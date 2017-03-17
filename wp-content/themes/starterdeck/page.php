<?php
/**
 * The template for displaying all pages.
 */

$context = Timber::get_context();
$post = new TimberPost();
$context['post'] = $post; 

Timber::render( 'page.twig', $context );
