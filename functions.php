<?php 
/**
 * Main Theme php library and functions reference
 *
 *
 * PHP version 5
 *
 *
 * @author     Felipe Arosemena <felipe@drivedigital.ca>
 * @version    0.1
 * @since      0.1
 */



include('lib/admin.php');                           // Admin config
include('lib/comment-tag.php');                     // Comment Template Tag
include('lib/util.php');                            // Utility functions
include('lib/thumbs.php');                          // Site Image Sizes
include('lib/scripts.php');                         // Scripts and Styles Enqeueuing
include('lib/sidebars.php');                        // Site Sidebars
include('lib/widgets.php');                         // Site Widgets

// Third Party Libraries
include('lib/kint/Kint.class.php');                 // Debugging tool
include('lib/timber/timber.php');                   // Timber library

// Plugin Configuration
if (class_exists( 'GFForms' ) ) {
    include('lib/gravity-forms-config.php');        // Gravity Forms config
} 

// global theme configuration, always include last
include('lib/config.php');                          // Site config ( Load Last to ensure dependencies are present )


?>