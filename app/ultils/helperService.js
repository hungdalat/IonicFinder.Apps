angular.module('app.service', [
    //'toaster',
    //'angularSpinner'
])
.factory('helperService', ['$rootScope', '$http', function ($rootScope, $http) {
    var service = {
        post: function (params) {
            return $http({
                url: appUri.BaseUri,
                method: "POST",
                data: $.param(params),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            });
        },
        showLoading: function (text) {
            //usSpinnerService.spin('spinner');
        },
        hideLoading: function () {
            //usSpinnerService.stop('spinner');
        },
        showProgress: function (perc) {

        },
        truncate: function (input, allowed) {
            if (input != null && input != undefined) {
                allowed = (((allowed || '') + '')
                  .toLowerCase()
                  .match(/<[a-z][a-z0-9]*>/g) || [])
                  .join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
                var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
                  commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
                return input.replace(commentsAndPhpTags, '')
                  .replace(tags, function ($0, $1) {
                      return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
                  });
            } else {
                return "";
            }
        },
        htmlEntities: function (str) {
            if (str != null && str != undefined) {
                return String(str).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
            } else {
                return "";
            }
        },
        decodeHtmlEntities: function (str) {
            if (str != null && str != undefined) {
                return String(str).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
            } else {
                return "";
            }
        },
        endcodeHtmlEntities: function (str) {
            if (str != null && str != undefined) {
                return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            } else {
                return "";
            }
        },
        subDate: function (input) {
            //input format dd/mm/yyyy
            //return dd/mm
            if (input != null && input != undefined) {
                var split = input.split('/');
                return split[0] + "/" + split[1];
            }
            return input;
        },
        subTime: function (input) {
            //input format dd/mm/yyyy hh:ss:mm
            //return hh:ss
            if (input != null && input != undefined) {
                var split = input.split(' ');
                var time = split[1];
                var timeSplit = time.split(':');

                var result = timeSplit[0] + ":" + timeSplit[1];
                if (result == "00:00") result = "__:__";
                return result
            }
            return input;
        },
        stringNullOrEmpty: function (input) {
            if (input != null && input != undefined && input.length > 0) {
                return true;
            } else {
                return false;
            }
        },
        checkValidEmail: function (input) {
            var patternEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            if (patternEmail.test(input.trim()) && input.trim() !== "") {
                return true;
            }
            return false;
        },
        readSettings: function (input) {
            var objSettings = {};
            if (typeof (input) == 'undefined' | input == null) return objSettings;

            input = input.trim();
            if (input.charAt(0) == "?") input = input.substr(1).trim();

            var lstSettings = input.split("&");
            for (var i = 0; i < lstSettings.length; i++) {
                var lstParam = lstSettings[i].split("=");
                if (lstParam.length >= 2) objSettings[lstParam[0].trim()] = lstParam[1].trim();
            }

            return objSettings;
        },
        getMimetypes: function (extension) {
            switch (extension.toLowerCase()) {
                case 'pdf':
                    return 'application/pdf';
                case 'xlsx':
                case 'xls':
                    return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                case 'xltx':
                    return 'application/vnd.openxmlformats-officedocument.spreadsheetml.template';
                case 'potx':
                    return 'application/vnd.openxmlformats-officedocument.presentationml.template';
                case 'ppsx':
                    return 'application/vnd.openxmlformats-officedocument.presentationml.slideshow';
                case 'pptx':
                case 'ppt':
                    return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
                case 'sldx':
                    return 'application/vnd.openxmlformats-officedocument.presentationml.slide';
                case 'docx':
                case 'doc':
                    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                case 'dotx':
                    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.template';
                case 'xlam':
                    return ' application/vnd.ms-excel.addin.macroEnabled.12';
                case 'xlsb':
                    return 'application/vnd.ms-excel.sheet.binary.macroEnabled.12';
                case 'jpg':
                case 'jpeg':
                    return 'image/jpeg';
                case 'gif':
                    return 'image/gif';
                case 'bmp':
                    return 'image/bmp';
                default:
                    return extension;
            }
        },
        getItemLocalStorage: function (localStorageKey) {
            return window.localStorage.getItem(localStorageKey);
        },
        messageBox: function (type, msg) {
            //toaster.pop(type, msg);
        },
        convertToInt: function (input) {
            try {
                if (input == null || input == undefined) return 0;
                var value = parseInt(input);
                if (isNaN(value)) return 0;
                else {
                    return value;
                }
            } catch (e) {
                return 0;
            }
        }
    };
    return service;
}]);


angular.module('app.directive', [])
.directive('viewLoading', function () {

    return {
        templateUrl: "/app/shared/loading.html"
    }

})