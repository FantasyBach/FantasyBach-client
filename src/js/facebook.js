import Promise from 'bluebird';

var createFacebook = function() {
    var APP_ID = '307416292730318';
    var PREFIX = '/' + APP_ID + '/';
    var GROUP = PREFIX + 'groups';

    var me = {};

    me.getProfilePicture = function(uid) {
    	return new Promise(function(resolve, reject) {
            FB.api(format(uid, 'picture'), function(response) {
				if (response && !response.error && response.data) {
					console.log("user", response);
					resolve(response.data.url);
				} else {
					reject(response.error);
				}
			});
        });
    }

    me.getLeagues = function() {
        return new Promise(function(resolve, reject) {
            FB.api(GROUP, 'GET', {
            	auth_token: me.accessToken
            }, function(response) {
				if (response.error) {
					reject(response.error);
				} else {
					resolve(response.data);
				}
			});
        });
    }

    me.getMembers = function(leagueId) {
    	// TODO paging
        return new Promise(function(resolve, reject) {
            FB.api(format(leagueId, 'members'), function (response) {
				if (response && !response.error) {
					resolve(response.data);
				} else {
					reject(response);
				}
		    });
        });
    }

    me.createGroup = function() {
    	return new Promise(function(resolve, reject) {
	    	FB.ui({
			  method: 'game_group_create',
			  name: 'My League',
			  description: 'A league of winners',
			  privacy: 'CLOSED',
			},
			 function(response) {
			    if (response && response.id) {
			        resolve(response.id);
			    } else {
			        reject(response);
			    }
			 }
			);
	    });
    }

    me.login = function() {
        return new Promise(function(res, rej) {
            FB.login(function(response) {
                if (response.authResponse) {
                    res(response.authResponse);
                }
            });
        });
    }

    me.getLoginStatus = function() {
        return new Promise(function(resolve, reject) {
            FB.getLoginStatus(function(response) {
            	console.log("loging", response);
            	if (response && response.status === 'connected') {
            		this.accessToken = response.authResponse.accessToken;
					resolve(response.authResponse);
				} else if (response && response.status === 'not_authorized') {
					reject('need to log in to this app');
				} else {
					reject('need to log in to facebook');
				}
            });
        });
    }

    me.logout = function() {
    	return new Promise(function(resolve, reject) {
    		FB.logout(function(response) {
    			if (response && !response.error) {
    				resolve(response);
    			} else {
    				reject(response);
    			}
		    });
    	});
    }

    var format = function(id, edge) {
    	return '/' + id + '/' + edge;
    }

    return new Promise(function(res, rej) {
        window.fbAsyncInit = function() {
            FB.init({
                appId: APP_ID,
                cookie: true,
                xfbml: false,
                version: 'v2.2'
            });

            res(me);
        };

        // Load the SDK asynchronously
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    });
}
module.exports = createFacebook;
