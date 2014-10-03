/*
 * mediaEventInspector Plugin for jQuery JavaScript Library
 * http://www.happyworm.com/jquery/jplayer
 *
 * Copyright (c) 2009 - 2010 Happyworm Ltd
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * Author: Mark J Panaghiston
 * Version: 1.0.0
 * Date: 11th November 2010
 *
 * Note: Declare inspector instances after mediaElement instances. ie., Otherwise the mediaElement instance is nonsense.
 */

(function($, undefined) {
	$.mediaEventInspector = {};
	$.mediaEventInspector.i = 0;
	$.mediaEventInspector.defaults = {
		mediaElement: undefined, // The DOM node of the mediaElement instance to inspect.
		idPrefix: "media_event_inspector_",
		visible: true,
		eventRefresh: true
	};
	$.mediaEventInspector.event = {

		// Events match HTML5 spec.
		// http://www.whatwg.org/specs/web-apps/current-work/multipage/video.html#mediaevents
		
		loadstart: "loadstart",
		progress: "progress",
		suspend: "suspend",
		abort: "abort",
		error: "error",
		emptied: "emptied",
		stalled: "stalled",
		
		play: "play",
		pause: "pause",
		
		loadedmetadata: "loadedmetadata",
		loadeddata: "loadeddata",
		waiting: "waiting",
		playing: "playing",
		canplay: "canplay",
		canplaythrough: "canplaythrough",
		
		seeking: "seeking",
		seeked: "seeked",
		timeupdate: "timeupdate",
		ended: "ended",
		
		ratechange: "ratechange",
		durationchange: "durationchange",
		volumechange: "volumechange"
	};
	
	var methods = {
		init: function(options) {
			var self = this;
			var $this = $(this);
			
			var config = $.extend({}, $.mediaEventInspector.defaults, options);
			$(this).data("mediaEventInspector", config);

			config.id = $(this).attr("id");
			config.mediaElementJq = $(config.mediaElement);
			config.mediaElementId = config.mediaElementJq.attr("id");

			config.controlId = config.idPrefix + "control_" + $.mediaEventInspector.i;
			config.loadId = config.idPrefix + "load_" + $.mediaEventInspector.i;
			config.playId = config.idPrefix + "play_" + $.mediaEventInspector.i;
			config.pauseId = config.idPrefix + "pause_" + $.mediaEventInspector.i;
			config.currentTimeId = config.idPrefix + "currentTime_" + $.mediaEventInspector.i;
			config.currentTimeValueId = config.idPrefix + "currentTimeValue_" + $.mediaEventInspector.i;

			config.windowId = config.idPrefix + "window_" + $.mediaEventInspector.i;
			config.statusId = config.idPrefix + "status_" + $.mediaEventInspector.i;
			config.toggleId = config.idPrefix + "toggle_" + $.mediaEventInspector.i;
			config.eventResetId = config.idPrefix + "event_reset_" + $.mediaEventInspector.i;
			config.eventRefreshId = config.idPrefix + "event_refresh_" + $.mediaEventInspector.i;
			config.updateId = config.idPrefix + "update_" + $.mediaEventInspector.i;
			config.eventWindowId = config.idPrefix + "event_window_" + $.mediaEventInspector.i;
			
			config.eventId = {};
			config.eventJq = {};
			config.eventTimeout = {};
			config.eventOccurrence = {};
			
			$.each($.mediaEventInspector.event, function(eventName,eventType) {
				config.eventId[eventType] = config.idPrefix + "event_" + eventType + "_" + $.mediaEventInspector.i;
				config.eventOccurrence[eventType] = 0;
			});
			
			var controlStyle = "float:left;margin:0 5px 5px 0;padding:0 5px;border:1px dotted #000;";
			var structure = 
				'<div id="' + config.controlId + '" style="margin-top:10px;">'
					// + '<div style="' + controlStyle + '"><a href="#" id="' + config.loadId + '">load()</a></div>'
					+ '<div style="' + controlStyle + '"><a href="#" id="' + config.playId + '">play()</a></div>'
					+ '<div style="' + controlStyle + '"><a href="#" id="' + config.pauseId + '">pause()</a></div>'
					+ '<div style="' + controlStyle + '"><a href="#" id="' + config.currentTimeId + '">currentTime</a> = <input type="text" id="' + config.currentTimeValueId + '" style="width:3em;" value="15"/>s</div>'
					+ '<div style="clear:both"></div>'
				+ '</div>'
				+ '<p style="margin-top:0;margin-bottom:5px;"><a href="#" id="' + config.toggleId + '">' + (config.visible ? "Hide" : "Show") + '</a> Media Event Inspector for id <strong>' + config.mediaElementId + '</strong></p>' 
				+ '<div id="' + config.windowId + '">'
					+ '<div id="' + config.eventWindowId + '" style="padding:5px 5px 0 5px;background-color:#eee;border:1px dotted #000;">'
						+ '<p style="margin:0 0 10px 0;"><strong>Media Element events that have occurred over the past 1 second:</strong>'
						+ '<br />(Backgrounds: <span style="padding:0 5px;background-color:#eee;border:1px dotted #000;">Never occurred</span> <span style="padding:0 5px;background-color:#fff;border:1px dotted #000;">Occurred before</span> <span style="padding:0 5px;background-color:#9f9;border:1px dotted #000;">Occurred</span> <span style="padding:0 5px;background-color:#ff9;border:1px dotted #000;">Multiple occurrences</span> <a href="#" id="' + config.eventResetId + '">reset</a>)</p>';
			
			var eventStyle = "float:left;margin:0 5px 5px 0;padding:0 5px;border:1px dotted #000;";
			structure +=
						'<div id="' + config.eventId[$.mediaEventInspector.event.loadstart] + '" style="clear:left;' + eventStyle + '"></div>'
						+ '<div id="' + config.eventId[$.mediaEventInspector.event.progress] + '" style="' + eventStyle + '"></div>'
						+ '<div id="' + config.eventId[$.mediaEventInspector.event.suspend] + '" style="' + eventStyle + '"></div>'
						+ '<div id="' + config.eventId[$.mediaEventInspector.event.abort] + '" style="' + eventStyle + '"></div>'
						+ '<div id="' + config.eventId[$.mediaEventInspector.event.error] + '" style="' + eventStyle + '"></div>'
						+ '<div id="' + config.eventId[$.mediaEventInspector.event.emptied] + '" style="' + eventStyle + '"></div>'
						+ '<div id="' + config.eventId[$.mediaEventInspector.event.stalled] + '" style="' + eventStyle + '"></div>'

						+ '<div id="' + config.eventId[$.mediaEventInspector.event.play] + '" style="clear:left;' + eventStyle + '"></div>'
						+ '<div id="' + config.eventId[$.mediaEventInspector.event.pause] + '" style="' + eventStyle + '"></div>'
						+ '<div id="' + config.eventId[$.mediaEventInspector.event.waiting] + '" style="' + eventStyle + '"></div>'
						+ '<div id="' + config.eventId[$.mediaEventInspector.event.playing] + '" style="' + eventStyle + '"></div>'

						+ '<div id="' + config.eventId[$.mediaEventInspector.event.loadeddata] + '" style="clear:left;' + eventStyle + '"></div>'
						+ '<div id="' + config.eventId[$.mediaEventInspector.event.loadedmetadata] + '" style="' + eventStyle + '"></div>'
						+ '<div id="' + config.eventId[$.mediaEventInspector.event.canplay] + '" style="' + eventStyle + '"></div>'
						+ '<div id="' + config.eventId[$.mediaEventInspector.event.canplaythrough] + '" style="' + eventStyle + '"></div>'

						+ '<div id="' + config.eventId[$.mediaEventInspector.event.seeking] + '" style="clear:left;' + eventStyle + '"></div>'
						+ '<div id="' + config.eventId[$.mediaEventInspector.event.seeked] + '" style="' + eventStyle + '"></div>'
						+ '<div id="' + config.eventId[$.mediaEventInspector.event.timeupdate] + '" style="' + eventStyle + '"></div>'
						+ '<div id="' + config.eventId[$.mediaEventInspector.event.ended] + '" style="' + eventStyle + '"></div>'

						+ '<div id="' + config.eventId[$.mediaEventInspector.event.ratechange] + '" style="clear:left;' + eventStyle + '"></div>'
						+ '<div id="' + config.eventId[$.mediaEventInspector.event.durationchange] + '" style="' + eventStyle + '"></div>'
						+ '<div id="' + config.eventId[$.mediaEventInspector.event.volumechange] + '" style="' + eventStyle + '"></div>'

						+ '<div style="clear:both"></div>';

			structure +=
					'</div>'
					+ '<p>The HTML Media Element object properties: (<a href="#" id="' + config.eventRefreshId + '">' + (config.eventRefresh ? "Disable" : "Enable") + '</a> property refresh on event or click <a href="#" id="' + config.updateId + '">Update</a>.)</p>'
					+ '<div id="' + config.statusId + '"></div>'
				+ '</div>';
			$(this).html(structure);

			config.controlJq = $("#" + config.controlId);
			config.loadJq = $("#" + config.loadId);
			config.playJq = $("#" + config.playId);
			config.pauseJq = $("#" + config.pauseId);
			config.currentTimeJq = $("#" + config.currentTimeId);
			config.currentTimeValueJq = $("#" + config.currentTimeValueId);
			
			config.windowJq = $("#" + config.windowId);
			config.statusJq = $("#" + config.statusId);
			config.toggleJq = $("#" + config.toggleId);
			config.eventResetJq = $("#" + config.eventResetId);
			config.eventRefreshJq = $("#" + config.eventRefreshId);
			config.updateJq = $("#" + config.updateId);

			// This each loop sets up all the event listeners and pretty much does all the Event related feedback.
			$.each($.mediaEventInspector.event, function(eventName,eventType) {
				config.eventJq[eventType] = $("#" + config.eventId[eventType]);
				config.eventJq[eventType].text(eventType + " (" + config.eventOccurrence[eventType] + ")"); // Sets the text to the event type and (0);
				
				config.mediaElementJq.bind(eventType + ".mediaEventInspector", function(e) {
				
					config.eventOccurrence[e.type]++;
					if(config.eventOccurrence[e.type] > 1) {
						config.eventJq[e.type].css("background-color","#ff9");
					} else {
						config.eventJq[e.type].css("background-color","#9f9");
					}
					config.eventJq[e.type].text(e.type + " (" + config.eventOccurrence[e.type] + ")");
					// The timer to handle the color
					clearTimeout(config.eventTimeout[e.type]);
					config.eventTimeout[e.type] = setTimeout(function() {
						config.eventJq[e.type].css("background-color","#fff");
					}, 1000);
					// The timer to handle the occurences.
					setTimeout(function() {
						config.eventOccurrence[e.type]--;
						config.eventJq[e.type].text(e.type + " (" + config.eventOccurrence[e.type] + ")");
					}, 1000);
					if(config.visible && config.eventRefresh) {
						$this.mediaEventInspector("updateStatus");
					}
				});
			});

			// The load command is not enabled in the inspector. ie., the link is not added in the structure.
			// Removed this command since we are not changing the SRC at all... And it caused problems on FF3.6 if load() was ever used.
			config.loadJq.click(function() {
				config.mediaElement.load();
				$(this).blur();
				return false;
			});
			config.playJq.click(function() {
				config.mediaElement.play();
				$(this).blur();
				return false;
			});
			config.pauseJq.click(function() {
				config.mediaElement.pause();
				$(this).blur();
				return false;
			});
			config.currentTimeJq.click(function() {
				if(config.currentTimeValueJq.val() > 0) {
					config.mediaElement.currentTime = config.currentTimeValueJq.val();
				} else {
					config.currentTimeValueJq.val(0);
					config.mediaElement.currentTime = 0;
				}
				$(this).blur();
				return false;
			});

			config.toggleJq.click(function() {
				if(config.visible) {
					$(this).text("Show");
					config.windowJq.hide();
				} else {
					$(this).text("Hide");
					config.windowJq.show();
					$this.mediaEventInspector("updateStatus");
				}
				config.visible = !config.visible;
				$(this).blur();
				return false;
			});

			config.eventResetJq.click(function() {
				$.each($.mediaEventInspector.event, function(eventName,eventType) {
					config.eventJq[eventType].css("background-color","#eee");
				});
				$(this).blur();
				return false;
			});

			config.eventRefreshJq.click(function() {
				if(config.eventRefresh) {
					$(this).text("Enable");
				} else {
					$(this).text("Disable");
				}
				config.eventRefresh = !config.eventRefresh;
				$(this).blur();
				return false;
			});

			config.updateJq.click(function() {
				$this.mediaEventInspector("updateStatus");
				$(this).blur();
				return false;
			});

			if(!config.visible) {
				config.windowJq.hide();
			}
			
			$.mediaEventInspector.i++;

			return this;
		},
		destroy: function() {
			$(this).data("mediaEventInspector").mediaElementJq.unbind(".mediaEventInspector");
			$(this).empty();
		},
		updateStatus: function() {
			function displayTimeRanges(timeRanges, name) {
				var returnString = "";
				var commonStyle = "float:left;padding:0 5px;border:1px dotted #000;text-align:center;overflow:hidden;";
				returnString += '<div style="padding-bottom:5px;background-color:#eee;border:1px dotted #000;">';
				returnString += '<div style="height:42px;margin-top:5px;margin-left:5px;' + commonStyle + '">MediaElement.<strong>' + name + '</strong><br />';
				if(typeof timeRanges === "object") {
					returnString += 'length = ' + timeRanges.length + '</div>';
					for(var i=0; i < timeRanges.length; i++) {
						returnString += '<div style="width:104px;margin-top:5px;margin-left:5px;float:left;">';
						returnString += '<div style="width:92px;height:20px;' + commonStyle + '">' + i + '</div>';
						returnString += '<div style="width:40px;height:20px;' + commonStyle + '">' + timeRanges.start(i).toFixed(1) + '</div>';
						returnString += '<div style="width:40px;height:20px;' + commonStyle + '">' + timeRanges.end(i).toFixed(1) + '</div>';
						returnString += '<div style="clear:both"></div>';
						returnString += '</div>';
					}
				} else {
					returnString += typeof timeRanges + '</div>';
				}
				returnString += '<div style="clear:both"></div>';
				returnString += '</div>';
				return returnString;
			}
		
		
		
			var myConfig = $(this).data("mediaEventInspector");
			var status = "";
			status += displayTimeRanges(myConfig.mediaElement.played, "played");
			status += displayTimeRanges(myConfig.mediaElement.seekable, "seekable");
			status += displayTimeRanges(myConfig.mediaElement.buffered, "buffered");

			myConfig.statusJq.html(status);
			return this;
		}
	};
	$.fn.mediaEventInspector = function( method ) {
		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.mediaEventInspector' );
		}    
	};
})(jQuery);
