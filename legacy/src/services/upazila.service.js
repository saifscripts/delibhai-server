const Upazila = require('../models/Upazila');

exports.getUpazilasService = async (districtId) => await Upazila.find({ districtId });
