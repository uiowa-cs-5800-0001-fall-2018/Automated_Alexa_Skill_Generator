var jsFormatter = require('esformatter')
const fs = require('fs');

module.exports.LibraryImportHandler = function(){
  let importHandlerTemplate = 
    `const Alexa = require('ask-sdk-core');
     const rp = require('request-promise')`
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

module.exports.HandlerExportFooter = function(customHandlers){

  let handlerExportTemplate = 
    `const skillBuilder = Alexa.SkillBuilders.custom();

    exports.handler = skillBuilder
      .addRequestHandlers(
        LaunchRequestHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler${customHandlers}
      )
      .addErrorHandlers(ErrorHandler)
      .lambda();`
  return jsFormatter.format(handlerExportTemplate) + '\n\n'
}

module.exports.generateLambdaFunction = function(intents){
  let lambdaFunction = 
    (this.getRequiredLibraries() + 
    this.getRequiredIntents() +
    this.createCustomIntents(intents))
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
  return (this.LaunchRequestHandler() + this.HelpIntentHandler() + this.CancelAndStopIntentHandler() + this.SessionEndedRequestHandler() + this.ErrorHandler())
}

module.exports.createCustomIntents = function(customIntents){
  var response = ``
  var customHandlers = ``
  for(i=0; i<customIntents.length; i++){
    var intentName = customIntents[i]["name"]
    var api_request = customIntents[i]["lambda_function"]
    var customHandlers = ',' + '\n' + intentName + 'Handler' + customHandlers
    response = response + callApi(intentName, api_request)
  return response + this.HandlerExportFooter(customHandlers)

  }
  // customIntents.intents.forEach(function (arrayItem) {
  //   var name = arrayItem.name
  //   var lambda_function = arrayItem.lambda_function
  //   console.log(name)
  // });

  function callApi(intentName, api_request){
    var baseURL = api_request["base_url"]
    var key = api_request["parameter"].key
    var value = api_request["parameter"].value
    console.log("Key ==== ", key)

    let customIntent = 
      `function getRoute() {
        return rp('${baseURL}${key}=${value}')
      }
      
      const ${intentName}Handler = {
        canHandle(handlerInput) {
          return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === '${intentName}';
        },
        async handle(handlerInput) {

          let speechText = 'No buses are ariving any time soon.';

          await getRoute().then(function(value){
            let predictionsArray = JSON.parse(value).predictions
            let firstBus = predictionsArray[0].title
            let firstTime = predictionsArray[0].minutes

            speechText = 'A ' + firstBus + ' will arrive in ' + firstTime + ' minutes'

          }, function(err){
              speechText = "There was a problem"
          })
      
          return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('Hello World', speechText)
            .getResponse();
        },
      };`

      return jsFormatter.format(customIntent) + '\n\n'
  }
  }