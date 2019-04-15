angular.module('PruForce.services')
.service('MyContestTransactionUnitService', function(DataFactory, $q) {
    function invoke(page, size, searchVal, filterBy, orderDir, contestCode) {

        var req = {
            adapter: "HTTPAdapterContest",
            procedure: "findContestTransactionUnit",
            method: WLResourceRequest.POST,
            parameters: { "params": "[" + page + "," + size + ",'"  + searchVal + "','" + orderDir + "','" + filterBy + "','" + contestCode + "']"}
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

    function invokeFilterAgentType(contestCode) {
			var req = {
				adapter: "HTTPAdapterContest",
				procedure: "getTransactionUnitAgentType",
				method: WLResourceRequest.POST,
				parameters: { "params": "['" + contestCode + "']" }
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
        invokeFilterStatus: invokeFilterAgentType
    }
});