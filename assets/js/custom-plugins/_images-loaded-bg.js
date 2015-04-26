/*

  Images Loaded Background

  Enables detection of background image load.

  Author: Felipe Arosemena
  Date: 21 Oct 2014
  
*/

(function($) {

    $.fn.extend({

        imagesLoadedBg: function(callback) {

            // if we don't have imagesLoaded enabled, do nothing
            if (typeof $.fn.imagesLoaded !== 'function') {
                return;
            }

            var self = this;

            this.each(function() {

                var el      = $(this),
                    image   = el.css('background-image').replace(/"/g, '').replace(/url\(|\)$/ig, '');

                if (image && image !== '' && image !== 'none') {
                    self = self.add($('<img>').attr('src', image));
                }

                if (el.is('img')) {
                    self = self.add(el);
                }

            });

            self.imagesLoaded(callback);
        }
        
    });

})(jQuery);