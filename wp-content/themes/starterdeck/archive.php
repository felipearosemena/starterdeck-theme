<?php
/**
 * Default archive template for WordPress
 * 
 * @package archive.php
 * @since 1.0
 */

$templates = array( 'archive.twig', 'index.twig' );

$context = Timber::get_context();

$context['title'] = 'Archive';
if ( is_day() ) {
  $context['title'] = 'Archive: '.get_the_date( 'D M Y' );
} else if ( is_month() ) {
  $context['title'] = 'Archive: '.get_the_date( 'M Y' );
} else if ( is_year() ) {
  $context['title'] = 'Archive: '.get_the_date( 'Y' );
} else if ( is_tag() ) {
  $context['title'] = single_tag_title( '', false );
} else if ( is_category() ) {
  $context['title'] = single_cat_title( '', false );
  array_unshift( $templates, 'archive-' . get_query_var( 'cat' ) . '.twig' );
} else if ( is_post_type_archive() ) {
  $context['title'] = post_type_archive_title( '', false );
  array_unshift( $templates, 'archive-' . get_post_type() . '.twig' );
}

$context['posts'] = Timber::get_posts();

//  Accepts same array as argument as paginate_links(). Must be array.
$context['pagination']      = Timber::get_pagination();

Timber::render( $templates, $context );
