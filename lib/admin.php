<?php

/*

    Admin

    Admin area configuration

*/

// Remove default login style
if (basename($_SERVER['PHP_SELF']) == 'wp-login.php') {
    add_action('style_loader_tag', create_function('$a', "return null;"));
}

// Drive login style
function login_css() {
    echo '<link rel="stylesheet" type="text/css" href="' . get_bloginfo('template_directory') . '/assets/css/login.css" />';
};
add_action('login_head', 'login_css');

// Drive login url
function login_screen_url() {
    return home_url();
};
add_filter('login_headerurl', 'login_screen_url');

function lms_login_logo() { ?>
    <style type="text/css">
        body.login div#login h1 a {
            background-image: url(<?php
    echo get_field('site_logo', 'options') ['url']; ?>);
        }
    </style>
<?php
}
add_action('login_enqueue_scripts', 'lms_login_logo'); 

// Hide the color options in the user profile
function admin_color_scheme() {
    global $_wp_admin_css_colors;
    $_wp_admin_css_colors = 0;
}

add_action('admin_head', 'admin_color_scheme'); 
