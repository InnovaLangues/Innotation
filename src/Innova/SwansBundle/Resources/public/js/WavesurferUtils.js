'use strict';

var WavesurferUtils = {
    /**
     * get region from time
     * @param time current time 
     * @param wavesurfer wavesurfer instance
     * @returns a wavesurfer.region or null
     */
    getCurrentRegion: function (wavesurfer, time) {
        for (var index in wavesurfer.regions.list) {
            var region = wavesurfer.regions.list[index];
            if (region.start < time && region.end > time) {
                return region;
            }
            index++;
        }
        return null;
    },
    /**
     * Get the closest next wavesurfer region
     * @param time current time 
     * @param wavesurfer wavesurfer instance
     * @returns a wavesurfer.region or null
     */
    getNextRegion: function (wavesurfer, time) {
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
    },
    /**
     * Get the closest previous wavesurfer region
     * @param time current time 
     * @param wavesurfer wavesurfer instance
     * @returns a wavesurfer.region or null
     */
    getPrevRegion: function (wavesurfer, time) {
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
    },
    /**
     * format wavesurfer time into human readable time
     * @param d
     * @returns formated time
     */
    secondsToHms: function (d) {
        d = Number(d);
        if (d > 0) {

            var hours = Math.floor(d / 3600);
            var minutes = Math.floor(d % 3600 / 60);
            var seconds = Math.floor(d % 3600 % 60);

            // ms
            var str = d.toString();
            var substr = str.split('.');
            var ms = substr[1].substring(0, 2);

            if (hours < 10) {
                hours = "0" + hours;
            }
            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            if (seconds < 10) {
                seconds = "0" + seconds;
            }
           // var time = hours + ':' + minutes + ':' + seconds + ':' + ms;
            var time = minutes + ':' + seconds + ':' + ms;
            return time;
        }
        else {

            return "00:00:00";
        }
    },
    /**
     * Random RGBA color.
     * @param alpha 
     */
    randomColor: function (alpha) {
        return 'rgba(' + [
            ~~(Math.random() * 255),
            ~~(Math.random() * 255),
            ~~(Math.random() * 255),
            alpha || 1
        ] + ')';
    },
    /**
     * Extract regions separated by silence.
     *  == silence finder
     *  var regions = extractRegions(
     wavesurfer.backend.getPeaks(512),
     wavesurfer.getDuration()
     );
     *      
     */
    extractRegions: function (peaks, duration) {
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


};