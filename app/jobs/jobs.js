(function (angular) {
    "use strict";

    var app = angular.module('app.jobs', ['trumbowyg-ng', 'ngSanitize', 'ngTagsInput']);

    app.controller('JobListCtrl', ['$rootScope', '$scope', '$stateParams', 'jobsService', 'helperService', 'AppConstant', '$timeout',
        function ($rootScope, $scope, $stateParams, jobsService, helperService, AppConstant, $timeout) {
            $scope.getJobTypeName = function (code) {
                var jobType = _.find(AppConstant.JobTypes, function (item) { return item.code == code });
                if (jobType != undefined) {
                    return jobType.name;
                } else { return ''; }
            }
            
            $scope.viewModel = {
                ready: false,
                title: $scope.getJobTypeName($stateParams.id)
            };
            function getJobs() {
                jobsService.all().then(function (result) {
                    $scope.viewModel.datasource = result;
                    $scope.viewModel.ready = true;
                });
            }
            getJobs();

            //remaining time
            $scope.timeRemaining = function (date) {
                if (date != undefined) {
                    return remaining.getString(-remaining.getSeconds(date), null, true) + ' trước';
                } else {
                    return '';
                }
            };
        }]);

    app.controller('JobTypesCtrl', ['$rootScope', '$scope', '$stateParams', 'jobsService', 'helperService', 'AppConstant', '$timeout',
        function ($rootScope, $scope, $stateParams, jobsService, helperService, AppConstant, $timeout) {
            $scope.getJobTypeName = function (code) {
                var jobType = _.find(AppConstant.JobTypes, function (item) { return item.code == code });
                if (jobType != undefined) {
                    return jobType.name;
                } else { return ''; }
            }

            $scope.viewModel = {
                ready: false
            };
            function getJobs() {
                jobsService.getByType($stateParams.id).then(function (result) {
                    $scope.viewModel.datasource = result;
                    $scope.viewModel.ready = true;
                });
            }
            getJobs();



            //remaining time
            $scope.timeRemaining = function (date) {
                if (date != undefined) {
                    return remaining.getString(-remaining.getSeconds(date), null, true) + ' trước';
                } else {
                    return '';
                }
            };
        }]);

    app.controller('PostJobCtrl', ['$rootScope', '$scope', '$state', 'user', 'jobsService', 'jobTagService', 'helperService', 'AppConstant',
    function ($rootScope, $scope, $state, user, jobsService, jobTagService, helperService, AppConstant) {
        $scope.jobmodel = {
            type: AppConstant.JobTypes[0]
        };
        $scope.editorModel = '';
        $scope.tagsSelected = [];
        $scope.jobTagsSelected = [];
        $scope.jobTypes = AppConstant.JobTypes;

        $scope.loadTags = function (keywork) {
            console.log(keywork);
            return jobTagService.searchKeyword(keywork);
        };

        $scope.create = function () {
            function onCreateJob() {
                helperService.showLoading();
                var job = jobsService.create();
                job.title = $scope.jobmodel.title;
                job.description = $scope.jobmodel.description;
                job.createdBy = user;
                job.publish = true;
                job.location = $scope.jobmodel.location;
                job.type = $scope.jobmodel.type.code;
                job.view = 1;
                job.comment = 0;
                jobsService.save(job).then(
                        function (result) {
                            // Handle success   
                            //Nếu chọn tag 
                            //https://parse.com/docs/js/guide#relations-one-to-one
                            //https://github.com/ParsePlatform/Docs/blob/master/en/js/objects.mdown
                            var relation = result.relation("jobTags");
                            _.each($scope.jobTagsSelected, function (tag) {
                                relation.add(tag);
                            });

                            result.save();

                            helperService.hideLoading();
                            helperService.messageBox('success', 'your job is posted')
                            //goto detail
                            $state.go('jobdetail', { id: result.id });
                        },
                        function (e) {
                            helperService.hideLoading();
                            helperService.messageBox('error', e.message);
                        }
                    );
            }
            function onCreateTag() {
                var tagCount = $scope.tagsSelected.length;

                if (tagCount > 0) {
                    var index = 0;
                    _.each($scope.tagsSelected, function (tag) {
                        if (!helperService.stringNullOrEmpty(tag.id)) {
                            var jobTag = jobTagService.create();
                            jobTag.name = tag.name;
                            jobTag.createdBy = user;
                            jobsService.save(jobTag).then(function (result) {
                                $scope.jobTagsSelected.push(result);
                                index++;
                            });
                        }
                        else {
                            $scope.jobTagsSelected.push(tag);
                            index++;
                        }
                        if (index == tagCount) {
                            onCreateJob();
                        }
                    });
                } else {
                    onCreateJob();
                }
            }

            if (!helperService.stringNullOrEmpty($scope.jobmodel.title)) {
                helperService.messageBox('error', "Job title is required");
                return;
            } else if (!helperService.stringNullOrEmpty($scope.jobmodel.location)) {
                helperService.messageBox('error', "Job location is required");
                return;
            } else if (!helperService.stringNullOrEmpty($scope.jobmodel.description)) {
                helperService.messageBox('error', "Job description is required");
                return;
            } else if (_.isUndefined($scope.jobmodel.type) || _.isNull($scope.jobmodel.type) || _.isEmpty($scope.jobmodel.type)) {
                helperService.messageBox('error', "Job type is required");
                return;
            }
            else {
                onCreateTag();
            }
        };
    }]);

    app.controller('JobDetailCtrl', ['$rootScope', '$scope', '$stateParams', 'jobsService', 'helperService', 'AppConstant', '$timeout',
        function ($rootScope, $scope, $stateParams, jobsService, helperService, AppConstant, $timeout) {
            $scope.ready = false;
            jobsService.get($stateParams.id).then(
                        function (result) {
                            $scope.jobDetail = result;
                            getTags(result);
                            updateView(result);
                            $scope.ready = true;
                        },
                        function (e) {
                            // Handle error
                            $scope.ready = true;
                        }
                    );

            function getTags(obj) {
                //getRelation
                jobsService.getRelation(obj, 'jobTags').then(
                    function (tags) {
                        $scope.jobTags = tags;
                    },
                    function (e) {
                    });
            }

            function updateView(obj) {
                var count = helperService.convertToInt(obj.view);
                obj.view = count + 1;
                obj.save();
            }

            //remaining time
            $scope.timeRemaining = function (date) {
                if (date != undefined) {
                    return remaining.getString(-remaining.getSeconds(date), null, true) + ' ago';
                } else {
                    return '';
                }
            };

            $scope.getJobTypeName = function (code) {
                var jobType = _.find(AppConstant.JobTypes, function (item) { return item.code == code });
                if (jobType != undefined) {
                    return jobType.name;
                } else { return ''; }
            }
        }]);

    app.factory('jobsService', ['$q', 'parseRepositories', function ($q, $repos) {
        var job = $repos.CreateRepository('Job', {
            'all': {
                'queries': ['query.limit(1000);', 'query.include("createdBy");']
            },
            'get': {
                'queries': ['query.include("createdBy");']
            }
        });

        $repos.GettersAndSetters(job, [
            { angular: 'title', parse: 'title' },
            { angular: 'description', parse: 'description' },
            { angular: 'createdBy', parse: 'createdBy' },
            { angular: 'publish', parse: 'publish' },
            { angular: 'location', parse: 'location' },
            { angular: 'type', parse: 'type' },
            { angular: 'view', parse: 'view' },
            { angular: 'comment', parse: 'comment' }
        ]);

        job.top = function () {
            var defer = $q.defer();

            // Any querying
            var query = new Parse.Query('Job');
            query.ascending('objectId');
            query.include("createdBy");
            query.find({
                success: function (result) {
                    defer.resolve(result); // resolve the Angular promise
                },
                error: function (e) {
                    defer.reject(e); // reject the Angular promise
                }
            });

            return defer.promise;
        };

        job.getRelation = function (obj, relation) {
            var defer = $q.defer();
            var relation = obj.relation(relation);
            relation.query().find({
                success: function (list) {
                    defer.resolve(list); // resolve the Angular promise
                },
                error: function (e) {
                    defer.reject(e); // reject the Angular promise
                }
            });
            return defer.promise;
        };

        job.getByType = function (type) {
            var defer = $q.defer();

            // Any querying
            var query = new Parse.Query('Job');
            query.ascending('objectId');
            query.equalTo("type", type);
            query.include("createdBy");
            query.find({
                success: function (result) {
                    defer.resolve(result); // resolve the Angular promise
                },
                error: function (e) {
                    defer.reject(e); // reject the Angular promise
                }
            });

            return defer.promise;
        };
        return job;
    }]);

    //Tag service
    app.factory('jobTagService', ['$q', 'parseRepositories', function ($q, $repos) {
        var jobTag = $repos.CreateRepository('JobTag', {
            'all': {
                'queries': ['query.ascending("name");', 'query.limit(1000);', 'query.include("flag");']
            },
            'get': {
                'queries': ['query.include("createdBy");']
            }
        });

        $repos.GettersAndSetters(jobTag, [
            { angular: 'name', parse: 'name' },
            { angular: 'createdBy', parse: 'createdBy' }
        ]);

        jobTag.searchKeyword = function (keyword) {
            var defer = $q.defer();

            // Any querying
            var query = new Parse.Query('JobTag');
            query.startsWith("name", keyword);
            query.find({
                success: function (result) {
                    defer.resolve(result); // resolve the Angular promise
                },
                error: function (e) {
                    defer.reject(e); // reject the Angular promise
                }
            });

            return defer.promise;
        };

        return jobTag;
    }]);

    app.directive('jobsList', ['$state', '$rootScope', 'jobsService', 'AppConstant', function ($state, $rootScope, jobsService, AppConstant) {
        return {
            scope: true,
            restrict: "E",
            link: function ($scope, element, attrs) {
                $scope.viewModel = {
                    ready: false,
                    datasource: []
                }
                function getJobs() {
                    jobsService.top().then(function (result) {
                        $scope.viewModel.datasource = result;
                        $scope.viewModel.ready = true;
                    });
                }
                getJobs();

                //remaining time
                $scope.timeRemaining = function (date) {
                    if (date != undefined) {
                        return remaining.getString(-remaining.getSeconds(date), null, true) + ' trước';
                    } else {
                        return '';
                    }
                };

                $scope.getJobTypeName = function (code) {
                    var jobType = _.find(AppConstant.JobTypes, function (item) { return item.code == code });
                    if (jobType != undefined) {
                        return jobType.name;
                    } else { return ''; }
                }
            },
            templateUrl: 'app/jobs/_jobsList.html'
        };
    }]);

    app.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('jobpost', {
                url: "/jobs/post",
                templateUrl: 'app/jobs/post.html',
                controller: 'PostJobCtrl',
                resolve: {
                    user: function (accountService) {
                        var value = accountService.init();
                        // alert(value); // for debugging
                        return value;
                    }
                }
            })
            .state('jobtypes', {
                url: "/jobs/type/:id",
                templateUrl: 'app/jobs/types.html',
                controller: 'JobTypesCtrl'
            })
            .state('joblist', {
                url: "/jobs/list",
                templateUrl: 'app/jobs/list.html',
                controller: 'JobListCtrl'
            });
            //.state('jobdetail', {
            //    url: "/job/:id",
            //    templateUrl: 'app/jobs/detail.html',
            //    controller: 'JobDetailCtrl'
            //});
    }]);

})(angular);