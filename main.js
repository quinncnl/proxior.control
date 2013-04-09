var target;

var listshtml = "";
function loadlist() {
    var check=" checked";
    loadtrylist();

    if (listshtml != "") $("#listname").html(listshtml);
    else
	$.ajax({
	    url: "http://"+target+"/getlists",
	    success: function( data ) {
		var list = data.split("\n");
		var first = true;
		for(var i=list.length-2; i>=0; i--) {
		    var name=list[i].split(",")[0];

		    listshtml += '<input type="radio"'+check+' name="radiolist" id="'+name+'" value="'+name+'" /><label for="'+name+'">' + name +'</label>';
		    if (first) {
			first = false;
			check="";
		    }

		}

		$("#urllist").html(listshtml);
		$("#urllist").buttonset();
		$( ":button" ).button();
	    }
	});
}

function loadtrylist() {
    $.ajax({
	url: "http://"+target+"/gettrylist",
	success: function( html ) {
	    $( "#trylist" ).html(html);
	}
    });
}

function loadlog() {
    $.ajax({
	url: "http://"+target+"/getlog",
	success: function( list ) {
	    var arr = list.split('\n');
	    var html = '';
	    for (var i = arr.length -2 ; i > 0; i-=2) {
		html += "<div class='log_detail'>" + arr[i-1] + "</div>";
		html += "<div class='log_url'>" + arr[i] + "</div>";

	    }
	    $( "#log" ).html(html);
	}
    });
}

$(function() {
    target = $.cookie('target');
    if (target == undefined)
	target = "localhost:9999";

    loadlist();
    $( "#tabs" ).tabs({
	activate: function( event, ui ) {
	    switch(ui.newTab.index()) {
	    case 0:
		loadlist();
		
		break;
	    case 1:
		loadlog();
		break;
	    case 2:
		loadversion();
	    }
	}
    });

    $("#target_proxy").val(target);
    $("#iptquery")
	.mouseenter(function() {
	    $("#iptquery").focus();
	})
	.keypress(function(event) {
	    if ( event.which == 13 ) {
		do_find();
	    }
	});

    $("#iptadd")
	.mouseenter(function() {
	    $("#iptadd").focus();
	})
	.keypress(function(event) {
	    if ( event.which == 13 ) {
		do_addrule();
	    }
	});

});

function douptarget() {
    $.cookie('target',  $("#target_proxy").val(), { expires: 7 });
    target = $("#target_proxy").val();
}

function do_del(rule, list) {
    $.ajax({
	type: "POST",
	url: "http://"+target+"/rmrule",
	data: {rule: encodeURIComponent(rule), list: list},
	success: function(rs) {
	    $("#queryres").html('');
	}
    });
}

var version;
function loadversion() {
    if (version == null) {
	$.ajax({
	    type: "GET",
	    url: "http://"+target+"/getversion",
	    success: function(rs) {
		version = rs;
		$("#ver").html(version);
	    }
	});
    }
    else
	$("#ver").html(version);
}

function do_find() {

    $.ajax({
	type: "GET",
	url: "http://"+target+"/query?" + encodeURIComponent($("#iptquery").val()),
	success: function(rs) {
	    var html = "";
	    var rsarr = rs.split("\n");
	    for (var i in rsarr) {
		if (rsarr[i] == "") break;
		var list = rsarr[i].split("|")[0];
		var rule = rsarr[i].split("|")[1];
		html+="<li>"+rule+" in <span class='querylist'>"+list+"</span> <input type='button' value='Delete' onclick=\"do_del('"+rule+"', '"+list+"')\" /></li>";
	    }
	    if (html == "") html = "Not Found";
	    $("#queryres").html(html);
	    $( ":button" ).button();
	}
    });
}

function dormlog() {

    $.ajax({
	type: "POST",
	url: "http://"+target+"/rmlog",
	success: function(rs) {
	    $( "#log" ).html("");
	}
    });
}

function do_addrule() {

    $.ajax({
	type: "POST",
	url: "http://"+target+"/addrule",
	data: {rule: encodeURIComponent($("#iptadd").val()), list: $("[name=radiolist]:checked").val()},
	success: function(rs) {
	    alert(rs);
	}
    });
}

function do_add_trylist() {

    var lines = $("#trylist").val().split("\n");
    for (var i in lines) {
	if (lines[i] == "") continue;

	$.ajax({
	    type: "POST",
	    url: "http://"+target+"/addrule",
	    data: {rule: encodeURIComponent(lines[i]), list: $("[name=radiolist]:checked").val()},
	    success: function(rs) {

	    }
	});

    }

       
}

function do_purge_trylist() {

  
	$.ajax({
	    type: "POST",
	    url: "http://"+target+"/purgetrylist",
	    success: function(rs) {
		alert(rs);
	    }
	});

}

function do_flush() {
    $.ajax({
	type: "POST",
	url: "http://"+target+"/flush",
	success: function(rs) {

	}
    });
}

