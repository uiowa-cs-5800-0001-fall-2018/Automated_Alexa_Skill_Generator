let quote = "Dont do dumb shit"
var data = `/* eslint-disable func-names */ /* eslint-disable no-console */ const quoteHelper = require('./modules/quoteHelper') const Alexa = require('ask-sdk-core'); const LaunchRequestHandler = { canHandle(handlerInput) { return handlerInput.requestEnvelope.request.type === 'LaunchRequest'; }, async handle(handlerInput) { let speechText = 'I dont have a quote'; await quoteHelper.getQuote().then(function(value){ let quote = JSON.parse(value).quote speechText = \`Here is a quote: ${quote}\` }, function(err){ speechText = "There was a problem" }) return handlerInput.responseBuilder .speak(speechText) .withSimpleCard('Random Quote', speechText) .getResponse(); }, };"`
var beautify = require('js-beautify').js,
fs = require('fs');

exports.formatCode = function(){
    let beautifulCode = beautify(data, { indent_size: 2, space_in_empty_paren: true })
    return beautifulCode
}

/////////////////////
// Write to a file //
/////////////////////
// fs.writeFile("foo.js", String(beautifulCode), function(err) {
//     if(err) {
//         return console.log(err);
//     }

//     console.log("The file was saved!");
// }); 

