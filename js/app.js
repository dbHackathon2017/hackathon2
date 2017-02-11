var mainApp=angular.module("pensionApp",["ngRoute"]);

mainApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
	.when("/", {
		templateUrl : "html/login.html",
		controller : "loginController",
	})
	.when("/pension", {
		templateUrl : "html/pensions.html",
		controller : "pensionsController",
	});
	$locationProvider.html5Mode({
		enabled: false,
		requireBase: false
	});
}]);

mainApp.service('loggedService', function() {
	var thisService = this;
	this.loggedIn = true;
	this.getData = function() {
		return thisService.loggedIn;
	}
});

mainApp.controller("indexController",["$scope", "$routeParams", "loggedService", "$timeout", "$location",
	function($scope, $routeParams, loggedService, $timeout, $location){
		var indexScope = $scope;
		indexScope.loggedIn = loggedService.loggedIn;
		indexScope.logout = function() {
			indexScope.loggedIn = false;
			loggedService.loggedIn = indexScope.loggedIn;
		}
		indexScope.$watch(function() { return loggedService.getData(); }, function(newVal) {
			console.log("NEW VAL [" + newVal + "]");
		    indexScope.loggedIn = newVal;
		}, true);
	}
]);

mainApp.controller("loginController",["$scope", "$routeParams", "loggedService", "$timeout", "$location",
	function($scope, $routeParams, loggedService, $timeout, $location){
		var loginScope = $scope;
		loginScope.loggedIn = loggedService.loggedIn;
		console.log("Login loggedIn[" + loginScope.loggedIn + "]");
		if (loginScope.loggedIn) {
			$location.path("pension")
		}
		loginScope.username = "";
		loginScope.pass = "";
		loginScope.loading = false;
		loginScope.login = function() {
			console.log("Loggingin")
			loginScope.loading = true;
			loginScope.username = "";
			loginScope.password = "";
			$timeout(function() {
				loginScope.loading = false;
				loginScope.loggedIn = true;
				loggedService.loggedIn = loginScope.loggedIn;
				console.log(loggedService.loggedIn);
				$location.path("pension")
			}, 1200);
		}
	}
]);

mainApp.controller("pensionsController",["$scope", "$routeParams", "loggedService", "$timeout", "$location", "$http",
	function($scope, $routeParams, loggedService, $timeout, $location, $http){
		var pensionThis = this;
		var pensionScope = $scope;

		pensionScope.loggedIn = loggedService.loggedIn;
		//Check if logged in else go back to root
		if (!pensionScope.loggedIn) {
			$location.path("/")
		}

		// pensionScope.requestAll = function() {
		// 	$http.jsonp({method: 'GET', url: 'localhost:1337' + "callback=JSON_CALLBACK"})
		// 	.then(function successCallback(response) {
		// 		console.log("Success callback, response [" + response + "]");

		// 	  }, function errorCallback(response) {
		// 		console.log("Error callback, response [" + response + "]");
		// 	  });
		// }

		pensionScope.initialize = function() {
			// pensionScope.requestAll();
			pensionScope.loading = true;
			//FOR TESTING UNTIL API IS READY
			pensionScope.accounts = [
				{
					firstname: "bob",
					lastname: "yessir",
					acct: "1532146146"
				},
				{
					firstname: "ff",
					lastname: "asdf",
					acct: "5673456357"
				},
				{
					firstname: "ashasdgdf",
					lastname: "asdf",
					acct: "245624573567"
				},
				{
					firstname: "aaa",
					lastname: "bbbb",
					acct: "2346236"
				},
				{
					firstname: "bob",
					lastname: "yessir",
					acct: "347345737"
				},
			]
		}

		pensionScope.initialize();
	}
]);