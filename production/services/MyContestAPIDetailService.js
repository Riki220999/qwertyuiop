angular.module('PruForce.services')
	.service('MyContestAPIDetailService', function (DataFactory, $q) {
		function invoke(contestCode, source) {

			var req = {
				adapter: "HTTPAdapterContest",
				procedure: "findMyContestAPIDetail",
				method: WLResourceRequest.POST,
				parameters: { "params": "['" + contestCode + "','" + source + "']" }
			};

			var deferred = $q.defer();

			DataFactory.invoke(req, true, false)
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

