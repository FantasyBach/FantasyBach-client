var Facebook = new function() {
    this.app_id = '307416292730318';

    var me = this;

    // Load the SDK asynchronously
	(function(d, s, id) {
	    var js, fjs = d.getElementsByTagName(s)[0];
	    if (d.getElementById(id)) return;
	    js = d.createElement(s); js.id = id;
	    js.src = "//connect.facebook.net/en_US/sdk.js";
	    fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));


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
            me.accessToken = response.authResponse.accessToken;
            resolve(me.accessToken);
        } else if (response.status === 'not_authorized') {
            // The person is logged into Facebook, but not your app.
            reject('need to log in to this app');
        } else {
        	reject('need to log in to facebook');
            // The person is not logged into Facebook, so we're not sure if
        }
    }
}
module.exports = Facebook;