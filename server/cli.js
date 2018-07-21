/*
*	COMMAND LINE INTERFACE
*
*	This is the command line interface for testing out various methods
*/

//declare dependencies
var helper 		= require('./helpers/cli_helpers.js');


//helper.tests.cne_sqr_tx_download();

//cne_sqr_employees_download(status, external_id, limit, order, begin_updated_at, end_updated_at, begin_created_at, end_created_at) 
//helper.tests.cne_sqr_employees_download("ACTIVE");
helper.tests.cne_sqr_locations_download();