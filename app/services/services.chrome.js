/**
 * Created by jordanbradley on 2/14/15.
 */
angular.module('cr.services.chrome', [])

    .factory('CRChrome', function($window, $state, $timeout){

        var chromeService = {},
            _currentUrl = null;


        chromeService.getCurrentUrl = function(callbackfn){

            if(_currentUrl)
                return _currentUrl;

            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, function(tabs){
                var currentTab = tabs[0];
                _currentUrl = currentTab.url;
                console.log(_currentUrl);
                callbackfn(_currentUrl);
            });


        };

        return chromeService;

    });