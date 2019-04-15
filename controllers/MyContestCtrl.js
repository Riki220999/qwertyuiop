/** 
 * Controller	  : All My Contest
 * Author By      : Riki Setiyo P.
*/

angular.module('PruForce.controllers')
	.controller('MyContestCtrl', function ($scope, $state, $stateParams, $interval, $http, $filter, $sce, $rootScope, $ionicLoading, $ionicPopup, AllMyContestService, $translate, $ionicHistory, FiveRankingMyContestDetailService,AllYearService) {

//      Global Var
		var extraCreditFlag = 0;
		var pageMyContest = 1;
		$scope.ListMyContest = [];
		$scope.noMoreItemsAvailable = true;
		$scope.numberOfItemsToDisplay = $rootScope.size;
		$scope.showSpinner = true;
		$scope.error500 = false;
		
//      Refresh Page
		$scope.refreshPage = function () {
			$scope.showSpinner = true;
			$scope.error500 = false;
			$scope.loadMore();
		}

		$scope.loadMore = function () {
			pageMyContest += 1;
			$scope.$broadcast('scroll.infiniteScrollComplete');
			getDataFromService();
		};

		$scope.MoreItemsAvailable = function () {
			return !$scope.noMoreItemsAvailable;
		};
			
//		Get Data From Service
		function getDataFromService() {
			AllMyContestService.invoke($rootScope.agent.code, $rootScope.agent.agentType).then(function (res) {
				if (res.invocationResult.isSuccessful) {
					$scope.listDataSuccess = res.invocationResult.array;
					$scope.showSpinner = false;
					$scope.error500 = false;
					setAchieve();
				}
			},
				function (error) {
					$scope.error500 = true;
					$scope.showSpinner = false;
					pageMyContest -= 1;
					AppsLog.log(error);
				});
		}

		$scope.progressSpinner = 0;
		function setAchieve(){
			for(var i = 0; i < $scope.listDataSuccess.length; i++){
				var tempDataS = $scope.listDataSuccess[i];
				var achieve = 0;
				if(tempDataS.contests.length > 0){
					for(var j = 0; j < tempDataS.contests.length; j++){
						
						var tempDataC = tempDataS.contests[j];

						
						for(var k = 0; k < tempDataC.detail.contestsCriteria.length; k++){
							if(tempDataC.target.length != 0){

								if(tempDataC.target[0][tempDataC.detail.contestsCriteria[k].criteriaCategory.name_column_achievement] >= tempDataC.target[0][tempDataC.detail.contestsCriteria[k].criteriaCategory.name_column_target] ){
									$scope.listDataSuccess[i].contests[j].detail.contestsCriteria[k]['leftOvers'] = 0;
									$scope.progressSpinner++;
								}else{
									$scope.listDataSuccess[i].contests[j].detail.contestsCriteria[k]['leftOvers'] = tempDataC.target[0][tempDataC.detail.contestsCriteria[k].criteriaCategory.name_column_target] - tempDataC.target[0][tempDataC.detail.contestsCriteria[k].criteriaCategory.name_column_achievement];
								}
							}else{
								$scope.listDataSuccess[i].contests[j].detail.contestsCriteria[k]['leftOvers'] = 0;
							}
						}
						$scope.listDataSuccess[i].contests[j].detail['myProgress'] = $scope.progressSpinner;
						$scope.progressSpinner = 0;
						
						if(tempDataC.target.length != 0){
							achieve += tempDataC.target[0].is_achieved;
						}else{
							achieve += 0;
						}
					}
					$scope.listDataSuccess[i].contests['isAchieve'] = Math.floor(achieve / tempDataS.contests.length);
				}else{
					$scope.listDataSuccess[i].contests['isAchieve'] = 0;
				}
			}
		}	

//      Get All List Data If Success        
		function getDataAllMyContestListSuccess(result) {
			$scope.showSpinner = false;
			var diffDays;
			var isDiff = true;
			var progressSingle;
			var percentageChildTemp;

			if (result.invocationResult.isSuccessful) {
				if (result.invocationResult.array != null) {
					$scope.noMoreItemsAvailable = (result.invocationResult.array.length<$rootScope.size) ? true : false;

					if (result.invocationResult.array.length > 0) {
						for (var i = 0; i < result.invocationResult.array.length; i++) {
							var dt = {};

							dt.contestCode = result.invocationResult.array[i].contestCode;
							dt.contestName = result.invocationResult.array[i].contestName;
							dt.dueDate = moment(new Date(result.invocationResult.array[i].dueDate)).format('LL');
							dt.diffDays = result.invocationResult.array[i].daysLeft;
							dt.SubContests = angular.copy(result.invocationResult.array[i].children);
							dt.isParent = (dt.SubContests != null && dt.SubContests.length > 0);
							dt.achieveStatus = result.invocationResult.array[i].achieveStatus;

							dt.currContest = null;

							if (dt.isParent) {
								dt.contestActiveCode = result.invocationResult.array[i].contestActiveCode;

								angular.forEach(dt.SubContests, function(value, key)
								{	
									if (dt.contestActiveCode == value.contestCode) {
										dt.SubContests[key].isActive = true;
										dt.currContest = dt.SubContests[key];
                                    }
                                    else {
										dt.SubContests[key].isActive = false;
									}

									dt.SubContests[key].completedTask = value.completedTask;
									dt.SubContests[key].totalTask = value.totalTask;
									dt.SubContests[key].achieved = value.completedTask == value.totalTask ? true : false;
									dt.SubContests[key].achieveStatus = value.achieveStatus;
									
									if (value.overall == null) {
										dt.SubContests[key].overall = {};
										dt.SubContests[key].overall.progress = (dt.SubContests[key].completedTask/dt.SubContests[key].totalTask)*100;
                                    }
                                    else {
										dt.SubContests[key].overall = value.overall;
										dt.SubContests[key].alias = value.overall.alias;
										dt.SubContests[key].contestName = value.overall.contestName;
									}
									dt.SubContests[key].percentage = $filter('formatNumber')(dt.SubContests[key].overall.progress,0);
								});

                            }
                            else {
								dt.currContest = result.invocationResult.array[i];
							}

							if (dt.diffDays == 0) {
								diffDays = $filter("translate")("CONTEST.TODAY");
								isDiff = false;
                            }
                            else if (dt.diffDays == 1) {
								diffDays = $filter("translate")("CONTEST.TOMORROW");
								isDiff = false;
                            }
                            else {
								diffDays = dt.diffDays;
								isDiff = true;
							}

							dt.periodEndDiff = dt.dueDate;
							dt.daysLeft = diffDays;
							dt.isDiff = isDiff;
							dt.completedTask = dt.currContest.completedTask;
							dt.totalTask = dt.currContest.totalTask;
							dt.orphan = dt.currContest.orphan;
							dt.overall = dt.currContest.overall;

							if (dt.overall == null) {
								progressSingle = (dt.completedTask / dt.totalTask) * 100;
								dt.overall = {};
								dt.overall.lineStatus = "nothave";
								dt.overall.progress = $filter('formatNumber')(progressSingle, 1);
							}
							else {
								dt.overall.lineStatus = "have";
							}

							dt.overall.spinner = $filter('formatNumber')(dt.overall.progress, 0);
							
							dt.extraCreditFlag = dt.currContest.extraCreditFlag;
							dt.extraCreditCode = dt.currContest.contestCode;

							dt.params = angular.copy(dt.currContest.params);

							angular.forEach(dt.params, function (value, key) {
								if (dt.params[key].percentage != undefined || dt.params[key].percentage != null) {
									dt.params[key].percentageRound = $filter('formatNumber')(dt.params[key].percentage, 0);
									percentageChildTemp = dt.params[key].percentage;
									dt.params[key].percentage = $filter('formatNumber')(percentageChildTemp, 1);
								}

								if (dt.params[key].key == "api" && dt.params[key].targetRanking > 0) {
									dt.params[key].subtitleRanking = $sce.trustAsHtml($translate.instant(dt.params[key].subtitleRanking, dt.params[key]));
								}

								if (dt.params[key].type == "ranking" && dt.params[key].actual == 0) {
									dt.params[key].subtitle = $sce.trustAsHtml($filter("translate")("CONTEST.SUBTITLE_RANKING_NA"));	
                                }
                                else {
									dt.params[key].subtitle = $sce.trustAsHtml($translate.instant(dt.params[key].subtitle, dt.params[key]));	
								}
							});

							$scope.ListMyContest.push(dt);
						}

						$scope.numberOfItemsToDisplay = $scope.ListMyContest.length;
					}
				}

				if (result.invocationResult.error == 500 || result.invocationResult.statusCode == 500) {
					AppsLog.log("No data found. Please try again later!");
					$scope.error500 = true;
					pageMyContest -= 1;
				}

            } 
            else {
				if (result.invocationResult.error == 500 || result.invocationResult.statusCode == 500) {
					AppsLog.log("Load Data Failed, Please Check Your Connection");
					$scope.error500 = true;
					pageMyContest -= 1;
                } 
                else {
					AppsLog.log("No data found. Please try again later!");
				}
			}
        }

//		ChangePage My Contest Detail		
		$scope.changePageMyContestDetail = function (contest) {
			$state.go('my_contest_detail', { contest: JSON.stringify(contest), isAchieve: contest.isAchieve });
		}

//      Change page by parameter
		$scope.changePageParameter = function(key, contest) {
			key = key ? key : "";
			if (key.toLowerCase() == "persistency") {
				$state.go('contest_achievement_persistency', {
					contestCode: contest.currContest.contestCode,
					categoryOfAgent: contest.currContest.categoryOfAgent
				});
			} 
			else if (key.toLowerCase() == "api") {
				$state.go('contest_achievement_production', { 
					contestCode : contest.currContest.contestCode, 
					categoryOfAgent: contest.currContest.categoryOfAgent, 
					alias: contest.currContest.alias,
					source: "summary"
				});
			} 
			else if (key.toLowerCase() == "ranking") {
				if (contest.currContest.rankingDetail) {
					$scope.showRankingDetail(contest.currContest.contestCode);
				}
			}
		}

// 		Show Rangking Detail		
		$scope.showRankingDetail = function(contestCode) {	
			$ionicLoading.show();
			FiveRankingMyContestDetailService.invoke($rootScope.username, $rootScope.agent.code, contestCode).then(function (res) {
				$scope.fiveRanking = res;

				$scope.fiveRanking.invocationResult.thisAgent.nettApiStr = $filter('formatNumber')($scope.fiveRanking.invocationResult.thisAgent.nettApi, 2);
				angular.forEach($scope.fiveRanking.invocationResult.upperAgent, function(value, key) {	
					$scope.fiveRanking.invocationResult.upperAgent[key].nettApiStr =  $filter('number')($scope.fiveRanking.invocationResult.upperAgent[key].nettApi, 2);
				});

				angular.forEach($scope.fiveRanking.invocationResult.lowerAgent, function(value, key) {	
					$scope.fiveRanking.invocationResult.lowerAgent[key].nettApiStr =  $filter('number')($scope.fiveRanking.invocationResult.lowerAgent[key].nettApi , 2);
				});
				
				$ionicLoading.hide();
				var alertPopup = $ionicPopup.alert({	
					title: '<span class="text-initial">'+$filter('translate')('CONTEST.NOW_RANKING')+'<span class="big mLeft10">'+$scope.fiveRanking.invocationResult.thisAgent.ranking+'</span></span>',
					template: '<div class="container home inquiry-custom">'+
					'<div class="content font-size-12-8 pLeft10 pRight10 line-height-18-row" style="padding: 0px;">'+

					'<div class="row bBottom mTop0" style="border-bottom: solid 1px #000 !important;">'+
					'<div class="col col-55" style="font-weight:bold;">'+$filter('translate')('RANKING_CONTEST')+'</div><div class="col col-45 text-right"  style="font-weight:bold;">'+$filter('translate')('API')+'</div>'+
					'</div>'+

					'<div ng-if="'+$scope.fiveRanking.invocationResult.upperAgent.length+'>0" ng-model="fiveRanking" data-ng-repeat="upperAgentHtml in fiveRanking.invocationResult.upperAgent" class="row bBottom mTop0">'+
					'<div class="col col-55"> {{upperAgentHtml.ranking}}'+" "+'</div><div class="col col-45 text-right">'+'{{upperAgentHtml.nettApiStr}}'+'</div>'+
					'</div>'+
					'<div class="row mTop0 red-font red-border">'+
					'<div class="col col-55">'+$scope.fiveRanking.invocationResult.thisAgent.agentName+' </div><div class="col col-45 text-right">'+$scope.fiveRanking.invocationResult.thisAgent.nettApiStr+'</div>'+
					'</div>'+
					'<div ng-if="'+$scope.fiveRanking.invocationResult.lowerAgent.length+'>0" ng-model="fiveRanking" data-ng-repeat="lowerAgentHtml in fiveRanking.invocationResult.lowerAgent" class="row bBottom mTop0">'+
					'<div class="col col-55"> {{lowerAgentHtml.ranking}}'+" "+'</div><div class="col col-45 text-right">{{lowerAgentHtml.nettApiStr}}'+'</div>'+
					'</div>'+
					'</div>'+
					'</div>'+
					'</div>',
					scope:$scope,
					cssClass: 'v2 rank-detail',
					okText: $filter('translate')('CONTEST.CLOSE_BUTTON')
				});
			})
		};

//		ChangePage Size		
		function changePageSize() {
			var tabList = document.getElementsByClassName('tabList');
			if (tabList[0]) {
				tabList[0].style.minHeight = (window.innerHeight - 100) + "px";
			}
		}

//		Return Date format
		$scope.endDate = function (value){
			return moment(new Date(value)).format('LL');
		}		

		angular.element(document).ready(function () {
			changePageSize();
		});

		$(window).resize(function () {
			changePageSize();
		});
		
		getDataFromService();						

	})