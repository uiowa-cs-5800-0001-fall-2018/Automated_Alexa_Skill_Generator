var mongoose = require('mongoose');

// create a schema
var blockSchema = new mongoose.Schema({
    type: String,
    messages: [String],
    args: [[Schema.Types.Map]],
    previousStatement: { type: Schema.Types.Mixed, default: null },
    nextStatement: { type: Schema.Types.Mixed, default: null },
    colour: { type: Number, default: 0 },
    tooltip: { type: String, default: "" },
    helpUrl: { type: String, default: "" }
});

// we need to create a model using it
var Custom_Block = mongoose.model('Custom_Block', blockSchema);

// make this available to our users in our Node applications
module.exports = Custom_Block;