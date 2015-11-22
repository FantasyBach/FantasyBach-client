var Facebook = new function() {
    var APP_ID = '307416292730318';
    var PREFIX = '/' + APP_ID + '/';
    var GROUP = PREFIX + 'groups';

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
            appId: APP_ID,
            cookie: true,
            xfbml: false,
            version: 'v2.2'
        });

        me.login().then(function response(response) {
        	console.log(response.accessToken);
        	me.userId = response.userID;
    		me.getLeagues().then(function(data) {
    			console.log("leagues data", data);
    			for (var i =0; i < data.length; i++) {
    				me.getMembers(data[i].id).then(function(d) {
    					console.log("Got group info ", d);
    				}, function(error) {
    					console.log("error", error);
    				});
    			}
        	}, function() {
        		console.log("error ", data);
        	});
        }, function() {
        	console.log("error", response);
        });
    }

    this.getLeagues = function() {
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

    this.getMembers = function(leagueId) {
    	// TODO paging
        return new Promise(function(resolve, reject) {
            FB.api(formatGetMembers(leagueId), function (response) {
				if (response && !response.error) {
					resolve(response.data);
				} else {
					reject(response);
				}
		    });
        });
    }

    this.createGroup = function() {
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

    this.login = function() {
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

    this.logout = function() {
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

    var formatGetMembers = function(id) {
    	return '/' + id + '/members';
    }
}
module.exports = Facebook;