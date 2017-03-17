<?php

namespace SD;

class Utils {

  /**
   * Utilize Wordpress's default oembed function to embed videos
   * 
   * @param $url, $width = 0, $height = 0, $post_id = 0
   * @return shortcode
   */

  public static function embed_video_url( $url, $width = 0, $height = 0, $post_id = 0 ) {

    $wpembed = new WP_Embed();

    if ( !empty( $post_id ) ) {
      $wpembed->post_ID = $post_id;
    }

    $video_size = array(
      'width' => $width,
      'height' => $height,
    );

    return $wpembed->shortcode( $video_size, $url );

  } /* embed_video_url() */


  /**
   * Get a post from a given slug
   *
   * @param $slug = ''
   * @return $data
   */

  public static function getPagePostFromSlug( $slug = '', $type = '', $postType = null ) {

    if ( empty( $slug ) ) {
      return;
    }

    if ( empty( $postType ) ) {
      $postType = 'page';
    }

    $page = get_page_by_path( $slug, OBJECT, $postType );

    if ( empty( $page ) ) {
      return false;
    }

    return $page;

  } /* getPageDataFromSlug() */

  /**
   * get page post based on the template name
   *
   * @param $template = ''
   * @return $data
   */

  static public function getPageWithTemplate( $template = '' ) {

    if ( empty($template) ) {
      return;
    }

    $query = new \WP_Query(array(
      'post_type'  => 'page',
      'meta_key'   => '_wp_page_template',
      'meta_value' => 'templates/' . $template . '.php'
    ));

    if ( $query->have_posts() ) {
      return $query->posts[0];
    } else {
      return null;
    }

  }/* getPageWithTemplate() */



  /**
   * Transform an array to a url with query parameters
   * starting from a given base url.
   *
   * @param (string) $base_url - base url to build from
   * @param (array) $url_args - arguments to use to build url query
   * @return (string) new url with query parameters
   */
  static public function arrayToUrl( $baseUrl, $urlArgs = array() ) {

    $args = array();

    if ( !empty( $urlArgs ) ) {

      foreach($urlArgs as $key => $arg)
      {
        if ($arg)
          $args[] = $key .'='. $arg;
      }

    }

    $args = implode('&',$args);
    $baseUrl .= (strpos($baseUrl,'?') === false) ? '?' : '&';

    return $baseUrl . $args;

  }/* arrayToUrl() */
}
