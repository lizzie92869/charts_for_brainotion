// Dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;

// Schema
var emotionalStateSchema = new mongoose.Schema({
    anger_score: Number,
    hapiness_score: Number,
    sadness_score: Number,
    frustration_score: Number,
    empathy_score: Number,
    date: Date
});


// Return model
module.exports = restful.model('EmotionalStates', emotionalStateSchema);
