<?php 

$context = Timber::get_context();
$post    = new TimberPost();
$context['post'] = $post;
$context['categories_list'] = wp_list_categories('echo=0&title_li=');

// Previous/Next post links
$prev_link =  get_permalink(get_adjacent_post(false,'',false));
$next_link =  get_permalink(get_adjacent_post(false,'',true));
// If there is not prev/next post, the functions above will return the current post instead
// For that, we check if $prev_link/$next_link is equal to the current page, if so make the link null
$context['prev_link'] = ($prev_link != get_permalink()) ? $prev_link : null ;
$context['next_link'] = ($next_link != get_permalink()) ? $next_link : null;


Timber::render('single.twig', $context);
