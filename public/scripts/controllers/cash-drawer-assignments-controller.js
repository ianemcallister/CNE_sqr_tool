angular
    .module('cne')
    .controller('cashDrawerAssignmentsController', cashDrawerAssignmentsController);

cashDrawerAssignmentsController.$inject = ['$scope','$log', '$firebase', '$firebaseObject', '$firebaseArray'];

/* @ngInject */
function cashDrawerAssignmentsController($scope, $log, $firebase, $firebaseObject, $firebaseArray) {

	//define view model variable
	var vm = this;
	vm.sqrLocations = $firebaseArray(firebase.database().ref().child('reference_lists/sqr_locations'));
	vm.cashDrawerList = [{name:"test"}, {name:"test"}, {name:"test"}];
	vm.cmeList = [{test:"test"}, {test:"test"}, {test:"test"}];
	
	//notify location
	$log.info('in the cash drawer assignment controller');	//TODO: TAKE THIS OUT LATER
	
	//define local functions

	//run the test


}