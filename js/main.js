
var AppRouter = Backbone.Router.extend({

    routes: {
        "boktips": "boktipssearchmain_bma",
        "skrivboktips": "skrivboktips_bma",
        "inskickatboktips": "inskickatboktips_bma",
        "bokdetail/:id": "bokdetail_bma",
        "bokdetailextra/:id": "bokdetailextra_bma",
        "boktipsdetail/:id": "boktipsdetail_bma",
        "login": "login_bma",
        "katalog": "katalog_bma",
        "krypin": "krypin_bma",
        "krypinedit": "krypinedit_bma",
        "krypinavatar": "krypinavatar_bma",
        "krypinpresentation": "krypinpresentation_bma",        
        "quizer": "quizer_bma",
        "votepage": "votepage_bma",
        "votepagevotedtotal": "votepagevotedtotal_bma",
        "sagomaskinen": "sagomaskinenmain_bma",
        "sagomaskinen1": "sagomaskinen_bma",
        "sagomaskinenvisa": "sagomaskinenvisa_bma",
        "sagomaskinen2": "sagomaskinen2_bma",
        "sagomaskinenvisa2": "sagomaskinenvisa2_bma",
        "mybooks": "mybooks_bma",
        "information": "information_bma",     
        "noconnection": "noconnection_bma",
        "reconnect":"hemstart_bma",
        "hem": "hem_bma",
        "*path": 'hemstart_bma'
    },
    initialize: function () {
        // Handle back button throughout the application
        $('.back').live('click', function (event) {
            window.history.back();
            return false;
        });
        this.firstPage = true;
    },

    hem_bma: function () {
        $.mobile.loading('show', { text: "Laddar.. v" + unescape("%E4") + "nta!", textVisible: true });
        console.log('#hem_bma');
            var lsmenu = storageHandler.get("menudata");
            var menumodel = new AppMain.Models.menu(lsmenu)
            var page = new AppMain.Views.hem_bmaView({ model: menumodel });                    
           
            this.addtopage(page)
            

            loadlatestbooklist(this, function (that, latestbookJson) {

            var nyhet = new AppMain.Views.nyheter_bmaView();
            var manadensforfattare = new AppMain.Views.manadensforfattare_bmaView();

                var latestbooklist = new AppMain.Collections.latestbooklista(latestbookJson);
                var insertlatestbooklisttopage = new AppMain.Views.latestbooks_bmaView({ collection: latestbooklist });
                console.log('#loadlatestbooklist');
                that.changePagelist(page);
            });

    },
    
    hemstart_bma: function () {
        console.log('#hemstart_bma');
        var usrobj = storageHandler.get("_userdata");
        //if (window['_userdata'] != undefined) {
        if (usrobj) {
            if (usrobj.userid) {
                app = new AppRouter();
                app.navigate('#hem', { trigger: true });
            };
        } else {
            app = new AppRouter();
            app.navigate('#login', { trigger: true });
        };

    },
    login_bma: function () {
    	//navigator.splashscreen.hide();
        console.log('#login_bma');
        storageHandler.remove("_userdata");
        storageHandler.remove("menudata");
        storageHandler.remove("maskinsaga");
        storageHandler.remove("debug");
        var page = new AppMain.Views.login_bmaView();
        this.addtopage(page).changePagelist(page);
        // this.changePage(new mainpageView());
    },
    boktipssearchmain_bma: function () {
        console.log('boktipssearchmain_bma');
        var lsmenu = storageHandler.get("menudata");
        var menumodel = new AppMain.Models.menu(lsmenu)
        var page = new AppMain.Views.boktipssearchmain_bmaView({ model: menumodel });
        this.addtopage(page).changePagelist(page);
        // this.changePage(new mainpageView());
    },


    boktips_bma: function () {
        $.mobile.loading('show', { text: "Laddar boktips.. v" + unescape("%E4") + "nta!", textVisible: true });
        console.log('#boktips_bma');

        getboktipsdata(this, function (that, boktips) {
            var lsmenu = storageHandler.get("menudata");
            var menumodel = new AppMain.Models.menu(lsmenu)
            
            var boktipsallcol = new AppMain.Collections.boktipsen(boktips);
            var page = new AppMain.Views.boktips_bmaView({ model: menumodel, collection: boktipsallcol });
            that.addtopage(page).changePagelist(page);
        })

        // this.changePage(new mainpageView());
    },
   
    skrivboktips_bma: function () {
        $.mobile.loading('show');
        console.log('#skrivboktips_bma');
        var lsmenu = storageHandler.get("menudata");
        var menumodel = new AppMain.Models.menu(lsmenu);
        var page = new AppMain.Views.skrivboktips_bmaView({ model: menumodel });
        this.addtopage(page).changePagelist(page);
        // this.changePage(new mainpageView());
    },

    inskickatboktips_bma: function () {
        $.mobile.loading('show');
        console.log('#inskickatboktips_bma');
        var page = new AppMain.Views.inskickatboktips_bmaView();
        this.addtopage(page).changePagelist(page);
        // this.changePage(new mainpageView());
    },
    bokdetail_bma: function (id) {
        $.mobile.loading('show', { text: "Laddar boken.. v" + unescape("%E4") + "nta!", textVisible: true });
        
        getBokDetaildata(this, id, function (that, bokdetailJson) {

            var LSBokDetaildBookid = storageHandler.get("LSBokDetaildBookid_" + id);
            if (LSBokDetaildBookid) {
                bokdetailJson = LSBokDetaildBookid;
            }
            var lsmenu = storageHandler.get("menudata");
            var menumodel = new AppMain.Models.menu(lsmenu);            
            var bokDetails = new AppMain.Collections.boklist(bokdetailJson);
            var page = new AppMain.Views.bokdetail_bmaView({ model: menumodel, collection: bokDetails });
            that.addtopage(page);

            page.inmybook(id);            

            loadForfAlsoWritelist(that, id, function (that, ForfAlsoWriteJson) {
                var ForfattarAlsoWritelist = new AppMain.Collections.ForfAlsoWritelista(ForfAlsoWriteJson);

                if (AppMain.globals.currentView.length > 1) {
                    AppMain.globals.currentView[0].close();
                    AppMain.globals.currentView.shift();
                };
                var insertForfattarAlsoWritetopage = new AppMain.Views.forfattarealsowrite_bmaView({ collection: ForfattarAlsoWritelist });
               
                console.log('#loadForfAlsoWritelist');
                
            });

            that.changePagelist(page);
      
        })
        console.log('#bokdetail_bma');
    },

    bokdetailextra_bma: function (id) {
        $.mobile.loading('show', { text: "Laddar extrainformation.. v" + unescape("%E4") + "nta!", textVisible: true });
        var page;
        //var visa = function (that, bookid, callback) {
        var LSBokDetaildBookid = storageHandler.get("LSBokDetaildBookid_" + id);
        if (LSBokDetaildBookid) {
            bokdetailJson = LSBokDetaildBookid;
        } else {
            //navigera tillbaka
        }
        var lsmenu = storageHandler.get("menudata");
        var menumodel = new AppMain.Models.menu(lsmenu);
        var bokDetails = new AppMain.Collections.boklist(bokdetailJson);
        page = new AppMain.Views.bokdetailextra_bmaView({ model: menumodel, collection: bokDetails });
        this.addtopage(page);

        loadSuggestionlist(this, id, function (that, SuggestionJson) {
            var bokSuggestionlist = new AppMain.Collections.booksuggestlista(SuggestionJson);
            var insertsuggesttopage = new AppMain.Views.booksuggestapi_bmaView({ collection: bokSuggestionlist });

            getbokomdomelists(that, id, function (that, bokomdomeJson) {
                var bokomdomeslistorlist = new AppMain.Collections.bokomdomeslistor(bokomdomeJson);
                var insertbokomdomentopage = new AppMain.Views.bokomdomen_bmaView({ collection: bokomdomeslistorlist });
                console.log('#bokomdomen_bmaView');
            });
        });

        this.changePagelist(page);
        console.log('#bokdetail_bma' + id);
    },

    boktipsdetail_bma: function (id) {
        $.mobile.loading('show', { text: "Laddar boktipset.. v" + unescape("%E4") + "nta!", textVisible: true });

        getboktipsdetaildata(this, id, function (that, boktips) {
            var lsmenu = storageHandler.get("menudata");
            var menumodel = new AppMain.Models.menu(lsmenu);      
            var boktipsDetail = new AppMain.Collections.boktipsen(boktips);
            var page = new AppMain.Views.boktipsdetail_bmaView({ model: menumodel, collection: boktipsDetail });
            that.addtopage(page).changePagelist(page);
        })

        console.log('#boktipsdetail_bma' + id);

    },

    katalog_bma: function () {
        console.log('#katalog_bma');
        var lsmenu = storageHandler.get("menudata");
        var menumodel = new AppMain.Models.menu(lsmenu)
        var page = new AppMain.Views.katalog_bmaView({ model: menumodel });
        this.addtopage(page).changePagelist(page);
        // this.changePage(new mainpageView());
    },
    krypin_bma: function () {
        $.mobile.loading('show', { text: "Laddar krypin.. v" + unescape("%E4") + "nta!", textVisible: true });
        console.log('#krypin_bma');
        var usrobj = storageHandler.get("_userdata");
        //if (window['_userdata'] != undefined) {
        var notloggedin= false;
        if (usrobj) {
            if (usrobj.userid) {
                var lsmenu = storageHandler.get("menudata");
                var menumodel = new AppMain.Models.menu(lsmenu)

                var krypincol = new AppMain.Models.user(usrobj);
                var page = new AppMain.Views.krypin_bmaView({ model: { menu: menumodel.toJSON(), obj: krypincol.toJSON() } });
                this.addtopage(page).changePagelist(page);
            } else {
                notloggedin = true;
            };
        } else {
            notloggedin = true;
        };
        if (notloggedin) {
            app = new AppRouter();
            app.navigate('#login', { trigger: true });
        };
        
    },
    krypinedit_bma: function () {
        console.log('#krypinedit_bma');
        var notloggedin = false;
        var usrobj = storageHandler.get("_userdata");
        if (usrobj) {
            if (usrobj.userid) {
                var lsmenu = storageHandler.get("menudata");
                var menumodel = new AppMain.Models.menu(lsmenu)
                var krypincol = new AppMain.Models.user(usrobj);
                var page = new AppMain.Views.krypinedit_bmaView({ model: { menu: menumodel.toJSON(), obj: krypincol.toJSON() } });
                this.addtopage(page).changePagelist(page);

            } else {
                notloggedin = true;
            };
        } else {
            notloggedin = true;
        };
        if (notloggedin) {
            app = new AppRouter();
            app.navigate('#login', { trigger: true });
        };
    },
    krypinavatar_bma: function () {
        console.log('#krypinavatar_bma');
        var notloggedin = false;
        var usrobj = storageHandler.get("_userdata");
        if (usrobj) {
            if (usrobj.userid) {
                var lsmenu = storageHandler.get("menudata");
                var menumodel = new AppMain.Models.menu(lsmenu)
                var krypincol = new AppMain.Models.user(usrobj);
                var page = new AppMain.Views.krypinavatar_bmaView({ model: { menu: menumodel.toJSON(), obj: krypincol.toJSON() } });
                this.addtopage(page).changePagelist(page);

            } else {
                notloggedin = true;
            };
        } else {
            notloggedin = true;
        };
        if (notloggedin) {
            app = new AppRouter();
            app.navigate('#login', { trigger: true });
        };
    },
    krypinpresentation_bma: function () {
        console.log('#krypinpresentation_bma');
        var notloggedin = false;
        var usrobj = storageHandler.get("_userdata");
        if (usrobj) {
            if (usrobj.userid) {
                var lsmenu = storageHandler.get("menudata");
                var menumodel = new AppMain.Models.menu(lsmenu)
                var krypincol = new AppMain.Models.user(usrobj);
                var page = new AppMain.Views.krypinpresentation_bmaView({ model: { menu: menumodel.toJSON(), obj: krypincol.toJSON() } });
                this.addtopage(page).changePagelist(page);

            } else {
                notloggedin = true;
            };
        } else {
            notloggedin = true;
        };
        if (notloggedin) {
            app = new AppRouter();
            app.navigate('#login', { trigger: true });
        };
    },

    quizer_bma: function () {
        console.log('#quizer_bma');
        var page = new AppMain.Views.quizer_bmaView();
        this.addtopage(page).changePagelist(page);
        // this.changePage(new mainpageView());
    },
    sagomaskinenmain_bma: function () {
        console.log('#sagomaskinenmain_bma');
        var lsmenu = storageHandler.get("menudata");
        var menumodel = new AppMain.Models.menu(lsmenu)
        var page = new AppMain.Views.sagomaskinenmain_bmaView({ model: menumodel });
        this.addtopage(page).changePagelist(page);
        // this.changePage(new mainpageView());
    },
    sagomaskinen_bma: function () {
        console.log('#sagomaskinen_bma');
        var lsmenu = storageHandler.get("menudata");
        var menumodel = new AppMain.Models.menu(lsmenu)       
        var page = new AppMain.Views.sagomaskinen_bmaView({ model: menumodel });
        this.addtopage(page).changePagelist(page);
        // this.changePage(new mainpageView());
    },
    sagomaskinenvisa_bma: function () {
        console.log('#sagomaskinenvisa_bma');
        var sagajson = storageHandler.get("maskinsaga");
        var maskinsaga = new AppMain.Models.sagomaskinen(sagajson);

        var page = new AppMain.Views.sagomaskinenvisa_bmaView({ model: maskinsaga });
        this.addtopage(page).changePagelist(page);
        // this.changePage(new mainpageView());                
    },
    sagomaskinen2_bma: function () {
        console.log('#sagomaskinen2_bma');
        var lsmenu = storageHandler.get("menudata");
        var menumodel = new AppMain.Models.menu(lsmenu)
        var page = new AppMain.Views.sagomaskinen2_bmaView({ model: menumodel });
        this.addtopage(page).changePagelist(page);
        // this.changePage(new mainpageView());
    },
    sagomaskinenvisa2_bma: function () {
        console.log('#sagomaskinenvisa2_bma');
        var sagajson = storageHandler.get("maskinsaga2");
        var maskinsaga = new AppMain.Models.sagomaskinen2(sagajson);

        var page = new AppMain.Views.sagomaskinenvisa2_bmaView({ model: maskinsaga });
        this.addtopage(page).changePagelist(page);
        // this.changePage(new mainpageView());                
    },
    mybooks_bma: function () {
        //var userid = 105; //sä
        var usr = storageHandler.get("_userdata");
        //if (window['_userdata'] != undefined) {
        if (usr) {
            userid = usr.userid;

            $.mobile.loading('show', { text: "Laddar Mina b" + unescape("%F6") + "cker.. v" + unescape("%E4") + "nta!", textVisible: true });
            console.log('#mybooks_bma');
            getmybooklists(this, userid, function (that, mybooklist) {
                var lsmenu = storageHandler.get("menudata");
                var menumodel = new AppMain.Models.menu(lsmenu)
                
                var mybooklistcol = new AppMain.Collections.Mybooklistor(mybooklist);
                var page = new AppMain.Views.mybooks_bmaView({ model: menumodel,  collection: mybooklistcol});
                
                that.addtopage(page).changePagelist(page);
            })
        } else {
            app = new AppRouter();
            app.navigate('#login', { trigger: true });
        }

    },
  
    votepage_bma: function () {
        $.mobile.loading('show', { text: "Laddar R" + unescape("%F6") + "stlistan.. v" + unescape("%E4") + "nta!", textVisible: true });

        var usr = storageHandler.get("_userdata");
        if (usr) {
            userid = usr.userid
            var lsmenu = storageHandler.get("menudata");
         
            var menumodel = new AppMain.Models.menu(lsmenu)
            var page = new AppMain.Views.votepage_bmaView({ model: menumodel});
            this.addtopage(page);

            getuservotelist(this, userid, function (that, votelistlist) {
                
                var votelistcol = new AppMain.Collections.votedbooklistor(votelistlist);             
                var nyvotelist = new AppMain.Views.votelist_bmaView( {collection: votelistcol });
                
            })
            this.changePagelist(page);
        } else {
            app = new AppRouter();
            app.navigate('#login', { trigger: true });
        }
    },
    votepagevotedtotal_bma: function () {
        $.mobile.loading('show', { text: "Laddar R" + unescape("%F6") + "stlistan.. v" + unescape("%E4") + "nta!", textVisible: true });

        var usr = storageHandler.get("_userdata");
        if (usr) {
            userid = usr.userid
            var lsmenu = storageHandler.get("menudata");
            var menumodel = new AppMain.Models.menu(lsmenu)
            var page = new AppMain.Views.votepagevotedtotal_bmaView({ model: menumodel });
            this.addtopage(page);

            getuservotelist(this, userid, function (that, votelistlist) {
                var votelistcol = new AppMain.Collections.votedbooklistor(votelistlist);
                var nyvotelist = new AppMain.Views.votelistvotedtotal_bmaView({ collection: votelistcol });
            })
            this.changePagelist(page);
        } else {
            app = new AppRouter();
            app.navigate('#login', { trigger: true });
        }
    },
    information_bma: function () {
        $.mobile.loading('show', { text: "h" + unescape("%E4") + "mtar informationssidan.. v" + unescape("%E4") + "nta!", textVisible: true });
        console.log('#information_bmaView');
        var page = new AppMain.Views.information_bmaView();
        this.addtopage(page).changePagelist(page);
        // this.changePage(new mainpageView());
    },
    noconnection_bma: function () {
    	 $.mobile.loading('show', { text: "Laddar.. v" + unescape("%E4") + "nta!", textVisible: true });
        console.log('#noconnection_bma');
        var page = new AppMain.Views.noconnection_bmaView();
        this.addtopage(page).changePagelist(page);
        // this.changePage(new mainpageView());
    },
    ///////////////////////////////////////////////////////////////////////////////////////
    //helpers------------------------------------------------------------------------------
    ///////////////////////////////////////////////////////////////////////////////////////

    changePage: function (page) {
        $(page.el).attr('data-role', 'page');
        page.render();

        $('body').append($(page.el));

        // We don't want to slide the first page
        if (this.firstPage) {
            transition = 'none';
            this.firstPage = false;
        }
        $.mobile.changePage($(page.el), { changeHash: false, transition: transition });
    },

    addtopage: function (page) {
        $(page.el).attr('data-role', 'page');

        if (AppMain.globals.currentView.length > 1) {
            AppMain.globals.currentView[0].close();
            AppMain.globals.currentView.shift();
        };

        AppMain.globals.currentView.push(page)
        var i = AppMain.globals.currentView.length - 1;
        AppMain.globals.currentView[i].render();
        //page.render();

        $('body').append($(page.el));

        return this;
    },

    changePagelist: function (page) {
        var transition = $.mobile.defaultPageTransition;
        // We don't want to slide the first page
        if (this.firstPage) {
            transition = 'none';
            this.firstPage = false;
        }

        var transition = $.mobile.defaultPageTransition;
        $.mobile.changePage($(page.el), { changeHash: false, transition: transition });
        
    }

});


$(document).ready(function () {
    console.log('document ready');
    // ADD
    //tpl.loadTemplates(['mainhub', 'mainpage', 'sokmain', 'start', 'sokdeltagare', 'mainhubstart', 'mainhublist', 'mainhubend', 'mainhublistitem', 'hem_bma'], function () {
    tpl.loadTemplates(['hem_bma', 'menu_bma', 'boktips_bma','boktipssearchmain_bma','boktipssearch_bma', 'boktipsdetail_bma', 'skrivboktips_bma', 'bokdetail_bma', 'votelist_bma', 'votepagevotedtotal_bma', 'votelistvotedtotal_bma', 'bokdetailextra_bma', 'forfattarealsowrite_bma', 'latestbooks_bma', 'bokomdomenlist_bma', 'booksuggestapi_bma', 'login_bma', 'katalog_bma', 'katalogensearch_bma', 'krypin_bma', 'krypinedit_bma', 'krypinavatar_bma', 'krypinpresentation_bma', 'quizer_bma', 'votepage_bma', 'sagomaskinenmain_bma', 'sagomaskinen_bma', 'sagomaskinenvisa_bma', 'sagomaskinen2_bma', 'sagomaskinenvisa2_bma', 'mybooks_bma', 'information_bma', 'noconnection_bma', 'inskickatboktips_bma'], function () {

        app = new AppRouter();
        Backbone.history.start();
    });

});
