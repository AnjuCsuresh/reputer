
//API URLS 
// Add Trailing Slash
/*
What are the links to APIs ? 
---------------------------
Production API https://app.reputer.co:444/api/v1/
Development API http://localhost:8000/api/v1/

What does each variable below mean? 
----------------------------------
API_URL : URL for the API for Entity/Users/SignUp/SignIn/Plans/Pricing etc
DATA_API_URL : URL to the server which provides the Search Data, Sentiments, Trends etc 
WEBSITE_URL : URL to website of Reputer, where user is redirected after Log Out 

*/
//Always add Trailing Slashes to URLS

//Config for Development Servers 

config = {
	development: {
		API_URL : 'http://localhost:8000/api/v1/',
		API_SERVER_URL : 'http://localhost:8000',
		DATA_API_URL: 'http://localhost:5000/',
		WEBSITE_URL : 'http://localhost:8888/'
	},
	production: {
		API_URL : 'https://app.reputer.co/api/v1/',
		API_SERVER_URL : 'https://app.reputer.co',
		DATA_API_URL: 'https://app.reputer.co/data/',
		WEBSITE_URL : 'https://app.reputer.co'
	}
}
//Set mode to development / production
var MODE = 'development'

var API_URL = config[MODE]['API_URL']
var DATA_API_URL = config[MODE]['DATA_API_URL']
var WEBSITE_URL = config[MODE]['WEBSITE_URL']
var API_SERVER_URL = config[MODE]['API_SERVER_URL']
var SOLO_PLAN_MONTHLY="Solomonthly"
var SOLO_PLAN_YEARLY="Soloyearly"
var GROUP_PLAN_MONTHLY="Groupmonthly"
var GROUP_PLAN_YEARLY="Groupyearly"
var LGROUP_PLAN_MONTHLY="Large Groupmonthly"
var LGROUP_PLAN_YEARLY="Large Groupyearly"
