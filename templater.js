var jsFormatter = require('esformatter')

module.exports.LibraryImportHandler = function(){
  let importHandlerTemplate = 
    `const Alexa = require('ask-sdk-core');`
  return jsFormatter.format(importHandlerTemplate)
}

module.exports.LaunchRequestHandler = function(launchRequestSpeech){
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
  return jsFormatter.format(launchRequestHandlerTemplate)
}

module.exports.HelpIntentHandler = function(helpIntentSpeech){
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
  return jsFormatter.format(helpIntentHandlerTemplate)
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
  return jsFormatter.format(helloWorldHandlerTemplate)
}

module.exports.CancelAndStopIntentHandler = function(lastWords){
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
  return jsFormatter.format(cancelAndStopIntentHandlerTemplate)
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
  return jsFormatter.format(endOfSessionHandlerTemplate)
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
  return jsFormatter.format(errorHandlerTemplate)
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
  return jsFormatter.format(handlerExportTemplate)
}