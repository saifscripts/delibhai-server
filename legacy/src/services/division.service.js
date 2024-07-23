const Division = require('../models/Division');

exports.getAllDivisionService = async () => await Division.find();
