
var Facebook = function() {
    this.app_id = '307416292730318';
    this.accessToken;

    var me = this;

    window.fbAsyncInit = function() {
        FB.init({
            appId: '307416292730318',
            cookie: true,
            xfbml: false,
            version: 'v2.2' // use version 2.2
        });

        me.login().then(function response(token) {
        	console.log(token);
        }, function error() {
        });
        console.log('loaded');
    }

    this.getLeagues = function() {
        return new Promise(function(resolve, reject) {
            // TODO
            if (false) {
                resolve("it worked!");
            } else {
                reject(":(");
            }
        });
    }

    this.getUsers = function(leagueId) {
        return new Promise(function(resolve, reject) {
            // TODO
            if (false) {
                resolve("it worked!");
            } else {
                reject(":(");
            }
        });
    }

    this.login = function() {
        return new Promise(function(resolve, reject) {
            // TODO
            FB.getLoginStatus(function(response) {
                console.log(response.authResponse.accessToken);
                me.loginCallback(response, resolve, reject);
            });
        });
    }

    this.loginCallback = function(response, resolve, reject) {
        // The response object is returned with a status field that lets the
        // app know the current login status of the person.
        // Full docs on the response object can be found in the documentation
        // for FB.getLoginStatus().
        if (response.status === 'connected') {
            // Logged into your app and Facebook.
            console.log('token', resonse.authResponse.accessToken);
            resolve(resonse.authResponse.accessToken);
        } else if (response.status === 'not_authorized') {
            // The person is logged into Facebook, but not your app.
            reject('need to log in');
            document.getElementById('status').innerHTML = 'Please log ' +
                'into this app.';
        } else {
            // The person is not logged into Facebook, so we're not sure if
            // they are logged into this app or not.
            document.getElementById('status').innerHTML = 'Please log ' +
                'into Facebook.';
        }
        if (false) {
            resolve("it worked!");
        } else {
            reject(":(");
        }
    }
}