/** 
 * Service	  : Get target Contest Agent
 * Author By  : Riki Setiyo P.
*/

angular.module('PruForce.services')
.service('GetTargetContest', function (DataFactory, $q) {
    function invoke( contest_code, agentNumber, agentType ) {
        var req = {
            adapter: "HTTPAdapterContests",
            procedure: "getTargetContest",
            method: WLResourceRequest.POST,
            parameters: { "params": "['" + contest_code + "','" + agentNumber + "','" + agentType + "']" }
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
