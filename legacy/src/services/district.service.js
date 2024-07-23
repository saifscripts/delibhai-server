const District = require('../models/District');

exports.getDistrictsService = async (divisionId) => await District.find({ divisionId });
