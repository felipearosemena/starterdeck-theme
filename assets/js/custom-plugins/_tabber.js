/*

  TABBERJS

  Jquery plugin for tabblable panes

  Author: Felipe Arosemena
  Date: 21 Sep 2014

  Usage:

  $('.js-tab').tabber({ ... }) // Pass in you options (see defaults)

*/

(function($) {
    /*
      Tabber class definition
    */

    Tabber = function(element) {
        this.element = $(element);
    };

    Tabber.prototype.show = function() {
        var $this = this.element,
            href = $this.attr('href');
        target = $(href);

        if (target.length) {

            this.resetAll($this);
            this.activate($this);
            this.activate(target);

        } else {
            throw new Error('The element does not have a valid target');
        }

    };

    Tabber.prototype.activate = function(element) {
        element.addClass('active');
    };

    Tabber.prototype.resetAll = function(element) {
        var parent = element.closest('.js-tabs');

        parent.find('.tabs__item, [data-toggle=tabs]').removeClass('active');
    };


    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('tabber');

            if (!data) {
                $this.data('tabber', (data = new Tabber(this)));
            }
            if (typeof option === 'string') {
                data[option]();
            }


        });
    }

    $.fn.tabber = Plugin;
    $.fn.tabber.Constructor = Tabber;

    $(document).on('click', '[data-toggle=tabs]', function(e) {
        e.preventDefault();
        Plugin.call($(this), 'show');
    });


})(jQuery);