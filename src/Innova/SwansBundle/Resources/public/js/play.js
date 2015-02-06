var transitionType = 'fast';
var currentExerciseType = '';
var audioUrl = '';
var wavesurfer;
var videoPlayer = null;
var playing = false;
var isEditing = false;

var isResizing = false;
var resized = null;
var originalStart;
var originalEnd;


var wavesurferOptions = {
    container: '#waveform',
    waveColor: '#172B32',
    progressColor: '#00A1E5',
    height: 256,
    scrollParent: true,
    normalize: true,
    minimap: true,
    resize: true
};

var actions = {
    play: function (elem) {
        console.log('play');
        if (!playing) {
            wavesurfer.play();
            console.log('yep');
            if ('video' === currentExerciseType) {
                // also handle video playback
                videoPlayer.play();
            }
            playing = true;
        }
        else {
            wavesurfer.pause();
            if ('video' === currentExerciseType) {
                // also handle video playback
                videoPlayer.pause();
            }
            playing = false;
        }
    },
    backward: function () {
        console.log('backward');
        wavesurfer.seekTo(0);
        // TODO : check if regions and if true go to the previous region begining
    },
    forward: function () {
        console.log('forward');
        wavesurfer.seekTo(1);
        // TODO : check if regions and if true go to the next region begining
    },
    mark: function () {
        console.log('addregion');
        // BEWARE !!! We only show the begin region handler in order to avoid overlaps

        // if one or more region(s) (always true because a default region is created at startup)
        if (!jQuery.isEmptyObject(wavesurfer.regions.list)) {
            var time = wavesurfer.getCurrentTime();
            var current = getCurrent(time);
            var savedEnd = current.end;
            var idToUpdate = current.id;
            // Update current wavesurfer region
            current.update({
                end: time
            });

            // update DOM
            var input = $('#delete-region.' + idToUpdate).closest(".row").find("input[name=end]");
            input.val(time);

            // ADD new region to DOM in the right place
            var toAdd = addRegion(time, savedEnd, '-', false);
            addRegionToDom(toAdd);
        }
    },
    fullscreen: function (elem) {
        console.log('go fullscreen');
        toggleFullScreen(videoPlayer);
    },
    toggleText: function (elem) {
        console.log('toggle text');
    },
    toggleMedias: function (elem) {
        console.log('toggle medias');
    },
    annotate: function (elem) {
        console.log('annotate');
        var color = elem.data('color');
        console.log(color);
    }
};

$(document).ready(function () {
    console.log('ready from play.js');

    // get hidden inputs values
    currentExerciseType = $('input[name=type]').val();
    audioUrl = $('input[name="audio-url"]').val();
    isEditing = parseInt($('input[name="editing"]').val()) === 1 ? true : false;

    // init swithces inputs
    if ('video' === currentExerciseType) {
        var toggleMediaCheck = $("[name='toggle-media-checkbox']").bootstrapSwitch('state', true);
        $(toggleMediaCheck).on('switchChange.bootstrapSwitch', function (event, state) {
            $('#audio-player').toggle(transitionType);
            $('#video-player').toggle(transitionType);
            $('#full-screen').toggle();
        });

        videoPlayer = $('#video-player')[0];
        videoPlayer.muted = true; // sound is played by wavesurfer
    }
    else {
        $("[name='toggle-media-checkbox']").toggle();
    }


    var toggleAnnotationCheck = $("[name='toggle-annotation-checkbox']").bootstrapSwitch('state', true);
    $(toggleAnnotationCheck).on('switchChange.bootstrapSwitch', function (event, state) {

        $('.annotation-buttons-container').toggle(transitionType);
    });

    // create wavesurfer object
    wavesurfer = Object.create(WaveSurfer);

    // wavesurfer progress bar
    (function () {
        var progressDiv = document.querySelector('#progress-bar');
        var progressBar = progressDiv.querySelector('.progress-bar');
        var showProgress = function (percent) {
            progressDiv.style.display = 'block';
            progressBar.style.width = percent + '%';
        };
        var hideProgress = function () {
            progressDiv.style.display = 'none';
        };
        wavesurfer.on('loading', showProgress);
        wavesurfer.on('ready', hideProgress);
        wavesurfer.on('destroy', hideProgress);
        wavesurfer.on('error', hideProgress);
    }());

    wavesurfer.init(wavesurferOptions);

    /* Minimap plugin */
    wavesurfer.initMinimap({
        height: 30,
        waveColor: '#ddd',
        progressColor: '#999',
        cursorColor: '#999'
    });

    wavesurfer.on('ready', function () {
        var timeline = Object.create(WaveSurfer.Timeline);
        timeline.init({
            wavesurfer: wavesurfer,
            container: '#wave-timeline'
        });




        // check if there are regions defined
        if ($(".row.form-row.region").size() === 0) {
            // if no region add one by default
            var region = addRegion(0.0, wavesurfer.getDuration(), '-', false);
            addRegionToDom(region);
        } else {
            // for each existing PHP Region entity ( = region row) create a wavesurfer region
            $(".row.form-row.region").each(function () {
                var start = $(this).find('input[name="start"]').val();
                var end = $(this).find('input[name="end"]').val();
                var note = $(this).find('input[name="note"]').val() ? $(this).find('input[name="note"]').val() : '-';
                if (start && end && note) {
                    addRegion(start, end, note, true);
                }
            });
        }
    });

    wavesurfer.on('seek', function () {
        // console.log('seek ' + wavesurfer.getCurrentTime());
        if ('video' === currentExerciseType) {
            videoPlayer.currentTime = wavesurfer.getCurrentTime();
        }
    });

    wavesurfer.on('region-click', function (region, e) {
        // highlight the corresponding row
        highlightRow(region);
    });

    wavesurfer.on('region-in', function (region) {
        highlightRow(region);
    });

    // on each update
    wavesurfer.on('region-updated', function (region, e) {
        // console.log('youpi');
        /*if (isResizing) {
         console.log('dragging');
         console.log(region.start);
         console.log('youpi');
         // current updated region end time not chnaging 
         var currentRow = getRegionRow(false, region.end);
         
         var currentTime = region.start;
         console.log('test :: ' + currentTime + ' end ' + (region.end - 1));
         // avoid the dragging to go after the end of the current edited region
         if (parseFloat(currentTime) >= parseFloat((region.end - 1))) {
         console.log('stop!!');
         e.preventDefault();
         e.stopPropagation();
         return false;
         }
         e.preventDefault();
         e.stopPropagation();
         return;
         }*/
    });

    wavesurfer.on('region-resize', function (region, e) {
        if (isResizing) {
            console.log('dragging');
            console.log(region.start);
            console.log('youpi');
            // current updated region end time not chnaging 
            var currentRow = getRegionRow(false, region.end);

            var currentTime = region.start;
            console.log('test :: ' + currentTime + ' end ' + (region.end - 1));
            // avoid the dragging to go after the end of the current edited region
            if (parseFloat(currentTime) >= parseFloat((region.end - 1))) {
                console.log('stop!!');
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            /*e.preventDefault();
             e.stopPropagation();
             return false;*/
        }
    });

    wavesurfer.on('region-resize-start', function (region, e) {
        console.log('start resizing');
        isResizing = true;
        resized = region;
        originalStart = region.start;
        originalEnd = region.end;
    });

    wavesurfer.on('region-update-end', function (region, e) {
        console.log('finished updating');
        console.log(resized.start +  '  ' + resized.end );
        if (parseFloat(region.start) >= parseFloat(originalEnd)) {
            region.update({
                start: originalStart,
                end: originalEnd
            });
        }


        isResizing = false;
        resized = null;
    });


    /*wavesurfer.on('region-click', editAnnotation);
     wavesurfer.on('region-updated', saveRegions);
     wavesurfer.on('region-removed', saveRegions);
     wavesurfer.on('region-in', showNote);
     wavesurfer.on('region-play', function (region) {
     region.once('out', function () {
     wavesurfer.play(region.start);
     wavesurfer.pause();
     //playing = false;
     });
     });*/


    wavesurfer.load(audioUrl);

    // bind events / functions
    $("button[data-action]").click(function () {
        var action = $(this).data('action');
        if (actions.hasOwnProperty(action)) {
            actions[action]($(this));
        }
    });
});


document.addEventListener("keydown", function (e) {

    // Enter key pressed
    if (isEditing && e.keyCode === 13) {
        actions['mark']();
    }
    // spacebar
    else if (e.keyCode === 32) {
        actions['play']();
    }
    // left arrow
    else if (e.keyCode === 37) {
        actions['backward']();
    }
    // right arrow
    else if (e.keyCode === 39) {
        actions['forward']();
    }

}, false);

/**
 * Highlight a row 
 * @param region wavesurfer.region 
 */
function highlightRow(region) {
    var row = getRegionRow(region.start, region.end);
    if (row) {
        $('.active-row').each(function () {
            $(this).removeClass('active-row');
        });
        $(row).find('input[name=note]').addClass('active-row');
    }
}

/**
 * Get the wavesurfer region associatied row (ie DOM object)
 * @param start
 * @param end
 * @returns the row
 */
function getRegionRow(start, end) {
    var row;
    $('.region').each(function () {
        var temp = $(this);
        var sinput = $(this).find("input[name=start]");
        var einput = $(this).find("input[name=end]");
        if (start && end && parseFloat(sinput.val()) === parseFloat(start) && parseFloat(einput.val()) === parseFloat(end)) {
            row = temp;
        }
        else if (!end && start && parseFloat(sinput.val()) === parseFloat(start)) {
            row = temp;
        }
        else if (!start && end && parseFloat(einput.val()) === parseFloat(end)) {
            // when dragging
            console.log('using the right one');
            row = temp;
        }
    });
    return row;
}

/**
 * Check if we are currently inside an existing wavesurefer region
 * @param time current time 
 * @returns a wavesurfer.region or null
 */
function getCurrent(time) {

    for (var index in wavesurfer.regions.list) {
        var region = wavesurfer.regions.list[index];
        if (region.start < time && region.end > time) {
            return region;
        }
        index++;
    }
    return null;
}

/**
 * Get the closest next region
 * @param time current time 
 * @returns a wavesurfer.region or null
 */
function getNext(time) {
    var result = null;
    for (var index in wavesurfer.regions.list) {
        if (wavesurfer.regions.list[index].start > time) {
            // if existing result check that current region is more
            if (!result || (result && result.start > wavesurfer.regions.list[index].start)) {
                result = wavesurfer.regions.list[index];
            }
        }
    }
    return result;
}
/**
 * Get the closest previous region
 * @param time current time 
 * @returns a wavesurfer.region or null
 */
function getPrev(time) {
    var result = null;
    for (var index in wavesurfer.regions.list) {
        if (wavesurfer.regions.list[index].start < time) {
            // if existing result check that current region is more
            if (!result || (result && result.start < wavesurfer.regions.list[index].start)) {
                result = wavesurfer.regions.list[index];
            }
        }
    }
    return result;
}

/**
 * Crate and add a wavesurfer region
 * dataset is true only when we are creating a wavesurfer region from existing DOM rows
 * @param float start
 * @param float end
 * @param string note
 * @param bool dataset
 * @returns region the newly created wavesurfer region
 */
function addRegion(start, end, note, dataset) {

    note = note ? note : '-';
    var region = {};
    region.start = start;
    region.end = end;
    region.color = randomColor(0.1);
    region.resizeHandlerColor = '#FF0000';
    region.resizeHandlerWidth = '2px';
    region.drag = false;
    region.showEndHandler = false;
    region.data = {note: note};
    region = wavesurfer.addRegion(region);
    // set data-id to del button
    if (dataset) {
        document.getElementById('delete-region').dataset.id = region.id;
        $('#delete-region').addClass(region.id);
    }
    return region;
}

/**
 * Delete a region from the wavesurfer collection remove it from DOM and update times (start or end)
 * @param elem the source of the event
 */
function deleteRegion(elem) {
    // can not delete region if just one ( = the default one)
    if (!jQuery.isEmptyObject(wavesurfer.regions.list) && Object.keys(wavesurfer.regions.list).length === 1) {
        console.log('just one default region can not delete');
    }
    else {
        // remove from wavesurfer regions list
        var id = $(elem).data('id');
        if (id) {
            var toRemove = wavesurfer.regions.list[id];
            var start = toRemove.start;
            var end = toRemove.end;
            // if we are deleting the first region
            if (start === 0) {
                var next = getNext(end - 0.1);
                if (next) {
                    next.update({
                        start: 0
                    });
                    wavesurfer.regions.list[id].remove();

                    // update time (DOM)
                    var currentRow = $('#delete-region.' + id).closest(".row.form-row.region");
                    var inputToUpdate = currentRow.next().find("input[name=start]");

                    inputToUpdate.val(start);
                    $(currentRow).remove();
                } else {
                    console.log('not found');
                }
            } else { // all other cases
                // update previous wavesurfer region (will automatically update the dom ??)
                var previous = getPrev(start - 0.1);
                // what if we are on the first region ?
                if (previous) {
                    previous.update({
                        end: end
                    });
                    wavesurfer.regions.list[id].remove();

                    // update time (DOM)
                    var currentRow = $('#delete-region.' + id).closest(".row.form-row.region");
                    var inputToUpdate = currentRow.prev().find("input[name=end]");

                    inputToUpdate.val(end);
                    $(currentRow).remove();
                } else {
                    console.log('not found');
                }
            }
        }
    }
}

/**
 * Add the region to the DOM at the right place
 * @param region wavesurfer.region 
 */
function addRegionToDom(region) {
    var container = $('.segments-container');
    // HTML to append
    var html = '<div class="row form-row region">';
    // start input
    html += '<div class="col-xs-1">';
    html += '<input type="text" name="start" class="form-control" value="' + region.start + '" required="required">';
    html += '</div>';
    // end input
    html += '<div class="col-xs-1">';
    html += '<input type="text" name="end" class="form-control" value="' + region.end + '" required="required">';
    html += '</div>';
    // text input
    html += '<div class="col-xs-9">';
    html += '<input type="text" name="note" class="form-control" value="' + region.data.note + '">';
    html += '</div>';
    // delete button
    html += '<div class="col-xs-1">';
    html += '<button type="button" class="btn btn-danger glyphicon glyphicon-trash ' + region.id + '" data-id="' + region.id + '" id="delete-region" onclick="deleteRegion(this)"></button>';
    html += '</button>';
    html += '</div>';
    html += '</div>';
    // find the previous or next row in order to happend the new one in the good place
    if (Object.keys(wavesurfer.regions.list).length > 1) {
        var previous = findTheOne(region.start);
        if (previous) {
            $(html).insertAfter(previous);
        }
        else {
            console.log('previous not found');
        }
    }
    else {
        console.log('insert at end');
        $(container).append(html);
    }
}

/**
 * Find the row after which we have to insert the new one
 * @param start 
 * @returns DOM Object the row
 */
function findTheOne(start) {
    var elem = null;
    $('.region').each(function () {
        if (parseFloat($(this).find('input[name=end]').val()) === parseFloat(start)) {
            elem = $(this);
        }
    });
    return elem ? elem[0] : null;
}

/**
 * Random RGBA color.
 */
function randomColor(alpha) {
    return 'rgba(' + [
        ~~(Math.random() * 255),
        ~~(Math.random() * 255),
        ~~(Math.random() * 255),
        alpha || 1
    ] + ')';
}

function toggleFullScreen(elem) {
    // https://developer.mozilla.org/fr/docs/Web/Guide/DOM/Using_full_screen_mode
    if (!document.fullscreenElement && // alternative standard method
            !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }


    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    }
}



/**
 * Extract regions separated by silence.
 *  == silence finder
 *  var regions = extractRegions(
 wavesurfer.backend.getPeaks(512),
 wavesurfer.getDuration()
 );
 *      
 */
function extractRegions(peaks, duration) {
// Silence params
    var minValue = 0.15 //0.0015; = threshold
    var minSeconds = 0.01; //0.25;
    var length = peaks.length;
    var coef = duration / length;
    var minLen = minSeconds / coef;
// Gather silence indeces
    var silences = [];
    Array.prototype.forEach.call(peaks, function (val, index) {
        if (val < minValue) {
            silences.push(index);
        }
    });
// Cluster silence values
    var clusters = [];
    silences.forEach(function (val, index) {
        if (clusters.length && val == silences[index - 1] + 1) {
            clusters[clusters.length - 1].push(val);
        } else {
            clusters.push([val]);
        }
    });
// Filter silence clusters by minimum length
    var fClusters = clusters.filter(function (cluster) {
        return cluster.length >= minLen;
    });
// Create regions on the edges of silences
    var regions = fClusters.map(function (cluster, index) {
        var next = fClusters[index + 1];
        return {
            start: cluster[cluster.length - 1],
            end: (next ? next[0] : length - 1)
        };
    });
// Add an initial region if the audio doesn't start with silence
    var firstCluster = fClusters[0];
    if (firstCluster && firstCluster[0] != 0) {
        regions.unshift({
            start: 0,
            end: firstCluster[firstCluster.length - 1]
        });
    }
    // Filter regions by minimum length
    var fRegions = regions.filter(function (reg) {
        return reg.end - reg.start >= minLen;
    });
    // Return time-based regions
    return fRegions.map(function (reg) {
        return {
            start: Math.round(reg.start * coef * 10) / 10,
            end: Math.round(reg.end * coef * 10) / 10
        };
    });
}
