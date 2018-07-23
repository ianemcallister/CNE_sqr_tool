angular
    .module('cne')
    .controller('aCustomersController', aCustomersController);

aCustomersController.$inject = ['$scope','$log', '$routeParams', '$firebase', '$firebaseObject', '$firebaseArray'];

/* @ngInject */
function aCustomersController($scope, $log, $routeParams, $firebase, $firebaseObject, $firebaseArray) {

	//define view model variable
	var vm = this;
	var customerId = $routeParams.customerid;
	
	//view model variables
	vm.customerProfile = $firebaseObject(firebase.database().ref().child('customers').child(customerId));
	vm.tempSalesDays = [];
	vm.selected = {
		season_id: ""
	};

	//notify progress
	$log.info('in a customer controller');	//TODO: TAKE THIS OUT LATER

	//define local functions
	function isCmeDay(counterDate, repeatObject, repeatOn) {
		var dayHash = {"0": "sun", "1": "mon", "2": "tue","3": "wed", "4": "thu", "5": "fri", "6": "sat"}
		var wkday = dayHash[counterDate.day()];
		//console.log(repeatOn, counterDate.day());
		return repeatOn[wkday];
	};

	//define view model funcitons
	vm.selectSeason = function(id) {
		vm.selected.season_id = id;
		console.log('id', vm.selected.season_id);
	}

	//
	vm.generateSalesDaysList = function() {
		var start = vm.customerProfile.seasons[vm.selected.season_id].start_date
		var end = vm.customerProfile.seasons[vm.selected.season_id].end_date
		var repeatObject = vm.customerProfile.seasons[vm.selected.season_id].repeats
		var repeatOn = vm.customerProfile.seasons[vm.selected.season_id].repeat_on
		var counterDate = moment(start);
		var endDate = moment(end);

		console.log('trying to generate', start, end, repeatObject, repeatOn);
		
		//check values
		if(	 start != "" &&
			 end != "" &&
			 repeatObject != "" &&
			 repeatOn != "") {
			console.log('good values', counterDate);

			var flag = false;

			//iterate through all the days between start and end
			while(!flag) {

				//incriment the coutner
				counterDate = counterDate.add(1, "day");

				//console.log(counterDate.format());

				if(isCmeDay(counterDate, repeatObject, repeatOn)) {
					
					// add sales day
					vm.tempSalesDays.push(1);
				}

				//check for match
				if(moment(counterDate).isSame(endDate)) flag = true
				
			}

			console.log(vm.tempSalesDays);

		} else {
			console.log('missing values');
		}
	}

	vm.saveChanges = function() { vm.customerProfile.$save(); console.log('saved change'); }
	//run the test


}