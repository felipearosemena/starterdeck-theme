<?php

namespace SD;

use Timber;
use TimberMenu;
use TimberSite;
use Twig_Filter_Function;
use Twig_SimpleFunction;
use Kint;

class Twig extends TimberSite {

  /**
   * Directory that holds the twig template files
   */
  public $templateDir = array(
    'views',
  );

  public function __construct() {
    add_filter( 'timber_context', array( &$this, 'add_to_context' ) );
    add_filter( 'get_twig', array( $this, 'get_twig__addFilters' ) );

    Timber::$dirname = $this->templateDir;

    parent::__construct();

  } /* __construct() */

  /**
   * Add elements to the array passed to all templates
   *
   * @param (array) $context - The pre-existing information
   * @return array
   */
  public function add_to_context( $context ) {
    $context['site']           = $this;
    $context['src_uri']        = get_stylesheet_directory_uri() . '/src/';
    $context['wp_title_right'] = wp_title( '|', false, 'right' );

    $context['main_menu']     = new TimberMenu( 'main-nav' );
    $context['footer_menu']    = new TimberMenu( 'footer-nav' );

    if ( function_exists( 'get_fields' ) ) {
      $context['global_info']    = get_fields( 'options' );
    }

    return $context;
  }

  /**
   * Custom Twig Filters and Extensions
   */

  public function get_twig__addFilters($twig) { 

    $twig->addFilter('char_limit', new Twig_Filter_Function(array(&$this, 'filter_charLimit' )));
    $twig->addFilter('debug', new Twig_Filter_Function(array(&$this, 'filter_kintDebug' )));
    $twig->addFilter('file_get_contents', new Twig_Filter_Function(array(&$this, 'filter__file_get_contents' )));
    $twig->addFilter('link_vars', new Twig_Filter_Function(array(&$this, 'filter__link_vars' )));

    return $twig;

  } /* get_twig() */

  /**
   * Limits the character output of a string, adding elipsis if the result was trimmed.
   */
  public function filter_charLimit( $string, $limit ) {
    if(is_string($string)) {
      $len = strlen($string);
      return $len >= $limit ? substr($string, 0, $limit - $len) . '...' : $string;
    }
  }

  /**
   * Output value through the Kint debugger, fallback to var_dump if Kint is not available
   */
  public function filter_kintDebug( $value ) {
    return class_exists('Kint') ? Kint::dump($value) : var_dump($value);
  }

  /**
   * Twig filter for php `file_get_contents` function
   */

  public function filter__file_get_contents( $url ) {
    return @file_get_contents($url);
  }

  /**
   *
   * Twig filter to get internal/external link variables, as well as the target
   *
   * @param array $vars Array of variables to get the link from
   * @param string $vars['link_type'] Must be equal to "internal" or "external"
   * @param string $vars['link_internal']
   * @param string $vars['link_external']
   *
   * @return array Link object with the correct link and target
   * @return string array['href'] Link object href
   * @return string array['target'] Target for the link
   * 
   */

  public function filter__link_vars( $vars ) {

    $type = $vars['link_type'];
    $internal = $vars['link_internal'];
    $external = $vars['link_external'];

    $link = array();

    if($type == 'internal') {
      $link['href'] = $internal;
      $link['target'] = '_self';
    } elseif ($type == 'external') {
      $link['href'] = $external;
      $link['target'] = '_blank';
    }

    return $link['href'] ? $link : false;

  }
}
