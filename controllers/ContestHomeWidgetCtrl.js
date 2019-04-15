angular.module('PruForce.controllers')
.controller('ContestHomeWidgetCtrl', function($translate, $sce, $scope, $state, $rootScope, $filter, $q, AllFavoriteContestOfflineService, AllMyContestOfflineService, $log,AllMyContestService) {

	var MyContestId = [];
	var MyFavContestId = [];

	var collectionContest = "";

	$scope.loadingMyContest = true;
	$scope.loadingFavorite = true;
	$scope.initLoaded = true;
	$scope.successResult = true;
	$scope.successCall = true;
	$scope.size = 3;
	$rootScope.page = 1;
	$scope.constestWidgetUrl = 'components/contest/contest_home_widget.html';

	$scope.isMyContest = function(contestCode) {
		return MyContestId.indexOf(contestCode) > -1;
	}

	$scope.isFavorite = function(contestCode) {
		return MyFavContestId.indexOf(contestCode) > -1;
	}

	function getDataMyContestFromService() {
		AllMyContestService.invoke($rootScope.agent.code, $rootScope.agent.agentType).then(function (res) {
			if (res.invocationResult.isSuccessful) {
				$scope.ListAllMyContests = res.invocationResult.array;
				setAchieve();
			}
		},
			function (error) {
				$scope.error500 = true;
				$scope.showSpinner = false;
				AppsLog.log(error);
			});
	}

// 	Cek Is Achive
	$scope.progressSpinner = 0;
	function setAchieve() {
		for (var i = 0; i < $scope.ListAllMyContests.length; i++) {
			var tempDataS = $scope.ListAllMyContests[i];
			var achieve = 0;
			if (tempDataS.contests.length > 0) {
				for (var j = 0; j < tempDataS.contests.length; j++) {

					var tempDataC = tempDataS.contests[j];


					for (var k = 0; k < tempDataC.detail.contestsCriteria.length; k++) {
						if (tempDataC.target.length != 0) {

							if (tempDataC.target[0][tempDataC.detail.contestsCriteria[k].criteriaCategory.name_column_achievement] >= tempDataC.target[0][tempDataC.detail.contestsCriteria[k].criteriaCategory.name_column_target]) {
								$scope.ListAllMyContests[i].contests[j].detail.contestsCriteria[k]['leftOvers'] = 0;
								$scope.progressSpinner++;
							} else {
								$scope.ListAllMyContests[i].contests[j].detail.contestsCriteria[k]['leftOvers'] = tempDataC.target[0][tempDataC.detail.contestsCriteria[k].criteriaCategory.name_column_target] - tempDataC.target[0][tempDataC.detail.contestsCriteria[k].criteriaCategory.name_column_achievement];
							}
						} else {
							$scope.ListAllMyContests[i].contests[j].detail.contestsCriteria[k]['leftOvers'] = 0;
						}
					}
					$scope.ListAllMyContests[i].contests[j].detail['myProgress'] = $scope.progressSpinner;
					$scope.progressSpinner = 0;

					if (tempDataC.target.length != 0) {
						achieve += tempDataC.target[0].is_achieved;
					} else {
						achieve += 0;
					}
				}
				$scope.ListAllMyContests[i].contests['isAchieve'] = Math.floor(achieve / tempDataS.contests.length);
			} else {
				$scope.ListAllMyContests[i].contests['isAchieve'] = 0;
			}
		}
	}

	function getDataFavoriteContestFromService(callservice) {	
		return AllFavoriteContestOfflineService.invoke($rootScope.username, $rootScope.agent.code, $rootScope.agent.agentType, callservice).then( function (res){
			getDataAllFavoriteContestListSuccess(res);
		}, function (error) {
			AppsLog.log(error);
		});
	}

	$scope.init = function() {
		$scope.loadingMyContest = true;
		$scope.loadingFavorite = true;
		$scope.successCall = true;
		
		var promises = [];
		var myContestPromise = getDataMyContestFromService(true);
		promises.push(myContestPromise);
		var favoriteContestPromise = getDataFavoriteContestFromService(true);
		promises.push(favoriteContestPromise);

		$q.all(promises).then(function() {
			$scope.successResult = true;
			$scope.initLoaded = true;
			$scope.loadingMyContest = false;
			$scope.loadingFavorite = false;
		}, function (error){
			$scope.successResult = false;
			$scope.initLoaded = true;
			$scope.loadingMyContest = false;
			$scope.loadingFavorite = false;
		});
	}
	
	collectionContest = JsonStoreConfig['findAllMyContest'];
	$scope.$on(collectionContest.JSONSTORE_NAME, function(event, args) {
		if(!$scope.initLoaded) {
			return;
		}

		$scope.successCall = (args.status == "success") ? true : false;

		var myContestPromise = getDataMyContestFromService(false);
		
		$q.all([myContestPromise]).then(function() {
			$scope.loadingMyContest = false;
		}, function (error) {
			$scope.loadingMyContest = false;
		});
	});
	
	collectionContest = JsonStoreConfig['findAllFavoriteContest'];
	$scope.$on(collectionContest.JSONSTORE_NAME, function(event, args) {
		if(!$scope.initLoaded) {
			return;
		}

		$scope.successCall = (args.status == "success") ? true : false;

		var favoriteContestPromise = getDataFavoriteContestFromService(false);
		
		$q.all([favoriteContestPromise]).then(function() {
			$scope.loadingFavorite = false;
		}, function (error) {
			$scope.loadingFavorite = false;
		});
	});
	
	function getDataAllMyContestListSuccess(result) {
		var ListAllMyContest = [];
		var diffDays;
		var isDiff = true;

		if (result.invocationResult != null) {
			for (var i = 0; i < result.invocationResult.length; i++) {
				var dt = {};

				MyContestId.push(result.invocationResult[i].contestCode);

				var children = angular.copy(result.invocationResult[i].children);
				dt.contestCode = result.invocationResult[i].contestCode;
				dt.contestName = result.invocationResult[i].contestName;
				dt.dueDate = moment(new Date(result.invocationResult[i].dueDate)).format('LL');
				dt.diffDays = result.invocationResult[i].daysLeft;
				dt.achieveStatus = 0;
				dt.isParent = (children != null && children.length > 0);
				dt.templateView = dt.isParent ? 'parentContest' : 'singleContest';
				dt.contestState = result.invocationResult[i].contestState;
				dt.isFav = result.invocationResult[i].isFavorite;

				if (dt.isParent) {
					dt.contestActiveCode = result.invocationResult[i].contestActiveCode;
					dt.achieveStatus = result.invocationResult[i].achieveStatus;
					dt.SubContests = [];

					angular.forEach(children, function(value, key) {
						if (dt.contestActiveCode == value.contestCode) {
							value.isActive = true;
							dt.alias = value.alias;
							dt.alias = value.alias;
						} else {
							value.isActive = false;
						}
						dt.SubContests.push(bindContestData(value, {}));
					});
				} else {
					dt = bindContestData(result.invocationResult[i], dt);
				}

				if (dt.diffDays == 0) {
					diffDays = $filter("translate")("CONTEST.TODAY");
					isDiff = false;
				} else if (dt.diffDays == 1) {
					diffDays = $filter("translate")("CONTEST.TOMORROW");
					isDiff = false;
				} else {
					diffDays = dt.diffDays;
					isDiff = true;
				}
				
				dt.periodEndDiff = dt.dueDate;
				dt.daysLeft = diffDays;
				dt.isDiff = isDiff;
				
				ListAllMyContest[i] = dt;
			}
		}

		$scope.ListAllMyContests = ListAllMyContest;
	}

	function bindContestData(contest, container) {
		container.contestName = contest.contestName;
		container.completedTask = contest.completedTask;
		container.totalTask = contest.totalTask;
		container.isActive = contest.isActive;
		container.achieved = contest.completedTask == contest.totalTask ? true : false;
		container.achieveStatus = contest.achieveStatus ? contest.achieveStatus : 0;

		if (contest.overall == null) {
			container.overall = {};
			container.overall.progress = (container.completedTask/container.totalTask)*100;
			container.alias = contest.alias;
		}
		else {
			container.overall = contest.overall;
			container.alias = contest.overall.alias;
			container.contestName = container.overall.contestName;
		}
		container.percentage = $filter('formatNumber')(container.overall.progress,0);

		return container;
	}

	function getDataAllFavoriteContestListSuccess(result) {
		var ListAllContestFavHome = [];
		var diffDays;
		var isDiff = true;

		angular.forEach(result.invocationResult, function(value, key) {
			var dtFav = {};
			var children = angular.copy(result.invocationResult[key].children);
			
			MyFavContestId.push(value.contestCode);
			
			dtFav.achieveStatus = 0;
			dtFav.contestCode = result.invocationResult[key].contestCode;
			dtFav.dueDate = moment(new Date(result.invocationResult[key].dueDate)).format('LL');
			dtFav.diffDays = result.invocationResult[key].daysLeft;
			dtFav.isParent = (children != null && children.length > 0);
			dtFav.templateView = dtFav.isParent ? "parentContest" : "singleContest";
			dtFav.contestState = result.invocationResult[key].contestState;
			dtFav.isContest = result.invocationResult[key].isMyContest;

			if (dtFav.isParent) {
				dtFav.contestActiveCode = result.invocationResult[key].contestActiveCode;
				dtFav.contestName = result.invocationResult[key].contestName;
				dtFav.achieveStatus = result.invocationResult[key].achieveStatus;
				dtFav.SubContests = [];
				
				angular.forEach(children, function(value, key)
				{
					if (dtFav.contestActiveCode == value.contestCode) {
						value.isActive = true;
						dtFav.alias = value.alias;
					} else {
						value.isActive = false;
					}
					dtFav.SubContests.push(bindContestData(value, {}));
				});
			} else {
				dtFav = bindContestData(result.invocationResult[key], dtFav);
			}

			if (dtFav.diffDays == 0) {
				diffDays = $filter("translate")("CONTEST.TODAY");
				isDiff = false;
			} else if (dtFav.diffDays == 1) {
				diffDays = $filter("translate")("CONTEST.TOMORROW");
				isDiff = false;
			} else {
				diffDays = dtFav.diffDays;
				isDiff = true;
			}
			
			dtFav.periodEndDiff = dtFav.dueDate;
			dtFav.daysLeft = diffDays;
			dtFav.isDiff = isDiff;

			ListAllContestFavHome[key] = dtFav;
		});
		
		$scope.ListAllContestFavHomes = ListAllContestFavHome;	
	}
	
	$scope.toContestTab = function() {
		$state.go('contest-tab');
	}

	$scope.changePageHomeContestDetail = function (contest) {
		$state.go('my_contest_detail', { contest: JSON.stringify(contest) });
	}
	
	$scope.changePageHomeFavContestDetail = function(id, contestState) {
		if (contestState == "notEligible") {
			$state.go('my_contest_detail_not_eligible', {contestCode: id});
		}
		else if (contestState == "myContest") {
			$state.go('my_contest_detail', {contestCode: id});
		}
		else if (contestState == "monitoring") {
			$state.go('contest_monitoring_detail', {contestCode: id});
		}
		else if (contestState == "completed") {
			$state.go('contest_completed_detail', {contestCode: id});
		}
	}

	$scope.init();
	
})