angular.module('PruForce.controllers')
	.controller('MyContestDetailCtrl', function ($state, $rootScope, $scope, GetTargetContest, CommonService, $filter, $stateParams, $ionicLoading) {

		$scope.viewData = {
			hasHeader: true,
			title: '<h2>' + $filter('translate')('CONTEST.MY_CONTEST_DETAIL') + '</h2>',
			titleHeader: $filter('translate')('CONTEST.MY_CONTEST_DETAIL'),
			rightButtonMenu: true
		}

		$scope.showSpinnerImages = true;
		$scope.progressSpinner = 0;
		
//		Return Date format
		$scope.endDate = function (value) {
			return moment(new Date(value)).format('LL');
		}

//		Define Get Data From Resolve
		$scope.getDataMCD = JSON.parse($stateParams.contest);
		$scope.isAchieve = $stateParams.isAchieve;
		$scope.countOl = 0;
		
	
// 		Get Data Target From Service
		function getTargetContest() {
			GetTargetContest.invoke($scope.DataList.code_contest, $rootScope.agent.code, $rootScope.agent.agentType).then(function (res) {
				$scope.target = res.invocationResult.array;
				for (var i = 0; i < $scope.DataList.contestsCriteria.length; i++) {
					var val1 = $scope.target[0][$scope.DataList.contestsCriteria[i].criteriaCategory.name_column_achievement];
					var val2 = $scope.target[0][$scope.DataList.contestsCriteria[i].criteriaCategory.name_column_target];
					if (Number(val1) > Number(val2)) {
						$scope.countOl += 1;
					}
					$scope.progressSpinner = ($scope.countOl / $scope.DataList.contestsCriteria.length) * 100;
				}
			})
		}
	
		function setAchieve() {
			for (var i = 0; i < $scope.getDataMCD.length; i++) {
				var tempDataMCD = $scope.getDataMCD[i];
				for (var j = 0; j < tempDataMCD.detail.contestsCriteria.length; j++) {
					var tempContestCriteria = tempDataMCD.detail.contestsCriteria[j];
					if (tempDataMCD.target.length != 0) {
						if (tempDataMCD.target[0][tempContestCriteria.criteriaCategory.name_column_achievement] < tempDataMCD.target[0][tempContestCriteria.criteriaCategory.name_column_target]) {
							$scope.getDataMCD[i].detail.contestsCriteria[j]['leftOvers'] = tempDataMCD.target[0][tempContestCriteria.criteriaCategory.name_column_target] - tempDataMCD.target[0][tempContestCriteria.criteriaCategory.name_column_achievement];
							$scope.getDataMCD[i].detail.contestsCriteria[j]['isAchieve'] = false;
						} else {
							$scope.getDataMCD[i].detail.contestsCriteria[j]['leftOvers'] = 0;
							$scope.getDataMCD[i].detail.contestsCriteria[j]['isAchieve'] = true;
							$scope.progressSpinner++;
						}
					} else {
						$scope.getDataMCD[i].detail.contestsCriteria[j]['leftOvers'] = 0;
						$scope.getDataMCD[i].detail.contestsCriteria[j]['isAchieve'] = false;
					}
				}
				$scope.getDataMCD[i].detail['progress'] = $scope.progressSpinner;
				$scope.progressSpinner = 0;
			}
			$scope.DataList = $scope.getDataMCD[0];
		}
		setAchieve();

//		Get Data Image
		function getDataImage(param) {
			CommonService.invokeFileBase64(param, 'contest').then(
				function (response) {
					// If module SIT make atob,
					// If module UIT make "data:image/jpeg;base64," + Response Image
					if(response.invocationResult.isSuccessful){
						$scope.image = atob(response.invocationResult.content[0]);
					}
					$scope.showSpinnerImages = false;
				}, function (error) {
					console.log(error);
					$scope.showSpinnerImages = false;
				});
		}
		getDataImage($scope.getDataMCD[0].detail.image);	

// 		Change Get Target By Contest
		$scope.selectChild = function (listAlias) {
			$scope.DataList = listAlias;
			getDataImage(listAlias.detail.image);
		}
	
		$scope.openPDF = function (val) {
			$ionicLoading.show();
			$state.go('common_pdfjs', { fileName: val, originalFileName: val, module: "contest", pageTitle: "CONDITIONS_CONTEST", pageLogId: "prudential.contest.pdftermncondition" });
		}
})