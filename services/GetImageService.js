/** 
 * Service	  : Get Image Base 64 For Contest
 * Author By  : Riki Setiyo P.
*/

angular.module('PruForce.services')
.service('GetImageService', function (DataFactory, $q) {
    function invoke( image ) {
        var req = {
            adapter: "HTTPAdapterContests",
            procedure: "getFileBase64GetImage",
            method: WLResourceRequest.POST,
            parameters: { "params": "['" + image + "']" }
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
