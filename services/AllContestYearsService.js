angular.module('PruForce.services')
	.service('AllContestYearsService', function (DataFactory, $q) {
		function invoke() {

			var req = {
				adapter: "HTTPAdapterContest",
				procedure: "findAllContestYears",
				method: WLResourceRequest.POST,
				parameters:{"params":"['']"}
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

