var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var eventSchema = require('../models/event');

var locationSchema = new Schema({
   name: String,
   description: String,
   lat: Number,
   lng: Number,
   contentString: String,
   events: [eventSchema]
});

var Location = mongoose.model('Location', locationSchema);

module.exports = Location;