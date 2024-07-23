const Union = require('../models/Union');

exports.getUnionsService = async (upazilaId) => await Union.find({ upazilaId });
