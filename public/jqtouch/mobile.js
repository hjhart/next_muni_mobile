var jQT = new $.jQTouch({
    icon:'apple-touch-icon.png',
    //addGlossToIcon: false,
    startupScreen:"apple-touch-startup.png",
    statusBar:'black-translucent',
    preloadImages:[
        '/jqtouch/themes/jqt/img/back_button.png',
        '/jqtouch/themes/jqt/img/back_button_clicked.png',
        '/jqtouch/themes/jqt/img/button_clicked.png',
        '/jqtouch/themes/jqt/img/grayButton.png',
        '/jqtouch/themes/jqt/img/whiteButton.png',
        '/jqtouch/themes/jqt/img/loading.gif'
    ]
});

jQuery(function() {
    var bus_stops = ["to", "from", "1_market", "other", "routes"]
    jQuery.each(bus_stops, function () {
        bindInitialBusPopulation(this)
        bindRefreshButton(this)
    })



});

function bindRefreshButton(namespace) {
    $("#" + namespace + " .refresh").tap(function() {
        refreshButton(namespace);
    })
}

function refreshButton(namespace) {
    var $ul = $("#" + namespace + " ul:first")
    var li_names = "#" + namespace + " ul:first li";
    var first_li_name = "#" + namespace + " ul:first li:first";
    var uri = "/" + namespace + ".json";
    var $li = $(first_li_name);

    $(li_names).remove()

    var $clone = $li.clone();
    $clone.html("Loading Bus Times");

    $ul.append($clone);

    $.getJSON(uri, function (data) {
        refreshBusTimes(data, namespace);
    });
}

function refreshBusTimes(data, namespace) {
    var li_name = "#" + namespace + " ul:first li:first";
    var $li = $(li_name);
    jQuery.each(data, function () {
        var $clone = $li.clone();
        $clone.html(this.times.join(", ") + "<small>" + this.bus_number + "</small>");
        $li.parent().append($clone);
    });
    $li.remove()
}

function bindInitialBusPopulation(namespace) {
    var div = "#" + namespace;
    var $div = $(div);
    var is_loaded = namespace + "-loaded"
    var uri = "/" + namespace + ".json"

    $(div).bind("pageAnimationEnd", function (e, info) {
        if (info.direction === "out") {
            return;
        }
        var $page = $(this);
        if ($page.data(is_loaded)) {
            return;
        }

        $.getJSON(uri, function (data) {
            refreshBusTimes(data, namespace);
            $page.data(is_loaded, true)
        });
    });
}