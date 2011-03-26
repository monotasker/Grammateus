﻿<?php
  //retrieve reference information
	$doc=$_REQUEST["book"];

  //set file path for xml document 
	$bookpath="http://ocp.tyndale.ca/sites/default/docs/drafts/".$doc.".xml";

  //load xml file into memory
	$bookxml=simplexml_load_file($bookpath);

  $list = '<book>';

  //loop through the following for each version entity of the xml file
  foreach($bookxml->xpath('/book/version') as $version){
      $versionTitle = $version->xpath('./@title');
      $versionLanguage = $version->xpath('./@language');
      $list = $list . "<version title='" . $versionTitle[0] . "' language='" . $versionLanguage[0] . "'>";

      $list = $list . "<manuscripts>";
      //loop for each ms  
      foreach($version->xpath('./manuscripts/ms') as $ms){
        $list = $list . $ms->asXML();
      }
      $list = $list . "</manuscripts></version>";

	};

  $list = $list . '</book>';
  $xmlstr = (string)$list;
  $xmlobj = simplexml_load_string($xmlstr);
  echo $xmlobj->asXML();

?>
