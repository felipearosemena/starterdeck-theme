<?php
/**
 Template Name: Elements Simple
 */

$context = Timber::get_context();
$post    = new TimberPost();
$context['post'] = $post;

Timber::render('styleguide.twig', $context);