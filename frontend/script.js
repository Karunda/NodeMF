// create the module and name it scotchApp
var scotchApp = angular.module('scotchApp', ['ngRoute']);

// configure our routes
scotchApp.config(function($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl : 'pages/home.html',
            controller  : 'mainController'
        })

        // route for the about page
        .when('/roles', {
            templateUrl : 'roles',
            controller  : 'rolesController'
        })

        .when('/roles/view', {
            templateUrl : 'roles/view.html',
            controller  : 'rolesViewController'
        })


        // route for the contact page
        .when('/contact', {
            templateUrl : 'pages/contact.html',
            controller  : 'contactController'
        })
        //route for the kendo example
        .when('/login', {
            templateUrl : 'login.html',
            controller  : 'LoginController'
        });
});

// create the controller and inject Angular's $scope
scotchApp.controller('mainController',['Auth', function($scope,Auth) {
    // create a message to display in our view
   /* $scope.$watch(Auth.isLoggedIn, function (value, oldValue) {

        if(!value && oldValue) {
            console.log("Disconnect");
            $location.path('/login');
        }

        if(value) {
            $scope.message = 'Everyone come and see how good I look!';
        }
    },true)*/

    $scope.message = 'Everyone come and see how good I look!';
}]);

/*scotchApp.controller('rolesController', function($scope) {
    $scope.message = 'This is the roles page';
});*/

scotchApp.controller('contactController', function($scope) {
    $scope.message = 'Contact us! JK. This is just a demo.';
});

scotchApp.controller('rolesController', ['$scope', '$http', 'Auth','SharedService','$location',function($scope, $http,Auth,sharedService, $location) {

    console.log(Auth.isLoggedIn());
    console.log(Auth.getDatabase());
    console.log(sharedService.get());
    $scope.$watch(Auth.isLoggedIn, function (value, oldValue) {

        if(!value && oldValue) {
            console.log("Disconnect");
            $location.path('/login');
        }

        if(value) {
            console.log("proceed");
            $scope.tableCollection = [];
            var stringtopost = {
                "fetchmethod": "Roles.SelectAllRoles"
            };


            $http({
                method: 'POST',
                url: '/api/RolesManager/',
                data: {
                    "fetchmethod": "Roles.SelectAllRoles"
                },
                headers: {'Content-Type': 'application/json'}
            })
                .success(function (data, status, headers, config) {
                    if (data.dataSet.length > 0) {
                        for (var i = 0; i < data.dataSet.length; i++) {
                            $scope.tableCollection.push(data.dataSet[i]);
                        }
                    } else {
                        $scope.errorMsg = "Failed to fetch roles";
                        console.log('roles fetch failed');
                    }

                })
                .error(function (data, status, headers, config) {
                    $scope.errorMsg = 'Unable to submit form';
                })
        }
    },true);
    }]);

scotchApp.controller('rolesViewController', ['$scope', '$http', function($scope, $http) {


    $scope.tableCollection = [];
    var stringtopost={
        "fetchmethod":"Roles.GetAllowedMenuList",
        "params":{"roleId":"1"}
    };


    $http({
        method: 'POST',
        url: '/api/RolesManager/',
        data: {
            "fetchmethod":"Roles.GetAllowedMenuList",
            "params":{"roleId":"1"}
        },
        headers: {'Content-Type': 'application/json'}
    })
        .success(function(data, status, headers, config) {
            if ( data.dataSet.length>0) {
                for(var i=0;i<data.dataSet.length;i++){
                    $scope.tableCollection.push(data.dataSet[i]);
                }
            } else {
                $scope.errorMsg = "Failed to fetch role allowed items";
                console.log('role allowed items fetch failed');
            }

        })
        .error(function(data, status, headers, config) {
            $scope.errorMsg = 'Unable to submit form';
        })
}]);

scotchApp.factory('Auth', function(){
    var user;
    var databasename;

    return{
        setUser : function(aUser){
            user = aUser;
        },
        isLoggedIn : function(){
            return(user)? user : false;
        },
        setDatabase:function(dbName){
            databasename = dbName;
        },
        getDatabase:function(){
            return(databasename)? databasename : "";
        }
    }
});

scotchApp.service('SharedService',[function(){
    var value = '';
    this.set = function(val){
        value = val;
    };
    this.get = function(val){
        return value;
    }
}]);

scotchApp.controller('LoginController', ['$scope', '$http','Auth','SharedService', function($scope, $http,Auth,sharedService) {
console.log('In login controller');
    $scope.postForm = function() {
        console.log('Processing login information');
        var stringtopost={
            "fetchmethod":"User.SelectLogin",
            "params":{
                "username":$scope.username,
                "password":$scope.password
            }
        };

        $http({
            method: 'POST',
            url: '/api/LoginManager/',
            data: stringtopost,
            headers: {'Content-Type': 'application/json'}
        })
            .success(function(data, status, headers, config) {
                if ( data.dataSet.length>0) {
                    Auth.setUser(data.dataSet[0].user_name);
                    Auth.setDatabase(data.dataSet[0].databasename);
                    sharedService.set('The value is now set');
                    console.log(data.dataSet[0].user_name);
                    console.log('login successful');
                    console.log(data.dataSet[0]);
                    console.log('auth.isloggedin status is: '+Auth.isLoggedIn());
                    window.location.href = 'index.html';

                } else {
                    $scope.errorMsg = "Login not correct";
                    console.log('login failed');
                }
            })
            .error(function(data, status, headers, config) {
                $scope.errorMsg = 'Unable to submit form';
            })
    }

}]);

/*scotchApp.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
    $rootScope.$on('$routeChangeStart', function (event) {

        console.log('The isLoggedin status in watcher is: '+Auth.isLoggedIn());
        if (!Auth.isLoggedIn()) {
            console.log('DENY');
            event.preventDefault();
            $location.path('/login');
        }
        else {
            console.log('ALLOW');
            $location.path('/home');
        }
    });
}]);*/