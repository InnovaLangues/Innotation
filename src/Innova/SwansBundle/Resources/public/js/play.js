// INNOVA JAVASCRIPT HELPERS /OBJECTS
var strUtils;
var wavesurferUtils;
var JavascriptUtils;

var transitionType = 'fast';
var currentExerciseType = '';
var audioUrl = '';
var wavesurfer;
var videoPlayer = null;
var playing = false;
var isEditing = false;

var isResizing = false;
var currentlyResizedRegion = null;
var currentlyResizedRegionRow = null;
var originalStart;
var originalEnd;
var previousResizedRegion = null;
var previousResizedRegionRow = null;

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
        if (!playing) {
            wavesurfer.play();
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
        if (Object.keys(wavesurfer.regions.list).length > 1) {
            var current = wavesurferUtils.getCurrentRegion(wavesurfer, wavesurfer.getCurrentTime() - 0.1);
            var percent = (current.start) / wavesurfer.getDuration();
            wavesurfer.seekAndCenter(percent);
        }
        else {
            wavesurfer.seekAndCenter(0);
        }
        var region = wavesurferUtils.getCurrentRegion(wavesurfer, wavesurfer.getCurrentTime() - 0.1);
        if (region) {
            highlightRegionRow(region);
        }
    },
    forward: function () {
        if (Object.keys(wavesurfer.regions.list).length > 1) {
            var current = wavesurferUtils.getCurrentRegion(wavesurfer, wavesurfer.getCurrentTime() + 0.1);
            var percent = (current.end) / wavesurfer.getDuration();
            wavesurfer.seekAndCenter(percent);
        }
        else {
            wavesurfer.seekAndCenter(1);
        }
        var region = wavesurferUtils.getCurrentRegion(wavesurfer, wavesurfer.getCurrentTime() + 0.1);
        if (region) {
            highlightRegionRow(region);
        }
    },
    mark: function () {
        // BEWARE !!! We only show the begin region handler in order to avoid marker(s) overlaps
        // (endmarker time = next region start marker time)

        // if one or more region(s) (always true because a default region is created at startup)
        if (!jQuery.isEmptyObject(wavesurfer.regions.list)) {
            var time = wavesurfer.getCurrentTime();
            var current = wavesurferUtils.getCurrentRegion(wavesurfer, time);
            var savedEnd = current.end;
            var idToUpdate = current.id;
            // Update current wavesurfer region
            current.update({
                end: time
            });

            // update DOM
            // hidden input
            var hiddenInput = $('button.' + idToUpdate).closest(".row").find("input.hidden-end");
            hiddenInput.val(time);
            // visible end value
            var endTimeDisplay = $('button.' + idToUpdate).closest(".row").find("div.time-text.end");
            endTimeDisplay.text(wavesurferUtils.secondsToHms(time));
            // ADD new region to DOM in the right place
            var toAdd = addRegion(time, savedEnd, '', false);
            addRegionToDom(toAdd);
        }
    },
    fullscreen: function () {
        javascriptUtils.toggleFullScreen(videoPlayer);
    },
    toggleText: function () {
        $('.regions-container').toggle(transitionType);
    },
    toggleMedias: function () {
        $('.media-container').toggle(transitionType);
        $('#toggle-media-switch-container').toggle(transitionType);
    },
    annotate: function (elem) {
        var color = elem.data('color');
        if (color === 'none') {
            automaticTextAnnotation();
        }
        else {
            var text = JavascriptUtils.getSelectedText();
            if (text !== '') {
                manualTextAnnotation(text, 'accent-' + color);
            }
        }
    }
};
$(document).ready(function () {
    // get hidden inputs values
    currentExerciseType = $('input[name=type]').val();
    audioUrl = $('input[name="audio-url"]').val();
    isEditing = parseInt($('input[name="editing"]').val()) === 1 ? true : false;


    // init switches inputs
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
    // create our objects
    strUtils = Object.create(StringUtils);
    wavesurferUtils = Object.create(WavesurferUtils);
    JavascriptUtils = Object.create(JavascriptUtils);

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

    wavesurfer.load(audioUrl);

    wavesurfer.on('ready', function () {
        var timeline = Object.create(WaveSurfer.Timeline);
        timeline.init({
            wavesurfer: wavesurfer,
            container: '#wave-timeline'
        });

        // check if there are regions defined
        if ($(".row.form-row.region").size() === 0) {
            // if no region : add one by default
            var region = addRegion(0.0, wavesurfer.getDuration(), '', false);
            addRegionToDom(region);
        } else {
            // for each existing PHP Region entity ( = region row) create a wavesurfer region
            $(".row.form-row.region").each(function () {
                var start = $(this).find('input.hidden-start').val();
                var end = $(this).find('input.hidden-end').val();
                var note = $(this).find('input.hidden-note').val() ? $(this).find('input.hidden-note').val() : '';
                if (start && end) {
                    addRegion(start, end, note, true);
                }
            });
        }
    });

    wavesurfer.on('seek', function () {
        if ('video' === currentExerciseType) {
            var currentTime = wavesurfer.getCurrentTime();
            videoPlayer.currentTime = currentTime;
        }
    });

    wavesurfer.on('region-click', function (region, e) {
        highlightRegionRow(region);
    });

    wavesurfer.on('region-in', function (region) {
        highlightRegionRow(region);
    });

    // catch region resize start to store some data
    wavesurfer.on('region-resize-start', function (region, e) {
        isResizing = true;
        currentlyResizedRegion = region;
        currentlyResizedRegionRow = getRegionRow(region.start, region.end);
        previousResizedRegion = wavesurferUtils.getPrevRegion(wavesurfer, region.start);
        previousResizedRegionRow = getRegionRow(previousResizedRegion.start, previousResizedRegion.end);
        originalStart = region.start;
        originalEnd = region.end;
    });

    // when ending the region update
    wavesurfer.on('region-update-end', function (region, e) {
        // if we are resizing, we need to check if data are OK
        if (isResizing) {
            // reinit  currently resized region if datas are wrong
            if (parseFloat(region.start) >= parseFloat(originalEnd)) {
                region.update({
                    start: originalStart,
                    end: originalEnd
                });
                previousResizedRegion.update({end: originalStart});
                // hidden input update
                $(currentlyResizedRegionRow).find("input.hidden-start").val(originalStart);
                //diplay div update
                $(currentlyResizedRegionRow).find(".time-text.start").text(wavesurferUtils.secondsToHms(originalStart));
                if (previousResizedRegionRow) {
                    $(previousResizedRegionRow).find("input.hidden-end").val(originalStart);
                    $(previousResizedRegionRow).find(".time-text.end").text(wavesurferUtils.secondsToHms(originalStart));
                }

            }
            isResizing = false;
            currentlyResizedRegion = null;
            previousResizedRegion = null;
        }
    });

    wavesurfer.on('region-resize', function (region, e) {
        if (isResizing) {

            var currentTime = region.start;
            $(currentlyResizedRegionRow).find("input.hidden-start").val(currentTime);
            $(currentlyResizedRegionRow).find(".time-text.start").text(wavesurferUtils.secondsToHms(currentTime));
            if (previousResizedRegionRow) {
                $(previousResizedRegionRow).find("input.hidden-end").val(currentTime);
                $(previousResizedRegionRow).find(".time-text.end").text(wavesurferUtils.secondsToHms(currentTime));
                previousResizedRegion.update({end: currentTime});
            }
        }
    });

    // bind events / functions
    $("button[data-action]").click(function () {
        var action = $(this).data('action');
        if (actions.hasOwnProperty(action)) {
            actions[action]($(this));
        }
    });

    // CONTENT EDITABLE ... TODO set value to hidden input and make the difference between title and region notes
    $('body').on('focus', '[contenteditable]', function () {
        var $this = $(this);
        $this.data('before', $this.html());
        console.log('focus');
        return $this;
    }).on('blur keyup paste input', '[contenteditable]', function () {
        var $this = $(this);
        if ($this.data('before') !== $this.html()) {
            $this.data('before', $this.html());
            $this.trigger('change');
            console.log('change');
            updateHiddenNoteOrTitleInput($this);
        }
        return $this;
    });
});

function updateHiddenNoteOrTitleInput(elem) {
    // get last css class name of the element
    var isNote = $(elem).hasClass('note');
    if (isNote) {
        console.log('note changed');
        // find associated input[name="note"] input and set val
        var hiddenNoteInput = $(elem).closest(".row.form-row.region").find('input.hidden-note');
        var content = $(elem).html() ? $(elem).html() : $(elem).text();
        $(hiddenNoteInput).val(content);
    }
    else {
        console.log('title changed');
        var hiddenTitleInput = $(elem).closest('.row').find('input[name=title]');
        $(hiddenTitleInput).val($(elem).text());
    }
}

/*
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
 
 }, false);*/

/**
 * Highlight a row 
 * @param region wavesurfer.region 
 */
function highlightRegionRow(region) {
    var row = getRegionRow(region.start, region.end);
    if (row) {
        $('.active-row').each(function () {
            $(this).removeClass('active-row');
        });
        $(row).find('div.text-left.note').addClass('active-row');
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
    $('.row.form-row.region').each(function () {
        var temp = $(this);
        var sinput = $(this).find("input.hidden-start");

        var einput = $(this).find("input.hidden-end");
        if (start && end && parseFloat(sinput.val()) === parseFloat(start) && parseFloat(einput.val()) === parseFloat(end)) {
            row = temp;
        }
        else if (!end && start && parseFloat(sinput.val()) === parseFloat(start)) {
            row = temp;
        }
        else if (!start && end && parseFloat(einput.val()) === parseFloat(end)) {
            row = temp;
        }
    });
    return row;
}


/**
 * Crate and add a wavesurfer region
 * dataset is true only when we are creating a wavesurfer region from existing DOM rows
 * @param start
 * @param end
 * @param note
 * @param dataset
 * @returns region the newly created wavesurfer region
 */
function addRegion(start, end, note, dataset) {

    note = note ? note : '';
    var region = {};
    region.start = start;
    region.end = end;
    region.color = wavesurferUtils.randomColor(0.1);
    region.resizeHandlerColor = '#FF0000';
    region.resizeHandlerWidth = '2px';
    region.drag = false;
    region.showEndHandler = false;
    region.data = {note: note};
    region = wavesurfer.addRegion(region);
    // set data-id to del button
    if (dataset) {
        var regionRow = getRegionRow(start, end);
        var btn = $(regionRow).find('button.glyphicon-trash');
        $(btn).addClass(region.id);
        $(btn).attr('data-id', region.id);
        var startText = $(regionRow).find('.time-text.start')
        startText.text(WavesurferUtils.secondsToHms($(startText).text()));
        var endText = $(regionRow).find('.time-text.end')
        endText.text(WavesurferUtils.secondsToHms($(endText).text()));

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
                var next = wavesurferUtils.getNextRegion(wavesurfer, end - 0.1);
                if (next) {
                    next.update({
                        start: 0
                    });
                    wavesurfer.regions.list[id].remove();

                    // update time (DOM)
                    var currentRow = $('button.' + id).closest(".row.form-row.region");
                    var hiddenInputToUpdate = currentRow.next().find("input.hidden-start");
                    hiddenInputToUpdate.val(start);

                    var divToUpdate = currentRow.next().find(".time-text.start");
                    divToUpdate.text(wavesurferUtils.secondsToHms(start));

                    $(currentRow).remove();
                } else {
                    console.log('not found');
                }
            } else { // all other cases
                // update previous wavesurfer region (will automatically update the dom ??)
                var previous = wavesurferUtils.getPrevRegion(wavesurfer, start - 0.1);

                if (previous) {
                    previous.update({
                        end: end
                    });
                    wavesurfer.regions.list[id].remove();

                    // update time (DOM)
                    var currentRow = $('button.' + id).closest(".row.form-row.region");
                    var hiddenInputToUpdate = currentRow.prev().find("input.hidden-end");
                    hiddenInputToUpdate.val(end);
                    var divToUpdate = currentRow.prev().find(".time-text.end");
                    divToUpdate.text(wavesurferUtils.secondsToHms(end));

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
    html += '<div class="time-text start">' + wavesurferUtils.secondsToHms(region.start) + '</div>';
    html += '</div>';
    // end input
    html += '<div class="col-xs-1">';
    html += '<div class="time-text end">' + wavesurferUtils.secondsToHms(region.end) + '</div>';
    html += '</div>';
    // text input
    html += '<div class="col-xs-9">';
    html += '<div contenteditable="true" class="text-left note">' + region.data.note + '</div>';
    //html += '<input type="text" name="note" class="form-control" value="' + region.data.note + '">';
    html += '</div>';
    // delete button
    html += '<div class="col-xs-1">';
    html += '<button type="button" name="del-region-btn" class="btn btn-danger glyphicon glyphicon-trash ' + region.id + '" data-id="' + region.id + '" onclick="deleteRegion(this)"></button>';
    html += '</button>';
    html += '</div>';
    html += '<input type="hidden" class="hidden-start" name="start[]" value="' + region.start + '" required="required">';
    html += '<input type="hidden" class="hidden-end" name="end[]" value="' + region.end + '" required="required">';
    html += '<input type="hidden" class="hidden-note" name="note[]" value="' + region.data.note + '">';
    html += '<input type="hidden" class="hidden-region-id" name="region-id[]" value="" >';
    html += '</div>';
    // find the previous row in order to happend the new one in the good place
    if (Object.keys(wavesurfer.regions.list).length > 1) {
        var previous = findPreviousRegionRow(region.start);
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
function findPreviousRegionRow(start) {
    var elem = null;
    $('.region').each(function () {
        if (parseFloat($(this).find('input.hidden-end').val()) === parseFloat(start)) {
            elem = $(this);
        }
    });
    return elem ? elem[0] : null;
}



function automaticTextAnnotation() {

    bootbox.confirm('Attention toute annotation antérieure sera remplacée!', function (result) {
        if (result) {
            // get ajax method url
            var url = $('input[name=annotate_url]').val();
            // for each region text row
            $('.row.form-row.region').each(function () {
                // get text
                var textInput = $(this).find('div.text-left.note');
                var text = $(textInput).text();
                if (text && text !== '') {



                    var data = {text: text};

                    $.post(url, data).done(function (response) {
                        // parse json response
                        var data = jQuery.parseJSON(response);
                        // replace the text with the result (css classes added)
                        if (data.success) {
                            var content = strUtils.html_decode(data.data);
                            $(textInput).html(content);
                            $(textInput).trigger('input');
                        }
                    }).fail(function (e) {
                        console.log(e);
                    }, 'json');
                }
            });
        }
    });
}

function manualTextAnnotation(text, css) {
    if (!css) {
        document.execCommand('insertHTML', false, css);
    } else {
        document.execCommand('insertHTML', false, '<span class="' + css + '">' + text + '</span>');
    }
}