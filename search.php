<?php 

$templates = array('search.twig', 'archive.twig', 'index.twig');
$context = Timber::get_context();
$context['title'] = 'Search results for '. get_search_query();
$context['query'] = get_search_query();
$context['posts'] = lms_get_posts();

Timber::render($templates, $context);