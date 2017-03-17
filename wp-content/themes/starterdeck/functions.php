<?php

/**
 * Include composer vendors, if it exists
 */
if ( file_exists( dirname( __FILE__ ) . '/lib/vendor/autoload.php' ) ) {
  require_once( dirname( __FILE__ ) . '/lib/vendor/autoload.php' );
}

/**
 * Instantiate app classes
 */
new SD\CustomPostTypes();
new SD\CustomTaxonomies();
new SD\Enqueue();
new SD\Media();
new SD\Search();
new SD\Setup();
new SD\Social();
new SD\Twig();
new SD\TinyMCE();

