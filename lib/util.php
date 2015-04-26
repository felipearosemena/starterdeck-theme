<?php 

/*

	Utility Functions

*/

// Creates an ACF style image object
// To be used with the img macro.
function lms_get_image_object( $attachment_id ) {
  
    $attachment = get_post( $attachment_id );
    
    // validate
    if( !$attachment ) {
        return false; 
    }
    
    // create array to hold value data
    $src = wp_get_attachment_image_src( $attachment->ID , 'full' );
    
    $value = array(
        'id' => $attachment->ID,
        'alt' => get_post_meta($attachment->ID, '_wp_attachment_image_alt', true),
        'title' => $attachment->post_title,
        'caption' => $attachment->post_excerpt,
        'description' => $attachment->post_content,
        'mime_type' => $attachment->post_mime_type,
        'url' => $src[0],
        'width' => $src[1],
        'height' => $src[2],
        'sizes' => array(),
    );
    
    
    // find all image sizes
    $image_sizes = get_intermediate_image_sizes();
    
    if( $image_sizes ) {
        foreach( $image_sizes as $image_size ) {
            // find src
            $src = wp_get_attachment_image_src( $attachment->ID , $image_size );
            
            // add src
            $value[ 'sizes' ][ $image_size ] = $src[0];
            $value[ 'sizes' ][ $image_size . '-width' ] = $src[1];
            $value[ 'sizes' ][ $image_size . '-height' ] = $src[2];
        } // foreach( $image_sizes as $image_size )
    } // if( $image_sizes )
      
    return $value;
    
}   
    
function lms_get_posts(){
    
    $posts = Timber::get_posts();
    
    // Add the acf fields used 
    foreach($posts as &$post){
        $post->acf_fields = get_fields($post->ID);
    }
    
    return $posts;












// !!! this is test code



////////////////////   
//////////// Removing the yoast comment / marker

///////////
// $test = new WPSEO_Frontend;

// var_dump($test->debug_marker());


class WPSEO_Frontend extends WPSEO_Frontend {

  
   //  function debug_marker() {
   //    echo "Bar";
   // }



public function debug_marker(){return '';}

   // public function __set(debug_marker)
   //  {
   //      echo "Setting '$name' to '1'\n";
   //      $this->data[$name] = $value;
   //  }



}
}






function XUACompatible(){

    preg_match('/MSIE (.*?);/', $_SERVER['HTTP_USER_AGENT'], $matches);
    
    if(count($matches)<2) {
      preg_match('/Trident\/\d{1,2}.\d{1,2}; rv:([0-9]*)/', $_SERVER['HTTP_USER_AGENT'], $matches);
    }


    if (count($matches)>1) {
      //Then we're using IE
      $version = $matches[1];

      switch(true){
        case ($version<=8):
          echo '<meta http-equiv="X-UA-Compatible" content="IE=edge">';
          break;

        case ($version==9 || $version==10):
          echo '<meta http-equiv="X-UA-Compatible" content="IE=edge">';
          break;

        case ($version==11):
          break;

        default:
          echo '<meta http-equiv="X-UA-Compatible" content="IE=edge">';
      }
    }

}