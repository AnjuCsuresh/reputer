
//API URLS 
// Add Trailing Slash
/*
What are the links to APIs ? 
---------------------------
Production API https://app.reputer.co/api/v1/
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
		DATA_API_URL: 'http://localhost:5000/',
		WEBSITE_URL : 'http://localhost:8888/'
	},
	production: {
		API_URL : '',
		DATA_API_URL: '',
		WEBSITE_URL : ''
	}
}
//Set mode to development / production
var MODE = 'development'

var API_URL = config[MODE]['API_URL']
var DATA_API_URL = config[MODE]['DATA_API_URL']
var WEBSITE_URL = config[MODE]['WEBSITE_URL']