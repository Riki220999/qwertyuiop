angular.module('PruForce.services')
.service('MyContestTransactionDetailService', function(DataFactory, $q) {
    function invoke(page, size, searchVal, searchVal2, orderBy, contestCode, unit, agentNumber) {

        var req = {
            adapter: "HTTPAdapterContest",
            procedure: "findContestTransactionDetail",
            method: WLResourceRequest.POST,
            parameters: {
                "params": "[" + page + "," + size + ",'" + searchVal + "','" + searchVal2 + "','" + orderBy + "','" + contestCode + "','" + unit + "','" + agentNumber + "']"
            }
        };

        var deferred = $q.defer();

        DataFactory.invoke(req, true)
            .then(function(res) {
                deferred.resolve(res);
            }, function(error) {
                deferred.reject(error);
            });

        return deferred.promise;
    }

    function invokeFilterStatus(contestCode, pageType, agentNumber) {
			var req = {
				adapter: "HTTPAdapterContest",
				procedure: "getTransactionDetailStatus",
				method: WLResourceRequest.POST,
				parameters: { "params": "['" + contestCode+ "','" + pageType + "','"+ agentNumber + "']" }
			};

			var deferred = $q.defer();

			DataFactory.invoke(req, true)
				.then(function (res) {
					deferred.resolve(res);
				}, function (error) {
					deferred.reject(error);
				});

			return deferred.promise;
		}

    return {
        invoke: invoke,
        invokeFilterStatus: invokeFilterStatus
    }
});