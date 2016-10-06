var APP_ID = undefined; //replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

var https = require('https');

/**
 * The AlexaSkill Module that has the AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

var BuildDeployer = function() {
    AlexaSkill.call(this, APP_ID);
};

BuildDeployer.prototype = Object.create(AlexaSkill.prototype);
BuildDeployer.prototype.constructor = BuildDeployer;

BuildDeployer.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session){
  console.log("BuildDeployer onSessionStarted requestId: " + sessionStartedRequest.requestId
      + ", sessionId: " + session.sessionId);

  // any session init logic would go here
};
BuildDeployer.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("BuildDeployer onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    getWelcomeResponse(response);
};

BuildDeployer.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);

    // any session cleanup logic would go here
};

BuildDeployer.prototype.intentHandlers = {

    "GetLoginEventIntent": function (intent, session, response) {
        handleLoginEventRequest(intent, session, response);
    },
    "GetDeployEventIntent": function (intent, session, response) {
        handleDeployEventRequest(intent, session, response);
    },
    "GetDeploymentStatusEventIntent": function (intent, session, response) {
        handleDeploymentStatusEventRequest(intent, session, response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = "With BuildDeployer, you can deploy your desired build." +
            "For example, you could say run the QA Deployment, or you can say exit. Now, what would you like to do?";
        var repromptText = "What would you like to do?";
        var speechOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        var repromptOutput = {
            speech: repromptText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.ask(speechOutput, repromptOutput);
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = {
                speech: "Goodbye",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = {
                speech: "Goodbye",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.tell(speechOutput);
    }

};

function getWelcomeResponse(response){
  var cardTitle = "Welcome";
  var repromptText = "with Build Deployer , you can deploy the desired build from team city based on your settings";
  var speechText = "<p>Hello .</p> <p>Welcome to Build Deployer. You can log in to Team city or deploy your desired build or ask for build status.  What would you like to do?</p>";
  var cardOutput = "Hello . What would you like to do?";
  var speechOutput = {
        speech: "<speak>" + speechText + "</speak>",
        type: AlexaSkill.speechOutputType.SSML
    };
    var repromptOutput = {
        speech: repromptText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    response.askWithCard(speechOutput, repromptOutput, cardTitle, cardOutput);
}

function handleLoginEventRequest(intent, session, response){
    var repromptText = "With BuildDeployer , you can deploy the build from Team City or login to team city. For example, you could say run the QA Deployment or log in to team city, what day do you want to say?";
    var sessionAttributes = session.attributes;
    var cardTitle = "LoginRequest";
    var speechText = "";
    var cardContent = "";

    teamCityLogon(intent, function (xmlHttp){


      if (xmlHttp.status == 200){
        console.log(xmlHttp.responseText)

        speechText = "Login is successful";
        cardContent = speechText;
      }
      else{

        speechText = "There is a problem connecting. Please try again later.";
        cardContent = speechText;
        };
      var speechOutput = {
          speech: "<speak>" + speechText + "</speak>",
          type: AlexaSkill.speechOutputType.SSML
      };
      var repromptOutput = {
          speech: "<speak>" + repromptText + "</speak>",
          type: AlexaSkill.speechOutputType.SSML
      };
      response.askWithCard(speechOutput, repromptOutput, cardTitle, cardContent);
    })

  }


  function handleDeployEventRequest(intent, session, response){
      var repromptText = "With Build Deployer , you can deploy the build from Teamcity. For example, you could say run the QA deployment, what day do you want to say?";
      var sessionAttributes = session.attributes;
      var cardTitle = "DeployBuild";
      var speechText = "";
      var cardContent = "";
      triggerBuild(intent, function (xmlHttp){

        if (xmlHttp.status == 200){
          console.log(xmlHttp.responseText)
          speechText = "Congratulations, deployment triggered successfully " ;
          cardContent = speechText;
        }
        else{

          speechText = "There is a problem connecting. Please try again later.";
          cardContent = speechText;
        };
        var speechOutput = {
            speech: "<speak>" + speechText + "</speak>",
            type: AlexaSkill.speechOutputType.SSML
        };
        var repromptOutput = {
            speech: "<speak>" + repromptText + "</speak>",
            type: AlexaSkill.speechOutputType.SSML
        };
        response.askWithCard(speechOutput, repromptOutput, cardTitle, cardContent);
      })

    }


    function handleDeploymentStatusEventRequest(intent, session, response){
        var repromptText = "With Build Deployer , you can get the status of the build. For example, you could say Status of  the QA deployment, what day do you want to say?";
        var sessionAttributes = session.attributes;
        var cardTitle = "BuildStatus";
        var speechText = "";
        var cardContent = "";
        statusofBuild(intent, function (xmlHttp){

          if (xmlHttp.status == 200){

            console.log(xmlHttp.responseText)
            var DOMParser = require('xmldom').DOMParser;
            var xmlDoc = new DOMParser().parseFromString(xmlHttp.responseText,'text/xml');

            statusText = xmlDoc.getElementsByTagName("statusText")[0].childNodes[0].nodeValue;
            speechText = "Here is the status of the build, it is  " + statusText ;

            cardContent = speechText;
          }
          else{

            speechText = "There is a problem connecting. Please try again later.";
            cardContent = speechText;
          };
          var speechOutput = {
              speech: "<speak>" + speechText + "</speak>",
              type: AlexaSkill.speechOutputType.SSML
          };
          var repromptOutput = {
              speech: "<speak>" + repromptText + "</speak>",
              type: AlexaSkill.speechOutputType.SSML
          };
          response.askWithCard(speechOutput, repromptOutput, cardTitle, cardContent);
        })

      }


// Example on how to log in to TeamCity via TeamCity API

function teamCityLogon(intent, callback){

  var resourceUrl = "/httpAuth/app/rest/";
  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
  var xmlHttp = new XMLHttpRequest();
  console.log(intent)
  readJSONfile(function (jsonObject){
  var teamcityurl = jsonObject.baseUrl + resourceUrl;
  xmlHttp.open( "GET", teamcityurl, true ); // false for synchronous request
  xmlHttp.setRequestHeader('Authorization',jsonObject.authentication)
  xmlHttp.onload = function(e){
    if (xmlHttp.readyState === 4){
      if (xmlHttp.status === 200){
        callback(xmlHttp);
      }
      else {
        console.error(xmlHttp.statusText);
      }

    }
  };
  xmlHttp.send( null );
});

  }


  function triggerBuild(intent, callback){
    readJSONfile(function (jsonObject){
    var resourceUrl = "/httpAuth/app/rest/buildQueue";
    var teamcityurl = jsonObject.baseUrl + resourceUrl;
    var buildName = intent.slots.build.value;
    //console.log(buildName);

    var configObj = jsonObject;
    var property = buildName;
    buildId = configObj[property].name;
    environment = configObj[property].environment;
    release = configObj[property].release;
    console.log(buildId, environment,release);

    var data = "<build>\n\
                  <buildType id=\""+buildId+"\"/>\n\
                    <properties>\n \
                        <property name=\"Environment\" value=\""+environment+"\"/>\n\
                        <property name=\"Release\" value=\""+release+"\"/>\n\
                    </properties>\n\
                </build>";
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "POST", teamcityurl, false );
    xmlHttp.setRequestHeader("Authorization",jsonObject.authentication);
    xmlHttp.setRequestHeader("Content-Type", "application/xml");
      xmlHttp.onload = function(e){
    if (xmlHttp.readyState === 4){
        if (xmlHttp.status === 200){
          console.log(xmlHttp.responseText);
          console.log(xmlHttp.response);
          callback(xmlHttp);
        }
        else {
          console.error(xmlHttp.statusText);
        }

      }

    };

    xmlHttp.send(data);
  });
  }


  function statusofBuild(intent, callback){
    readJSONfile(function (jsonObject){
    var buildName = intent.slots.build.value;
    var configObj = jsonObject;
    var property = buildName;
    buildId = configObj[property].name;
    environment = configObj[property].environment;
    release = configObj[property].release;
    console.log(buildId, environment,release);
    var resourceUrl = "/httpAuth/app/rest/builds/buildType:(id:"+buildId+")";
    var teamcityurl = jsonObject.baseUrl + resourceUrl;

    console.log(teamcityurl);
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", teamcityurl, true );
    xmlHttp.setRequestHeader("Authorization",jsonObject.authentication);
    xmlHttp.onload = function(e){
      if (xmlHttp.readyState === 4){
        if (xmlHttp.status === 200){
          callback(xmlHttp);

        }
        else {
          console.error(xmlHttp.statusText);

        }

      }
      else{
        console.log("readyState is not 4")
      }
    };
    xmlHttp.send( null );
  });
  }

// read JSON file from config
function readJSONfile(callback){
  var fs = require("fs");
  console.log("Starting");

  fs.exists("./../alexa-skills/buildDeployer/config/config.json", function(fileok){
    if(fileok)fs.readFile("./../alexa-skills/buildDeployer/config/config.json", function(error, data) {
      var jsonObject = JSON.parse(data);
      callback(jsonObject);
  });
  else console.log("file not found");
});
}
// Create the handler that responds to the Alexa Request.
// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the  Skill.
    var skill = new BuildDeployer();
    skill.execute(event, context);
};
