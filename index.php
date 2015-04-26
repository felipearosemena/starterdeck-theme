<?php 

$context                    = Timber::get_context();
$context['posts']           = lms_get_posts();
$context['page_title']      = get_the_title( get_option('page_for_posts', true) );
$context['sidebar']         = Timber::get_widgets('sidebar-blog'); // slug of sidebar to be included in this template

//  Accepts same array as argument as paginate_links(). Must be array.
$context['pagination']      = Timber::get_pagination(); 

$context['categories_list'] = wp_list_categories('echo=0&title_li='); 

Timber::render('index.twig', $context);
