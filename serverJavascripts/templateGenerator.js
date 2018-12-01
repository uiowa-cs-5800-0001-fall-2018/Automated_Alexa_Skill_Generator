import fs from '/node_modules/fs'
function exportHandlerTemplate(){
    var exportHandler = 'exports.handler = skillBuilder'+
    '  .addRequestHandlers('+
    '    LaunchRequestHandler,'+
    '    HelloWorldIntentHandler,'+
    '    HelpIntentHandler,'+
    '    CancelAndStopIntentHandler,'+
    '    SessionEndedRequestHandler'+
    '  )'+
    '  .addErrorHandlers(ErrorHandler)'+
    '  .lambda();';
}

function intentTemplate(name){
    let INTENT = 'Intent'
    let intentName = `${name}${INTENT}`
    let response = 'Hello World!'

    var skillBuilder = 'const skillBuilder = Alexa.SkillBuilders.custom();'+
    '' +
    'exports.handler = skillBuilder'+
    '  .addRequestHandlers('+
    '    LaunchRequestHandler,'+
    '    HelloWorldIntentHandler,'+
    '    HelpIntentHandler,'+
    '    CancelAndStopIntentHandler,'+
    '    SessionEndedRequestHandler'+
    '  )'+
    '  .addErrorHandlers(ErrorHandler)'+
    '  .lambda();';

    fs.writeFile("/tmp/test", "Hey there!", function(err) {
        if(err) {
            return console.log(err);
        }
    
        console.log("The file was saved!");
    });
    

    return templatedIntent
} 