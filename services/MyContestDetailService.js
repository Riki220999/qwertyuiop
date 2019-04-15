/** 
 * Service	  : List All My Contest Detail
 * Author By  : Riki Setiyo P.
*/

	angular.module('PruForce.services')
		.service('MyContestDetailService', function (DataFactory, $q) {
			function invoke(agentType,id_category) {
				var req = {
					adapter: "HTTPAdapterContests",
					procedure: "getAllMyContestDetail",
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
