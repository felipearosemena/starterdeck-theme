<?php

namespace SD;

use Timber;

class Media {

  public function __construct() {

    add_filter( 'embed_oembed_html', array( &$this, 'embed_oembed_html__updateEmbeddedMarkup' ), 90, 3 );

    // update the markup for the gallery so it's not outputting inline styles
    add_filter( 'gallery_style', array( &$this, 'gallery_style__changeGalleryMarkup' ) );
    // Add Image Sizes
    add_action( 'init', array( &$this, 'init__addImagesSizes' ) );

  } /* __construct() */


  /**
   * Add Image Sizes
   *
   */

  public function init__addImagesSizes() {

    add_image_size('hero_full', 1920);
    add_image_size('hero_md', 1280);
    add_image_size('hero_sm', 640);
    add_image_size('card', 320, 320, true);
    add_image_size('card-md', 460, 420, true);

  } /* init__addImagesSizes() */

  /**
   * change the markup for the gallery so we won't have to use IDs to style
   *
   * @param
   * @return
   */

  public function gallery_style__changeGalleryMarkup( $a ) {

    // $a outputs just the inline styles and the opening div tag for the div with the ID of the gallery
    $output = '<div class="gallery gallery-size-thumbnail">';

    return $output;

  } /* gallery_style__changeGalleryMarkup() */

  /**
   *
   * Update the markup outputted by WP oembed for videos
   */
  
  public function embed_oembed_html__updateEmbeddedMarkup($cache, $url, $attr) {

    $video_service = Video::getVideoService($url);

    if(!$video_service || is_admin()) {
      return $cache;
    }

    return '<div class="embed-wrapper">' . $cache . '</div>';

  }

}
