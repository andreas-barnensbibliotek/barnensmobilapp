/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function () {
    	
    	document.addEventListener('deviceready', this.onDeviceReady, false);
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        //WebFontConfig = {
        //    google: { families: ['Dosis::latin', 'Lato::latin', 'Open+Sans::latin', 'Raleway::latin'] }
        //};
        //(function () {
        //    var wf = document.createElement('script');
        //    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
        //      '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
        //    wf.type = 'text/javascript';
        //    wf.async = 'true';
        //    var s = document.getElementsByTagName('script')[0];
        //    s.parentNode.insertBefore(wf, s);
        //})();
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {    	
    	 
    	if (checkConnection()=="0"){
    		navigator.notification.alert("Du har ingen uppkoppling!");
    		
    	} else {
    	   	app.startApp();   
    	}
    	           	
    },
    startApp: function(){
    	
    	var usrobj = storageHandler.get("_userdata");        
        if (usrobj) {
            if (usrobj.userid) {

                isvotestarted(this, function (that, value) {
                    console.log(value);
                })

                var menuinfo = {
                    avatar: usrobj.avatar,
                    votetime: storageHandler.get('isvoteStarted'),
                    Status: ""
                }
                var savemenu = new AppMain.Models.menu(menuinfo)
                storageHandler.set("menudata", savemenu);
            };
        }

        
    }
};

