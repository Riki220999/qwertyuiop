angular.module('PruForce.services')
	.service('ContestLastUpdateService', function (DataFactory, $q) {
		function invoke(contestCode) {

			var req = {
				adapter: "HTTPAdapterContest",
				procedure: "getLastUpdate",
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
			invoke: invoke
		}
	});

