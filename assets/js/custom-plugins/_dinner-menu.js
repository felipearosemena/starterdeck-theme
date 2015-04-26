/*

  DinnerMenu

  JQuery plugin for responsive overlay navigation

  Author: Felipe Arosemena
  Date: 23 Jan 2015

*/

(function ($) {
    
    $.fn.extend({

        dinnerMenu: function(options) {

            var cf = {
                btn         : this,
                target      : $(this.attr('data-target')),
                activeClass : 'dinner-menu-active',
                transClass  : ' dinner-menu-transiting',
                header      : $('.js-dinner-menu-header'),
                parentEL    : $('html')
            };

            if(!cf.target.length || !cf.header.length ) {
                return;
            }

            var IS_FIXED = ( cf.header.attr('class').indexOf('fixed') > -1 ),
                IS_OPEN  = false; 

            function open(){
                cf.btn.addClass(cf.activeClass);
                cf.parentEL.addClass( cf.activeClass + cf.transClass );
                cf.target.css('paddingTop', cf.header.outerHeight() );
                IS_OPEN = true;
            }

            function close(){
                cf.btn.removeClass(cf.activeClass);
                cf.parentEL.removeClass(cf.activeClass);
                IS_OPEN = false;
            }

            cf.target.on('webkitTransitionEnd transitionend oTransitionEnd', function(e){
                if(!IS_OPEN){
                    cf.parentEL.removeClass(cf.transClass);
                    cf.target.css('paddingTop', 0 );
                }
            });
          
            // Helper variable used to prevent 
            // firing btn click event multiple times
            var flag = false; 

            cf.btn.on('click touchstart', function(){

                if (!flag) {
                    flag = true;
                    setTimeout(function(){ flag = false; }, 100);
                    ($(this).hasClass(cf.activeClass) ) ? close() : open();
                }

                return false;

            });

            // Close on resize
            window.addEventListener('resize',close);

            if(IS_FIXED){
                $('body').css('overflow','visible');
            }

        }

    });

    $(document).ready(function(){
        $('.js-navigation-toggle').dinnerMenu();
    });

})(jQuery);