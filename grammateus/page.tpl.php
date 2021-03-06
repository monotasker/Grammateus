<?php
// $Id: page.tpl.php,v 1.4 2009/07/13 23:52:58 andregriffin Exp $
?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN"
  "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<?php print $language->language ?>" >
  <head>
    <meta name="application-name" content="OCP"/>
    <meta name="description" content="The Online Critical Pseudepigrapha"/>
    <?php global $theme_path; global $base_url; $sitepath = $base_url .'/'. $theme_path .'/' ?>
    <title><?php print $head_title ?></title>
    <?php print $head ?>
    <link rel="icon" href="/<?php print $theme_path; ?>/images/favicon.ico" sizes"16x16 24x24 32x32 48x48 64x64 128x128" type="image/x-icon" >
    <link rel="icon" href="/<?php print $theme_path; ?>/images/favicon_32.png" sizes="32x32" type="image/png" />
    <link rel="icon" href="/<?php print $theme_path; ?>/images/favicon_48.png" sizes="48x48" type="image/png" />
    <link rel="apple-touch-icon" href="/<?php print $theme_path; ?>/images/favicon_72.png" type="image/png" sizes="72x72" />
    <link rel="apple-touch-icon-precomposed" href="/<?php print $theme_path; ?>/images/favicon_precomposed_72.png" sizes="72x72" type="image/png" />
    <?php print $styles ?>
    <?php print $scripts ?>


    <!--[if lte IE 7]><?php print grammateus_get_ie_styles(); ?><![endif]--> <!--If Less Than or Equal (lte) to IE 7-->
  </head>
  <body<?php print grammateus_body_class($left, $right); ?>>
    <!-- Layout -->
    <div class="container"> <!-- add "showgrid" class to display grid -->

      <div id="header" class="clearfix">

       <div id="headerblocks">
		<?php if ($site_name): ?>
            <h1 class="sitename"><a href="<?php print check_url($front_page); ?>" title="<?php print check_plain($site_name); ?>"><?php print check_plain($site_name); ?></a></h1>
        <?php endif; ?>
        <?php print $header; ?>
       </div>

      <div id="headertitle">
          <?php if ($title): print '<h2'. ($tabs ? ' class="with-tabs"' : '') .'>'. $title .'</h2>'; endif; ?>
      </div><!-- /#node title -->

        <?php if ($logo): ?>
          <img src="<?php print check_url($logo); ?>" alt="<?php print check_plain($site_name); ?>" id="logo" />
        <?php endif; ?>
        <div id="siteslogan">
          <?php if ($site_slogan): ?>
            <span id="siteslogan"><?php print check_plain($site_slogan); ?></span>
          <?php endif; ?><!-- /#sitename -->
      </div>

        <?php if ($search_box): ?><?php print $search_box ?><?php endif; ?>
      <div id="nav">
        <?php if ($tabs): print '<div id="tabs-wrapper"><ul class="tabs primary">'. $tabs .'</ul>'; endif; ?>
        <?php if ($tabs2): print '<ul class="tabs secondary">'. $tabs2 .'</ul>'; endif; ?>
        <?php if ($tabs): print '</div>'; endif; ?>
        <?php if ($nav): ?>
          <?php print $nav ?>
          <div id="nodelinks" class="links">
            <?php print $links; ?>
            <?php print $feed_icons ?>
          </div>
        <?php endif; ?>
        <?php if ($node->type != "document_text" && $node->type != "editing_page"): print $breadcrumb; endif; ?>
      </div> <!-- /#nav -->

      </div> <!-- /#header -->

			<?php if ($left): ?>
        <div id="sidebar-left" class="sidebar">
          <?php print $left ?>
        </div> <!-- /#sidebar-left -->
      <?php endif; ?>
      <?php if ($right): ?>
        <div id="sidebar-right" class="sidebar">
          <?php print $right ?>
        </div> <!-- /#sidebar-right -->
      <?php endif; ?>
      <div id="main">

<!--        <?php if ($mission): print '<div id="mission">'. $mission .'</div>'; endif; ?>  -->
<!--        <?php if ($title): print '<h2'. ($tabs ? ' class="with-tabs"' : '') .'>'. $title .'</h2>'; endif; ?> -->
        <?php if ($show_messages && $messages): print $messages; endif; ?>
        <?php print $help; ?>
        <?php print $content ?>
        <br />
        <br />
        <br />

      </div> <!-- /#main -->


      <div id="footer" class="clear">
        <?php print $footer_message . $footer ?>
        <?php print $feed_icons ?>
      </div> <!-- /#footer -->

    </div> <!-- /.container -->
    <!-- /layout -->

  <?php print $closure ?>
  </body>
</html>

