angular.module('PruForce.controllers')
.controller('ContestExtraCreditDetailCtrl', function($scope, $rootScope, $ionicLoading, $state,$interval, $http, $filter, $sce, ContestExtraCreditDetail, ContestLastUpdate, CommonService) {

	getDataContestExtraCreditDetailSuccess(ContestExtraCreditDetail);
	$scope.getDataContestExtraCreditDetailSuccess=getDataContestExtraCreditDetailSuccess;

	updateLastUpdate(ContestLastUpdate);
	$scope.updateLastUpdate = updateLastUpdate;

	var options = {
		location: 'yes'
	};
	$scope.showSpinnerImages = true;

	$scope.openPdf = function(name, originalName){
		$ionicLoading.show();
		$state.go('common_pdfjs', {fileName: name, originalFileName: originalName, module: "contest", pageTitle: "CONDITIONS_CONTEST" , pageLogId: "prudential.contest.pdftermncondition"});
	}

	//Change page Policy List
	$scope.changePagePolicyList = function(id) {			
		$state.go('contest_policy_list', {contestCode: id});
	}

	//Change page to Proposal List
	$scope.changePageProposalList = function(id) {			
		$state.go('contest_proposal_list', {contestCode: id});
	}

	//resize frame
	function resizeIframeExtraCredit(obj) {
		obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
	}

	//get data from server
	function getDataContestExtraCreditDetailSuccess(result) {

		ContestExtraCreditDetail = [];
		var periodStartTemp;
		var periodStartTemp2;
		var periodEndTemp;
		var periodEndTemp2;

		var retrieveDateTemp;
		var retrieveDate;

		if (result.invocationResult.isSuccessful) {
			var dt = {};

			dt.bonanza = result.invocationResult.bonanza;
			periodStartTemp = new Date(result.invocationResult.bonanza.periodStart);
			periodStartTemp2 = moment(periodStartTemp).format('LL');
			dt.bonanza.periodStart = periodStartTemp2;
			periodEndTemp = new Date(result.invocationResult.bonanza.periodEnd);
			periodEndTemp2 = moment(periodEndTemp).format('LL');
			dt.bonanza.periodEnd = periodEndTemp2;
			dt.bonanza.flyers = result.invocationResult.bonanza.flyer;
			
			var flyers = (dt.bonanza.flyers != null && dt.bonanza.flyers.indexOf("|")) ? dt.bonanza.flyers.split("|") : null;
			dt.bonanza.flyersName = flyers ? flyers[0] : "image"; 
			dt.bonanza.flyersFileName = flyers ? flyers[1] : ""; 
			CommonService.invokeFileBase64(dt.bonanza.flyersFileName, 'contest').then(
			function(response){
				if(response.invocationResult.isSuccessful){
					dt.bonanza.flyerBase64 = "data:image/jpeg;base64," + response.invocationResult.content;
				}
				$scope.showSpinnerImages = false;
			}, function(error){
				$scope.showSpinnerImages = false;
			});
			dt.bonanza.bonanzaDescription = $sce.trustAsHtml(result.invocationResult.bonanza.bonanzaDescription);
			retrieveDate = result.retrieveDate;
			
			if (dt.bonanza.status == "Active")
			{
				dt.bonanza.statusStr = $filter('translate')('CONTEST.EXTRACREDIT_STATUS_ACTIVE');
			}
			else
			{
				dt.bonanza.statusStr = $filter('translate')('CONTEST.EXTRACREDIT_STATUS_NOTACTIVE');
			}

			dt.bonanza.params = angular.copy(result.invocationResult.bonanza.params);

			angular.forEach(dt.bonanza.params, function(value, key)
			{	
				if (dt.bonanza.params[key].percentage != undefined || dt.bonanza.params[key].percentage != null)
				{
					dt.bonanza.params[key].percentageRound = $filter('formatNumber')(dt.bonanza.params[key].percentage, 0);
					dt.bonanza.params[key].percentage = $filter('formatNumber')(dt.bonanza.params[key].percentage, 1);
				}
			});

			dt.bonanzaDescription = $sce.trustAsHtml(result.invocationResult.bonanzaDescription);
			dt.bonanzaAwardsDescription = $sce.trustAsHtml(result.invocationResult.bonanzaAwardsDescription);
			dt.termCondition = $sce.trustAsHtml(result.invocationResult.termCondition);
			dt.termConditionPdf = result.invocationResult.termConditionPdf;

			var termConditionPdf = (result.invocationResult.termConditionPdf != null && result.invocationResult.termConditionPdf.indexOf("|")) ? result.invocationResult.termConditionPdf.split("|") : null;
			dt.termConditionPdfName = termConditionPdf ? termConditionPdf[0] : "image"; 
			dt.termConditionPdfFileName = termConditionPdf ? termConditionPdf[1] : ""; 

			dt.showPolicyProposal = result.invocationResult.bonanza.contestState == "myContest" ? true : false;
			
			ContestExtraCreditDetail = dt;

			$scope.ContestExtraCreditDetails = ContestExtraCreditDetail;
		} else {
			AppsLog.log("No data found. Please try again later!");
		}
	}

	function updateLastUpdate(result){
		if (result.invocationResult.isSuccessful) {
			$scope.lastUpdate = '';
			if(result.invocationResult.lastUpdate != null){
				var lastUpdateDateTemp = new Date(result.invocationResult.lastUpdate);
				$scope.lastUpdate = moment(lastUpdateDateTemp).format('LL');
			}
		}
	}

	function getDataContestExtraCreditDetailFailed(result) {
		AppsLog.log("Load Data Failed, Please Check Your Connection");
	}

	// ================== Start accordion widget collapse - expand ===================//
	$scope.accordionWidgetCollapse = function(e){
		var self = $(e.toElement);
		var accordion = self.parents(".widget-policy");
		var accordionBody = accordion.find(".list-info, .list-info-contest");

		if(accordion.hasClass("collapse1")){
			accordion.removeClass("collapse1");
			accordionBody.attr("style","margin-top: -"+(accordionBody.height()+ 15)+"px;");
			// accordionBody.css({"margin-bottom":"-18px"});
		}else {
			accordion.addClass("collapse1");
			accordionBody.css("margin-top","0px");
			accordionBody.css("padding-top","12px");
		}
	}

	$scope.accordionWidgetCollapseDesc = function(e){
		var self = $(e.toElement);
		var accordion = self.parents(".widget-policy");
		var accordionBody = accordion.find(".list-info, .list-info-contest");

		if(accordion.hasClass("collapse1")){
			accordion.removeClass("collapse1");
			accordionBody.attr("style","margin-top: -"+(accordionBody.height()+ 15)+"px;");
			// accordionBody.css({"margin-bottom":"-18px"});
		}else {
			accordion.addClass("collapse1");
			accordionBody.css("margin-top","0px");
			accordionBody.css("padding-top","12px");
		}
	}

	function init() {
		setTimeout(function(){
			for (var i = 0; i < $(".tab-item").length; i++) {
				$($(".tab-item")[i]).attr("data-position-left", ($($(".tab-item")[i]).position().left - 20));
			}
		}, 100)
	}

	$scope.accordionInit = function(){
		var accordions = $(".list-info-accordion");

		$.each(accordions, function( index, value ) {
			var accordionBody = $(value).find(".accordion-body");

			if(!$(value).hasClass("collapsed")){
				accordionBody.attr("style", "margin-top: -" + accordionBody.height() + "px;")
			}
		});
	}

	$scope.accordionWidgetInit = function(){
		var accordionsWidget = $(".widget-policy");

		$.each(accordionsWidget, function( index, value ) {
			var accordionBody = $(value).find(".list-info, .list-info-contest");

			if(!$(value).hasClass("collapse1")){
				accordionBody.attr("style", "margin-top: -" + (accordionBody.height() + 15) +"px;");
			}
		});
	}
	//================== End accordion widget collapse - expand ===================//

	$scope.viewData = {
    hasHeader:true,
    
    title: '<h2>'+ $filter('translate')('EXTRA_CREDITS_DETAIL_CONTEST') +'</h2>',
    titleHeader: $filter('translate')('EXTRA_CREDITS_DETAIL_CONTEST'),

    

    rightButtonMenu: true
  }

  
	angular.element(document).ready(function() {
		init();
		$scope.accordionInit();
		$scope.accordionWidgetInit();
	});
})