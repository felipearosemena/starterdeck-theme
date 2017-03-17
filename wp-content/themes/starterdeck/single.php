<?php
/**
 * The Template for displaying all single posts
 */

$context = Timber::get_context();
$post = new TimberPost();
$context['post'] = $post;
$context['share_post'] = new BW\SharePost();

$template = post_password_required() ? 'single-password.twig' : 'single.twig';

Timber::render( $template, $context );
