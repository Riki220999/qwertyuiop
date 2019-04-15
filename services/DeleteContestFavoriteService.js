angular.module('PruForce.services')
	.service('DeleteContestFavoriteService', function (DataFactory, $q) {
		function invoke(salesforceId, agentNumber, agentType, contestCode) {

			var req = {
				adapter: "HTTPAdapterContest",
				procedure: "deleteContestFavorite",
				method: WLResourceRequest.POST,
				parameters: { "params": "['" + salesforceId + "','" + agentNumber + "','" + agentType + "','" + contestCode + "']" }
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
			invoke: invoke
		}
	});

