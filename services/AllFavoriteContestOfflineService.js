angular.module('PruForce.services')
	.service('AllFavoriteContestOfflineService', function (DataFactoryOffline, $q) {
		function invoke(salesforceId, agentNumber, agentType, callservice) {

			var req = {
				adapter: "HTTPAdapterContest",
				procedure: "findAllFavoriteContest",
				method: WLResourceRequest.POST,
				parameters: { "params": "['" + salesforceId + "','" + agentNumber + "','" + agentType + "']" }
			};

			var deferred = $q.defer();

			DataFactoryOffline.invoke(req, callservice)
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

