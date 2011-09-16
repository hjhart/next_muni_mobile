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
    var bus_stops = ["to", "from", "1_market", "other"]

    jQuery.each(bus_stops, function () {
        bindInitialBusPopulation(this)
        bindRefreshButton(this)
    })

    $("#times").bind("pageAnimationEnd", function (e, info) {
        var namespace = "times"
        if (info.direction === "out") {
            return;
        }

        var $page = $("body");
        var route = $page.data("route-selected");
        var stop = $page.data("stop-selected");

        $.getJSON('/times/' + route + '/' + stop + '.json', function (data) {
            var $li = $("#" + namespace + " ul:first li:first");
            jQuery.each(data, function(index, time) {
                var $clone = $li.clone();
                html = time + " minutes"
                $clone.html(html);
                $li.parent().append($clone);
            })
            $li.remove()

        })
    });

    $("#stops").bind("pageAnimationEnd", function (e, info) {
        var namespace = "stops"
        if (info.direction === "out") {
            return;
        }

        var $page = $("body");
        var route = $page.data("route-selected");

        $.getJSON('/routes/' + route + '.json', function (data) {
            direction = $("body").data("direction-selected")
            var direction = new RegExp(direction, "i");
            jQuery.each(data, function() {
                if (this.name.match(direction)) {
                    var $li = $("#" + namespace + " ul:first li:first");
                    jQuery.each(this.stops, function(stop_id, title) {
                        var $clone = $li.clone();
                        html = "<a href='#times'>" + title + "</a>"
                        $clone.html(html);
                        $clone.click(function() {
                            $("body").data("stop-selected", stop_id)
                        });
                        $li.parent().append($clone);
                    })
                    $li.remove()

                }
            });
        });

    });

    $("#directions").bind("pageAnimationEnd", function (e, info) {
        namespace = "directions"
        if (info.direction === "out") {
            return;
        }

        var directions = ["inbound", "outbound"]
        var $page = $("body");

        var $li = $("#" + namespace + " ul:first li:first");
        jQuery.each(directions, function() {
            var $clone = $li.clone();
            var direction = this
            html = "<a href='#stops'>" + this + "</a>"
            $clone.html(html);
            $clone.click(function() {
                $("body").data("direction-selected", direction)
            });
            $li.parent().append($clone);
        })
        $li.remove()
    });

    $("#routes").bind("pageAnimationEnd", function (e, info) {
        namespace = "routes"
        if (info.direction === "out") {
            return;
        }

        var $page = $("body");
        if ($page.data("routes-loaded")) {
            return;
        }

        $.getJSON('/routes.json', function (data) {
            var $li = $("#" + namespace + " ul:first li:first");
            jQuery.each(data, function() {
                var $clone = $li.clone();
                var route_id = this.id
                html = "<a class='arrow' href='#directions'>" + this.title + "</a>"
                $clone.html(html);
                $clone.click(function() {
                    $("body").data("route-selected", route_id)
                });
                $li.parent().append($clone);
            })
            $li.remove()
            $page.data("routes-loaded", true)
        });
    });


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
        var $page = $("body");
        if ($page.data(is_loaded)) {
            return;
        }

        $.getJSON(uri, function (data) {
            refreshBusTimes(data, namespace);
            $page.data(is_loaded, true)
        });
    });
}