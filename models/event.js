var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
   name: String,
   description: String,
   time: String,
   cost: Number,
   twentyOne: Boolean
});


module.exports = eventSchema;