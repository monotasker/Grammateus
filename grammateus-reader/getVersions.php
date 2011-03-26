<?php
  header('content-type:application/xml;charset=utf-8');
  //retrieve reference information
	$doc=$_REQUEST["book"];

  //set file path for xml document
	$bookpath="http://www.tyndale.ca/~ocp/sites/default/docs/".$doc.".xml";

  //load xml file into memory
	$bookxml=simplexml_load_file($bookpath);
  $structure=$bookxml->xpath('/book/@textStructure');
  $list = '<?xml version="1.0" encoding="UTF-8" ?><book textStructure="' . $structure[0] . '">';

  //loop through the following for each version entity of the xml file
  foreach($bookxml->xpath('/book/version') as $version){
      $versionTitle = $version->xpath('./@title');
      $versionLanguage = $version->xpath('./@language');
      $versionFragment = $version->xpath('./@fragment');
      $list .= "<version title='" . $versionTitle[0] . "' language='" . $versionLanguage[0] . "' fragment='" . $versionFragment[0] . "'>";

      foreach ($version->xpath('./divisions/division') as $division){
        $list .= $division->asXML();
      }

      $list .= "<manuscripts>";
      //loop for each ms
      foreach($version->xpath('./manuscripts/ms') as $ms){
        $list .= $ms->asXML();
      }
      $list .= "</manuscripts>";

      //loop for each first-level div
      foreach($version->xpath('./text/div') as $div1){
        $div1num = $div1->xpath('./@number');
        $list .= "<div number='" . $div1num[0] . "' />";
      }

      $list .= "</version>";

	};

  $list .= '</book>';
  $xmlstr = (string)$list;
  $xmlobj = simplexml_load_string($xmlstr);
  echo $xmlobj->asXML();
