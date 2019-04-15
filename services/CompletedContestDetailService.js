/** 
 * Service	  : List All Finished Contest Detail.
 * Author By  : Riki Setiyo P.
*/

	angular.module('PruForce.services')
		.service('CompletedContestDetailService', function (DataFactory, $q) {
			function invoke(agentType,id_category) {
				var req = {
					adapter: "HTTPAdapterContests",
					procedure: "getAllFinishContestDetail",
					method: WLResourceRequest.POST,
					parameters: { "params": "['" + agentType + "','" + id_category + "']" }
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


