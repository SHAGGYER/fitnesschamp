const Food = require("../models/Food");
const AppSettings = require("../models/AppSettings");
const XLSX = require("xlsx");
const path = require("path");
const { ValidationService } = require("../services/ValidationService");

exports.InstallationController = class {
  static setAppName = async (req, res) => {
    let appSettings = await AppSettings.findOne();

    const errors = await ValidationService.run(
      {
        appName: [[(val) => !val, "Appnavn er påkrævet"]],
      },
      req.body
    );

    if (Object.keys(errors).length) {
      return res.status(403).send({ errors });
    }

    if (appSettings) {
      appSettings.appName = req.body.appName;
      await appSettings.save();
    } else {
      appSettings = new AppSettings(req.body);
      await appSettings.save();
    }

    res.sendStatus(201);
  };

  static populateFoodDatabase = async (req, res) => {
    const workbook = XLSX.readFile(
      path.join(__dirname, "..", "data/Frida20190802dav3.xlsx")
    );
    var sheet_name_list = workbook.SheetNames;
    var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[1]]);

    const transformedFoods = xlData
      .filter((x, i) => i > 0)
      .map((x) => {
        return {
          name: x.__EMPTY_2,
          group: x.__EMPTY_1,
          kcal: x["Energi, kcal"] === "iv" ? undefined : x["Energi, kcal"],
          protein:
            x["Protein, videnskabelig"] === "iv"
              ? undefined
              : x["Protein, videnskabelig"],
          carbs:
            x["Kulhydrat, deklaration"] === "iv"
              ? undefined
              : x["Kulhydrat, deklaration"],
          sugars: x["Tilsat sukker"] === "iv" ? undefined : x["Tilsat sukker"],
          fibers: x["Kostfibre"] === "iv" ? undefined : x["Kostfibre"],
          fats: x["Fedt, total"] === "iv" ? undefined : x["Fedt, total"],
        };
      });

    const workbookEnglish = XLSX.readFile(
      path.join(__dirname, "..", "data/Frida20190802env3.xlsx")
    );
    var sheet_name_list_en = workbookEnglish.SheetNames;
    var xlDataEnglish = XLSX.utils.sheet_to_json(
      workbookEnglish.Sheets[sheet_name_list_en[1]]
    );

    const transformedFoodsEnglish = xlDataEnglish
      .filter((x, i) => i > 0)
      .map((x) => {
        return {
          name: x.__EMPTY_2,
          group: x.__EMPTY_1,
          kcal: x["Energy, kcal"] === "nv" ? undefined : x["Energy, kcal"],
          protein:
            x["Protein, videnskabelig"] === "nv"
              ? undefined
              : x["Protein, videnskabelig"],
          carbs:
            x["Carbohydrate, declaration"] === "nv"
              ? undefined
              : x["Carbohydrate, declaration"],
          sugars: x["Added sugar"] === "nv" ? undefined : x["Added sugar"],
          fibers: x["Dietary fiber"] === "nv" ? undefined : x["Dietary fiber"],
          fats: x["Fat, total"] === "nv" ? undefined : x["Fat, total"],
        };
      });

    try {
      //await Food.insertMany(transformedFoods);

  /*    if (req.body.english) {
        await Food.insertMany(transformedFoodsEnglish);
      }*/

      await Food.insertMany(transformedFoodsEnglish);

      res.sendStatus(201);
    } catch (e) {
      res.status(500).send({ error: "Error populating food database" });
    }
  };
};
