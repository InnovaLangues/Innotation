var transitionType = 'fast';
var currentExerciseType = '';
var audioUrl = '';
var wavesurfer;
var videoPlayer = null;

var playing = false;

var wavesurferOptions = {
    container: '#waveform',
    waveColor: '#172B32',
    progressColor: '#00A1E5',
    height: 256
};



var actions = {
    play: function (elem) {
        console.log('play');
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
        console.log('backward');
        wavesurfer.seekTo(0);
    },
    forward: function () {
        console.log('forward');
        wavesurfer.seekTo(1);
    },
    mark: function (elem) {
        console.log('addmark');
        // create region
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

    // get hidden inut values
    currentExerciseType = $('input[name=type]').val();
    audioUrl = $('input[name="audio-url"]').val();

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
   /* wavesurfer.initMinimap({
        height: 30,
        waveColor: '#ddd',
        progressColor: '#999',
        cursorColor: '#999'
    });*/

    wavesurfer.on('ready', function () {
        // wavesurfer.play();
        var timeline = Object.create(WaveSurfer.Timeline);
        timeline.init({
            wavesurfer: wavesurfer,
            container: '#wave-timeline'
        });

        var regions = extractRegions(
                wavesurfer.backend.getPeaks(512),
                wavesurfer.getDuration()
                );

        console.log(regions);

        loadRegions(regions);
    });

    wavesurfer.on('seek', function () {
        // console.log('seek ' + wavesurfer.getCurrentTime());
        videoPlayer.currentTime = wavesurfer.getCurrentTime();
    });

    wavesurfer.on('region-click', function (region, e) {
        e.stopPropagation();
        // Play on click, loop on shift click
        e.shiftKey ? region.playLoop() : region.play();
    });
    wavesurfer.on('region-click', editAnnotation);
    wavesurfer.on('region-updated', saveRegions);
    wavesurfer.on('region-removed', saveRegions);
    wavesurfer.on('region-in', showNote);
    wavesurfer.on('region-play', function (region) {
        region.once('out', function () {
            wavesurfer.play(region.start);
            wavesurfer.pause();
        });
    });


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
    console.log(e);

    // Enter key pressed
    if (e.keyCode === 13) {
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

function saveRegions() {
    localStorage.regions = JSON.stringify(
            Object.keys(wavesurfer.regions.list).map(function (id) {
        var region = wavesurfer.regions.list[id];
        return {
            start: region.start,
            end: region.end,
            data: region.data
        };
    })
            );
}

function loadRegions(regions) {
    regions.forEach(function (region) {
        region.color = randomColor(0.1);
        wavesurfer.addRegion(region);
    });
}
/**
 * Extract regions separated by silence.
 */
function extractRegions(peaks, duration) {
// Silence params
    var minValue = 0.15 //0.0015;
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
function editAnnotation(region) {
    var form = document.forms.edit;
    form.style.opacity = 1;
    form.elements.start.value = Math.round(region.start * 10) / 10,
            form.elements.end.value = Math.round(region.end * 10) / 10;
    form.elements.note.value = region.data.note || '';
    form.onsubmit = function (e) {
        e.preventDefault();
        region.update({
            start: form.elements.start.value,
            end: form.elements.end.value,
            data: {
                note: form.elements.note.value
            }
        });
        form.style.opacity = 0;
    };
    form.onreset = function () {
        form.style.opacity = 0;
        form.dataset.region = null;
    };
    form.dataset.region = region.id;
}
/**
 * Display annotation.
 */
function showNote(region) {
    if (!showNote.el) {
        showNote.el = document.querySelector('#subtitle');
    }
    showNote.el.textContent = region.data.note || '–';
}
/**
 * Bind controls.
 *//*
GLOBAL_ACTIONS['delete-region'] = function () {
    var form = document.forms.edit;
    var regionId = form.dataset.region;
    if (regionId) {
        wavesurfer.regions.list[regionId].remove();
        form.reset();
    }
};
GLOBAL_ACTIONS['export'] = function () {
    window.open('data:application/json;charset=utf-8,' +
            encodeURIComponent(localStorage.regions));
};*/