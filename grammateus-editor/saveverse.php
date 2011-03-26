<?php
    //retrieve information from ajax GET request
	$doc=$_REQUEST["book"];
	$div1=$_REQUEST["div1"];
	$div2=$_REQUEST["div2"];
	if ($div1=="") $div1=$_REQUEST["chapter"];
	if ($div2=="") $div2=$_REQUEST["verse"];
	$div3=$_REQUEST["div3"];
	$textresponse=$_REQUEST["xmltext"];
    //prepare xml string sent by page (stripping out escapes)
    $strippedresponse = "<?xml version='1.0'?>" . stripslashes($textresponse);
    //start printing confirmation response message
    echo("Saved changes to " . $doc . " " . $div1 . "." . $div2 ."<br />");
    //load and parse xml document using php DOM
	$xmlDoc = new DOMDocument();
	$xmlDoc->preserveWhiteSpace = false;
	$fileName="/home/ocp/public_html/sites/default/docs/drafts/".$doc.".xml";
	$xmlDoc->load($fileName);
    //save a dated backup and add a statement with its file-size to the response message
	$backupFileName="/home/ocp/public_html/sites/default/docs/backups/".$doc." ".date("Y-m-d H.i.s").".xml";
  	echo("Backup {$backupFileName} created:".$xmlDoc->save($backupFileName)." bytes<br />");
    //check to see that the ajax request included a book
	if ($doc) {
	    //check to see that the ajax request included a div1 value
		if ($div1) {
    	    //check to see that the ajax request included a div2 value
			if ($div2) {
			    //load and parse the xml string sent by page
				$newVerseDoc=new DOMDocument();
				$newVerseDoc->loadXML($strippedresponse);
				//get the first "div" element of the xml string
				$newVerseNode=$newVerseDoc->getElementsByTagName("div")->item(0);
				//import that "div" element to the existing XML document
				$newVerse=$xmlDoc->importNode($newVerseNode, TRUE);
                //use xpath syntax to find the corresponding "div" element in the existing XML doc
				$xpath = new DOMXPath($xmlDoc);
				$entries = $xpath->query('version/text/div[@number="'.$div1.'"]/div[@number="'.$div2.'"]');
				$oldVerse=$entries->item(0);
				//replace the old "div" element with the new "div" element
				$chapterNode=$oldVerse->parentNode;
				$chapterNode->replaceChild($newVerse,$oldVerse);
				//find all "unit" entities in the newly modified XML document
				$entries = $xpath->query('//unit');
				//loop through the "units" and renumber them consecutively from 1
				$u=0;
				foreach ($entries as $entry) {
					$u=$u+1;
					$entry->setAttribute("id",$u);
					//loop through each unit's "reading" entities and number them from 0
					$o=0;
					foreach ($entry->getElementsByTagName("reading") as $reading) {
						if ($reading->getAttribute("option")!=="0") {
							$o=$o+1;
							$reading->setAttribute("option",$o);
						}
					}
				}
				//save the new version of the XML document to the server and finish response message with its filesize.
				echo("Saved ".$xmlDoc->save($fileName)." bytes <br />");
			}
		};
	};
?>

