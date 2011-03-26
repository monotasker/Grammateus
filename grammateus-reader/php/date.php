<?php
//  echo '{serverTime: new Date(' . time()*1000 .')}';
  $today = getdate();
  $day = $today[mday];
  $month = $today[month];
  $year = $today[year];
  echo $month . ' ' . $day . ', ' . $year;
?>
