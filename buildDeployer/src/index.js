//'use strict';
var Alexa = require("alexa-sdk");

var goodbyeMessage = "See you next time, Good bye";
var helpMessage = "With BuildDeployer, you can deploy your desired build." +
    "For example, you could say run the QA Deployment, or you can say exit. Now, what would you like to do?";


exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(loginEventHandlers,deployEventHandlers,deploymentStatusEventHandlers );
    alexa.execute();
};

/*
var newSessionHandlers = {
  'NewSession': function(){

    this.attributes['speechOutput'] = 'welcome to Build Deployer. You can log in to Team city or deploy your desired build or ask for build status.  What would you like to do?';
    this.attributes['repromptSpeech'] = 'with Build Deployer , you can deploy the desired build from team city based on your settings.';

    this.emit(':ask',this.attributes['speechOutput']);
  },
    'HelloWorldIntent': function () {
        this.emit('SayHello')
    },
    'SayHello': function () {
        this.emit(':tell', 'Hello World!');
    }
};
*/

var loginEventHandlers = {
  'NewSession': function(){

    this.attributes['speechOutput'] = 'welcome to Build Deployer. You can log in to Team city or deploy your desired build or ask for build status.  What would you like to do?';
    this.attributes['repromptSpeech'] = 'with Build Deployer , you can deploy the desired build from team city based on your settings.';

    this.emit(':ask',this.attributes['speechOutput']);
  },
    'GetLoginEventIntent': function () {
        this.emit('handleLoginEventRequest')
    },
    'handleLoginEventRequest': function () {
        //this.emit(':tell', 'this is where I will log in!');
        var self = this;
        handleLoginEventRequest(self);

        //this.emit(':tell','login successful')
    },
    'AMAZON.NoIntent': function () {
       // Handle No intent.
       this.emit(':tell', goodbyeMessage);
   },
   'AMAZON.StopIntent': function () {
       this.emit(':tell', goodbyeMessage);
   },
   'AMAZON.CancelIntent': function () {
       this.emit(':tell', goodbyeMessage);
   },
   'AMAZON.HelpIntent': function () {
       this.emit(':ask', helpMessage, helpMessage);
   },
   'Unhandled': function () {
       this.emit(':ask',this.attributes['repromptSpeech']);
   }
};

var deployEventHandlers = {
  'NewSession': function(){

    this.attributes['speechOutput'] = 'welcome to Build Deployer. You can log in to Team city or deploy your desired build or ask for build status.  What would you like to do?';
    this.attributes['repromptSpeech'] = 'with Build Deployer , you can deploy the desired build from team city based on your settings.';

    this.emit(':ask',this.attributes['speechOutput']);
  },
    'GetDeployEventIntent': function () {
        this.emit('handleDeployEventRequest')
    },
    'handleDeployEventRequest': function () {
        var self = this;
        handleDeployEventRequest(self);

    },
    'AMAZON.NoIntent': function () {
       // Handle No intent.
       this.emit(':tell', goodbyeMessage);
   },
   'AMAZON.StopIntent': function () {
       this.emit(':tell', goodbyeMessage);
   },
   'AMAZON.CancelIntent': function () {
       this.emit(':tell', goodbyeMessage);
   },
   'AMAZON.HelpIntent': function () {
       this.emit(':ask', helpMessage, helpMessage);
   },
   'Unhandled': function () {
       this.emit(':ask',this.attributes['repromptSpeech']);
   }
};


var deploymentStatusEventHandlers = {
  'NewSession': function(){

    this.attributes['speechOutput'] = 'welcome to Build Deployer. You can log in to Team city or deploy your desired build or ask for build status.  What would you like to do?';
    this.attributes['repromptSpeech'] = 'with Build Deployer , you can deploy the desired build from team city based on your settings.';

    this.emit(':ask',this.attributes['speechOutput']);
  },
    'GetDeploymentStatusEventIntent': function () {
        this.emit('handleDeploymentStatusEventRequest')
    },
    'handleDeploymentStatusEventRequest': function () {
        var self = this;
        handleDeploymentStatusEventRequest(self);

    },
    'AMAZON.NoIntent': function () {
       // Handle No intent.
       this.emit(':tell', goodbyeMessage);
   },
   'AMAZON.StopIntent': function () {
       this.emit(':tell', goodbyeMessage);
   },
   'AMAZON.CancelIntent': function () {
       this.emit(':tell', goodbyeMessage);
   },
   'AMAZON.HelpIntent': function () {
       this.emit(':ask', helpMessage, helpMessage);
   },
   'Unhandled': function () {
       this.emit(':ask',this.attributes['repromptSpeech']);
   }
};


function handleLoginEventRequest(self){
    var repromptText = "With BuildDeployer , you can deploy the build from Team City or login to team city. For example, you could say run the QA Deployment or log in to team city, what day do you want to say?";
    var cardTitle = "LoginRequest";
    var speechText = "";
    var cardContent = "";

    teamCityLogon(function (xmlHttp){


      if (xmlHttp.status == 200){
        console.log(xmlHttp.responseText)

        speechText = "Login is successful";
        cardContent = speechText;
      }
      else{

        speechText = "There is a problem connecting. Please try again later.";
        cardContent = speechText;
        };

      self.emit(':askWithCard', speechText,repromptText,cardTitle,cardContent);
    })
  }


  function handleDeployEventRequest(self){
      var repromptText = "With Build Deployer , you can deploy the build from Teamcity. For example, you could say run the QA deployment, what day do you want to say?";
      var cardTitle = "DeployBuild";
      var speechText = "";
      var cardContent = "";
      triggerBuild(self,function (xmlHttp){

        if (xmlHttp.status == 200){
          console.log(xmlHttp.responseText)
          speechText = "Congratulations, deployment triggered successfully " ;
          cardContent = speechText;
        }
        else{

          speechText = "There is a problem connecting. Please try again later.";
          cardContent = speechText;
        };
        self.emit(':askWithCard', speechText,repromptText,cardTitle,cardContent);
      })

    }


    function handleDeploymentStatusEventRequest(self){
        var repromptText = "With Build Deployer , you can get the status of the build. For example, you could say Status of  the QA deployment, what day do you want to say?";
        var cardTitle = "BuildStatus";
        var speechText = "";
        var cardContent = "";
        statusofBuild(self,function (xmlHttp){

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
          self.emit(':askWithCard', speechText,repromptText,cardTitle,cardContent);
        })

      }

  function teamCityLogon(callback){

    var resourceUrl = "/httpAuth/app/rest/";
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var xmlHttp = new XMLHttpRequest();
    //console.log(intent)
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



    // read JSON file from config
    function readJSONfile(callback){
      var fs = require("fs");
      console.log("Starting");

      fs.exists("..//alexa-skills/buildDeployer/config/config.json", function(fileok){
        if(fileok)fs.readFile("..//alexa-skills/buildDeployer/config/config.json", function(error, data) {
          var jsonObject = JSON.parse(data);
          callback(jsonObject);
      });
      else console.log("file not found");
    });
    }


    function triggerBuild(self,callback){
      readJSONfile(function (jsonObject){
      var resourceUrl = "/httpAuth/app/rest/buildQueue";
      var teamcityurl = jsonObject.baseUrl + resourceUrl;
      //var buildName = intent.slots.build.value;
      var buildName = self.event.request.intent.slots.build.value;
      console.log(buildName);

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

    function statusofBuild(self, callback){
      readJSONfile(function (jsonObject){
      var buildName = self.event.request.intent.slots.build.value;
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
