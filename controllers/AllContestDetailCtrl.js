angular.module('PruForce.controllers')
	.controller('AllContestDetailCtrl', function ($state,$scope,$rootScope,GetTargetContest,CommonService ,$filter, $stateParams,$ionicLoading) {

		$scope.viewData = {
			hasHeader:true,
			title: '<h2>'+ $filter('translate')('CONTEST.MY_CONTEST_DETAIL') +'</h2>',
			titleHeader: $filter('translate')('CONTEST.MY_CONTEST_DETAIL'),
			rightButtonMenu: true
		  }
		  
		  $scope.showSpinnerImages = true;

//		Return Date format
		$scope.endDate = function (value) {
			return moment(new Date(value)).format('LL');
		}
		  
// 		Get Data List Finished Contest detail
		$scope.getDataMCD = JSON.parse($stateParams.contest);
		$scope.isMyContest = $stateParams.isMyContest;
		$scope.isAchieve = $stateParams.isAchieve;
		$scope.countOl = 0;
		$scope.progressSpinner = 0;
		
		
		function setAchieve(){

			for(var i = 0; i < $scope.getDataMCD.length; i++){
				var tempDataMCD = $scope.getDataMCD[i];
				for(var j = 0; j < tempDataMCD.detail.contestsCriteria.length; j++){
					var tempContestCriteria = tempDataMCD.detail.contestsCriteria[j];
					if(tempDataMCD.target.length != 0){
						if(tempDataMCD.target[0][tempContestCriteria.criteriaCategory.name_column_achievement] < tempDataMCD.target[0][tempContestCriteria.criteriaCategory.name_column_target] ){

							$scope.getDataMCD[i].detail.contestsCriteria[j]['leftOvers'] = tempDataMCD.target[0][tempContestCriteria.criteriaCategory.name_column_target] - tempDataMCD.target[0][tempContestCriteria.criteriaCategory.name_column_achievement];
							$scope.getDataMCD[i].detail.contestsCriteria[j]['isAchieve'] = false;
						}else{
							$scope.getDataMCD[i].detail.contestsCriteria[j]['leftOvers'] = 0;
							$scope.getDataMCD[i].detail.contestsCriteria[j]['isAchieve'] = true;
							$scope.progressSpinner++;
						}
					}else{
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

//		Get Data Target From Service
		function getTargetContest() {
			GetTargetContest.invoke($scope.DataListAll.code_contest, $rootScope.agent.code, $rootScope.agent.agentType).then(function (res) {
				$scope.target = res.invocationResult.array;
				for(var i = 0; i<$scope.DataListAll.contestsCriteria.length; i++){
					var val1 = $scope.target[0][$scope.DataListAll.contestsCriteria[i].criteriaCategory.name_column_achievement];
					var val2 = $scope.target[0][$scope.DataListAll.contestsCriteria[i].criteriaCategory.name_column_target];
					if(Number(val1) > Number(val2)){
						$scope.countOl += 1;
					}
					$scope.progressSpinner = ($scope.countOl / $scope.DataListAll.contestsCriteria.length) * 100;
				}
			})
		}


// 		Change Get Target By Contest
		$scope.selectChild = function (listAlias) {
			$scope.DataList = listAlias;
		}
		
		//		Get Data Image
		function getDataImage(param) {
			CommonService.invokeFileBase64(param, 'contest').then(
				function (response) {
					// If module SIT make atob,
					// If module UIT make "data:image/jpeg;base64," + Response Image
					if (response.invocationResult.isSuccessful) {
						$scope.image = atob(response.invocationResult.content[0]);
					}
					$scope.showSpinnerImages = false;
				}, function (error) {
					console.log(error);
					$scope.showSpinnerImages = false;
				});
		}
		getDataImage($scope.getDataMCD[0].detail.image);
		
		$scope.openPDF = function (val) {
			$ionicLoading.show();
			$state.go('common_pdfjs', {fileName: val, originalFileName: val, module: "contest", pageTitle: "CONDITIONS_CONTEST" , pageLogId: "prudential.contest.pdftermncondition"});
		}
	})