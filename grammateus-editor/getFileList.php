<?php 

$doc=$_REQUEST["book"];
$docExploded=explode(" ", $doc);
$docName=$docExploded[0];
 
//Open images directory
$dir = opendir("/home/ocp/public_html/sites/default/docs/backups/");

//List files in images directory
while (($file = readdir($dir)) !== false && strpos($file, $docName) !== false){
    echo $file . ";";
}

// tidy up: close the handler
closedir($dir);

?>
