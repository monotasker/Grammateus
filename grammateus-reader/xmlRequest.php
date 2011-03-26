<?php header('Content-Type: application/xml;charset:utf-8');
  //retrieve reference information
	$doc=$_REQUEST["book"];
	$startRef1=$_REQUEST["startRef1"];
	$startRef2=$_REQUEST["startRef2"];
	$startRef3=$_REQUEST["startRef3"];
	$startRef4=$_REQUEST["startRef4"];
	$endRef1=$_REQUEST["endRef1"];
	$endRef2=$_REQUEST["endRef2"];
	$endRef3=$_REQUEST["endRef3"];
	$endRef4=$_REQUEST["endRef4"];

  //set file path for xml document
	$bookpath="http://www.tyndale.ca/~ocp/sites/default/docs/".$doc.".xml"; // for Tyndale server: /home/ocp/public_html/sites/default/docs/

  //load xml file into memory
	$bookxml=simplexml_load_file($bookpath);
	//find text structure (i.e., fragments or running text?)
	$textStructure = $bookxml->xpath('/book/@textStructure');

  //start assembling text string for xml snippet that will be returned to javascript
  $snippet = "<?xml version='1.0' encoding='UTF-8' ?><book>";

  //case for a fragmentary text structure
	if($textStructure[0]=='fragmentary'){
    foreach($bookxml->xpath('/book/version') as $version){
      $versionTitle = $version->xpath('./@title');
      $versionLanguage = $version->xpath('./@language');
      $versionFrag = $version->xpath('./@fragment');
      if($versionFrag[0]==$startRef1){
        //opening version tag
        $snippet .= "<version title='" . $versionTitle[0] . "' language='" . $versionLanguage[0] . "' >";
        //loop for each first-level div
        foreach($version->xpath('./text/div') as $div1){
          $snippet .= $div1->asXML();
        }
        //closing version tag
        $snippet .= "</version>";
      }
      else{
      }
	  }
	}
  //case for other text structures
  else{
  //loop for each version
  foreach($bookxml->xpath('/book/version') as $version){
    $versionTitle = $version->xpath('./@title');
    $versionLanguage = $version->xpath('./@language');
    //opening version tag
    $snippet .= "<version title='" . $versionTitle[0] . "' language='" . $versionLanguage[0] . "' >";

    //loop for each first-level div
    foreach($version->xpath('./text/div') as $div1){

      //retrieve the 'number' attribute for this div1 entity
      $div1num = $div1->xpath('./@number');

      //restrict display to chapters within the selected range
      if($div1num[0] >= $startRef1 && $div1num[0] <= $endRef1){
        if(is_null($startRef2)){
          $snippet .= $div1->asXML();
        }
        else{
          //loop for each second-level div
          $snippet .= "<div number='" . $div1num[0] . "'>";
          foreach($version->xpath('./text/div[@number="' . $div1num[0] . '"]/div') as $div2){
            //retrieve the 'number' attribute for this div1 entity
            $div2num = $div2->xpath('./@number');
            if(($div2num[0] >= $startRef2 && $div1num[0] == $startRef1) || ($div2num[0] <= $endRef2 && $div1num[0] == $endRef1) || ($div1num[0] > $startRef1 && $div1num[0] < $endRef1)){
              if(is_null($startRef3)){
                $snippet .= $div2->asXML();
              }
              else{
                //loop for each third-level div
                foreach($version->xpath('./text/div[@number="' . $div1num[0] . '"]/div[@number="' . $div2num[0] . '"]/div') as $div3){
                  //retrieve the 'number' attribute for this div1 entity
                  $div3num = $div3->xpath('./@number');
                  if(($div3num[0] >= $startRef3 && $div2num[0] == $startRef2) || ($div3num[0] <= $endRef3 && $div2num[0] == $endRef2) || ($div2num[0] > $startRef2 && $div2num[0] < $endRef2)){
                    if(is_null($startRef4)){
                      $snippet .= $div3->asXML();
                    }
                  else{
                    //loop for each fourth-level div
                    foreach($version->xpath('./text/div[@number="' . $div1num[0] . '"]/div[@number="' . $div2num[0] . '"]/div[@number="' . $div3num[0] . '"]/div') as $div4){
                      //retrieve the 'number' attribute for this div1 entity
                      $div4num = $div4->xpath('./@number');
                      if(($div4num[0] >= $startRef4 && $div3num[0] == $startRef3) || ($div4num[0] <= $endRef4 && $div3num[0] == $endRef3) || ($div3num[0] > $startRef3 && $div3num[0] < $endRef3)){
                        $snippet .= $div4->asXML();
                      }
                    }
                  }
                }
              }
            }
          }
        }
        //close div1
        $snippet .= "</div>";
        }
  		}

    //close $div1 foreach loop
    }
  //closing version tag
  $snippet .= "</version>";

  //close $version foreach loop
	}

  //close "else" loop for non-fragmentary text structures
  }
  $snippet .= "</book>";

  $snippetStr = (string)$snippet;
  $snippetXML = simplexml_load_string($snippetStr);
  echo $snippetXML->asXML();
?>
