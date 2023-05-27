const Inquiry = require('../models/Inquiry');

exports.InquiriesController = class {
  static create = async (req, res) => {
    const newInquiry = new Inquiry({
      ...req.body,
      user: res.locals.userId
    })

    await newInquiry.save();

    res.sendStatus(201)
  }

  static getAll = async (req, res) => {
    const inquiries = await Inquiry.find({}).sort({createdAt: -1});

    res.send(inquiries);
  }
}