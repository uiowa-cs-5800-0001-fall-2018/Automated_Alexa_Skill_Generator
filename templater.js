var jsFormatter = require('esformatter')
const fs = require('fs');

module.exports.LibraryImportHandler = function(){
  let importHandlerTemplate = 
    `const Alexa = require('ask-sdk-core');`
  return jsFormatter.format(importHandlerTemplate) + '\n\n'
}

module.exports.LaunchRequestHandler = function(launchRequestSpeech='LaunchRequest'){
  let launchRequestHandlerTemplate = 
    `const LaunchRequestHandler = {
      canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === '${launchRequestSpeech}';
      },
      handle(handlerInput) {
        const speechText = 'Welcome to the Alexa Skills Kit, you can say hello!';

        return handlerInput.responseBuilder
          .speak(speechText)
          .reprompt(speechText)
          .getResponse();   
      },
    };`
  return jsFormatter.format(launchRequestHandlerTemplate) + '\n\n'
}

module.exports.HelpIntentHandler = function(helpIntentSpeech='Say Alexa, followed by the name of this skill to use me.'){
  let helpIntentHandlerTemplate = 
    `const HelpIntentHandler = {
      canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
      },
      handle(handlerInput) {
        const speechText = '${helpIntentSpeech}';
    
        return handlerInput.responseBuilder
          .speak(speechText)
          .reprompt(speechText)
          .getResponse();
      },
    };`
  return jsFormatter.format(helpIntentHandlerTemplate) + '\n\n'
}

module.exports.HelloWorldHandler = function(){
  let helloWorldHandlerTemplate = 
    `const HelloWorldIntentHandler = {
      canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && handlerInput.requestEnvelope.request.intent.name === 'HelloWorldIntent';
      },
      handle(handlerInput) {
        const speechText = 'Hello World!';
    
        return handlerInput.responseBuilder
          .speak(speechText)
          .withSimpleCard('Hello World', speechText)
          .getResponse();
      },
    };`
  return jsFormatter.format(helloWorldHandlerTemplate) + '\n\n'
}

module.exports.CancelAndStopIntentHandler = function(lastWords='Goodbye, I hope to hear you soon.'){
  let cancelAndStopIntentHandlerTemplate = 
    `const CancelAndStopIntentHandler = {
      canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
            || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
      },
      handle(handlerInput) {
        const speechText = 'Goodbye!';
    
        return handlerInput.responseBuilder
          .speak(speechText)
          .withSimpleCard('Hello World', speechText)
          .getResponse();
      },
    };`
  return jsFormatter.format(cancelAndStopIntentHandlerTemplate) + '\n\n'
}

module.exports.SessionEndedRequestHandler = function(){
  let endOfSessionHandlerTemplate = 
    `const SessionEndedRequestHandler = {
      canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
      },
      handle(handlerInput) {
        console.log('Session ended :(');
    
        return handlerInput.responseBuilder.getResponse();
      },
    };`
  return jsFormatter.format(endOfSessionHandlerTemplate) + '\n\n'
}

module.exports.ErrorHandler = function(){
  let errorHandlerTemplate = 
    `const ErrorHandler = {
      canHandle() {
        return true;
      },
      handle(handlerInput, error) {
        console.log('An error occured :(');
    
        return handlerInput.responseBuilder
          .speak('Sorry, I cant understand the command. Please say again.')
          .reprompt('Sorry, I cant understand the command. Please say again.')
          .getResponse();
      },
    };`
  return jsFormatter.format(errorHandlerTemplate) + '\n\n'
}

module.exports.HandlerExportFooter = function(){
  let handlerExportTemplate = 
    `const skillBuilder = Alexa.SkillBuilders.custom();

    exports.handler = skillBuilder
      .addRequestHandlers(
        LaunchRequestHandler,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler
      )
      .addErrorHandlers(ErrorHandler)
      .lambda();`
  return jsFormatter.format(handlerExportTemplate) + '\n\n'
}

module.exports.generateLambdaFunction = function(intents){
  let lambdaFunction = 
    (this.getRequiredLibraries() + 
    this.getRequiredIntents() +
    this.createCustomIntents() +
    this.HandlerExportFooter())
  return lambdaFunction
}

module.exports.writeToFile = function(filepath, fileContents){
  fs.writeFile(filepath, fileContents, function(err) {
      if(err) {
          return console.log("Error writing to file: " + err);
      }
      console.log("The file was saved!");
  }); 
}

module.exports.getRequiredLibraries = function(){
  return this.LibraryImportHandler() 
}

module.exports.getRequiredIntents = function(){
  return (this.LaunchRequestHandler() + this.HelpIntentHandler() + this.CancelAndStopIntentHandler() + this.SessionEndedRequestHandler())
}

module.exports.createCustomIntents = function(){
  customIntents = 
    '// Todo: Add more custom intents here!'
  return customIntents + '\n\n'
}