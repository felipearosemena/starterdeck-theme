/*
  
  Dropper
  
  Stylable select dropdowns

  Author: Felipe Arosemena
  Date: 15 Sep 2014

  Usage:
  
  $('select').dropper

*/

(function($) {

    $.fn.extend({

        dropper: function(options) {

            this.each(function() {

                var select = $(this),
                    selectOpt = select.find('option');

                if (!select.is('select')) {
                    return;
                }

                select.addClass('dropper-original');

                // Setup DOM Elements
                var dropper         = $('<div class="dropper"></div>').insertAfter(select),
                    dropperClass    = 'dropper-select',
                    dropperSelect   = $('<div class="' + dropperClass + '"></div>').appendTo(dropper),
                    dropperList     = $('<ul class="dropper-list"></ul>').appendTo(dropper),
                    openClass       = 'dropper-open';

                function closeIt() {
                    dropperSelect.removeClass(openClass);
                    dropperList.hide();
                }

                function openIt() {
                    dropperSelect.addClass(openClass);
                    dropperList.show();
                }

                function toggleIt() {
                    dropperSelect.toggleClass(openClass);
                    dropperList.toggle();
                }

                function selectIt(el, preventTrigger) {

                    var $el   = el ? el : dropperList.children().eq(0);
                        value = $el.attr('data-option');

                    dropperSelect.html($el.html());

                    if (!preventTrigger) {
                        select.val(value).trigger('change');
                    }

                    closeIt();
                }

                // listen for click on the dropper select
                dropperSelect.on('click', toggleIt);

                // Setup each option
                selectOpt.each(function() {

                    var $this   = $(this),
                        html    = $this.html(),
                        val     = $this.val(),
                        item    = $('<li></li>').appendTo(dropperList);

                    item.attr('data-option', val).html(html);
                    item.on('click', null, function() {
                        selectIt(item);
                    });

                });


                // Listen for dynamic changes on the original dropdown
                select.on('change', function() {

                    var index   = this.selectedIndex,
                        el      = dropperList.children().eq(index);

                    selectIt(el, true);

                });


                //Listen for click outside the select
                $('body').children().eq(0).on('click', function(e) {

                    var target = $(e.target);

                    if (target.is(select) || target.is(dropper) || target.closest('.dropper').length) {
                        return;
                    } else {
                        closeIt();
                    }

                });

                selectIt();

            });
        }

    });

})(jQuery);