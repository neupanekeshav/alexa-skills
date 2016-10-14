
var statusofBuild = function statusofBuild(self, callback){
  readFile(function (jsonObject){
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

// read JSON file from config
var readFile =  function readJSONfile(callback){
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

var teamCityLogon = function teamCityLogon(callback){

  var resourceUrl = "/httpAuth/app/rest/";
  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
  var xmlHttp = new XMLHttpRequest();
  //console.log(intent)
  readFile(function (jsonObject){
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


var triggerBuild = function triggerBuild(self,callback){
    readFile(function (jsonObject){
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



  var handleLoginEventRequest = function handleLoginEventRequest(self){
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


    var handleDeployEventRequest = function handleDeployEventRequest(self){
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


      var handleDeploymentStatusEventRequest = function handleDeploymentStatusEventRequest(self){
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





module.exports = {
  handleLoginEventRequest: handleLoginEventRequest,
  handleDeployEventRequest: handleDeployEventRequest,
  handleDeploymentStatusEventRequest: handleDeploymentStatusEventRequest
}
