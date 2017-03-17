<?php

namespace SD;

class Setup {

  public function __construct() {
    // Scripts and styles
    add_action( 'after_setup_theme', array( &$this, 'after_setup_theme__addThemeSupports' ) );

    add_filter( 'body_class', array( &$this, 'body_class__filterBodyClass' ) );
    // Register Menus 
    add_action('init', array(&$this, 'init__registerMenus') );
    // Add Options page
    add_action( 'init', array( &$this, 'init__setupOptions' ) );

    // Remove WP Emoji Scripts
    add_action( 'init', array(&$this, 'init__removeEmojis') );

    // hide admin bar in front end
    if ( !is_admin() && WP_DEBUG ) {
      add_filter( 'show_admin_bar', '__return_false' );
    }
  } /* __construct() */


  /**
   * Setup theme
   */

  public function after_setup_theme__addThemeSupports() {
    // add theme supports
    add_theme_support( 'post-formats' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'menus' );

  } /* after_setup_theme() */


  /**
   * Register menus
   */

  public function init__registerMenus() {
    register_nav_menus( array(
      'main-nav'    => 'Main Navigation' ,
      'footer-nav'  => 'Footer Navigation'
    ) );
  }


  /**
   * initialize the options page
   */

  public function init__setupOptions() {
    if ( function_exists( 'acf_add_options_page' ) ) {
      acf_add_options_page( 'Global Settings' );
    }
  } /* init__setupOptions() */

  /**
   * Filters body class. For usage with Javascript Router
   * 
   * @param (array) $classes - WP body classes
   * @return array
   */
  public function body_class__filterBodyClass( $classes ) {

    if(get_post()){
      global $post;
      $id = $post -> ID ;

      $current_theme = get_post_meta( $id, '_wp_page_template', true );

      // remove .page-template* classes
      foreach($classes as $key => $value) {
        if (substr($value, 0 , 13 ) === 'page-template') {
          unset($classes[$key]);
        }
      }

      $class  = '';
      $directory        = 'templates/';
      $directory_strlen = strlen($directory);

      // cleanup the class for the page templates inside page-templates directory
      if(substr($current_theme, 0 , $directory_strlen ) === $directory ) {
          $class = substr (substr($current_theme, $directory_strlen), 0, -4); // cleanup the class returned to match the page template's name
      }

      if($class != 'home') {
          $classes[] = $class;
      }
    }

    return $classes;
  }

  /**
   * Remove Emoji scripts and all related evil
   */
  public function init__removeEmojis() {
    remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
    remove_action( 'wp_print_styles', 'print_emoji_styles' );
  }
}
