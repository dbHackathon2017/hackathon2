var COOKIE_LOGGED_IN = "loggedIn";
var COOKIE_USER_NAME = "username";
var mainApp=angular.module("pensionApp",["ngRoute","ngCookies"]);
var PAGE_NAMES = ["Pensions Page", "Single Pension Page", "Transactions Page", "Document Page"]

var checkRouting = ["$cookies", "$location", function($cookies, $location) {
	var val = ($cookies.get(COOKIE_LOGGED_IN) == null ? "false" : $cookies.get(COOKIE_LOGGED_IN));
	if (val === "false") {
		$location.path("/");
	}
	return true;
}];

mainApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
	.when("/", {
		templateUrl : "html/login.html",
		controller : "loginController",
	})
	.when("/pensions", {
		templateUrl : "html/pensions.html",
		controller : "pensionsController",
		resolve: {
	            factory: checkRouting
                }
	})
	.when("/pension/:id", {
		templateUrl : "html/pension.html",
		controller : "pensionController",
		resolve: {
	            factory: checkRouting
                }
	})
	.when("/pension/:id/:transId", {
		templateUrl : "html/transaction.html",
		controller : "transactionController",
		resolve: {
	            factory: checkRouting
                }
	})
	.when("/pension/:id/:transId/:docId", {
		templateUrl : "html/document.html",
		controller : "documentController",
		resolve: {
	            factory: checkRouting
                }
	})
	.otherwise({ redirectTo: '/' });
	$locationProvider.html5Mode({
		enabled: false,
		requireBase: false
	});
}]);

var checkRouting = ["$cookies", "$location", function($cookies, $location) {
	var val = ($cookies.get(COOKIE_LOGGED_IN) == null ? "false" : $cookies.get(COOKIE_LOGGED_IN));
	if (val === "false") {
		$location.path("/");
	}
	return true;
}];

mainApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
	.when("/", {
		templateUrl : "html/login.html",
		controller : "loginController",
	})
	.when("/pensions", {
		templateUrl : "html/pensions.html",
		controller : "pensionsController",
		resolve: {
	            factory: checkRouting
                }
	})
	.when("/pension/:id", {
		templateUrl : "html/pension.html",
		controller : "pensionController",
		resolve: {
	            factory: checkRouting
                }
	})
	.when("/pension/:id/:transId", {
		templateUrl : "html/transaction.html",
		controller : "transactionController",
		resolve: {
	            factory: checkRouting
                }
	})
	.when("/pension/:id/:transId/:docId", {
		templateUrl : "html/document.html",
		controller : "documentController",
		resolve: {
	            factory: checkRouting
                }
	})
	.otherwise({ redirectTo: '/' });
	$locationProvider.html5Mode({
		enabled: false,
		requireBase: false
	});
}]);

mainApp.controller("indexController",["$scope", "$routeParams", "$timeout", "$location", "$cookies",
	function($scope, $routeParams, $timeout, $location, $cookies){
		var indexScope = $scope;
		indexScope.notLoggedIn = false;
		indexScope.breadcrumbs = [];
		indexScope.isCompany = (typeof($cookies.get(COOKIE_USER_NAME)) === "string" ? ($cookies.get(COOKIE_USER_NAME).toLowerCase().charAt(0) === 'c') : false);


		indexScope.setBreadCrumbs = function(index) {
			indexScope.breadcrumbs = [];
			var split = $location.url().split("/");
			if (index >= 0) {
				indexScope.breadcrumbs.push({
					path: "#/" + split[1],
					name: PAGE_NAMES[0]
				});
			}
			if (index >= 1) {
				indexScope.breadcrumbs.push({
					path: "#/" + split[1] + "/" + split[2],
					name: PAGE_NAMES[1]
				});
			}
			if (index >= 2) {
				indexScope.breadcrumbs.push({
					path: "#/" + split[1] + "/" + split[2] + "/" + split[3],
					name: PAGE_NAMES[2]
				});
			}
			if (index >= 3) {
				indexScope.breadcrumbs.push({
					path: "#/" + split[1] + "/" + split[2] + "/" + split[3] + "/" + split[4],
					name: PAGE_NAMES[3]
				});
			}
		}

		indexScope.logout = function() {
			indexScope.breadcrumbs = [];
			indexScope.breadcrumbs.push({
				path: "#" + $location.url(),
				name: "Login Page"
			});
			indexScope.notLoggedIn = true;
			$cookies.put(COOKIE_LOGGED_IN, false);
			$cookies.put(COOKIE_USER_NAME, "");
		}
	}
]);

mainApp.controller("loginController",["$scope", "$routeParams", "$timeout", "$location", '$cookies',
	function($scope, $routeParams, $timeout, $location, $cookies) {
		var loginScope = $scope;

		loginScope.$parent.breadcrumbs = [];
		loginScope.$parent.breadcrumbs.push({
			path: "#" + $location.url(),
			name: "Login Page"
		});

		var val = ($cookies.get(COOKIE_LOGGED_IN) == null ? "false" : $cookies.get(COOKIE_LOGGED_IN));
		if (val === "true") {
			loginScope.$parent.notLoggedIn = false;
			$location.path("pensions");
		} else {
			loginScope.$parent.notLoggedIn = true;
		}
		loginScope.username = "";
		loginScope.pass = "";
		loginScope.loading = false;
		loginScope.login = function() {
			console.log("Loggingin")
			loginScope.loading = true;
			$cookies.put(COOKIE_USER_NAME, loginScope.username);
			loginScope.$parent.isCompany = (typeof($cookies.get(COOKIE_USER_NAME)) === "string" ? ($cookies.get(COOKIE_USER_NAME).toLowerCase().charAt(0) === 'c') : false);
			loginScope.username = "";
			loginScope.password = "";
			$timeout(function() {
				loginScope.$parent.notLoggedIn = false;
				loginScope.loading = false;
				$cookies.put(COOKIE_LOGGED_IN, true);
				loginScope.$parent.breadcrumbs = [];
				$location.path("pensions");
			}, 1400);
		}
	}
]);

mainApp.controller("pensionsController",["$scope", "$routeParams", "$timeout", "$location", "$http", "$cookies",
	function($scope, $routeParams, $timeout, $location, $http, $cookies){
		var pensionThis = this;
		var pensionsScope = $scope;

		pensionsScope.$parent.setBreadCrumbs(0);

		if (pensionsScope.$parent.isCompany) {
			pensionsScope.hidePen = {
				first: "InActive",
				second: "Active",
				third: "Both"
			}
		} else {
			pensionsScope.hidePen = {
				first: "Savings",
				second: "Income",
				third: "Both"
			}
		}
		pensionsScope.requestAll = function() {
			pensionsScope.loading = true;
			pensionsScope.loadSuccess = false;
			pensionsScope.loadFailed = false;
			var request = ((typeof($cookies.get(COOKIE_USER_NAME)) === "string" ? ($cookies.get(COOKIE_USER_NAME).toLowerCase().charAt(0) === 'c') : false) ? "all-pensions" : "all-pensions-user");
			var jsonTest = {
				"request": request,
				"data": "",
			}
			$http({
				'content-type': 'application/json; charset=UTF-8',
				method: 'post',
				url: 'http://localhost:1337/POST',
				data: JSON.stringify(jsonTest)
			})
			.then(function successCallback(response) {
				if (response.data.error === "none") {
					console.log("Success Pensions callback");
					pensionsScope.accounts = response.data.content.pensions;
				} else {
					console.log("Error Pensions callback, response data [" + JSON.stringify(response.data) + "]");
				}
			  }, function errorCallback(response) {
				console.log("Error Pensions callback, response [" + response + "]");
				pensionsScope.loadFailed = true;
				$timeout(function() {
				    $scope.loadFailed = false;
				}, 3000);
			  });
		}

		pensionsScope.hidePension = "";

		pensionsScope.hidePensions = function(state) {
			pensionsScope.hidePension = state;
		}

		pensionsScope.getState = function(state) {
			if (state) {
				return pensionsScope.hidePen.second;
			}
			return pensionsScope.hidePen.first;
		}

		pensionsScope.requestCompStats = function() {
			pensionsScope.loading = true;
			pensionsScope.loadSuccess = false;
			pensionsScope.loadFailed = false;
			var jsonTest = {
				"request": "company-stats",
				"data": "",
			}
			$http({
				'content-type': 'application/json; charset=UTF-8',
				method: 'post',
				url: 'http://localhost:1337/POST',
				data: JSON.stringify(jsonTest)
			})
			.then(function successCallback(response) {
				if (response.data.error === "none") {
					console.log("Success Pensions callback");
					pensionsScope.company = response.data.content;
					pensionsScope.loadSuccess = true;
				} else {
					console.log("Error Pensions callback, response data [" + JSON.stringify(response.data) + "]");
					pensionsScope.loadFailed = true;
				}
			  }, function errorCallback(response) {
				console.log("Error Pensions callback, response [" + response + "]");
				pensionsScope.loadFailed = true;
				$timeout(function() {
				    $scope.loadFailed = false;
				}, 3000);
			  })
			.finally(function(){
				$timeout(function() {
					pensionsScope.loading = false;
				}, 500);
			});
		}

		pensionsScope.goToPension = function (acct) {
			$location.path("/pension/" + acct)
		}

		pensionsScope.autoTimerRequest = function() {
			console.log("Pensions Auto Request");
			pensionsScope.requestAll();
			pensionsScope.requestCompStats();
			$timeout(pensionsScope.autoTimerRequest, 5000);
		}

		pensionsScope.initialize = function() {
			pensionsScope.loading = false;
			pensionsScope.loadSuccess = false;
			pensionsScope.loadFailed = false;
			pensionsScope.autoTimerRequest();
			//FOR TESTING UNTIL API IS READY
			pensionsScope.accounts = [];
		}

		pensionsScope.initialize();
	}
]);

mainApp.controller("pensionController",["$scope", "$routeParams", "$timeout", "$location", "$http",
	function($scope, $routeParams, $timeout, $location, $http){
		var pensionScope = $scope;
		pensionScope.id = $routeParams.id

		pensionScope.$parent.setBreadCrumbs(1);

		pensionScope.goBack = function() {
			$location.path("/pensions");
		}


		pensionScope.hideShow = function() {
			if(pensionScope.showSSN === "Show") {
				pensionScope.showSSN = "Hide";
				pensionScope.ssnValue = pensionScope.pension.header.ssn;
			} else {
				pensionScope.showSSN = "Show";
				pensionScope.ssnValue = "****-****-****";
			}
		}

		pensionScope.requestPension = function(id) {
			pensionScope.loading = true;
			pensionScope.loadSuccess = false;
			pensionScope.loadFailed = false;
			var json = {
				"request": "pension",
				"params": id,
			}
			$http({
				'content-type': 'application/json; charset=UTF-8',
				method: 'post',
				url: 'http://localhost:1337/POST',
				data: JSON.stringify(json)
			})
			.then(function successCallback(response) {
				if (response.data.error === "none") {
					console.log("Success Pension callback");
					if (pensionScope.pension.pension == null || response.data.content.pension.transactions.length !== pensionScope.pension.pension.transactions.length)	{
						pensionScope.pension = response.data.content;
						pensionScope.initMap();
					}
					pensionScope.loadSuccess = true;
				} else {
					console.log("Error Pension callback, response data [" + JSON.stringify(response.data) + "]");
					pensionsScope.loadFailed = true;
				}
			  }, function errorCallback(response) {
				console.log("Error Pension callback, response [" + response + "]");
				pensionScope.loadFailed = true;
			  })
			.finally(function(){
				$timeout(function() {
				    pensionScope.loading = false;
				}, 1000);
			});
		}

		pensionScope.goToTransaction = function (transaction) {
			console.log(transaction)
			$location.path($location.url() + "/" + transaction);
		}

		pensionScope.initMap = function(){
			var ctx = $('#myChart');
			var data = [],
				labels = [],
				pointBorderColors = []
				pointBackgroundColors = [];
			var amount = pensionScope.pension.pension.value.substring(1);
			var transactions = pensionScope.pension.pension.transactions;
			for (var i = transactions.length-1; i >= 0; i--) {
				switch(transactions[i].usertype) {
					case "Chain Liquidation":
						data.push(amount = (parseFloat(amount) + parseFloat(transactions[i].valchange.substring(1))));
						pointBorderColors.push("rgba(255,0,0,1)");
					break;
					case "Widthdraw":
						data.push(amount = (parseFloat(amount) + parseFloat(transactions[i].valchange.substring(1))));
						pointBorderColors.push("rgba(255,0,0,1)");
					break;
					case "Deposit":
						data.push(amount = (parseFloat(amount) + parseFloat(transactions[i].valchange.substring(1))));
						pointBorderColors.push("rgba(13,255,170,1)");
					break;
					case "Merge Finalized":
						data.push(amount = (parseFloat(amount) + parseFloat(transactions[i].valchange.substring(1))));
						pointBorderColors.push("rgba(255,0,0,1)");
					break;
					default:
						data.push(amount = (parseFloat(amount) + parseFloat(transactions[i].valchange.substring(1))));
						pointBorderColors.push("rgba(75,192,192,1)");
					break;
				}
				// Add in WHITE as background color
				pointBackgroundColors.push("rgba(255,255,255,1)");
				labels.push(transactions[i].timestamp);
			}
			console.log(data);
			console.log(labels);
			console.log(pointBorderColors);
			var data = {
			    labels: labels,
			    datasets: [
			        {
			            label: "Value Amount History",
			            fill: true,
			            lineTension: 0.0,
			            backgroundColor: "rgba(75,192,192,0.4)",
			            borderColor: "rgba(75,192,192,1)",
			            borderCapStyle: 'butt',
			            borderJoinStyle: 'miter',
			            pointBorderColor: pointBorderColors,
			            pointBackgroundColor: pointBackgroundColors,
			            pointBorderWidth: 1,
			            pointRadius: 5,
			            pointHitRadius: 10,
			            spanGaps: false,
			    		data: data,
			        }
			    ]
			};
			var myChart = new Chart(ctx, {
					type: 'line',
					data: data
			});
		}

		pensionScope.autoTimerRequest = function() {
			console.log("Pension Auto Request");
			pensionScope.requestPension(pensionScope.id);
			$timeout(pensionScope.autoTimerRequest, 5000);
		}


		pensionScope.initialize = function() {
			pensionScope.loading = false;
			pensionScope.loadSuccess = false;
			pensionScope.loadFailed = false;
			pensionScope.hideShow();
			pensionScope.autoTimerRequest()
			//FOR TESTING UNTIL API IS READY
			pensionScope.pension = [];
		}

		pensionScope.initialize();
	}
]);

mainApp.controller("transactionController",["$scope", "$routeParams", "$timeout", "$location", "$http",
	function($scope, $routeParams, $timeout, $location, $http){
		var transactionScope = $scope;
		transactionScope.id = $routeParams.id;
		transactionScope.transId = $routeParams.transId;

		transactionScope.$parent.setBreadCrumbs(2);


		transactionScope.requestTransaction = function(transId) {
			transactionScope.loading = true;
			transactionScope.loadSuccess = false;
			transactionScope.loadFailed = false;
			var json = {
				"request": "transaction",
				"params": transId,
			}
			$http({
				'content-type': 'application/json; charset=UTF-8',
				method: 'post',
				url: 'http://localhost:1337/POST',
				data: JSON.stringify(json)
			})
			.then(function successCallback(response) {
				if (response.data.error === "none") {
					console.log("Success Transaction callback");
					transactionScope.transaction = response.data.content;

					transactionScope.loadSuccess = true;
					$timeout(function() {
					    $scope.loadSuccess = false;
					}, 3000);
				} else {
					console.log("Error Transaction callback, response data [" + JSON.stringify(response.data) + "]");
					pensionsScope.loadFailed = true;
				}
			  }, function errorCallback(response) {
				console.log("Error Transaction callback, response [" + response + "]");
				transactionScope.loadFailed = true;
				$timeout(function() {
				    $scope.loadFailed = false;
				}, 3000);
			  })
			.finally(function(){
				transactionScope.loading = false;
			});
		}

		transactionScope.goBack = function() {
			$location.path("/pension/" + transactionScope.id)
		}

		transactionScope.goToDocument = function(documentId) {
			$location.path("/pension/" + transactionScope.id + "/" + transactionScope.transId + "/" + documentId);
		}

		transactionScope.initialize = function() {
			transactionScope.loading = false;
			transactionScope.loadSuccess = false;
			transactionScope.loadFailed = false;
			transactionScope.requestTransaction(transactionScope.transId);
			//FOR TESTING UNTIL API IS READY
			transactionScope.pension = [];
		}

		transactionScope.initialize();
	}
]);

mainApp.controller("documentController",["$scope", "$routeParams", "$timeout", "$location", "$http",
	function($scope, $routeParams, $timeout, $location, $http){
		var documentScope = $scope;
		documentScope.id = $routeParams.id;
		documentScope.transId = $routeParams.transId;
		documentScope.docId = $routeParams.docId;

		documentScope.$parent.setBreadCrumbs(3);

		documentScope.requestDocument = function(transId, documentId) {
			documentScope.loading = true;
			documentScope.loadSuccess = false;
			documentScope.loadFailed = false;
			var json = {
				"request": "transaction",
				"params": transId + "/" + documentId,
			}
			$http({
				'content-type': 'application/json; charset=UTF-8',
				method: 'post',
				url: 'http://localhost:1337/POST',
				data: JSON.stringify(json)
			})
			.then(function successCallback(response) {
				if (response.data.error === "none") {
					console.log("Success Document callback");
					documentScope.document = response.data.content;

					documentScope.loadSuccess = true;
					$timeout(function() {
					    $scope.loadSuccess = false;
					}, 3000);
				} else {
					console.log("Error Document callback, response data [" + JSON.stringify(response.data) + "]");
					pensionsScope.loadFailed = true;
				}
			  }, function errorCallback(response) {
				console.log("Error Document callback, response [" + response + "]");
				documentScope.loadFailed = true;
				$timeout(function() {
				    $scope.loadFailed = false;
				}, 3000);
			  })
			.finally(function(){
				documentScope.loading = false;
			});
		}

		documentScope.goBack = function() {
			$location.path("/pension/" + documentScope.id + "/" + documentScope.transId);
		}

		documentScope.initialize = function() {
			documentScope.loading = false;
			documentScope.loadSuccess = false;
			documentScope.loadFailed = false;
			documentScope.requestDocument(documentScope.transId, documentScope.docId);
		}

		documentScope.initialize();
	}
]);

mainApp.filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                  //Also remove . and , so its gives a cleaner result.
                  if (value.charAt(lastspace-1) == '.' || value.charAt(lastspace-1) == ',') {
                    lastspace = lastspace - 1;
                  }
                  value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    });