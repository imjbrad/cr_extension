/**
 * Created by jordanbradley on 2/14/15.
 */
angular.module('cr.services.chrome', [])

    .factory('CRChrome', function($window, $state, $timeout, $location){

        var chromeService = {},
            devChromeService = {},
            extension = chrome.extension ? true : false;
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

                if(callbackfn)
                    callbackfn(_currentUrl);
            });
        };

        devChromeService.getCurrentUrl = function(callback){
            if(_currentUrl)
                return _currentUrl;

            _currentUrl = $location.absUrl();

            if(callback) {
                callback(_currentUrl);
            }
        };

        return (chrome.extension ? chromeService : devChromeService);

    });