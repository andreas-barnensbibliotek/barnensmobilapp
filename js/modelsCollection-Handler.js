window.AppMain = {
    Models: {},
    Collections: {},
    Views: {},
    Mainroot: {
        rooturl: "https://api.barnensbibliotek.se/Api_v1",
        livesiteUrl: "https://www.barnensbibliotek.se/desktopModules",
        serverrooturl: "http://barnbibblan.se:8080/Api_v1",
        devserverrooturl: "https://www.barnensbibliotek.se/desktopModules",
        localdevurl: "https://www.barnensbibliotek.se/desktopModules",
        apiurl: "https://api.barnensbibliotek.se/Api_v1",
        siteurl: "https://www.barnensbibliotek.se/desktopModules",
    },
    devkey: { devdefaults: "alf", security: "alfuser" },
    globals: { currentView: [] },
    uppkoppling: { network: "0" }
};
// livesiteUrl : "https://www.barnensbibliotek.se/desktopModules"
Backbone.View.prototype.close = function () {
    console.log('closing' + this);

    if (this.beforeClose) {
        this.beforeClose(); // hook till om man vill göra en funktionsom städar innan allt stängs
    }
    this.remove();
    this.unbind();

    if (this.onClose) {
        this.onClose();// hook till om man vill göra en funktionsom städar EFTER allt stängs
    }
};

var storageHandler = {
    set: function (key, value) {
        window.localStorage.setItem(key, JSON.stringify(value));
        //$.jStorage.set(key, value);

    },
    remove: function (key) {
        window.localStorage.removeItem(key);
        //$.jStorage.deleteKey(key);
    },
    get: function (key) {
        var test = window.localStorage.getItem(key);
        if (test) {
            return JSON.parse(window.localStorage.getItem(key));
        } else {
            return test;
        }
        //return $.jStorage.get(key);
    },
};

var _userdata;
var _aktuelltUserid;
//var currentView =[];
// USER HANDLERS-------------------------------------------------------------------------------
AppMain.Models.menu = Backbone.Model.extend({
    defaults: {
        avatar: "",
        votetime: "0",
        votedfortotal: "0",
        votedebug: "0", //använd denna för att simulera votetime votebug:1 = bokjuryn startat på servern och votebug:0 = bokjuryn stängd på servern
        maxvotes: "0", 
        Status: ""
    }
});
// USER HANDLERS-------------------------------------------------------------------------------
AppMain.Models.user = Backbone.Model.extend({
    defaults: {
        userid: "",
        username: "",
        password: "",
        displayname: "",
        fornamn: "",
        efternamn: "",
        adress: "",
        postnr: "",
        ort: "",
        skola: "",
        alder: "",
        epost: "",
        avatar: "defautlavatar.gif",
        presentation: "",
        systemmess: "",
        laserjustnu: "",
        dev: "0",
        status: ""
    }
});

var verifyuser = function (that, values, callback) {

    $.ajax({
        type: "GET",
        url: AppMain.Mainroot.livesiteUrl + "/barnensbiblservice/userapi/userapi.aspx?callback=?",
        data: ({ devkey: AppMain.devkey.security, user: values.user, pass: values.pass, json: 'p' }),
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        dataType: "jsonp",
        success: function (data) {
            retjson = data.userinfoservice;
            //isvotestarted(this, retjson.userid, retjson.dev, function (that, value) {
            //    return true;
            //});
            retjson.presentation = convertSvenskatecken(retjson.presentation);
            storageHandler.set("LSuserdataJson", retjson)
            callback(that, retjson);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("verifyuser Error " + xhr + ajaxOptions + thrownError);
        }
    });

};

var edituserdata = function (that, values, callback) {
    checkConnection();

    values.devkey = AppMain.devkey.security;
    values.cmdtyp = 'editbaseuserdata';
    values.json = 'p';

    $.ajax({
        type: "GET",
        url: AppMain.Mainroot.livesiteUrl + "/barnensbiblservice/userapi/userapi.aspx?callback=?",
        data: (values),
        dataType: "jsonp",
        success: function (data) {
            retjson = data.userinfoservice;

            callback(that, retjson);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("verifyuser Error " + xhr + ajaxOptions + thrownError);
        }
    });

}

var editavatar = function (that, values, callback) {
    checkConnection();
    $.ajax({
        type: "GET",
        url: AppMain.Mainroot.livesiteUrl + "/barnensbiblservice/userapi/userapi.aspx?callback=?",
        data: ({ devkey: AppMain.devkey.security, cmdtyp: 'updavatar', avatar: values.avatar, user: values.user, pass: values.pass, json: 'p' }),
        dataType: "jsonp",
        success: function (data) {
            retjson = data.userinfoservice;

            callback(that, retjson);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("verifyuser Error " + xhr + ajaxOptions + thrownError);
        }
    });

}

var editpresentation = function (that, values, callback) {

    var testardebug = values;

    checkConnection();
    $.ajax({
        type: "GET",
        url: AppMain.Mainroot.livesiteUrl + "/barnensbiblservice/userapi/userapi.aspx?callback=?",
        data: ({ devkey: AppMain.devkey.security, cmdtyp: 'updpres', pres: values.presentation, user: values.user, pass: values.pass, json: 'p' }),
        dataType: "jsonp",
        success: function (data) {
            retjson = data.userinfoservice;

            callback(that, retjson);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("verifyuser Error " + xhr + ajaxOptions + thrownError);
        }
    });

}

//BOKTIPS HANDLERS -------------------------------------------------------------------------------
AppMain.Models.boktips = Backbone.Model.extend({
    defaults: {
        Antal: "",
        Booktiplist: {
            TipID: 0,
            title: "",
            Bookid: 0,
            Author: "",
            HighAge: 0,
            LowAge: 0,
            Review: "",
            UserName: "",
            Userid: 0,
            Userage: 0,
            Tiptype: 0,
            Category: "",
            ImgSrc: "",
            Approved: 0,
            Inserted: ""
        },
        Status: ""
    }
});

AppMain.Collections.boktipsen = Backbone.Collection.extend({
    model: AppMain.Models.boktips

})

var getboktipsdata = function (that, callback) {
    checkConnection();
    $.ajax({
        type: "GET",
        url: AppMain.Mainroot.apiurl + "/boktips/devkey/" + AppMain.devkey.devdefaults + "?callback=?",
        data: ({}),
        dataType: "jsonp",
        success: function (data) {

            callback(that, data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("getboktipsdata Error " + xhr + ajaxOptions + thrownError);
        }
    });
};

var getboktipsdetaildata = function (that, id, callback) {
    checkConnection();
    $.ajax({
        type: "GET",
        url: AppMain.Mainroot.apiurl + "/boktips/bytipid/" + id + "/devkey/" + AppMain.devkey.devdefaults + "?callback=?",
        data: ({}),
        dataType: "jsonp",
        success: function (data) {

            callback(that, data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("getboktipsdetaildata Error " + xhr + ajaxOptions + thrownError);
        }
    });
};

var addboktipsdetaildata = function (that, formdata, callback) {
    checkConnection();
    $.ajax({
        type: "get",
        url: AppMain.Mainroot.apiurl + "/boktips/addbooktip/devkey/" + AppMain.devkey.devdefaults + "/" + formdata + "?callback=?",
        data: ({}),
        dataType: "jsonp",
        success: function (data) {

            callback(that, data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("addboktipsdetaildata Error " + xhr + ajaxOptions + thrownError);
        }
    });
};
var getBoktipsSearchdata = function (that, searchval, callback) {
    checkConnection();
    $.ajax({
        type: "GET",
        url: AppMain.Mainroot.apiurl + "/boktips/bysearch/" + searchval + "/devkey/" + AppMain.devkey.devdefaults + "?callback=?",
        data: ({}),
        dataType: "jsonp",
        success: function (data) {

            callback(that, data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("getBokDetaildata Error " + xhr + ajaxOptions + thrownError);
        }
    });
};
var getBoktipsgetlatestdata = function (that, callback) {
    checkConnection();
    $.ajax({
        type: "GET",
        url: AppMain.Mainroot.apiurl + "/boktips/bylatest/10/devkey/" + AppMain.devkey.devdefaults + "?callback=?",
        data: ({}),
        dataType: "jsonp",
        success: function (data) {

            callback(that, data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("getBokDetaildata Error " + xhr + ajaxOptions + thrownError);
        }
    });
};

//KATALOGEN BOK HANDLERS -------------------------------------------------------------------------------
AppMain.Models.bok = Backbone.Model.extend({
    defaults: {
        Antal: "",
        Boklist: {
            bookid: "",
            Bokjuryn: "",
            Easyread: "",
            isbn: "",
            title: "",
            Author: "",
            Published: "",
            presentation: "",
            Serie: "",
            Serienr: "",
            Subtitle: "",
            TotVotes: "",
            forlag: "",
            Review: "",
            ImgSrc: "https://www.barnensbibliotek.se/Portals/0/bokomslag/foto_saknas.jpg",
            Userhasvoted: "0",
            status: ""
        },
        Status: ""
    }
});

AppMain.Collections.boklist = Backbone.Collection.extend({
    model: AppMain.Models.bok

})

var getBokDetaildata = function (that, bookid, callback) {
    checkConnection();
    $.ajax({
        type: "GET",
        url: AppMain.Mainroot.apiurl + "/bokinfo/bokdetail/" + bookid + "/devkey/" + AppMain.devkey.devdefaults + "?callback=?",
        data: ({}),
        dataType: "jsonp",
        success: function (data) {
            storageHandler.set("LSBokDetaildBookid_" + bookid, data)
            callback(that, data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("getBokDetaildata Error " + xhr + ajaxOptions + thrownError);
        }
    });
};

var getBokSearchdata = function (that, searchval, userid, callback) {
    checkConnection();
    $.ajax({
        type: "GET",
        url: AppMain.Mainroot.apiurl + "/bokinfo/boksearchvotes/" + searchval + "/" + userid + "/devkey/" + AppMain.devkey.devdefaults + "?callback=?",
        data: ({}),
        dataType: "jsonp",
        success: function (data) {

            callback(that, data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("getBokDetaildata Error " + xhr + ajaxOptions + thrownError);
        }
    });
};
var getBokcatamnSearchdata = function (that, typ, searchval, userid, callback) {
    checkConnection();
    $.ajax({
        type: "GET",
        url: AppMain.Mainroot.apiurl + "/bokinfo/" + typ + "/" + searchval + "/" + userid + "/devkey/" + AppMain.devkey.devdefaults + "?callback=?",
        data: ({}),
        dataType: "jsonp",
        success: function (data) {

            callback(that, data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("getBokDetaildata Error " + xhr + ajaxOptions + thrownError);
        }
    });
};


AppMain.Models.bookid = Backbone.Model.extend({
    defaults: {
        bookid: ""
    }
});

// Booksuggest HANDLERS -------------------------------------------------------------------------------
AppMain.Models.booksuggest = Backbone.Model.extend({
    defaults: {
        booksuggests: {
            title: "",
            bookid: 0,
            imgSrc: ""
        },
        Status: ""
    }
});

AppMain.Collections.booksuggestlista = Backbone.Collection.extend({
    model: AppMain.Models.booksuggest

})

var loadSuggestionlist = function (that, bookid, callback) {
    checkConnection();
    $.ajax({
        type: "GET",
        url: AppMain.Mainroot.livesiteUrl + "/barnensbiblService/booksuggestapi/booksuggestapi.aspx?callback=?",
        data: { devkey: "suggest", cmdtyp: "also", json: "p", bookid: bookid },
        dataType: "jsonp",
        async: true,
        success: function (data) {
            callback(that, data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("getBokDetaildata Error " + xhr + ajaxOptions + thrownError);
        }
    });

}

// Författare skriver också HANDLERS -------------------------------------------------------------------------------
AppMain.Models.ForfAlsoWrite = Backbone.Model.extend({
    defaults: {
        booksuggests: {
            title: "",
            bookid: 0,
            imgSrc: ""
        },
        Status: ""
    }
});

AppMain.Collections.ForfAlsoWritelista = Backbone.Collection.extend({
    model: AppMain.Models.booksuggest

})
var loadForfAlsoWritelist = function (that, bookid, callback) {
    checkConnection();
    $.ajax({
        type: "GET",
        url: AppMain.Mainroot.livesiteUrl + "/barnensbiblService/forfattarealsowriteapi/forfattarealsowriteapi.aspx?callback=?",
        data: { devkey: "forfalso", cmdtyp: "bookid", json: "p", bookid: bookid },
        dataType: "jsonp",
        async: true,
        success: function (data) {
            callback(that, data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("getBokDetaildata Error " + xhr + ajaxOptions + thrownError);
        }
    });

}

// Dom senaste inlagda böckerna HANDLERS -------------------------------------------------------------------------------
AppMain.Models.latestbook = Backbone.Model.extend({
    defaults: {
        Boklist: {
            title: "",
            bookid: 0,
            imgSrc: ""
        },
        Status: ""
    }
});

AppMain.Collections.latestbooklista = Backbone.Collection.extend({
    model: AppMain.Models.latestbook
})
var loadlatestbooklist = function (that, callback) {
    checkConnection();
    $.ajax({
        type: "GET",
        url: AppMain.Mainroot.apiurl + "/bokinfo/boklatest/0/devkey/" + AppMain.devkey.devdefaults + "?callback=?",
        data: ({}),
        dataType: "jsonp",
        success: function (data) {

            callback(that, data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("getboktipsdata Error " + xhr + ajaxOptions + thrownError);
        }
    });

}

// MINA BÖCKER HANDLERS------------------------------------------------------------
AppMain.Models.Mybooklista = Backbone.Model.extend({
    defaults: {
        booklistid: 0,
        groupid: 0,
        bookitems: {
            bookid: "0",
            booktitle: "",
            bookauthor: "",
            bookisbn: "",
            bookimgsrc: ""
        },
        booklistnamn: ""
    }
});

AppMain.Collections.Mybooklistor = Backbone.Collection.extend({
    model: AppMain.Models.Mybooklista

})

var getmybooklists = function (that, userid, callback) {
    checkConnection();
    $.ajax({
        type: "GET",
        url: AppMain.Mainroot.livesiteUrl + "/AJBarnensKrypin/controls/krypinbooklistservice.aspx?callback=?",
        data: { devkey: "krypin", cmdtyp: "getallusrbooklists", usr: userid, json: "p" },
        dataType: "jsonp",
        async: false,
        success: function (data) {
            var boklistorJson = data.barnenskrypin.boklistor;
            callback(that, boklistorJson);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("getmybooklists Error " + xhr + ajaxOptions + thrownError);
        }
    });
}
var updateMybookAjax = function (that, userid, bookid, callback) {
    checkConnection();
    var ret = false;
    $.ajax({
        type: "GET",
        url: AppMain.Mainroot.livesiteUrl + "/ajbarnbokskatalogen_v3/katalogapi/mybooks/updatemybook.aspx?callback=?",
        data: ({ devkey: 'alf', typ: '3', id: userid, bid: bookid, json: 'p' }),
        dataType: "jsonp",
        async: false,
        success: function (data) {
            if (data.barnensbiblioktekservice.inmybooks == 1) {
                ret = true;
            };
            callback(that, ret);

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("inne i getuserDatafromWeb Error " + xhr + ajaxOptions + thrownError);
        }
    });

}
var chkisbookinMybookAjax = function (that, userid, bookid, callback) {
    var ret = false;
    $.ajax({
        type: "GET",
        url: AppMain.Mainroot.livesiteUrl + "/ajbarnbokskatalogen_v3/katalogapi/mybooks/updatemybook.aspx?callback=?",
        data: ({ devkey: 'alf', typ: '4', id: userid, bid: bookid, json: 'p' }),
        dataType: "jsonp",
        async: false,
        success: function (data) {
            if (data.barnensbiblioktekservice.inmybooks == 1) {
                ret = true;
            };
            callback(that, ret);

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("inne i getuserDatafromWeb Error " + xhr + ajaxOptions + thrownError);
        }
    });

}

// VOTE HANDLERS ----------------------------------------------------------------------------------------------------------------------------
AppMain.Models.votedbook = Backbone.Model.extend({
    defaults: {
        bookid: '0',
        booktitle: '',
        bookisbn: '',
        bookmybook: '',
        bookVoted: '',
        bookVotedCount: '0',
        bookimgsrc: 'https://www.barnensbibliotek.net/Portals/0/bokomslag/foto_saknas.jpg',
        bookextentions: [
            {
                extnamn: '',
                exttitle: '',
                extactive: 'false',
                exticon: '',
                extlink: '',
                extorder: '0',
                extvalue: '0'
            }
        ]
    }
});

AppMain.Collections.votedbooklistor = Backbone.Collection.extend({
    model: AppMain.Models.votedbook

})

var votehandler = function (typ, bookid, userid,callback) {

    var voteinfo = {
        devkey: "katalogenVoteApi",
        json: "p",
        cmdtyp: typ + "_vote",
        usrid: userid,
        grp: "",
        bookid: bookid,
        ant: "1",
        status: ""
    };

   

}
var isBookvotedfor = function (that, userid, bookidt, callback) {
   

};
var getuservotelist = function (that, userid, callback) {
    
};

var isvotestarted = function (that,usrid,isdev, callback) {
 
};

var votefortotal = function (that, userid, callback) {
    
};


//Sagomaskinen

AppMain.Models.sagomaskinen = Backbone.Model.extend({
    defaults: {
        substantiv1: "",
        substantiv2: "",
        substantiv3: "",
        verb: "",
        adjektiv: ""
    }
});

AppMain.Collections.sagomaskiner = Backbone.Collection.extend({
    model: AppMain.Models.Mybooklista

})

AppMain.Models.sagomaskinen2 = Backbone.Model.extend({
    defaults: {
        ord1: "",
        ord2: "",
        ord3: "",
        ord4: "",
        ord5: "",
        ord6: "",
        ord7: "",
        ord8: "",
        ord9: ""
    }
});

// BOKOMDOMEN HANDLERS------------------------------------------------------------
AppMain.Models.bokomdome = Backbone.Model.extend({
    defaults: {
        bokomdomen: {
            bookid: "0",
            title: "",
            isbn: "",
            tipname: "",
            age: "",
            review: ""
        },
        status: ""
    }
});

AppMain.Collections.bokomdomeslistor = Backbone.Collection.extend({
    model: AppMain.Models.bokomdome

})

var getbokomdomelists = function (that, bookid, callback) {
    checkConnection();
    $.ajax({
        type: "GET",
        url: AppMain.Mainroot.livesiteUrl + "/ajbarnbokskatalogen_v3/katalogApi/bokomdomen/bokomdomenapi.aspx?callback=?",
        data: { devkey: "bokomd", cmdtyp: "omdtobook", bookid: bookid, json: "p" },
        dataType: "jsonp",
        async: false,
        success: function (data) {
            var bokomdomeJson = data;
            callback(that, bokomdomeJson);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("getmybooklists Error " + xhr + ajaxOptions + thrownError);
        }
    });
}

// Helper funktioner
var returnusermessages = function (errnumber) {
    var retmess;
    switch (errnumber) {
        case "10":
            retmess = "Boken är inlaggd i din röstlista!";
            break;
        case "11":
            retmess = "Boken finns redan i röstlistan";
            break;
        case "22":
            retmess = "Du har redan max antal böcker i listan";
            break;
        case "31":
            retmess = "Du har nu röstat i bokjuryn!";
            break;
        case "51":
            retmess = "Du är röstrapportör och kan därför inte rösta här!";
            break;
        case "71":
            retmess = "Du måste fylla i namn och adress!"
            break;
        case "77":
            retmess = "Du har inte valt något att söka på!"
            break;
        case "88":
            retmess = "Tack för dina röster!"
            break;
        case "99":
            retmess = "Nått blev fel! försök igen!"
            break;
        case "100":
            retmess = "Du måste välja böcker att rösta på, innan du skickar in!"
            break;
    };
    return retmess;
}

// NYHETS HANDLERS ---------------------------------------------------------------------------
AppMain.Models.nyhet = Backbone.Model.extend({
    defaults: {
        nyheter: [{
            nyhet: ""
        }],
        status: ''
    }
});

AppMain.Collections.nyheter = Backbone.Collection.extend({
    model: AppMain.Models.nyhet

})
var getnyheter = function (that, callback) {
    checkConnection();
    var nyhethtml = "";
    var x = 0;
    $.ajax({
        type: "GET",
        url: AppMain.Mainroot.livesiteUrl + "/barnensmobil/api/barnensmobilnyheter.aspx",
        data: { devkey: "NyheterApi", cmdtyp: "nyhet_bb", json: "p" },
        dataType: "jsonp",
        success: function (data) {

            $.each(data.barnensbibliotekservice.innehall, function (item, val) {
                nyhethtml += $('<div />').html(val.content).text();

            });

            console.log($('<div />').html(nyhethtml).text());
            //nyhethtml = "<strong>html</strong>inte här";
            callback(that, nyhethtml);

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("getnyheter Error " + xhr + ajaxOptions + thrownError);
        }
    });

};//end getnyheter

var getforfattare = function (that, callback) {
    checkConnection();
    var getforfattarehtml = "";
    var x = 0;
    $.ajax({
        type: "GET",
        url: AppMain.Mainroot.livesiteUrl + "/barnensmobil/api/barnensmobilnyheter.aspx",
        data: { devkey: "NyheterApi", cmdtyp: "forf_bb", json: "p" },
        dataType: "jsonp",
        success: function (data) {

            $.each(data.barnensbibliotekservice.innehall, function (item, val) {
                getforfattarehtml += $('<div />').html(val.content).text();

            });

            //var nyheterModel = new AppMain.Models.nyhet();
            //nyheterModel.set("nyheter", nyhethtml);
            //var testar = nyheterModel.toJSON();
            console.log($('<div />').html(getforfattarehtml).text());
            //nyhethtml = "<strong>html</strong>inte här";
            callback(that, getforfattarehtml);


        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("getnyheter Error " + xhr + ajaxOptions + thrownError);
        }
    });

};//end getnyheter

var checkConnection = function () {
    var ret = "1";

    if (typeof navigator.connection != 'undefined') {

        if (navigator.connection.type == 'none' || navigator.connection.type == 0) {

            ret = '0'
            AppMain.uppkoppling.network = "0";

            if (typeof navigator.notification != 'undefined') {
                navigator.notification.alert(
                            "Du har ingen uppkoppling!",
                            function () { },         // callback skickar med en anonymfunktion för att slippa callback handler
                            'Nätverksfel',            // title
                            'Ok'                  // buttonName    				
                    );

                app = new AppRouter();
                app.navigate('#noconnection', { trigger: true });
            }
            $.mobile.loading('hide');
        }
    }
    return ret;
}

var getuserdata = function (detta, callback) {
    var t = storageHandler.get("_userdata");
    if (!t) {
        app = new AppRouter();
        app.navigate('#login', { trigger: true });
        return false;
    }
    var uservalues = {
        user: t.username,
        pass: t.password
    }

    verifyuser(detta, uservalues, function (that, userjson) {
        userjson['password'] = uservalues.pass;
        _userdata = new AppMain.Models.user(userjson);

        var userid = _userdata.get("userid");
        var dev = _userdata.get("dev");
        if (userid) {

            isvotestarted(this, userid, dev, function (that, value) {
                console.log(value);
            })

            var menuinfo = {
                avatar: _userdata.attributes.avatar,
                votetime: storageHandler.get('isvoteStarted'),

                Status: ""
            }

            var savemenu = new AppMain.Models.menu(menuinfo)
            storageHandler.set("menudata", savemenu);

            //var usrdata = JSON.stringify(_userdata);
            //var tmp3 = JSON.stringify(userjson);
            storageHandler.set("debug", "sattvärde");
            storageHandler.set("_userdata", _userdata); //ladda user objektet med alla värden in i localstorage
            // window.localStorage.setItem("LSaktuelltUserid", userid);
            console.log("userdata är uppdaterat");
        };
    });
    //callback();
};

var convertSvenskatecken = function (str) {
    if (str) {
        var searchRaw = str;
        searchRaw = searchRaw.replaceAll("&#246;", unescape("%F6"));
        searchRaw = searchRaw.replaceAll("&#228;", unescape("%E4"));
        searchRaw = searchRaw.replaceAll("&#214;", unescape("%D6"));
        searchRaw = searchRaw.replaceAll("&#196;", unescape("%C4"));
        searchRaw = searchRaw.replaceAll("&#197;", unescape("%C5"));
        searchRaw = searchRaw.replaceAll("&#200;", unescape("%C8"));
        searchRaw = searchRaw.replaceAll("&#232;", unescape("%E8"));
        searchRaw = searchRaw.replaceAll("&#201;", unescape("%C9"));
        searchRaw = searchRaw.replaceAll("&#233;", unescape("%E9"));
        searchRaw = searchRaw.replaceAll("&#198;", unescape("%C6"));
        searchRaw = searchRaw.replaceAll("&#230;", unescape("%E6"));
        searchRaw = searchRaw.replaceAll("&#252;", unescape("%FC"));
        searchRaw = searchRaw.replaceAll("&#229;", unescape("%E5"));
        //searchRaw = searchRaw.replaceAll("&", "&amp;");
        //searchRaw = searchRaw.replaceAll("ö", "&#246;");
        //searchRaw = searchRaw.replaceAll("ä", "&#228;");
        //searchRaw = searchRaw.replaceAll("Ö", "&#214;");
        //searchRaw = searchRaw.replaceAll("Ä", "&#196;");
        //searchRaw = searchRaw.replaceAll("Å", "&#197;");
        //searchRaw = searchRaw.replaceAll("Ü", "&#220;");
        //searchRaw = searchRaw.replaceAll("ü", "&#252;");
        //searchRaw = searchRaw.replaceAll("É", "&Eacute;");
        //searchRaw = searchRaw.replaceAll("é", "&eacute;");
        //searchRaw = searchRaw.replaceAll("Æ", "&AElig;");
        //searchRaw = searchRaw.replaceAll("æ", "&aelig;");
        //searchRaw = searchRaw.replaceAll("´", "&rsquo;");

        searchRaw = searchRaw.replaceAll("Ã¥", "&#229;");
        searchRaw = searchRaw.replaceAll("Ã¤", "&#228;");
        searchRaw = searchRaw.replaceAll("Ã¶", "&#246;");
        var fixat = searchRaw.replaceAll("å", "&#229;");
    }

    return fixat;
}

String.prototype.replaceAll = function (token, newToken, ignoreCase) {
    var str, i = -1, _token;
    if ((str = this.toString()) && typeof token === "string") {
        _token = ignoreCase === true ? token.toLowerCase() : undefined;
        while ((i = (_token !== undefined ? str.toLowerCase().indexOf(_token, i >= 0 ? i + newToken.length : 0)
            : str.indexOf(token, i >= 0 ? i + newToken.length : 0))) !== -1) {
            str = str.substring(0, i)
                .concat(newToken)
                .concat(str.substring(i + token.length));
        }
    }
    return str;
};

