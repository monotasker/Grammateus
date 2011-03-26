<?php
	$doc="1Enoch"; //$_REQUEST["book"];
    $filename = "/home/ian/Desktop/".$doc.".xml";
    $xmlDoc = simplexml_load_file($fileName);
if ($doc)
{
    $i = 0;
    foreach($xmlDoc->xpath("//unit"), as $unit){
        $unit->attributes("id", true) = $i;
        $i++;
    }

    #WRITE THE RESULTS BACK TO THE XML FILE
    file_put_contents($filename, $xmlDoc->asXml());
    echo "All done renumbering!";
}
else
{
    echo "No document by that name was found";
}


?>
