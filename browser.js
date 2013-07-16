(function () {

    var isOS = null; // iOS, Android, Linux, Window
    var isDevice = null; // iPod, iPad, galaxyTab, htc, chrome

    // This SVG detection method is taken from Raphaeljs
    // Need to cache the support knowledge so that an SVG fake would not affect it
    var supportsSVG = (window.SVGAngle || document.implementation.hasFeature(
            "http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") ? true : false);

    window.browser = {
        isMobile : function () {
            return this._device() !== 'chrome';
        },

        isAndroid : function () {
            return this._isHTC() || this.isGalaxyTab();
        },

        isIOS : function () {
            return this.isIPod() || this.isIPad();
        },

        isIPod : function () {
            return this._device() === 'iPod';
        },

        isIPad : function () {
            return this._device() === 'iPad';
        },

        isGalaxyTab : function () {
            return this._device() === 'galaxy-tab';
        },

        _isHTC : function () {
            return this._device() === 'htc';
        },

        getDevice : function () {
            return this._device();
        },

        _device : function () {
            if (isDevice === null) {
                // We check only one time
                if ((/ipod|iphone/gi).test(navigator.appVersion)) {
                    // iPod and iPhone are identical device
                    // but If we need to create new function we add iPhone function
                    isDevice = 'iPod';
                } else if ((/ipad/gi).test(navigator.appVersion)) {
                    isDevice = 'iPad';
                } else if ((/SCH\-I800/gi).test(navigator.appVersion)) {
                    isDevice = 'galaxy-tab';
                } else if ((/htc/gi).test(navigator.appVersion)) {
                    isDevice = 'htc';
                } else if ((/chrome/gi).test(navigator.appVersion)) {
                    isDevice = 'chrome';
                // Fake UserAgent
                } else if ((/Linux/gi).test(navigator.platform) && !_.isUndefined(navigator.vendor) &&
                  (/google/gi).test(navigator.vendor)) {
                    isDevice = 'htc';
                } else {
                    isDevice = 'chrome';
                }
            }
            return isDevice;
        },

        isUpdateRecommended : function () {
            if (this.isIOS()) {
                var version = (/OS ([0-9_]*)/gi).exec(navigator.appVersion)[1].split('_');
                return this._compareVersion([5], version);
            }
            return false;
        },

        /**
          * Returns true if the recommended version is greater than the actual version.  False otherwise.
          */
        _compareVersion : function (recommended, actual) {
            for (var i = 0; i < recommended.length; i++) {
                var rec = recommended[i];
                var act = actual[i] ? actual[i] : 0;
                if (rec > act) {
                    return true;
                } else if (act > rec) {
                    return false;
                }
            }
            return false;
        },

        /**
         * Return true if the browser supports SVG, false otherwise.
         */
        supportsSVG : function () {
            return supportsSVG;
        },

        /**
         * If there is no SVG support in the browser (un)fake it
         * return true is it is faked, false otherwise
         */
        fakeSVG : function (fake) {
            if (!supportsSVG) {
                if (fake) {
                    window.SVGAngle = {};
                    return true;
                } else {
                    window.SVGAngle = undefined;
                    return false;
                }
            } else {
                return false;
            }
        },

        /**
         * Return the mouse co-ordinates of the given event.
         */
        getEventCoordinates : function (event) {
            // Stolen from http://www.quirksmode.org/js/events_properties.html#position
            var x = 0;
            var y = 0;
            if (!event) {
                var e = window.event;
            }
            if (event.pageX || event.pageY)     {
                x = event.pageX;
                y = event.pageY;
            }
            else if (event.clientX || event.clientY)    {
                x = event.clientX + document.body.scrollLeft +
                      document.documentElement.scrollLeft;
                y = event.clientY + document.body.scrollTop +
                      document.documentElement.scrollTop;
            }
            return {x: x, y: y};
        },


        // We used orientationchange for ipod/ipad
        // and resize for chrome
        bindToAppropriateEvent : function (element, event, handler) {
            event = this.toAppropriateEvent(event);
            $(element).bind(event, handler);
        },

        unbindToAppropriateEvent : function (element, event) {
            event = this.toAppropriateEvent(event);
            $(element).unbind(event);
        },


        toAppropriateEvent : function (event) {
            var eventNative = event.replace(/\..+/, '');

            // Array of interrelation events on device and PC browser
            var eventsArray = {'orientationchange' : 'resize'};

            if (_.indexOf(_.keys(eventsArray), eventNative) !== -1) {
                if ('orientationchange' in window) {
                    return event;
                } else {
                    return event.replace(eventNative, eventsArray[eventNative]);
                }
            }
        },

        isPortraitMode : function () {
            return ($('body').width() <= $('body').height());
        },

        isLandscapeMode : function () {
            return ($('body').width() > $('body').height());
        }

    };


}());
