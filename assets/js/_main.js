/* ========================================================================
 * DOM-based Routing
 * Based on http://goo.gl/EUTi53 by Paul Irish
 *
 * Only fires on body classes that match. If a body class contains a dash,
 * replace the dash with an underscore when adding it to the object below.
 *
 * .noConflict()
 * The routing is enclosed within an anonymous function so that you can
 * always reference jQuery with $, even when in .noConflict() mode.
 *
 * Google CDN, Latest jQuery
 * To use the default WordPress version of jQuery, go to lib/config.php and
 * remove or comment out: add_theme_support('jquery-cdn');
 * ======================================================================== */

(function($) {

    // Define Methods/Functions outside the router for reusability



    // Use this variable to set up the common and page specific functions. If you 
    // rename this variable, you will also need to rename the namespace below.
    var Router = {
        // All pages
        common: {
            init: function() {
                // Javascript to be fired on every page

                // Automatically call all methods in the common object
                for (var key in this) {

                    if (key !== 'init') {
                        this[key]();
                    }

                }
            },

            doubleTapMenu: function() {
                // Mainly for Landscape tablets which still get the full menu
                $('.site-header nav li:has(ul)').doubleTapToGo();
            },

            imagesLoaded: function() {

                $('.js-img-fade, .js-img-slide-fade, .js-wp-editor-img').each(function() {
                    $(this).imagesLoadedBg(function() {
                        $(this.elements).addClass('in');
                    });
                });
            },

            slider: function() {
                var slider = $('.js-slider');

                slider.flexslider({
                    namespace: 'slider-',
                    prevText: '',
                    nextText: '',
                    manualControls: slider.next('.js-slider-nav').find('li'),
                    animation: 'slide',
                    start: function(sldr) {
                        sldr.find('.js-slider-img').imagesLoaded(function() {
                            $(this.elements).addClass('in');
                        });
                    }
                });

            },
            
            formFocus: function() {

                // Gravity Form's AJAX submission removes the listeners in the form when submitted
                // Therefore we bind a listener to the outerwrapper and delegate
                $('form, .gform_wrapper').on('focus', 'input, textarea, select', function(e) {
                    $(this).closest('.form__group, .gfield').addClass('focus');
                });
                $('form, .gform_wrapper').on('blur', 'input, textarea, select', function(e) {
                    $(this).closest('.form__group, .gfield').removeClass('focus');
                });
            }

        },
        // Home page
        home: {
            init: function() {
                // JavaScript to be fired on the home page
            }
        },
        // About us page, note the change from about-us to about_us.
        about_us: {
            init: function() {
                // JavaScript to be fired on the about us page
            }
        }
    };

    // The routing fires all common scripts, followed by the page specific scripts.
    // Add additional events for more control over timing e.g. a finalize event
    var UTIL = {

        fire: function(func, funcname, args) {
            var namespace = Router;
            funcname = (funcname === undefined) ? 'init' : funcname;
            if (func !== '' && namespace[func] && typeof namespace[func][funcname] === 'function') {
                namespace[func][funcname](args);
            }
        },
        loadEvents: function() {
            UTIL.fire('common');

            $.each(document.body.className.replace(/-/g, '_').split(/\s+/), function(i, classnm) {

                // console.log(classnm);
                UTIL.fire(classnm);
            });
        }

    };

    $(document).ready(UTIL.loadEvents);

})(jQuery); // Fully reference jQuery after this point.