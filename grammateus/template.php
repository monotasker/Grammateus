<?php
// $Id: template.php,v 1.4 2009/07/13 23:52:57 andregriffin Exp $

/**
 * Sets the body-tag class attribute.
 *
 * Adds 'sidebar-left', 'sidebar-right' or 'sidebars' classes as needed.
 */
function grammateus_body_class($left, $right) {
  $class = array();

  if ($left != '' && $right != '') {
    $class[] = 'sidebars';
  }
  elseif ($left != '') {
    $class[] = 'sidebar-left';
  }
  elseif ($right != '') {
    $class[] = 'sidebar-right';
  }

  if (arg(0) == 'admin') {
    $class[] = 'admin';
  }

  if ($class) {
    print ' class="' . implode(' ', $class) . '"';
  }
}

/**
 * Return a themed breadcrumb trail.
 *
 * @param $breadcrumb
 *   An array containing the breadcrumb links.
 * @return a string containing the breadcrumb output.
 */
function phptemplate_breadcrumb($breadcrumb) {
  if (!empty($breadcrumb)) {
// uncomment the next line to enable current page in the breadcrumb trail
//    $breadcrumb[] = drupal_get_title();
    return '<div class="breadcrumb">'. implode(' » ', $breadcrumb) .'</div>';
  }
}

/**
 * Allow themable wrapping of all comments.
 */
function grammateus_comment_wrapper($content, $node) {
  if (!$content || $node->type == 'forum') {
    return '<div id="comments">'. $content .'</div>';
  }
  else {
    return '<div id="comments"><h2 class="comments">'. t('Comments') .'</h2>'. $content .'</div>';
  }
}

/**
 * Override or insert PHPTemplate variables into the templates.
 */
function grammateus_preprocess_page(&$vars) {
  $vars['tabs2'] = menu_secondary_local_tasks();

  /** use jquery version 1.4.2 instead of default version only on document_text and editing_page node types **/
  $path = drupal_get_path_alias($_GET['q']);
  if ($vars['node']->type == "document_text" || $vars['node']->type == "editing_page") {
    $scripts = drupal_add_js();
    $new_jquery = array('sites/all/libraries/jquery14/jquery-1.4.2.js' => $scripts['core']['misc/jquery.js']);
    $scripts['core'] = array_merge($new_jquery, $scripts['core']);
    unset($scripts['core']['misc/jquery.js']);

    $vars['scripts'] = drupal_get_js('header', $scripts);
  }

}

/**
 * Returns the rendered local tasks. The default implementation renders
 * them as tabs. Overridden to split the secondary tasks.
 *
 * @ingroup themeable
 */
function phptemplate_menu_local_tasks() {
  return menu_primary_local_tasks();
}

function grammateus_comment_submitted($comment) {
  return t('by <strong>!username</strong> | !datetime',
    array(
      '!username' => theme('username', $comment),
      '!datetime' => format_date($comment->timestamp)
    ));
}

function phptemplate_node_submitted($node) {
  return t('!datetime | by <strong>!username</strong>',
    array(
      '!username' => theme('username', $node),
      '!datetime' => format_date($node->created),
    ));
}

/**
 * Override or insert variables into the block templates.
	*
 * @param $vars
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("block" in this case.)
 */
function grammateus_preprocess_block(&$vars, $hook) {
  $block = $vars['block'];

  // Special classes for blocks.
  $classes = array('block');
  $classes[] = 'block-' . $block->module;
  $classes[] = 'region-' . $vars['block_zebra'];
  $classes[] = $vars['zebra'];
  $classes[] = 'region-count-' . $vars['block_id'];
  $classes[] = 'count-' . $vars['id'];

  $vars['edit_links_array'] = array();
  $vars['edit_links'] = '';
  if (user_access('administer blocks')) {
    include_once './' . drupal_get_path('theme', 'grammateus') . '/template.block-editing.inc';
    grammateus_preprocess_block_editing($vars, $hook);
    $classes[] = 'with-block-editing';
  }

  // Render block classes.
  $vars['classes'] = implode(' ', $classes);
}

/**
 * Generates IE CSS links.
 */
function grammateus_get_ie_styles() {
  $iecss = '<link type="text/css" rel="stylesheet" media="all" href="'. base_path() . path_to_theme() .'/ie.css" />';
  return $iecss;
}

function grammateus_get_ie6_styles() {
  $iecss = '<link type="text/css" rel="stylesheet" media="all" href="'. base_path() . path_to_theme() .'/ie6.css" />';
  return $iecss;
}


/**
 * Adds even and odd classes to <li> tags in ul.menu lists
 */

function phptemplate_menu_item($link, $has_children, $menu = '', $in_active_trail = FALSE, $extra_class = NULL) {
  static $zebra = FALSE;
  $zebra = !$zebra;
  $class = ($menu ? 'expanded' : ($has_children ? 'collapsed' : 'leaf'));
  if (!empty($extra_class)) {
    $class .= ' '. $extra_class;
  }
  if ($in_active_trail) {
    $class .= ' active-trail';
  }
  if ($zebra) {
    $class .= ' even';
  }
  else {
    $class .= ' odd';
  }
  return '<li class="'. $class .'">'. $link . $menu ."</li>\n";
}
