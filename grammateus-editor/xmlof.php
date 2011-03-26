<?php
	$doc=$_REQUEST["book"];
    $version=$_REQUEST["version"];
	$ref=$_REQUEST["ref"];
	$div1=$_REQUEST["div1"];
	$div2=$_REQUEST["div2"];
	$dir=$_REQUEST["directory"];
	if ($div1=="") $div1=$_REQUEST["chapter"];
	if ($div2=="") $div2=$_REQUEST["verse"];
	$div3=$_REQUEST["div3"];
	$bookpath="/home/ocp/public_html/sites/default/docs/".$dir."/".$doc.".xml";
	$bookxml=simplexml_load_file($bookpath);
	if ($doc) {
		if ($div1) {
			if ($div2) {
				if ($div3) {
					$xp='/book/version[@title="'.$version.'"]/text/div[@number="'.$div1.'"]/div[@number="'.$div2.'"]/div[@number="'.$div3.'"]';
					$re=$bookxml->xpath($xp);
				} else {
					$xp='/book/version[@title="'.$version.'"]/text/div[@number="'.$div1.'"]/div[@number="'.$div2.'"]';
					$re=$bookxml->xpath($xp);
				}
			} else {
				$re=$bookxml->xpath('/book/version[@title="'.$version.'"]/text/div[@number="'.$div1.'"]');
			}
			echo $re[0]->asXML();
		} else {
			echo "Request did not give valid reference";
		}
	}
?>