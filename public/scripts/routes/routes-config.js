/*
*	ROUTES-CONFIG
*
*	This module sets up all the required angular routes for this web app.
*/
angular
    .module('cne')
    .config(config);

/* @ngInject */
function config($routeProvider, $locationProvider) {
	$locationProvider.hashPrefix('');
    $routeProvider
	//PUBLIC ROUTES
    .when('/', {
        templateUrl: 'views/landingPage.htm',      //'views/mainPage.htm'
        controller: 'landingController',           //'mainController'
        controllerAs: 'vm'
    })
    .when('/customers', {
        templateUrl: 'views/customersPage.htm',      //'views/mainPage.htm'
        controller: 'customersController',           //'mainController'
        controllerAs: 'vm',
        resolve: { /* @ngInject */
            customerList: customerList
        }
    })
    .when('/salesdays', {
        templateUrl: 'views/salesDaysPage.htm',      //'views/mainPage.htm'
        controller: 'salesDaysController',           //'mainController'
        controllerAs: 'vm'
    })
    .when('/salesdays/:salesdayid', {
        templateUrl: 'views/aSalesdayPage.htm',      //'views/mainPage.htm'
        controller: 'aSalesdayController',           //'mainController'
        controllerAs: 'vm'
    })
    .when('/cash_drawer_assignments', {
        templateUrl: 'views/cashDrawerAssignmentsPage.htm',      //'views/mainPage.htm'
        controller: 'cashDrawerAssignmentsController',           //'mainController'
        controllerAs: 'vm'
    })    
    .when('/login', {
        templateUrl: 'views/loginPage.htm',      //'views/mainPage.htm'
        controller: 'loginController',           //'mainController'
        controllerAs: 'vm'
    })
    .when('/cme_schedule', {
        templateUrl: 'views/cmeSchedulingPage.htm',      //'views/mainPage.htm'
        controller: 'cmeScheduleController',           //'mainController'
        controllerAs: 'vm'
    })
	.otherwise({
        redirectTo: '/'
    });
}

/*
*   REQUIRED FUNCTIONS
*
*/

//  CUSTOMERS LIST
function customerList() {
    
    //return the promise
    return new Promise(function(resolve, reject) {
        //hit the server for the 
        resolve('good test');
    });

};

