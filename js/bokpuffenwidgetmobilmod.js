
    // Localize jQuery variable
    
    var localOrServerURL = "http://www.bokpuffen.se/api-bokpuffen";
    var widgetbaseurl = "http://www.bokpuffen.se/widget-bokpuffen";

    var bookid = new Array();
    var present = new Array();
    var pageurl = new Array();
    var forfattare = new Array();
    var title = new Array();
    var forlag = new Array();
    var isbn = new Array();
    var ljudfil = new Array();
    var imgsrc = new Array();
    var upplasare = new Array();

    //*** vald jquerycontainer fÃ¶r bokpuffen ***/
    var _bokpfContDiv = "#bp_bokpuffenContainer";
        

    /******** Our main function ********/
    var widgetmain = function () {


        /**** Init widget ****/
        var init = $("#bp_bokpuffenContainer").attr("rel");
        if (init) {
            var triminit = init.replace(/[\s]/g, "");
            var initvals = triminit.split(",");

            var _category = initvals[0];
            if (!_category) {
                _category = "barnochunga";
            }
            var _visaCss = initvals[1];
        } else {
            _category = "barnochunga";

        }


        /******* Load HTML *******/
        getbokpuffenJsonData();

        function getbokpuffenJsonData() {

            $.ajax({
                type: "GET",
                url: localOrServerURL + "/bokpuffenService.php?callback=?",
                data: { key: "getpuff", category: _category, format: "jsonp" },
                dataType: "jsonp",
                success: function (data) {

                    var i = 1;
                    $.each(data.bokpuffenService.bokpuff, function (item, val) {

                        bookid[i] = val.bookid;
                        present[i] = val.present;
                        pageurl[i] = val.pageurl;
                        forfattare[i] = val.forfattare;
                        title[i] = val.title;
                        forlag[i] = val.forlag;
                        isbn[i] = val.isbn;
                        ljudfil[i] = val.ljudfil;
                        imgsrc[i] = val.imgsrc;
                        upplasare[i] = val.upplasare;

                        // bokpuffenobjlist[i]= obj;

                        // mainhtmloutput(bookid[i], present[i], pageurl[i], forfattare[i], title[i], forlag[i], isbn[i], ljudfil[i], upplasare[i]);
                        mainhtmloutput(bookid[1], present[1], pageurl[1], forfattare[1], title[1], forlag[1], isbn[1], ljudfil[1], upplasare[1], imgsrc[1]);
                        i++;
                        return false;
                    });

                    //mainhtmloutput(bokpuffenobjlist[i], fragaordning[i], tmpquestion, tmpanswer);

                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert("NÃ¥tt blev fel!");

                }
            });

        }

        var bplogolinkurl = "http://www.bokpuffen.se";
        var bplogoigurl = widgetbaseurl + "/img/bokpuffen_logotyp.png";
        var bpdirecttoposturl = ""

        function mainhtmloutput(bookid, present, pageurl, forfattare, title, forlag, isbn, ljudfil, upplasare, imgsrc) {

            var htmlblock = '<div id="bp_bokpuffenContainer" class="bp_bokpuffenContainercls"><div id="bp_logobox"><a href="' + bplogolinkurl + '" id="bp_bokpufflogolink" class="bp_bokpufflogolinkcls">'
            htmlblock += '<img id="bp_bokpufflogo" class="bp_bokpufflogocls" src="' + bplogoigurl + '" /></a></div>';
            htmlblock += '<div id="bp_bokpuffmaincontbox" class="bp_bokpuffmaincontboxcls">';
            htmlblock += '<div id="bp_bokpuffimgbox" class="bp_bokpuffimgboxcls">';
            htmlblock += '<a id="bp_bokpufflink" class="bp_bokpufflinkcls">';
            htmlblock += '<img id="bp_bokpuffimg" class="bp_bokpuffimgcls" src="' + imgsrc + '" /></a></div>';
            htmlblock += '<div id="bp_bokpuffcontbox" class="bp_bokpuffcontboxcls">';
            htmlblock += '<h2>' + searchfixencoding(title) + '</h2>';
            htmlblock += 'F' + unescape("%F6") + 'rfattare:' + searchfixencoding(forfattare) + '<br />';
            htmlblock += 'F' + unescape("%F6") + 'rlag:' + searchfixencoding(forlag) + '<br />';
            htmlblock += 'ISBN:' + isbn + '<br />';
            htmlblock += 'Inl' + unescape("%E4") + 'sare:' + searchfixencoding(upplasare) + '<br />';
            htmlblock += '</div></div><div id="bp_bokpuffplayercontbox" class="bp_bokpuffplayerboxcls"></div>';
            htmlblock += '</div>';

            $(_bokpfContDiv).html(htmlblock);

            runbphtml5player(ljudfil);

        }

        function runbphtml5player(ljudfilen) {
            var html5supp = '<audio controls="controls" class="bp_bokpuffplayerboxcls">  ';
            html5supp += '<source src="' + ljudfilen + '"  type="audio/mpeg" />';
            html5supp += 'Your browser does not support the audio element. </audio>';
            $("#bp_bokpuffplayercontbox").html(html5supp);
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


        function searchfix(str) {
            var searchRaw = str;
            searchRaw = searchRaw.replaceAll("√∂", "3213");
            searchRaw = searchRaw.replaceAll("√§", "1323");
            searchRaw = searchRaw.replaceAll("√ñ", "3213");
            searchRaw = searchRaw.replaceAll("√Ñ", "1323");
            searchRaw = searchRaw.replaceAll("√Ö", "1233");
            var fixat = searchRaw.replaceAll("√•", "1233");
            return fixat;
        }

        function searchfixencoding(str) {
            var searchRaw = str;
            searchRaw = searchRaw.replaceAll("&amp;", "&");
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
            var fixat = searchRaw.replaceAll("&#229;", unescape("%E5"));
            return fixat;
        }

    };

