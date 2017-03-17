<?php
/**
 * The main template file
 */ 

$context = Timber::get_context(); 
$context['posts'] = Timber::get_posts();
$context['title'] = get_the_title( get_option('page_for_posts', true) );

//  Accepts same array as argument as paginate_links(). Must be array.
$context['pagination'] = Timber::get_pagination();

Timber::render('index.twig', $context);
