/*

  STICKYJS

  Jquery plugin for sticky elements on scroll

  Author: Felipe Arosemena
  Date: 7 Sep 2014

  Usage:

  $('js-sticky').sticky({ ... }) // Pass in you options (see defaults)

*/

(function($) {

    $.fn.extend({

        sticky: function(options) {

            var defaults = {
                stickyClass: 'sticky',
                topLimit: '.js-sticky-header',
                mainEl: '.js-sticky-main',
                bottomLimit: '.js-sticky-footer',
                stickyOffset: 0
            };

            config = $.extend(defaults, options);

            config.stickyEl     = this.wrap('<span></span>').parent();
            config.topLimit     = $(config.topLimit);
            config.mainEl       = $(config.mainEl);
            config.bottomLimit  = $(config.bottomLimit);

            // Add a sticky-sibling class to siblings to prevent overlapping
            config.stickyEl.siblings().addClass('sticky-sibling');

            function doSticky() {
                // The total height of the header, plus any possible space it might have on top
                config.headerHeight     = config.topLimit.outerHeight() + config.topLimit.offset().top;
                config.stickyHeight     = config.stickyEl.outerHeight();
                config.stickyThreshold  = config.stickyThreshold || config.stickyEl.offset().top;
                config.mainHeight       = config.mainEl.outerHeight();
                config.footerHeight     = config.bottomLimit.outerHeight();

                config.vh = window.innerHeight; // Viewport Height
                config.vw = window.innerWidth; // Viewport Width
                config.dh = $(document).height(); // Document Height

                config.scrollTop    = window.scrollY || document.documentElement.scrollTop; // Current Scroll Top Position
                config.bpTop        = config.headerHeight;
                config.bpBottom     = config.dh - (config.stickyHeight + config.footerHeight + config.stickyOffset);

                // calculate
                if ((config.mainHeight > config.stickyHeight) && (config.vh > config.stickyHeight)) {

                    if (config.scrollTop < (config.stickyThreshold - config.stickyOffset)) {
                        config.stickyEl.removeClass(config.stickyClass);
                    } else if (
                        (config.scrollTop >= (config.stickyThreshold - config.stickyOffset)) &&
                        (config.scrollTop < config.bpBottom)) {
                        config.stickyEl.addClass(config.stickyClass).css('top', config.stickyOffset);
                    } else {
                        var negativeOffset = config.bpBottom - config.scrollTop;
                        config.stickyEl.addClass(config.stickyClass).css('top', negativeOffset + config.stickyOffset);
                    }

                } else {
                    config.stickyEl.removeClass('sticky');
                }
            }

            return this.each(function() {
                $(window).on('scroll', $.proxy(doSticky, this));
                $(window).on('resize', $.proxy(doSticky, this));
                $.proxy(doSticky, this)();
            });

        }

    });

})(jQuery);