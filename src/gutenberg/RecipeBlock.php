<?php

namespace ZRDN;

use ZRDN\Recipe as RecipeModel;
use ZRDN\ZipRecipes;

/**
 * Gutenberg Recipe Block
 *
 * Add feature blocks using Gutenberg
 *
 * PHP version 5.3
 * Depends: WP REST API, Plugin Dependencies
 *
 * @package    Zip Recipes
 * @author     Mudassar Ali <sahil_bwp@yahoo.com>
 * @copyright  2017 Gezim Hoxha
 * @version 1.0
 */
class RecipeBlock {


	function __construct() {


		$relativeScriptPath = 'gutenberg/build/recipe.min.js'; // TODO: fix this

		wp_register_script(
			'recipe-block',
			ZRDN_PLUGIN_DIRECTORY_URL . $relativeScriptPath, // File.
			array(
				'wp-components',
				'wp-blocks',
				'wp-i18n',
				'wp-compose',
				'wp-editor',
				'wp-data',
				'wp-element',
				'underscore'
			), // Dependencies.
			filemtime( ZRDN_PLUGIN_DIRECTORY . $relativeScriptPath ) // filemtime — Gets file modification time.
		);

		$relativeStylePath = 'gutenberg/assets/styles/bulma.css';
		wp_register_style(
			'recipe-block-editor',
			ZRDN_PLUGIN_DIRECTORY_URL . $relativeStylePath,
			array( 'wp-edit-blocks' ),
			filemtime( ZRDN_PLUGIN_DIRECTORY . $relativeStylePath ) // filemtime — Gets file modification time.
		);

		$relativePathForBulmaMinireset = 'gutenberg/assets/styles/bulma-minireset-generic.css';
		wp_register_style(
			'recipe-block-editor-mini-reset',
			ZRDN_PLUGIN_DIRECTORY_URL . $relativePathForBulmaMinireset,
			array( 'wp-edit-blocks' ),
			filemtime( ZRDN_PLUGIN_DIRECTORY . $relativePathForBulmaMinireset ) // filemtime — Gets file modification time.
		);


		register_block_type( 'zip-recipes/recipe-block', array(
			'editor_script'   => 'recipe-block',
			'editor_style'    => array( 'recipe-block-editor-mini-reset', 'recipe-block-editor' ),
			'render_callback' => array( $this, 'block_renderer' ),
		) );

	}

	function block_renderer( $atts ) {
		$id = $atts['id'];

		$recipe = RecipeModel::db_select($id);
		return ZipRecipes::zrdn_format_recipe($recipe);
	}

}

new RecipeBlock();
