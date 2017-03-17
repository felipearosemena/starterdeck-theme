<?php
/**
 * Default Attachment Template
 */

$context = Timber::get_context();
$post = Timber::query_post();
$context['post'] = $post;
$context['attachment'] = new TimberImage($post->ID);

Timber::render( 'attachment.twig', $context );
