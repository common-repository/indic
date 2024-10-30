<?php
/*
 * Plugin Name: Indic Transliteration
 * Plugin URI: http://wordpress.org/extend/plugins/indic/
 * Version: 0.92
 * Description: Indic transliteration for the visual editor. Behind the scenes uses <a href="http://www.var-x.com/gamabhana/">Gamabhana library</a>.
 * Author: Automattic Inc.
 * Author URI: http://automattic.com/
 */
 
class Indic_Translit {
	function __construct() {
		$this->Indic_Translit();
	}

	function Indic_Translit() {
		$this->indic_path = '/'.PLUGINDIR.'/indic';
		$this->plugin_path = "$this->indic_path/tinymce";
		$this->gamabhana_path = "$this->indic_path/gamabhana";

		if (false !== $this->script) {
			add_filter('mce_buttons', array(&$this, 'add_mce_button'));
			add_filter('mce_plugins', array(&$this, 'add_mce_plugin'));
			add_action('admin_print_scripts', array(&$this, 'enqueue_js'));
		}
	}

	function enqueue_js() {
		global $editing;
		if (!isset($editing) || !$editing || !user_can_richedit()) {
			return;
		}
		wp_enqueue_script('indic_GA1000', $this->gamabhana_path.'/GA1000.js', 1);
		wp_enqueue_script('indic_GA0010', $this->gamabhana_path.'/GA0010.js', 1);
		wp_enqueue_script('indic_lib', $this->gamabhana_path.'/gamabhanaLib.js', 1);
		wp_enqueue_script('indic_tinymce', $this->plugin_path.'/editor_plugin.js', array('wp_tiny_mce'), 5);
		// dirty hack: since in 2.3.x script localizations are loaded *after* the script itself,
		// we attach it to the previous libary, so that it is loaded before our script
		wp_localize_script('indic_lib', 'IndicOptions', array(
			'plugin_url' => get_option('siteurl').$this->plugin_path,
			'plugin_locale' => $this->get_plugin_locale(),
		));
	}
	function get_plugin_locale() {
		$locale = get_locale();	
		if (is_file(ABSPATH . $this->plugin_path . '/langs/'.$locale)) {
			return $locale;
		}
		return 'en';
	}

	function add_mce_plugin($plugins) {
		$plugins[] = 'indic';
		return $plugins;
	}

	function add_mce_button($buttons) {
		$wp_adv_place = array_search('wp_adv', $buttons);
		if (false !== $wp_adv_place) {
			array_splice($buttons, $wp_adv_place, 0, array('indic'));
		}
		return $buttons;
	}

	function init() {
		$indic = new Indic_Translit;
	}
}

add_action('init', array('Indic_Translit', 'init'));
?>
