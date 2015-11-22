var Facebook = new function() {
    var APP_ID = '307416292730318';
    var PREFIX = '/' + APP_ID + '/';
    var CREATE_GROUP = PREFIX + 'groups';

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
    		me.createGroup().then(function(response) {
    			console.log("all leagues: ", response);
        	}, function() {

        	});
        }, function() {

        });
    }

    this.getLeagues = function() {
        return new Promise(function(resolve, reject) {
            FB.api(CREATE_GROUP, function(response) {
				if (response.error) {
					reject(response.error);
				} else {
					resolve(response.data);
				}
			});
        });
    }

    this.getMembers = function(leagueId) {
        return new Promise(function(resolve, reject) {
            // TODO
            if (false) {
                resolve("it worked!");
            } else {
                reject(":(");
            }
        });
    }

    this.createGroup = function(resolve, reject) {
    	return new Promise(function(resolve, reject) {
	    	FB.ui({
			  method: 'game_group_create',
			  name: 'My League',
			  description: 'A league of winners',
			  privacy: 'CLOSED',
			},
			 function(response) {
			    if (response && response.id) {
			        alert("Group was created with id " + response.id);
			        resolve(response.id);
			    } else {
			        alert('There was an error creating your group.');
			        reject(response);
			    }
			 }
			);
	    });
    }

    this.login = function() {
        return new Promise(function(resolve, reject) {
            FB.getLoginStatus(function(response) {
            	if (response.status === 'connected') {
					resolve(response);
				} else if (response.status === 'not_authorized') {
					reject('need to log in to this app');
				} else {
					reject('need to log in to facebook');
				}
                me.loginCallback(response, resolve, reject);
            });
        });
    }

    this.logout = function() {
    	return new Promise(function(resolve, reject) {
    		FB.logout(function(response) {
    			if (response.error) {
    				reject(response);
    			} else {
    				resolve(response);
    			}
		    });
    	});
    }
}
module.exports = Facebook;