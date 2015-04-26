/*

  Offcanvas

  JQuery plugin for offcanvas navigation

  Author: Felipe Arosemena
  Date: 7 Sep 2014

*/

(function($) {

    //Setup the jQuery Object;
    $.offCanvas = function(menuEl) {

        //Setup a config object, to which we will add the different elements that we use
        // this way we can reference them from inside any method by calling: config.element
        var config = {};

        // Our main module
        var offCanvasObj = {

            // Gets the ball rolling

            init: function() {

                // Query the DOM for all the elements we need to interact with
                var outerWrap = $('.off-canvas, .off-canvas--fixed'),
                    innerWrap = outerWrap.find('.off-canvas__inner'),
                    buttonEl = $('.js-navigation-toggle'),
                    exitEl = $('<div class="exit-off-canvas"></div>'),
                    menu = menuEl,
                    dir = this.getDirection(menu);

                // and store them into our config object
                config.outer = outerWrap;
                config.inner = innerWrap;
                config.button = buttonEl;
                config.exit = exitEl;
                config.direction = dir;
                config.menu = menu;
                config.movingClass = 'moving';

                // Call our method to toggle and close the menu
                this.setExit();
                this.setToggle();

                //Special workaround for  < IOS7 devices (don't suport vh)
                this.iosRearrange();

            },

            addClickListener: function(el, callback) {
                var self = this;

                // Helper variable used to prevent 
                // firing btn click event multiple times
                var flag = false;
                el.on('click touchstart', function(e) {

                    if (!flag) {
                        flag = true;
                        setTimeout(function() {
                            flag = false;
                        }, 100);

                        callback();
                    }

                    return false;

                });

            },

            // Add listeners to the toggle button
            // to toggle the required class to open it
            setToggle: function() {

                var self = this;

                config.inner.on('webkitTransitionEnd transitionend oTransitionEnd', function(e) {
                    config.outer.removeClass(config.movingClass);
                });

                self.addClickListener(config.button, function() {
                    config.outer.addClass(config.movingClass).toggleClass(config.direction);
                });

                // Call the method to handle page transitions
                self.pageTransitionClose();
            },

            // Append a div to the 'inner' element and attach a listener to close the menu
            setExit: function() {

                var self = this;

                config.outer.append(config.exit);

                self.addClickListener(config.exit, self.closeMenu);

            },
            // Closes it
            closeMenu: function() {

                config.outer.addClass(config.movingClass).removeClass(config.direction);
            },
            // Get which direction we are moving the menu to
            getDirection: function(menu) {

                // the value returned is the class required to pan the screen either to the left or to the right
                return menu.attr('class').match(/left/g) ? 'move-right' : 'move-left';

            },
            getDirectionClass: function(menu) {
                // the value returned is the class added to the offcanvas container to allow animation with fixed position
                return menu.attr('class').match(/left/g) ? 'off-canvas--right' : 'off-canvas--left';
            },

            // handle page transitions and anchor interactions inside the menu
            pageTransitionClose: function() {

                var anchors = config.menu.find('a'); //get the anchors inside the menu
                var self = this;


                anchors.each(function() {
                    var $this = $(this),
                        href = $this.prop('href');

                    // When we click on an anchor inside the menu
                    // First we want to close the menu
                    $this.on('click', function(e) {

                        self.closeMenu();

                        // If the anchor clicked is the page we are in, do nothing
                        if (window.location.href === href) {

                            e.preventDefault();

                            return;

                        } else {
                            // otherwise, follow the link
                            window.location = href;

                        }

                    });

                }); // end anchor.each()

            }, // end pageTransitionClose
            iosRearrange: function() {

                var IS_IOS = !!navigator.userAgent.match(/i(iPad|Phone|Pod)/i),
                    IS_FIXED = (config.outer.attr('class').indexOf('fixed') > -1);

                // If it's ios we move the menu outside of the offcanvas__inner element
                // css has a workaround for ios
                if (IS_IOS && IS_FIXED) {
                    config.outer.append(config.menu);
                    $('body').addClass('is-ios');
                }
            }

        };

        // Kick off!
        offCanvasObj.init();

    };

    // We call the method on document ready
    // Just need to include the file in your script, add the proper classes and 
    // DOM structure and the offcanvas will be setup
    $(document).ready(function() {

        var menu = $('[class*=off-canvas-menu]');
        if (menu.length) {
            $.offCanvas(menu);
        }

    });


})(jQuery);