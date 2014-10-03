$(document).ready(function(){
																											
$("div.sched:visible").addClass("item-expanded");
$("div.sched").hide();
$("div.item-expanded").show();
																											
$("a.toggle-all").click(function () {
var thisState = $(this).text();
if(thisState == "Collapse All")
{
$("div.pdetails").hide();
$("a.toggle-all").text("Expand All");
$("a.toggle-section").text("Expand Section");
$("img.item-reveal").attr('src', '/img/icon_reveal_default.png');
$("a.toggle-section").removeClass("toggle-expanded");
$("a.toggle-section").addClass("toggle-collapsed");
}
else
{
$("div.pdetails").show();
$("a.toggle-all").text("Collapse All");
$("a.toggle-section").text("Collapse Section");
$("img.item-reveal").attr('src', '/img/icon_reveal_revealing.png');
$("a.toggle-section").removeClass("toggle-collapsed");
$("a.toggle-section").addClass("toggle-expanded");
}
});
var countSection = 0;
var countExpanded = 0;
var countCollapsed = 0;
$("a.toggle-section").click(function () {
var thisState = $(this).text();
var thisID = $(this).attr("id");
var thisItem = "div."+$(this).attr("id");
var thisImg = "img."+$(this).attr("id");
countSection = $("a.toggle-section").size();
if(thisState == "Collapse Section")
{
$(thisItem).hide();
$(this).text("Expand Section");
$(thisImg).attr('src', '/img/icon_reveal_default.png');
$(this).removeClass("toggle-expanded");
$(this).addClass("toggle-collapsed");
countCollapsed = $("a.toggle-collapsed").size();
countExpanded = $("a.toggle-expanded").size();
if(countExpanded < 1) {$("a.toggle-all").text("Expand All");}
}
else
{
$(thisItem).show();
$(this).text("Collapse Section");
$(thisImg).attr('src', '/img/icon_reveal_revealing.png');
$(this).removeClass("toggle-collapsed");
$(this).addClass("toggle-expanded");
countCollapsed = $("a.toggle-collapsed").size();
countExpanded = $("a.toggle-expanded").size();
if(countCollapsed < 1) {$("a.toggle-all").text("Collapse All");}
}
});
});

var abclocation = window.location.href.indexOf("abc.net.au/australianetwork");
if (abclocation != -1) {
	var newurl = window.location.href.replace("abc.net.au/australianetwork", "australianetwork.com");
	window.location.href = newurl;
};
var wwwlocation = window.location.href.indexOf("www.australianetwork");
if (wwwlocation != -1 ) {
	var newurl = window.location.href.replace("www.", "");
	window.location.href = newurl;
};

var schedule_list = new Array("#F1B741","#FFFFFF");

function myrollover(aa,bb) {aa.parentNode.style.backgroundColor = bb[0];}
function myrollout(aa,bb) {aa.parentNode.style.backgroundColor = bb[1];}
function myonclick(aa,bb) {
	if (aa.childNodes[1].style.display != "block") {
		aa.childNodes[1].style.display = "block";
		aa.parentNode.style.background = "url(http://australianetwork.com/img/icon_reveal_revealing.png) 0px 3px no-repeat";
	} else {
		aa.childNodes[1].style.display = "none";
		aa.parentNode.style.background = "url(http://australianetwork.com/img/icon_reveal_default.png) 0px 3px no-repeat";
	};
}

function cookieLocationFromFlash(xx) {
	FlashCookieSet(xx);
}

function FlashCookieTest() {
	var strlocation = document.cookie.indexOf("LOCATION");
	if (strlocation == -1) {	
		var the_cookie = "abcapLOCATION=evenhongkong;path=/;expires=";
		var the_date = new Date("December 31, 2023");
   		var the_cookie_date = the_date.toGMTString();
		the_cookie = the_cookie + the_cookie_date; + ";"
   		document.cookie = the_cookie;
	};
		var info = document.cookie.substring(strlocation +13, strlocation +21);
		return info;
}

function FlashCookieSet(xx) {
	var strlocation = document.cookie.indexOf("LOCATION");
	if (strlocation != -1) {
		var cookviewperiod = document.cookie.substring(strlocation +9, strlocation +13);
    	var the_cookie = "abcapLOCATION=";
		the_cookie = the_cookie + cookviewperiod + xx;
		the_cookie = the_cookie + ";path=/;expires=";
		var the_date = new Date("December 31, 2023");
		var the_cookie_date = the_date.toGMTString();
		the_cookie = the_cookie + the_cookie_date; + ";";
		document.cookie = the_cookie;
	};
}

function SCHEDULECookieTest() {
	var strlocation = document.cookie.indexOf("LOCATION");
	if (strlocation == -1) {
		var the_cookie = "abcapLOCATION=evenhongkong;path=/;expires=";
		var the_date = new Date("December 31, 2023");
   		var the_cookie_date = the_date.toGMTString();
		the_cookie = the_cookie + the_cookie_date; + ";"
   		document.cookie = the_cookie;
	}
}

function LOCATIONCookieSet(xx, yy) {
	var strlocation = document.cookie.indexOf("LOCATION");
	if (strlocation != -1) {
    	var the_cookie = "abcapLOCATION=";
		the_cookie = the_cookie + "even" + xx;
		the_cookie = the_cookie + ";path=/;expires=";
		var the_date = new Date("December 31, 2023");
		var the_cookie_date = the_date.toGMTString();
		the_cookie = the_cookie + the_cookie_date; + ";";
		document.cookie = the_cookie;
		if (yy == "whentowatch") {window.location.reload();}
		if (yy == "schedule") {
			var datelocation = window.location.href.indexOf("guide/") + 6;
			var datenumber = window.location.href.substring(datelocation, datelocation+8);
			window.location.href = datenumber + "_" + xx + ".htm"
		}
	} else {
		alert ('Cookies must be turned on to support the Location Preference.  For more information about Cookies visit http://australianetwork.com/legals/legals.htm')
	};
}

function WHENTOWATCH() {
	document.getElementById("change_location").style.display = "block";
	var strlocation = document.cookie.indexOf("LOCATION");
	if (strlocation == -1) { SCHEDULECookieTest(); };
	var strlocation = document.cookie.indexOf("LOCATION");
	if (strlocation != -1) {
		var info = document.cookie.substring(strlocation +13,  strlocation +21);
		if (info != "hongkong") {
				document.getElementById("hongkong").style.display = "none";	
				document.getElementById(info).style.display = "block";		
		}
		for (var i = 0; i < document.location_list.location_selector.length; i++) {
			if (document.location_list.location_selector.options[i].value == info) { document.location_list.location_selector.options[i].selected = true; };
		};
	} else { };
}

function SCHEDULE() {
	document.getElementById("change_location").style.display = "block";
	var strlocation = document.cookie.indexOf("LOCATION");
	if (strlocation == -1) { SCHEDULECookieTest(); };
	var strlocation = document.cookie.indexOf("LOCATION");
	if (strlocation != -1) {
		var info = document.cookie.substring(strlocation +13,  strlocation +21);
		for (var i = 0; i < document.location_list.location_selector.length; i++) {
			if (document.location_list.location_selector.options[i].value == info) { document.location_list.location_selector.options[i].selected = true; };
		};
	} else { };
}

function MENULINK() {
	var strlocation = document.cookie.indexOf("LOCATION");
	if (strlocation == -1) { SCHEDULECookieTest(); };
	var strlocation = document.cookie.indexOf("LOCATION");
	if (strlocation != -1) {
		var info = document.cookie.substring(strlocation +13,  strlocation +21);
		window.location.href = "http://australianetwork.com/guide/schedule_" + info + ".htm";
	} else { window.location.href = "http://australianetwork.com/guide/schedule_hongkong.htm" };
}

function CALENDARLINK(aa) {
	var strlocation = document.cookie.indexOf("LOCATION");
	if (strlocation == -1) { LOCATIONCookieTest(); };
	var strlocation = document.cookie.indexOf("LOCATION");
	if (strlocation != -1) {
		var info = document.cookie.substring(strlocation +13,  strlocation +21);
		window.location.href = aa + "_" + info + ".htm"
	} else { window.location.href = aa + "_hongkong.htm"; };
}

AN_Rotator = function (target_div, content_array, current_position) {
	this.target_div 				= document.getElementById(target_div);
	this.content_array 		= content_array;
	this.current_position 	= parseInt(current_position);
	this.looplimit 				= content_array.length -1;
}

AN_Rotator.prototype.rotate = function () {
	temp_string = '<div class="promo_shell">';
	if (this.content_array[this.current_position][0] != ''){
		temp_string += '<div class="promo_head"><a href="' + this.content_array[this.current_position][1] + '">' + this.content_array[this.current_position][0] + '</a></div>';
	};
	temp_string += '<div class="promo_inner">';
	if (this.content_array[this.current_position][4] != ''){
		temp_string += '<div class="promo_image"><a href="' + this.content_array[this.current_position][3] + '"><img src="' + this.content_array[this.current_position][4] + '" border="0" alt="' + this.content_array[this.current_position][2] + '" title="' + this.content_array[this.current_position][2] + '"/></a></div>';
	};
	if (this.content_array[this.current_position][2] != ''){
	temp_string += '<div class="promo_title"><a href="' + this.content_array[this.current_position][3] + '">' + this.content_array[this.current_position][2] + '</a></div>';
	};
	if (this.content_array[this.current_position][5] != ''){
		temp_string += '<div class="promo_copybox">' + this.content_array[this.current_position][5] + '</div>';
	};
	temp_string += '<div class="clearboth"> </div></div></div>';
	this.target_div.innerHTML = temp_string;
	if (this.current_position < this.looplimit) {this.current_position = this.current_position +1;} else {this.current_position = 1;}
}


function openPopUp(xx,yy) {
	popupWin = window.open(xx, yy, 'width=520,height=380,left=50,top=50,scrollbars=no');
	popupWin.focus();
}

function openDynamicPopUp(v_url, v_title, v_height, v_width) {
	popupWin = window.open(v_url, v_title, 'width=' + v_width + ',height=' + v_height + ',left=50,top=50,scrollbars=no');
	popupWin.focus();
}

<!-- START OF SDC Cookie Code -->
<!-- Copyright (c) 1996-2005 WebTrends Inc.  All rights reserved. -->
<!-- $DateTime: 2006/03/08 11:31:03 $ -->
function DcsInit(){
	this.dcsid="dcs5lxb6900000ggvbs0j3tl5_7k7m";
	this.domain="statse.webtrendslive.com";
	this.enabled=true;
	this.exre=(function(){
		if (window.RegExp){
			return(new RegExp("dcs(uri)|(ref)|(aut)|(met)|(sta)|(sip)|(pro)|(byt)|(dat)|(p3p)|(cfg)|(redirect)|(cip)","i"));
		}
		else{
			return("");
		}
	})();
	this.fpc="WT_FPC";
	this.fpcdom="";
	this.i18n=false;
	this.images=[];
	this.index=0;
	this.qp=[];
	this.re=(function(){
		if (window.RegExp){
			return(this.i18n?{"%25":/\%/g}:{"%09":/\t/g,"%20":/ /g,"%23":/\#/g,"%26":/\&/g,"%2B":/\+/g,"%3F":/\?/g,"%5C":/\\/g,"%22":/\"/g,"%7F":/\x7F/g,"%A0":/\xA0/g});
		}
		else{
			return("");
		}
	})();
	this.timezone=10;
	this.trackevents=true;
	var t=this;
    (function(){
        if (t.enabled&&(document.cookie.indexOf(t.fpc+"=")==-1)&&(document.cookie.indexOf("WTLOPTOUT=")==-1)){
            document.write("<scr"+"ipt type='text/javascript' src='"+"http"+(window.location.protocol.indexOf('https:')==0?'s':'')+"://"+t.domain+"/"+t.dcsid+"/wtid.js"+"'><\/scr"+"ipt>");
        }
	})();
}
var DCS={};
var WT={};
var DCSext={};
var dcsInit=new DcsInit();

<!-- START OF SDC Advanced Tracking Code -->
<!-- Copyright (c) 1996-2005 WebTrends Inc.  All rights reserved. -->
<!-- $DateTime: 2006/03/08 11:31:03 $ -->
function dcsCookie(){
	if (typeof(dcsOther)=="function"){
		dcsOther();
	}
	else if (typeof(dcsFPC)=="function"){
		dcsFPC(dcsInit.timezone);
	}
}
function dcsGetCookie(name){
	var cookies=document.cookie.split("; ");
	var cmatch=[];
	var idx=0;
	var i=0;
	var namelen=name.length;
	var clen=cookies.length;
	for (i=0;i<clen;i++){
		var c=cookies[i];
		if ((c.substring(0,namelen+1))==(name+"=")){
			cmatch[idx++]=c;
		}
	}
	var cmatchCount=cmatch.length;
	if (cmatchCount>0){
		idx=0;
		if ((cmatchCount>1)&&(name==dcsInit.fpc)){
			var dLatest=new Date(0);
			for (i=0;i<cmatchCount;i++){
				var lv=parseInt(dcsGetCrumb(cmatch[i],"lv"));
				var dLst=new Date(lv);
				if (dLst>dLatest){
					dLatest.setTime(dLst.getTime());
					idx=i;
				}
			}
		}
		return unescape(cmatch[idx].substring(namelen+1));
	}
	else{
		return null;
	}
}
function dcsGetCrumb(cval,crumb){
	var aCookie=cval.split(":");
	for (var i=0;i<aCookie.length;i++){
		var aCrumb=aCookie[i].split("=");
		if (crumb==aCrumb[0]){
			return aCrumb[1];
		}
	}
	return null;
}
function dcsGetIdCrumb(cval,crumb){
	var id=cval.substring(0,cval.indexOf(":lv="));
	var aCrumb=id.split("=");
	for (var i=0;i<aCrumb.length;i++){
		if (crumb==aCrumb[0]){
			return aCrumb[1];
		}
	}
	return null;
}
function dcsFPC(offset){
	if (typeof(offset)=="undefined"){
		return;
	}
	if (document.cookie.indexOf("WTLOPTOUT=")!=-1){
		return;
	}
	var name=dcsInit.fpc;
	var dCur=new Date();
	var adj=(dCur.getTimezoneOffset()*60000)+(offset*3600000);
	dCur.setTime(dCur.getTime()+adj);
	var dExp=new Date(dCur.getTime()+315360000000);
	var dSes=new Date(dCur.getTime());
	WT.co_f=WT.vt_sid=WT.vt_f=WT.vt_f_a=WT.vt_f_s=WT.vt_f_d=WT.vt_f_tlh=WT.vt_f_tlv="";
	if (document.cookie.indexOf(name+"=")==-1){
		if ((typeof(gWtId)!="undefined")&&(gWtId!="")){
			WT.co_f=gWtId;
		}
		else if ((typeof(gTempWtId)!="undefined")&&(gTempWtId!="")){
			WT.co_f=gTempWtId;
			WT.vt_f="1";
		}
		else{
			WT.co_f="2";
			var cur=dCur.getTime().toString();
			for (var i=2;i<=(32-cur.length);i++){
				WT.co_f+=Math.floor(Math.random()*16.0).toString(16);
			}
			WT.co_f+=cur;
			WT.vt_f="1";
		}
		if (typeof(gWtAccountRollup)=="undefined"){
			WT.vt_f_a="1";
		}
		WT.vt_f_s=WT.vt_f_d="1";
		WT.vt_f_tlh=WT.vt_f_tlv="0";
	}
	else{
		var c=dcsGetCookie(name);
		var id=dcsGetIdCrumb(c,"id");
		var lv=parseInt(dcsGetCrumb(c,"lv"));
		var ss=parseInt(dcsGetCrumb(c,"ss"));
		if ((id==null)||(id=="null")||isNaN(lv)||isNaN(ss)){
			return;
		}
		WT.co_f=id;
		var dLst=new Date(lv);
		WT.vt_f_tlh=Math.floor((dLst.getTime()-adj)/1000);
		dSes.setTime(ss);
		if ((dCur.getTime()>(dLst.getTime()+1800000))||(dCur.getTime()>(dSes.getTime()+28800000))){
			WT.vt_f_tlv=Math.floor((dSes.getTime()-adj)/1000);
			dSes.setTime(dCur.getTime());
			WT.vt_f_s="1";
		}
		if ((dCur.getDay()!=dLst.getDay())||(dCur.getMonth()!=dLst.getMonth())||(dCur.getYear()!=dLst.getYear())){
			WT.vt_f_d="1";
		}
	}
	WT.co_f=escape(WT.co_f);
	WT.vt_sid=WT.co_f+"."+(dSes.getTime()-adj);
	var expiry="; expires="+dExp.toGMTString();
	document.cookie=name+"="+"id="+WT.co_f+":lv="+dCur.getTime().toString()+":ss="+dSes.getTime().toString()+expiry+"; path=/"+(((dcsInit.fpcdom!=""))?("; domain="+dcsInit.fpcdom):(""));
	if (document.cookie.indexOf(name+"=")==-1){
		WT.co_f=WT.vt_sid=WT.vt_f_s=WT.vt_f_d=WT.vt_f_tlh=WT.vt_f_tlv="";
		WT.vt_f=WT.vt_f_a="2";
	}
}
function dcsIsOnsite(host){
	var doms="abc.net.au";
	var aDoms=doms.split(',');
	for (var i=0;i<aDoms.length;i++){
		if (host.indexOf(aDoms[i])!=-1){
			return 1;
		}
	}
	return 0;
}
function dcsTypeMatch(pth, typelist){
	var type=pth.substring(pth.lastIndexOf(".")+1,pth.length);
	var types=typelist.split(",");
	for (var i=0;i<types.length;i++){
		if (type==types[i]){
			return true;
		}
	}
	return false;
}
function dcsEvt(evt,tag){
	var e=evt.target||evt.srcElement;
	while (e.tagName&&(e.tagName!=tag)){
		e=e.parentElement||e.parentNode;
	}
	return e;
}
function dcsNavigation(evt){
	var e=dcsEvt(evt,"DIV");
	var id=e.getAttribute?e.getAttribute("id"):"";
	var cname=e.className||"";
	return id?id:cname;
}
function dcsBind(event,func){
	if ((typeof(window[func])=="function")&&document.body){
		if (document.body.addEventListener){
			document.body.addEventListener(event, window[func], true);
		}
		else if(document.body.attachEvent){
			document.body.attachEvent("on"+event, window[func]);
		}
	}
}
function dcsET(){
	var e=(navigator.appVersion.indexOf("MSIE")!=-1)?"click":"mousedown";
	dcsBind(e,"dcsDownload");
	dcsBind(e,"dcsDynamic");
	dcsBind(e,"dcsFormButton");
	dcsBind(e,"dcsOffsite");
	dcsBind(e,"dcsAnchor");
	dcsBind("contextmenu","dcsRightClick");
	dcsBind(e,"dcsImageMap");
}
function dcsMultiTrack(){
	if (arguments.length%2==0){
		for (var i=0;i<arguments.length;i+=2){
			if (arguments[i].indexOf('WT.')==0){
				WT[arguments[i].substring(3)]=arguments[i+1];
			}
			else if (arguments[i].indexOf('DCS.')==0){
				DCS[arguments[i].substring(4)]=arguments[i+1];
			}
			else if (arguments[i].indexOf('DCSext.')==0){
				DCSext[arguments[i].substring(7)]=arguments[i+1];
			}
		}
		var dCurrent=new Date();
		DCS.dcsdat=dCurrent.getTime();
		dcsFunc("dcsCookie");
		dcsTag();
	}
}

// Add event handlers here

// Code section for Track clicks to download links.
function dcsDownload(evt){
	evt=evt||(window.event||"");
	if (evt&&((typeof(evt.which)!="number")||(evt.which==1))){
		var e=dcsEvt(evt,"A");
		if (e.hostname&&dcsIsOnsite(e.hostname)){
var types="3gp,aac,asf,asx,avi,csv,doc,exe,flv,kml,kmz,m4a,m4v,mov,mp3,mpg,mp4,opml,pdf,ppt,ram,rm,swf,txt,wav,wm,wma,wmv,xls,zip";
			if (dcsTypeMatch(e.pathname,types)){
				var qry=e.search?e.search.substring(e.search.indexOf("?")+1,e.search.length):"";
				var pth=e.pathname?((e.pathname.indexOf("/")!=0)?"/"+e.pathname:e.pathname):"/";
				var ttl="";
				var text=document.all?e.innerText:e.text;
				var img=dcsEvt(evt,"IMG");
				if (img.alt){
					ttl=img.alt;
				}
				else if (text){
					ttl=text;
				}
				else if (e.innerHTML){
					ttl=e.innerHTML;
				}
				dcsMultiTrack("DCS.dcssip",e.hostname,"DCS.dcsuri",pth,"DCS.dcsqry",e.search||"","WT.ti","Download:"+ttl,"WT.dl","20","WT.nv",dcsNavigation(evt));
				DCS.dcssip=DCS.dcsuri=DCS.dcsqry=WT.ti=WT.dl=WT.nv="";
			}
		}
	}
}
// Code section for Track right clicks to download links.
function dcsRightClick(evt){
	evt=evt||(window.event||"");
	if (evt){
		var btn=evt.which||evt.button;
		if ((btn!=1)||(navigator.userAgent.indexOf("Safari")!=-1)){
			var e=evt.target||evt.srcElement;
			if ((typeof(e.href)!="undefined")&&e.href){
				if ((typeof(e.protocol)!="undefined")&&e.protocol&&(e.protocol.indexOf("http")!=-1)){
var types="3gp,aac,asf,asx,avi,csv,doc,exe,flv,kml,kmz,m4a,m4v,mov,mp3,mpg,mp4,opml,pdf,ppt,ram,rm,swf,txt,wav,wm,wma,wmv,xls,zip";
					if ((typeof(e.pathname)!="undefined")&&dcsTypeMatch(e.pathname,types)){
						var pth=e.pathname?((e.pathname.indexOf("/")!=0)?"/"+e.pathname:e.pathname):"/";
						dcsMultiTrack("DCS.dcssip",e.hostname,"DCS.dcsuri",pth,"DCS.dcsqry","","WT.ti","RightClick:"+pth,"WT.dl","25","WT.nv",dcsNavigation(evt));
						DCS.dcssip=DCS.dcsuri=WT.ti=WT.dl=WT.nv="";
					}
				}
			}
		}
	}
}
// Code section for Track clicks to links leading offsite.
function dcsOffsite(evt){
	evt=evt||(window.event||"");
	if (evt&&((typeof(evt.which)!="number")||(evt.which==1))){
		var e=dcsEvt(evt,"A");
		if (e.hostname&&!dcsIsOnsite(e.hostname)){
			var qry=e.search?e.search.substring(e.search.indexOf("?")+1,e.search.length):"";
			var pth=e.pathname?((e.pathname.indexOf("/")!=0)?"/"+e.pathname:e.pathname):"/";
			var trim=true;
			dcsMultiTrack("DCS.dcssip",e.hostname,"DCS.dcsuri",pth,"DCS.dcsqry",trim?"":qry,"WT.ti","Offsite:"+e.hostname+pth+qry,"WT.dl","24","WT.nv",dcsNavigation(evt));
			DCS.dcssip=DCS.dcsuri=DCS.dcsqry=WT.ti=WT.dl=WT.nv="";
		}
	}
}
function dcsAdv(){
	if (dcsInit.trackevents){
		dcsFunc("dcsET");
	}
	dcsFunc("dcsCookie");
	dcsFunc("dcsAdSearch");
	dcsFunc("dcsTP");
	dcsFunc("dcsMetaCap");
}

// Add customizations here

function dcsVar(){
	var dCurrent=new Date();
	WT.tz=dCurrent.getTimezoneOffset()/60*-1;
	if (WT.tz==0){
		WT.tz="0";
	}
	WT.bh=dCurrent.getHours();
	WT.ul=navigator.appName=="Netscape"?navigator.language:navigator.userLanguage;
	if (typeof(screen)=="object"){
		WT.cd=navigator.appName=="Netscape"?screen.pixelDepth:screen.colorDepth;
		WT.sr=screen.width+"x"+screen.height;
	}
	if (typeof(navigator.javaEnabled())=="boolean"){
		WT.jo=navigator.javaEnabled()?"Yes":"No";
	}
	if (document.title){
		WT.ti=document.title;
	}
	WT.js="Yes";
	WT.jv=dcsJV();
	if (document.body&&document.body.addBehavior){
		document.body.addBehavior("#default#clientCaps");
		WT.ct=document.body.connectionType||"unknown";
		document.body.addBehavior("#default#homePage");
		WT.hp=document.body.isHomePage(location.href)?"1":"0";
	}
	else{
		WT.ct="unknown";
	}
	if (parseInt(navigator.appVersion)>3){
		if ((navigator.appName=="Microsoft Internet Explorer")&&document.body){
			WT.bs=document.body.offsetWidth+"x"+document.body.offsetHeight;
		}
		else if (navigator.appName=="Netscape"){
			WT.bs=window.innerWidth+"x"+window.innerHeight;
		}
	}
	WT.fi="No";
	if (window.ActiveXObject){
		for(var i=10;i>0;i--){
			try{
				var flash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash."+i);
				WT.fi="Yes";
				WT.fv=i+".0";
				break;
			}
			catch(e){
			}
		}
	}
	else if (navigator.plugins&&navigator.plugins.length){
		for (var i=0;i<navigator.plugins.length;i++){
			if (navigator.plugins[i].name.indexOf('Shockwave Flash')!=-1){
				WT.fi="Yes";
				WT.fv=navigator.plugins[i].description.split(" ")[2];
				break;
			}
		}
	}
	if (dcsInit.i18n){
		WT.em=(typeof(encodeURIComponent)=="function")?"uri":"esc";
		if (typeof(document.defaultCharset)=="string"){
			WT.le=document.defaultCharset;
		} 
		else if (typeof(document.characterSet)=="string"){
			WT.le=document.characterSet;
		}
	}
	WT.tv="1.0.7";
//	WT.sp="@@SPLITVALUE@@";
	WT.dl=0;
	DCS.dcsdat=dCurrent.getTime();
	DCS.dcssip=window.location.hostname;
	DCS.dcsuri=window.location.pathname;
	WT.es=DCS.dcssip+DCS.dcsuri;
	if (window.location.search){
		DCS.dcsqry=window.location.search;
		if (dcsInit.qp.length>0){
			for (var i=0;i<dcsInit.qp.length;i++){
				var pos=DCS.dcsqry.indexOf(dcsInit.qp[i]);
				if (pos!=-1){
					var front=DCS.dcsqry.substring(0,pos);
					var end=DCS.dcsqry.substring(pos+dcsInit.qp[i].length,DCS.dcsqry.length);
					DCS.dcsqry=front+end;
				}
			}
		}
	}
	if ((window.document.referrer!="")&&(window.document.referrer!="-")){
		if (!(navigator.appName=="Microsoft Internet Explorer"&&parseInt(navigator.appVersion)<4)){
			DCS.dcsref=window.document.referrer;
		}
	}
}
function dcsA(N,V){
	if (dcsInit.i18n&&(dcsInit.exre!="")&&!dcsInit.exre.test(N)){
		if (N=="dcsqry"){
			var newV="";
			var params=V.substring(1).split("&");
			for (var i=0;i<params.length;i++){
				var pair=params[i];
				var pos=pair.indexOf("=");
				if (pos!=-1){
					var key=pair.substring(0,pos);
					var val=pair.substring(pos+1);
					if (i!=0){
						newV+="&";
					}
					newV+=key+"="+dcsEncode(val);
				}
			}
			V=V.substring(0,1)+newV;
		}
		else{
			V=dcsEncode(V);
		}
	}
	return "&"+N+"="+dcsEscape(V, dcsInit.re);
}
function dcsEscape(S, REL){
	if (REL!=""){
		var retStr = new String(S);
		for (var R in REL){
			retStr = retStr.replace(REL[R],R);
		}
		return retStr;
	}
	else{
		return escape(S);
	}
}
function dcsEncode(S){
	return (typeof(encodeURIComponent)=="function")?encodeURIComponent(S):escape(S);
}
function dcsCreateImage(dcsSrc){
	if (document.images){
		dcsInit.images[dcsInit.index]=new Image;
		dcsInit.images[dcsInit.index].src=dcsSrc;
		dcsInit.index++;
	}
	else{
		document.write('<IMG ALT="" BORDER="0" NAME="DCSIMG" WIDTH="1" HEIGHT="1" SRC="'+dcsSrc+'">');
	}
}
function dcsMeta(){
	var elems;
	if (document.all){
		elems=document.all.tags("meta");
	}
	else if (document.documentElement){
		elems=document.getElementsByTagName("meta");
	}
	if (typeof(elems)!="undefined"){
		var length=elems.length;
		for (var i=0;i<length;i++){
			var name=elems.item(i).name;
			var content=elems.item(i).content;
			var equiv=elems.item(i).httpEquiv;
			if (name.length>0){
				if (name.indexOf("WT.")==0){
					WT[name.substring(3)]=content;
				}
				else if (name.indexOf("DCSext.")==0){
					DCSext[name.substring(7)]=content;
				}
				else if (name.indexOf("DCS.")==0){
					DCS[name.substring(4)]=content;
				}
			}
			else if (dcsInit.i18n&&(equiv=="Content-Type")){
				var pos=content.toLowerCase().indexOf("charset=");
				if (pos!=-1){
					WT.mle=content.substring(pos+8);
				}
			}
		}
	}
}
function dcsTag(){
	if (document.cookie.indexOf("WTLOPTOUT=")!=-1){
		return;
	}
	var P="http"+(window.location.protocol.indexOf('https:')==0?'s':'')+"://"+dcsInit.domain+(dcsInit.dcsid==""?'':'/'+dcsInit.dcsid)+"/dcs.gif?";
	for (var N in DCS){
		if (DCS[N]){
			P+=dcsA(N,DCS[N]);
		}
	}
	var keys=["co_f","vt_sid","vt_f_tlv"];
	for (var i=0;i<keys.length;i++){
		var key=keys[i];
		if (WT[key]){
			P+=dcsA("WT."+key,WT[key]);
			delete WT[key];
		}
	}
	for (N in WT){
		if (WT[N]){
			P+=dcsA("WT."+N,WT[N]);
		}
	}
	for (N in DCSext){
		if (DCSext[N]){
			P+=dcsA(N,DCSext[N]);
		}
	}
	if (P.length>2048&&navigator.userAgent.indexOf('MSIE')>=0){
		P=P.substring(0,2040)+"&WT.tu=1";
	}
	dcsCreateImage(P);
	WT.ad="";
}
function dcsJV(){
	var agt=navigator.userAgent.toLowerCase();
	var major=parseInt(navigator.appVersion);
	var mac=(agt.indexOf("mac")!=-1);
	var ff=(agt.indexOf("firefox")!=-1);
	var ff0=(agt.indexOf("firefox/0.")!=-1);
	var ff10=(agt.indexOf("firefox/1.0")!=-1);
	var ff15=(agt.indexOf("firefox/1.5")!=-1);
	var ff2up=(ff&&!ff0&&!ff10&!ff15);
	var nn=(!ff&&(agt.indexOf("mozilla")!=-1)&&(agt.indexOf("compatible")==-1));
	var nn4=(nn&&(major==4));
	var nn6up=(nn&&(major>=5));
	var ie=((agt.indexOf("msie")!=-1)&&(agt.indexOf("opera")==-1));
	var ie4=(ie&&(major==4)&&(agt.indexOf("msie 4")!=-1));
	var ie5up=(ie&&!ie4);
	var op=(agt.indexOf("opera")!=-1);
	var op5=(agt.indexOf("opera 5")!=-1||agt.indexOf("opera/5")!=-1);
	var op6=(agt.indexOf("opera 6")!=-1||agt.indexOf("opera/6")!=-1);
	var op7up=(op&&!op5&&!op6);
	var jv="1.1";
	if (ff2up){
		jv="1.7";
	}
	else if (ff15){
		jv="1.6";
	}
	else if (ff0||ff10||nn6up||op7up){
		jv="1.5";
	}
	else if ((mac&&ie5up)||op6){
		jv="1.4";
	}
	else if (ie5up||nn4||op5){
		jv="1.3";
	}
	else if (ie4){
		jv="1.2";
	}
	return jv;
}
function dcsFunc(func){
	if (typeof(window[func])=="function"){
		window[func]();
	}
}

if (dcsInit.enabled){
    dcsVar();
    dcsMeta();
    dcsFunc("dcsAdv");
    dcsTag();
}