//'use strict';
var Alexa = require("alexa-sdk");
var utils = require('./utils');

var goodbyeMessage = "See you next time, Good bye";
var helpMessage = "With BuildDeployer, you can deploy your desired build." +
    "For example, you could say run the QA Deployment, or you can say exit. Now, what would you like to do?";


exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(loginEventHandlers, deployEventHandlers, deploymentStatusEventHandlers);
    alexa.execute();
};

var loginEventHandlers = {
    'NewSession': function() {

        this.attributes['speechOutput'] = 'welcome to Build Deployer. You can log in to Team city or deploy your desired build or ask for build status.  What would you like to do?';
        this.attributes['repromptSpeech'] = 'with Build Deployer , you can deploy the desired build from team city based on your settings.';

        this.emit(':ask', this.attributes['speechOutput']);
    },
    'GetLoginEventIntent': function() {
        this.emit('handleLoginEventRequest')
    },
    'handleLoginEventRequest': function() {
        var self = this;
        utils.handleLoginEventRequest(self, function(speechText, repromptText, cardTitle, cardContent) {
            self.emit(':askWithCard', speechText, repromptText, cardTitle, cardContent);

        });
    },
    'AMAZON.NoIntent': function() {
        // Handle No intent.
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StopIntent': function() {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function() {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.HelpIntent': function() {
        this.emit(':ask', helpMessage, helpMessage);
    },
    'Unhandled': function() {
        this.emit(':ask', this.attributes['repromptSpeech']);
    }
};

var deployEventHandlers = {
    'NewSession': function() {

        this.attributes['speechOutput'] = 'welcome to Build Deployer. You can log in to Team city or deploy your desired build or ask for build status.  What would you like to do?';
        this.attributes['repromptSpeech'] = 'with Build Deployer , you can deploy the desired build from team city based on your settings.';

        this.emit(':ask', this.attributes['speechOutput']);
    },
    'GetDeployEventIntent': function() {
        this.emit('handleDeployEventRequest')
    },
    'handleDeployEventRequest': function() {
        var self = this;
        utils.handleDeployEventRequest(self, function(speechText, repromptText, cardTitle, cardContent) {
            self.emit(':askWithCard', speechText, repromptText, cardTitle, cardContent);
        });

    },
    'AMAZON.NoIntent': function() {
        // Handle No intent.
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StopIntent': function() {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function() {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.HelpIntent': function() {
        this.emit(':ask', helpMessage, helpMessage);
    },
    'Unhandled': function() {
        this.emit(':ask', this.attributes['repromptSpeech']);
    }
};


var deploymentStatusEventHandlers = {
    'NewSession': function() {

        this.attributes['speechOutput'] = 'welcome to Build Deployer. You can log in to Team city or deploy your desired build or ask for build status.  What would you like to do?';
        this.attributes['repromptSpeech'] = 'with Build Deployer , you can deploy the desired build from team city based on your settings.';

        this.emit(':ask', this.attributes['speechOutput']);
    },
    'GetDeploymentStatusEventIntent': function() {
        this.emit('handleDeploymentStatusEventRequest')
    },
    'handleDeploymentStatusEventRequest': function() {
        var self = this;
        utils.handleDeploymentStatusEventRequest(self, function(speechText, repromptText, cardTitle, cardContent) {
            self.emit(':askWithCard', speechText, repromptText, cardTitle, cardContent);
        });

    },
    'AMAZON.NoIntent': function() {
        // Handle No intent.
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StopIntent': function() {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function() {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.HelpIntent': function() {
        this.emit(':ask', helpMessage, helpMessage);
    },
    'Unhandled': function() {
        this.emit(':ask', this.attributes['repromptSpeech']);
    }
};
