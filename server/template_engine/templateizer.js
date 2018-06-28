/*
*	TEMPLATIZER
*
*	This module builds templates for various components of the server.  JSON -> Mysql 
*	or JSON-> Email, etc.
*/

//define dependencies
var handlebars 	= require('handlebars');
var stdio		= require('../stdio/stdio_api.js');

//define module
var templatizer = {
	_typeFormat: {
		isInt: format_int,
		isString: format_string
	},
	JSON: {
		toMysql: json_to_mysql
	}
};

//	FORMAT INT
function format_int() {

};

//	FORMAT STRING
function format_string(aString) {
	return "" + aString + "";
};

//	JSON_TO_MYSQL
/*
*	This will accept json and return mysql querys. It's only used for inserts. It accepts
*	a json model as a paramater, downloads the SQL INPUT template from the file store, 
*	renders the new tempate, and returns the string
*/
function json_to_mysql(data) {
	//define local variables
	var self = this;

	//load the template
	//var rawTemplate = stdio.read('/templates/test.hbs');
	var rawTemplate = stdio.read.string('/templates/sqrLocation_insert.hbs');
	
	//compile the template	
	var insertTemplate = handlebars.compile(rawTemplate);
	
	//add paramaters helper
	handlebars.registerHelper('insrtPrms', function(items, options) {
	  var returnString = "(";

	  //console.log(items);

	  //iterate through each of the items
	  for(var i = 0, l=items.length; i<l; i++) {

	  	//console.log(items[i], typeof items[i]);

	  	//escape out the tick
	    returnString = returnString + "\`" + format_string(items[i]) + "\`";

	    //add a comma or a parenthases
	    if(i < l-1) returnString = returnString + ", "
	    else returnString = returnString + ")"

	  }

	  return returnString;
	});


	//add values helper
	handlebars.registerHelper('insrtValues', function(items, options) {
	  var returnString = "";

	  //console.log(items);

	  //iterate through each row
	  for(var i = 0, l=items.length; i<l; i++) {
	    
	  	returnString = returnString + "(";

	  	//iterate through each value
	  	for(var j = 0, n=items[i].length; j<n; j++) {

	  		returnString = returnString + "\"" + format_string(items[i][j]) + "\"";
	    	
	    	//add a comma or a parenthases
		    if(j < n-1) returnString = returnString + ", "
		   
	    }

	    //add a comma or a parenthases
	    if(i < l-1) returnString = returnString + "),\n "
	    else returnString = returnString + ")"

	  }

	  return returnString;
	});

	//add data
	var mysql_query = insertTemplate(data);

	//return string
	return mysql_query;
};

//return the module
module.exports = templatizer;
