var mongoose = require('mongoose');
// Sample custom block
//{
//   "type": "intent_block",
//   "message0": "%1 %2",
//   "args0": [
//     {
//       "type": "input_value",
//       "name": "sample_utterances",
//       "check": "Array"
//     },
//     {
//       "type": "input_value",
//       "name": "slots",
//       "check": "Array"
//     }
//   ],
//   "previousStatement": null,
//   "nextStatement": null,
//   "colour": 225,
//   "tooltip": "",
//   "helpUrl": "https://developer.amazon.com/docs/custom-skills/create-intents-utterances-and-slots.html"
// }
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