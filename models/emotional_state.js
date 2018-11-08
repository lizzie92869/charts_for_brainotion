// Dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;

// Schema
var emotionalStateSchema = new mongoose.Schema({
    anger_score: String,
    happiness_score: String,
    sadness_score: String,
    frustration_score: String,
    empathy_score: String,
    date: Date
});


// Return model
module.exports = restful.model('EmotionalStates', emotionalStateSchema);
