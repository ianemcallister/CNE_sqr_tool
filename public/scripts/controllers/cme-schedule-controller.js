angular
    .module('cne')
    .controller('cmeScheduleController', cmeScheduleController);

cmeScheduleController.$inject = ['$scope','$log', '$firebase', '$firebaseObject', '$firebaseArray'];

/* @ngInject */
function cmeScheduleController($scope, $log, $firebase, $firebaseObject, $firebaseArray) {

	//define view model variable
	var vm = this;
	vm.calendarDays = $firebaseArray(firebase.database().ref().child('calender/2018'));
	$log.info('in the CME Schedule controller');	//TODO: TAKE THIS OUT LATER
	
	//define local functions

	//run the test


}