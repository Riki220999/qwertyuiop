/** 
 * Service	  : List All Contest
 * Author By  : Riki Setiyo P.
*/

	angular.module('PruForce.services')
		.service('AllContestService', function (DataFactory, $q) {
			function invoke(year, agentType, agenNumber) {
				var req = {
					adapter: "HTTPAdapterContests",
					procedure: "getAllContest",
					method: WLResourceRequest.POST,
					parameters: { "params": "['" + year + "','" + agentType + "','" + agenNumber + "']" }
				};
				var deferred = $q.defer();

				DataFactory.invoke(req, true, false)
					.then(function (res) {
						deferred.resolve(res);
					}, function (error) {
						console.log(error);
						deferred.reject(error);
					});

				return deferred.promise;
			}
			return {
				invoke: invoke
			}
		});