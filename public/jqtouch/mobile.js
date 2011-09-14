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
  // Add custom handler code here.
  $("#to").bind("pageAnimationEnd", function (e, info) {

    if (info.direction === "out") {
      return;
    }
    var $page = $(this);
    if ($page.data("to-loaded")) {
      return;
    }

    $.getJSON("/to.json", function (data) {
		refreshBusTimes(data, "to");
		$page.data("to-loaded", true)
    });
  });

  $("#from").bind("pageAnimationEnd", function (e, info) {
    if (info.direction === "out") {
      return;
    }
    var $page = $(this);
    if ($page.data("from-loaded")) {
      return;
    }

    $.getJSON("/from.json", function (data) {
      refreshBusTimes(data, "from");
	  $page.data("from-loaded", true)
    });
  });

function refreshBusTimes(data, namespace) {
	var li_name = "#" + namespace + " ul:first li:first";
	var $li =  $(li_name);
    jQuery.each(data, function () {
      var $clone = $li.clone();
      $clone.html(this.times.join(", ") + "<small>" + this.bus_number + "</small>");
      $li.parent().append($clone);
    });
	$li.remove()
}

});

