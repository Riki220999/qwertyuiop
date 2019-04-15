angular.module('PruForce.services')
	.service('AllMyContestOfflineService', function (DataFactoryOffline, $q) {
		function invoke(salesforceId, agentNumber, agentType, max, page, callservice) {

			var req = {
				adapter: "HTTPAdapterContest",
				procedure: "findAllMyContest",
				method: WLResourceRequest.POST,
				parameters: { "params": "['" + salesforceId + "','" + agentNumber + "','" + agentType + "'," + max + "," + page + "]" }
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

