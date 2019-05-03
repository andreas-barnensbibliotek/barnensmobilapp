$(document).bind("mobileinit", function () {
    $.mobile.ajaxEnabled = false;
    $.mobile.linkBindingEnabled = false;
    $.mobile.hashListeningEnabled = false;
    $.mobile.pushStateEnabled = false;
    $.mobile.loader.prototype.options.text = "Laddar";
    $.mobile.loader.prototype.options.textVisible = false;
    $.mobile.loader.prototype.options.theme = "c";
    $.mobile.loader.prototype.options.html = "";
    // Remove page from DOM when it's being replaced
    $('div[data-role="page"]').on('pagehide', function (event, ui) {
        $(event.currentTarget).remove();
    });

   
    $(document).on("swiperight", function (e) {
        if ($(".ui-page-active").jqmData("panel") !== "open") {
            if (e.type === "swiperight") {
                $.mobile.activePage.find('#nav-panel').panel("open");
            }
        }
    });
    var self = this;
    $(document).on('click', '#backbuttonurl', function (e) {
        e.preventDefault();
        self.back = true;
        window.history.back();
    });

    $(document).on('click', '.backbuttonurl', function (e) {
        e.preventDefault();
        self.back = true;
        window.history.back();
    });

    $(document).on('click', 'a[data-rel="popup"]', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var target = $(this).attr("href");       
        $(target).popup('open');
    });

    
});