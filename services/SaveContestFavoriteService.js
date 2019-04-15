angular.module('PruForce.services')
	.service('SaveContestFavoriteService', function (DataFactory, $q) {
		function invoke(salesforceId, agentNumber, agentType, contestCode) {
			var req = {
				adapter: "HTTPAdapterContest",
				procedure: "saveContestFavorite",
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

