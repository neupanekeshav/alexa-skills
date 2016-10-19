
#  About the Skill
Alexa Skills development
This skill is to deploy build from TeamCity to your desired environment.
Make sure you have TeamCity setup to deploy the build.
Update config-example.json to config.json based on your desired settings

## Getting Started
Clone the Repo
$cd /buildDeployer
$ npm install

Update config with your desired TeamCity changes
and test it by running it locally
$ bst proxy lambda buildDeployer/index.js

Details on bst and tutorials on setting up the skill can be found [here](https://github.com/bespoken/bst)
