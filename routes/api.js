// Dependencies
var express = require('express');
var router = express.Router();

// Models
var EmotionalState = require('../models/emotional_state');

// Routes
EmotionalState.methods(['get', 'put', 'post', 'delete']);
EmotionalState.register(router, '/emotional_states');

// Return router
module.exports = router;