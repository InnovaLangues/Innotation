'use strict';

var JavascriptUtils = {
    // get selected text in the current window
    getSelectedText: function () {
        var txt = '';
        if (window.getSelection) {
            txt = window.getSelection();
        } else if (window.document.getSelection) {
            txt = window.document.getSelection();
        } else if (window.document.selection) {
            txt = window.document.selection.createRange().text;
        }
        return txt;
    },
    // get selected text and parent element in the current window
    getSelectionTextAndContainerElement: function () {
        var text = "", containerElement = null;
        if (typeof window.getSelection !== "undefined") {
            var sel = window.getSelection();
            if (sel.rangeCount) {
                var node = sel.getRangeAt(0).commonAncestorContainer;
                containerElement = node.nodeType === 1 ? node : node.parentNode;
                text = sel.toString();
            }
        } else if (typeof document.selection !== "undefined" &&
                document.selection.type !== "Control") {
            var textRange = document.selection.createRange();
            containerElement = textRange.parentElement();
            text = textRange.text;
        }
        return {
            text: text,
            containerElement: containerElement
        };
    },
    toggleFullScreen: function (elem) {
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
};