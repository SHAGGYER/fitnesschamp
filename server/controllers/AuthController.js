const {ValidationService} = require("../services/ValidationService");
const User = require("../models/User");
const Meal = require("../models/Meal");
const Food = require("../models/Food");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const getIP = require("ipware")().get_ip;
const geoip = require("geoip-country");
const lookup = require("country-code-lookup");

exports.AuthController = class {
  static init = async (req, res) => {
    const userId = res.locals.userId;
    let user = null;
    let meals = [];
    let isDenmark = false;

    const ip = getIP(req).clientIp;
    const geo = geoip.lookup(ip);

    let country = "N/A";
    if (geo && geo.country) {
      country = lookup.byIso(geo.country).country || "N/A";
    }

    if (country === "Denmark") {
      isDenmark = true;
    }

    if (process.env.APP_ENV === "dev") {
      isDenmark = true;
    }

    const foodsCount = await Food.find().countDocuments();

    if (userId) {
      user = await User.findById(res.locals.userId);
      meals = await Meal.find({user: res.locals.userId});
    }

    res.send({
      user,
      meals,
      installed: !!foodsCount,
      isDenmark,
    });
  };

  static login = async (req, res) => {
    const user = await User.findOne({
      email: req.body.email.toLowerCase(),
    });

    if (!user) {
      return res.status(403).send({
        error: "Kunne ikke logge dig ind",
      });
    }

    const passwordEquals = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordEquals) {
      return res.status(403).send({
        error: "Kunne ikke logge dig ind",
      });
    }

    const jwtUserData = {
      userId: user._id,
      userRole: user.role,
    };

    const token = jwt.sign(jwtUserData, process.env.JWT_SECRET);
    res.send({token, user});
  };

  static register = async (req, res) => {
    const errors = await ValidationService.run(
      {
        email: [
          [(val) => !val, "Email er påkrævet"],
          [
            (val) => val && !validator.isEmail(val),
            "Email skal være i korrekt format",
          ],
          [
            async (val) => {
              if (!val) return true;

              const exists = await User.findOne({
                email: val.trim().toLowerCase(),
              });
              return !!exists;
            },
            "Denne Email er optaget",
          ],
        ],
        password: [
          [(val) => !val, "Kodeord er påkrævet"],
          [(val) => val.length < 6, "Kodeord skal være mindst 6 tegn langt"],
        ],
        passwordAgain: [
          [(val) => !val, "Kodeord bekræftelse er påkrævet"],
          [(val) => val !== req.body.password, "Kodeord skal være ens"],
        ],
      },
      req.body
    );

    if (Object.keys(errors).length) {
      return res.status(403).send({errors});
    }

    const user = new User({
      ...req.body,
      role: "User"
    });
    await user.save();

    const meals = [
      {
        user: user._id,
        name: "Morgenmad",
      },
      {
        user: user._id,
        name: "Snack 1",
      },
      {
        user: user._id,
        name: "Frokost",
      },
      {
        user: user._id,
        name: "Snack 2",
      },
      {
        user: user._id,
        name: "Aftensmad",
      },
    ];

    await Meal.insertMany(meals);

    const jwtUserData = {
      userId: user._id,
      userRole: user.role,
    };

    const token = jwt.sign(jwtUserData, process.env.JWT_SECRET);
    res.send({token, user});
  };
};
