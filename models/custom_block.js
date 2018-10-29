var mongoose = require('mongoose');

// create a schema
var blockSchema = new mongoose.Schema({
    type: String,
    messages: [String],
    args: [[ Map ]],
    output: { type: mongoose.Schema.Types.Mixed, default: null },
    previousStatement: { type: mongoose.Schema.Types.Mixed, default: null },
    nextStatement: { type: mongoose.Schema.Types.Mixed, default: null },
    colour: { type: Number, default: 0 },
    tooltip: { type: String, default: "" },
    helpUrl: { type: String, default: "" }
});

// we need to create a model using it
var CustomBlock = mongoose.model('Custom_Block', blockSchema);

// make this available to our users in our Node applications
module.exports = CustomBlock;