angular.module('PruForce.controllers')
.controller('AllContestCtrl',	function($scope, $rootScope, $ionicPopup, $window, $ionicLoading, $state,$interval, $http, $filter, $translate, $sce, AllContestService, SaveContestFavoriteService, DeleteContestFavoriteService, $ionicSlideBoxDelegate, AllYearService, AllContestYearsService) {
	
	var completedYear = '';
	var spinnerImage = [];
	var pageAllContest = 1;
	var date = new Date();

	$scope.noMoreItemsAvailable = true;
	$scope.showSpinner= true;
	$scope.favFlag = true;
	$rootScope.numberOfItemsToDisplay = $rootScope.size;
	$scope.filterSearchYear = 'Pilih Tahun';
	$scope.filterSearchString = '';
	$scope.listAllContestAll = [];
	$scope.ListAllBigContests = [];
	$scope.dataMaster = [];
	$scope.showSpinnerSlideBox = true;
	$scope.error500 = false;
	$scope.error500Big = false;

	$scope.data = {};
	$scope.data.sliderOption = {
        autoplay: 2500,
        autoplayDisableOnInteraction: false
	}
	$scope.data.activeIndex = 0;
	$scope.data.sliderDelegate = null;

	$scope.completedYears = {
		data: [{
			id: '',
			name: $filter('translate')('CONTEST.SELECT_YEAR_COMPLETED')
		}]
	};

	$scope.yearsFilterItem = {
		onRequest: $scope.completedYears.data[0]
	};

	$scope.orderByItem = {
		data: [
			{
				id: 'null',
				name: $filter('translate')('CONTEST.SELECT_ORDER_COMPLETED')
			}, {
				id: 'date desc',
				name: $filter('translate')('CONTEST.RECENT_YEARS_COMPLETED')
			},
			{
				id: 'date asc',
				name: $filter('translate')('CONTEST.LONGEST_YEARS_COMPLETED')
			},
			{
				id: 'name asc',
				name: $filter('translate')('CONTEST.CONTEST_NAME_COMPLETED')
			}
		]
	};

	$scope.orderByItemFilter = {
		onRequest: $scope.orderByItem.data[0]
	};

	$scope.GoSearching_GoFiltering = function () {
		$scope.showSpinner = true;
		$scope.listAllContestAll = [];
		pageAllContest = 1;
		$rootScope.numberOfItemsToDisplay = 10;

		$scope.ListCompletedContest = [];
		completedYear = angular.isUndefined($scope.yearsFilterItem.onRequest.id) ? "" : $scope.yearsFilterItem.onRequest.id;
		$rootScope.searchBy = angular.isUndefined(this.filterSearchString) ? "" : this.filterSearchString;
		$rootScope.orderDirection = '';
		$rootScope.orderDirection = $scope.orderByItemFilter.onRequest.id;

		if ($rootScope.orderDirection == 'null') {
			$rootScope.orderDirection = 'date desc';
		}

		getDataFromService();
	}
	
	$scope.refreshPage = function () {
		$scope.showSpinner = true;
		$scope.error500 = false;
		$scope.loadMore();
	}
	  
	$scope.loadMore = function () {
		getDataFromService();
	};

	$scope.MoreItemsAvailable = function() {
		return !$rootScope.noMoreItemsAvailable;
	};
	
//	Get Service Function	
	function getDataFromService(year) {
		$scope.listDataAllSuccess = [];
		AllContestService.invoke($scope.filterSearchYear == 'Pilih Tahun' ? 0 : $scope.filterSearchYear, $rootScope.agent.agentType, $rootScope.agent.code).then(function (res) {
			if (res.invocationResult.isSuccessful) {
				$scope.listDataAllSuccess = res.invocationResult.array;
				$scope.showSpinner = false;
				$scope.error500 = false;
				setAchieve();
			}
		}, function (error) {
			AppsLog.log(error);
			$scope.error500 = true;
			$scope.showSpinner = false;
			pageAllContest -= 1;
		});
	}

	$scope.progressSpinner = 0;
	function setAchieve(){
			for(var i = 0; i < $scope.listDataAllSuccess.length; i++){
				var tempDataS = $scope.listDataAllSuccess[i];
				var achieve = 0;
				var isMyContest = false;
				if(tempDataS.contests.length > 0){
					for(var j = 0; j < tempDataS.contests.length; j++){
						
						var tempDataC = tempDataS.contests[j];
						if(tempDataC.target.length != 0){

							for(var k = 0; k < tempDataC.detail.contestsCriteria.length; k++){
								if(tempDataC.target[0][tempDataC.detail.contestsCriteria[k].criteriaCategory.name_column_achievement] >= tempDataC.target[0][tempDataC.detail.contestsCriteria[k].criteriaCategory.name_column_target] ){
									$scope.progressSpinner++;
								}
							}
							
							$scope.listDataAllSuccess[i].contests[j].detail['myProgress'] = $scope.progressSpinner;
							$scope.progressSpinner = 0;
							achieve += tempDataC.target[0].is_achieved;

							for(var l = 0; l < tempDataC.detail.contestsDetail.length; l++){
								var tempAgenType = tempDataC.detail.contestsDetail[l];
								if($rootScope.agent.agentType == tempAgenType.contestLevel.agentType){
									isMyContest = true;
									break;
								}
							}

						}else{
							$scope.listDataAllSuccess[i].contests[j].detail['myProgress'] = 0;
							$scope.progressSpinner = 0;
							achieve += 0;
						}
					}
					$scope.listDataAllSuccess[i].contests['isAchieve'] = Math.floor(achieve / tempDataS.contests.length);
					$scope.listDataAllSuccess[i].contests['isMyContest'] = isMyContest;
				}else{
					$scope.listDataAllSuccess[i].contests['isAchieve'] = 0;
					$scope.listDataAllSuccess[i].contests['isMyContest'] = false;
				}
			}
			$scope.dataMaster = $scope.listDataAllSuccess;
	}

	function getDataAllContestListSuccess(result) {
		$scope.showSpinner = false;
		$ionicLoading.hide();
		
		if (result.invocationResult.isSuccessful) {
			if (result.invocationResult.array != null) {
				$scope.noMoreItemsAvailable = (result.invocationResult.array.length<$rootScope.size) ? true : false;

				if (result.invocationResult.array.length > 0) {
					for (var i = 0; i < result.invocationResult.array.length; i++) {
						var dt = {};
						var currContest;

						dt.contestCode = result.invocationResult.array[i].contestCode;
						dt.contestName = result.invocationResult.array[i].contestName;
						dt.favorite = result.invocationResult.array[i].favorite;
						if(dt.favorite !== true){
							$scope.favFlag == false;
						}

						dt.SubContests = angular.copy(result.invocationResult.array[i].children);
						dt.isParent = (dt.SubContests != null && dt.SubContests.length > 0);

						if (dt.isParent) {
							dt.contestActiveCode = result.invocationResult.array[i].contestActiveCode;
							angular.forEach(dt.SubContests, function(value, key)
								{	
								if (dt.contestActiveCode == value.contestCode) {
									currContest = dt.SubContests[key];
								}
							});

						} else {
							currContest = result.invocationResult.array[i];
						}
			
						dt.periodStart = moment(new Date(currContest.periodStart)).format('LL');
						dt.periodEnd = moment(new Date(currContest.periodEnd)).format('LL');
						dt.contestState = currContest.contestState;
						dt.description = currContest.description;
						dt.topRank = 100; //result.invocationResult.array[i].topRank;
						dt.progressSts = currContest.progressSts;
						dt.progressStsColor = "balanced";

						if (dt.contestState == "notEligible") {
							dt.progressStsStatus = $filter('translate')('CONTEST.NOT_ELIGIBLE');
							dt.progressStsColor = "energized";
						} else {
							if (dt.progressSts == "CLOSED") {
								dt.progressStsStatus = $filter('translate')('CONTEST.CLOSED');
								dt.progressStsColor = "assertive";
							}
							else if (dt.progressSts == "IN PROGRESS") {
								dt.progressStsStatus = $filter('translate')('CONTEST.IN_PROGRESS');
							}
						}

						$scope.listAllContestAll.push(dt);
					}
				}
			}

			$scope.numberOfItemsToDisplay = $scope.listAllContestAll.length;

			if (result.invocationResult.error==500 || result.invocationResult.statusCode == 500) {
				$scope.error500 = true;
				pageAllContest -= 1;
				AppsLog.log("No data found. Please try again later!");
			}
		} else {
			if(result.invocationResult.error==500 || result.invocationResult.statusCode == 500) {
				$scope.error500 = true;
				pageAllContest -= 1;
			} else {
				AppsLog.log("No data found. Please try again later!");
			}
		}
	}

	function getDataAllContestListFailed(result) {
		AppsLog.log("Load Data Failed, Please Check Your Connection");
	}

	function getAllCompletedContestYearsFromService() {
		AllContestYearsService.invoke().then(function (res) {
			getDataAllCompletedContestYearsListSuccess(res);
		}, function (error) {
			AppsLog.log(error);
		});
	}

	getAllCompletedContestYearsFromService();
	
	function getDataAllCompletedContestYearsListSuccess(result) {
		if (result.invocationResult.isSuccessful) {
			angular.forEach(result.invocationResult.array, function (value, key) {
				$scope.completedYears.data.push({
					'id': value,
					'name': value
				});
			})
		} else {
			AppsLog.log("No data found. Please try again later!");
		}
		$ionicLoading.hide();
	}

	$scope.contestFav = function(e, contestCode, index) {
		var self = $(e.toElement);
		$ionicLoading.show();
		self.blur();

		if (self.hasClass("contest-favorite") || $scope.listAllContestAll[index].favorite == true) {
			DeleteContestFavoriteService.invoke($rootScope.username, $rootScope.agent.code, $rootScope.agent.agentType, contestCode).then(function(res) {
				$ionicLoading.hide();
				self.removeClass("contest-favorite");
				$scope.listAllContestAll[index].favorite = false;
			}, function(error){
				$ionicLoading.hide();
				return $scope.showAlert($filter('translate')('CONTEST.ATTENTION_NOTELIGIBLE'), $filter('translate')('CONTEST.ERROR'));
			});
		} else {
			SaveContestFavoriteService.invoke($rootScope.username, $rootScope.agent.code, $rootScope.agent.agentType, contestCode).then(function (res) {
				$ionicLoading.hide();
				if (res.invocationResult.message == "I001")
				{
					$scope.listAllContestAll[index].favorite = true;
					self.addClass("contest-favorite");
				}
				var message = $translate.instant(resolveMessage(res.invocationResult.message), $scope.listAllContestAll[index]);
				res.invocationResult.message = "";
				return $scope.showAlert($filter('translate')('CONTEST.ATTENTION_NOTELIGIBLE'), message);
			}, function(error){
				$ionicLoading.hide();
				return $scope.showAlert($filter('translate')('CONTEST.ATTENTION_NOTELIGIBLE'), $filter('translate')('CONTEST.ERROR'));
			});
		}
	}

	var resolveMessage = function(ECode){
		switch(ECode){
			case "E001":
				return 'CONTEST.NOT_FOUND';
			case "E002":
				return 'CONTEST.NOT_ELIGIBLE_CONTEST';
			case "E003":
				return 'CONTEST.NOT_IN_PERIOD';
			case "E004":
				return "CONTEST.MAX_FAVORITE_AMOUNT";
			case "E005":
				return "CONTEST.FAILED_SAVE_FAVORITE";
			case "E006":
				return "CONTEST.FAILED_DELETE_FAVORITE";
			case "I001":
				return "CONTEST.FAVORITE_SUCCESS";
			case "I002":
				return "CONTEST.FAVORITE_DELETE_SUCCESS";
		}
	}

	$scope.changePageAllContestDetail = function(contest) {	
		$state.go('all_contest_detail', {contest: JSON.stringify(contest), isAchieve : contest.isAchieve, isMyContest : contest.isMyContest});
	}

	$scope.hideSpinnerImages = function(index) {
		return !(spinnerImage[index]);
	}

	$scope.showAlert = function(msg_title, msg_template) {
		var popUpButton3 = $(".popup-container .popup .popup-head h3");
		popUpButton3.css("line-height", "21px");
		popUpButton3.css("color", "#fff");
		popUpButton3.css("font-style", "italic");
		popUpButton3.css("font-size", "16px");

		var popUpButton4 = $(".popup-container .popup-buttons");
		popUpButton4.css("visibility", "hidden");
		popUpButton4.css("height", "0");
		popUpButton4.css("min-height", "0");

		var popUpButton5 = $(".popup-container .list-info");
		popUpButton5.css("border-bottom", "solid 1px #e5e5e5");

		var popUpButton6 = $(".popup-container .popup .popup-body");
		popUpButton6.css("overflow-y", "scroll");
		popUpButton6.css("overflow-x", "hidden");
		popUpButton6.css("-webkit-overflow-scrolling", "touch");

		var popUpButton7 = $(".popup-container .content p");
		popUpButton7.css("font-style", "normal");

		var alertPopup = $ionicPopup.alert({
			title: msg_title,
			template: msg_template
		});
		var popUpButton0 = $(".popup-container");
		popUpButton0.css("background-color", "rgba(0, 0, 0, 0.7)");
		popUpButton0.css("z-index", "2000");
		var popUpButton01 = $(".popup-container .popup");
		popUpButton01.css("width", "88vw");
		popUpButton01.css("margin-top", "86px");
		popUpButton01.css("margin-bottom", "56px");
		popUpButton01.css("background-color", "rgba(255, 255, 255, 1)");
		var popUpButton1 = $(".popup-container .popup .popup-head");
		
		popUpButton1.css("background-color", "#ff0000");
		var popUpButton = $(".popup-container .popup-buttons");
		popUpButton.css("visibility", "visible");
		popUpButton.css("min-height", "65px");
		var popUpButton2 = $(".popup-container .popup .popup-body");
		popUpButton2.css("padding", "5vw");
		popUpButton2.css("overflow", "auto");

		alertPopup.then(function(res) {
		});
	};

//	Get Data Years
	$scope.getAllyears = [];
	$scope.getAllyears.push('Pilih Tahun');
	function getDataYearsFromService() {
		AllYearService.invoke().then(function (res) {
			for (var i = 0; i < res.invocationResult.array.length; i++) {
				$scope.getAllyears.push(res.invocationResult.array[i]);
			}
		},
			function (error) {
				AppsLog.log(error);
				$scope.error500 = true;
				$scope.showSpinner = false;
				pageAllContest -= 1;
			});
	}
	getDataYearsFromService();
	
	$scope.onChangeFilter = function(){
		$scope.showSpinner = true;
		getDataFromService();
	}

	$scope.onChangeFilterName = function(){
		var tempDataMaster = $scope.dataMaster;
		var tempDataDisplay = [];
		
		for(var i = 0; i < tempDataMaster.length; i++){
			if(tempDataMaster[i].contestCategory.name_category.toLowerCase().indexOf($scope.filterSearchString.toLowerCase()) >= 0){
				tempDataDisplay.push(tempDataMaster[i]);
			}
		}

		$scope.listDataAllSuccess = tempDataDisplay;
	}

	$scope.onChangeFilterItem = function(){
		if($scope.orderByItemFilter.onRequest.id == 'name asc'){
			$scope.listDataAllSuccess = $filter('orderBy')($scope.listDataAllSuccess, 'contestCategory.name_category');
		}else if($scope.orderByItemFilter.onRequest.id == 'date desc'){
			$scope.listDataAllSuccess = $filter('orderBy')($scope.listDataAllSuccess, '-contestCategory.end_date');
		}else if($scope.orderByItemFilter.onRequest.id == 'date asc'){
			$scope.listDataAllSuccess = $filter('orderBy')($scope.listDataAllSuccess, 'contestCategory.end_date');
		}else{
			$scope.listDataAllSuccess = $scope.dataMaster;
		}

	}

//	Return Date format
	$scope.endDate = function (value) {
		return moment(new Date(value)).format('LL');
	}
})
