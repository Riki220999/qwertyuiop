angular.module('PruForce.controllers')
	.controller('ContestExtraCreditCtrl', function ($scope, $rootScope, $window, $state, $interval, $http, $filter, ContestExtraCredit, $sce) {

		$scope.allBonanzaLists = [];
		$scope.allActiveBonanzaLists = [];

		$scope.data = {};
		$scope.data.sliderOption = {
			autoplay: 2500,
			autoplayDisableOnInteraction: false
		}
		$scope.data.activeIndex = 0;
		$scope.data.sliderDelegate = null;
		$scope.showSpinnerSlideBox = true;

		$scope.goBackContest = function () {
			if ($state.current.name == 'contest_extra_credit') {
				$rootScope.goBack();
			}
		}

		var spinnerImage = [];
		$scope.hideSpinnerImages = function (index) {
			return !(spinnerImage[index]);
		}

		var onResize = false;
		var resizeProccess = null;

		$scope.refreshSize = function (pos) {
			if (pos == $scope.data.sliderDelegate.activeIndex) {
				if (!onResize) {
					onResize = true;
					resizeProccess = setTimeout(function () {
						$scope.slideHasChanged(pos);
					}, 1000)
				}
			}
		}

		angular.element($window).bind('resize', function () {
			$scope.refreshSize($scope.data.sliderDelegate.activeIndex);
		})

		$scope.slideHasChanged = function (index) {
			var extraCreditDetail = $(".extra-credit-detail");
			var currentSlide = $(extraCreditDetail.find(".swiper-slide")[index]);
			var imgWrapper = currentSlide.find(".image-wrapper").outerHeight();
			var contestInfoBig = $(currentSlide.find(".contest-info")[0]).outerHeight();
			var currentHeight = (imgWrapper + contestInfoBig + 15);

			$(".contest-slider").height(currentHeight + "px");
			onResize = false;
		}

		function setupSlide() {

			$scope.$on('selesaiLoadSlider', function (ngRepeatFinishedEvent) {
				$scope.showSpinnerSlideBox = false;
				$scope.refreshSize($scope.data.sliderDelegate.activeIndex);
			});

			$scope.$watch('data.sliderDelegate', function (newVal, oldVal) {
				if (newVal != null) {
					$scope.data.sliderDelegate.on('slideChangeStart', function () {
						clearTimeout(resizeProccess);
						$scope.slideHasChanged($scope.data.sliderDelegate.activeIndex);
					})
				}
			});
		}

		getDataAllContestExtraCreditSuccess(ContestExtraCredit);
		$scope.getDataAllContestExtraCreditSuccess = getDataAllContestExtraCreditSuccess;

		$scope.changePageExtraCredit = function (id) {
			$state.go('contest_extra_credit_detail', { contestCode: id });
		}

		function getDataAllContestExtraCreditSuccess(result) {

			allBonanzaList = [];

			if (result.invocationResult.isSuccessful) {

				var paramCode;
				var periodStartTemp;
				var periodStartTemp2;
				var dueDateTemp;
				var dueDateTemp2;
				var percentageChildTemp;
				var bonanzaList = {};
				var activeBonanzaList = [];

				if(result.invocationResult.bonanzaList){
					bonanzaList = angular.copy(result.invocationResult.bonanzaList);
				}

				for (var i = 0; i < bonanzaList.length; i++) {
					var flyers = (bonanzaList[i].flyer != null && bonanzaList[i].flyer.indexOf("|")) ? bonanzaList[i].flyer.split("|") : null;
					bonanzaList[i].flyersName = flyers ? flyers[0] : "image";
					bonanzaList[i].flyersFileName = flyers ? flyers[1] : "";
					// (function (filename, pos) {
					// 	spinnerImage[pos] = true;
					// 	CommonService.invokeFileBase64(filename, 'contest').then(
					// 		function (response) {
					// 			if (response.invocationResult.isSuccessful) {
					// 				bonanzaList[pos].flyerBase64 = "data:image/jpeg;base64," + response.invocationResult.content;
					// 			}
					// 			spinnerImage[pos] = false;
					// 		}, function (error) {
					// 			spinnerImage[pos] = false;
					// 		});
					// })(bonanzaList[i].flyersFileName, i);
					bonanzaList[i].bonanzaDescription = $sce.trustAsHtml(bonanzaList[i].bonanzaDescription);
					periodStartTemp = new Date(bonanzaList[i].periodStart);
					periodStartTemp2 = moment(periodStartTemp).format('LL');
					bonanzaList[i].periodStart = periodStartTemp2;
					periodEndTemp = new Date(bonanzaList[i].periodEnd);
					periodEndTemp2 = moment(periodEndTemp).format('LL');
					bonanzaList[i].periodEnd = periodEndTemp2;

					if (bonanzaList[i].status == "Active") {
						bonanzaList[i].statusStr = $filter('translate')('CONTEST.EXTRACREDIT_STATUS_ACTIVE');
					}
					else if (bonanzaList[i].status == "Not Started") {
						bonanzaList[i].statusStr = $filter('translate')('CONTEST.EXTRACREDIT_STATUS_NOTSTARTED');
					}
					else {
						bonanzaList[i].statusStr = $filter('translate')('CONTEST.EXTRACREDIT_STATUS_NOTACTIVE');
					}

					if (bonanzaList[i].status == "Active") { activeBonanzaList.push(bonanzaList[i]); }
				}

				$scope.allBonanzaLists = bonanzaList;
				$scope.allActiveBonanzaLists = activeBonanzaList;
			}
			else {
				AppsLog.log("No data found. Please try again later!");
			}

			$scope.showSpinnerSlideBox = false;
		}

		angular.element(document).ready(function () {
			setupSlide();
		});

		$scope.viewData = {
	    hasHeader:true,
	    
	    title: '<h2>'+ $filter('translate')('CONTEST_EXTRA_CREDIT_HEADER') +'</h2>',
	    titleHeader: $filter('translate')('CONTEST_EXTRA_CREDIT_HEADER'),

	    

	    rightButtonMenu: true
	  }

	  

		function getDataAllContestExtraCreditFailed(result) {
			AppsLog.log("Load Data Failed, Please Check Your Connection");
		}
	})