//retrieve list of versions with their language attributes (from external php script)
function getVersions(){
  var bookSelected = $.data(document.body, 'book');
  $.ajax({
    cache:"false",
    type: "GET",
    //dataType: "xml",
    url: "sites/all/modules/bookDisplay/getVersions.php",
    data: "book=" + bookSelected,
    success:function(xml){
        var data = xml;
        $.data(document.body, "versions", data);
        //get text structure information from xml document header
        var textStructure = $(data).find('version').parent('book').attr('textStructure');

        //if structure is fragmentary, get first and last fragment numbers
        if (textStructure=='fragmentary'){
          $.data(document.body, 'textStructure', textStructure);
          var firstFrag = $(data).find('version:first').attr('fragment');
          $.data(document.body, 'firstFrag', firstFrag);
          var lastFrag = $(data).find('version:last').attr('fragment');
          $.data(document.body, 'lastFrag', lastFrag);
        }
         //find first and last div numbers, labels, and delimiters and save as data objects
         var firstDiv1 = $(data).find('version:first div:first').attr('number');
         $.data(document.body, 'firstDiv1', firstDiv1);
         var lastDiv1 = $(data).find('version:first div:last').attr('number');
         $.data(document.body, 'lastDiv1', lastDiv1);
         var div1Punct = $(data).find('version:first division:first').attr('delimiter');
         var div2Punct = $(data).find('version:first division').eq(1).attr('delimiter');
         var div3Punct = $(data).find('version:first division').eq(2).attr('delimiter');
         var div4Punct = $(data).find('version:first division').eq(3).attr('delimiter');
          //determine depth of the version's organizational structure and if it is the deepest in the document cache it as data object
        var docDepth = 1;

        $(data).find('version').each(function(){
          if (!$(this).find('division').eq(1).length){
            var thisDocDepth = 1;
            if(thisDocDepth > docDepth){ docDepth = thisDocDepth };
          }
          else{
            if(!$(this).find('division').eq(2).length){
              var thisDocDepth = 2;
              if(thisDocDepth > docDepth){ docDepth = thisDocDepth };
            }
            else{
              if(!$(this).find('division').eq(3).length){
                var thisDocDepth = 3;
                if(thisDocDepth > docDepth){ docDepth = thisDocDepth };
              }
              else{
            	if(!$(this).find('division').eq(4).length){
            	  var thisDocDepth = 4;
            	  if(thisDocDepth > docDepth){ docDepth = thisDocDepth };
            	}
            	else{
            	  var thisDocDepth = 5;
              	  if(thisDocDepth > docDepth){ docDepth = thisDocDepth };
            	}
              }
            }
          }
          //cache this document's depth as data object
          var versionTitle = $(this).attr('title');
          $.data(document.body, 'docDepth' + versionTitle, thisDocDepth);
        });
        //cache the organizational depth of the deepest version as a data object
        $.data(document.body, 'docDepth', docDepth);
        //set labels and delimiters for main navigation form
        if(docDepth > 1){
          $('#startRef1').after('<label class="punct">' + div1Punct + '</label><input type="text" id="startRef2" />');
          $('#endRef1').after('<label class="punct">' + div1Punct + '</label><input type="text" id="endRef2" />');
          if(docDepth > 2){
            $('#startRef2').after('<label class="punct">' + div2Punct + '</label><input type="text" id="startRef3" />');
            $('#endRef2').after('<label class="punct">' + div2Punct + '</label><input type="text" id="endRef3" />');
            if(docDepth > 3){
              $('#startRef3').after('<label class="punct">' + div3Punct + '</label><input type="text" id="startRef4" />');
              $('#endRef3').after('<label class="punct">' + div3Punct + '</label><input type="text" id="endRef4" />');
            }
          }
        }
        $('#chapterNavForm input:first').addClass('start');

        //alter form if document is fragmentary
        if(textStructure=='fragmentary'){
          $('#chapterNavForm input:not(:first)').each(function(){
            $(this).remove();
          });
          $('#chapterNavForm label:not(:first)').each(function(){
            $(this).remove();
          });
          $('#chapterNavForm label:first').html('Fragment');
        }
  //get initial xml snippet to display
  getSnippet();
    }
  });
}

//retrieve document xml for the selected range (from external php script)
function getSnippet(){
  var bookSelected= $.data(document.body, 'book');
  var rawHash = window.location.hash;
  if(!rawHash.length){
    var structure = $.data(document.body, 'textStructure');
    if($.data(document.body, 'textStructure') == 'fragmentary'){
      var firstFrag = $.data(document.body, 'firstFrag');
      $('#startRef1').val(firstFrag).trigger('change');
      $('#endRef1').val(firstFrag).trigger('change');

    }
    else{
      var firstDiv1 = $.data(document.body, 'firstDiv1');
      $('#startRef1').val(firstDiv1).trigger('change');
      $('#endRef1').val(firstDiv1).trigger('change');
    }
  }
  else{
    rawHash = rawHash.replace('#', '');
    var hashVals = rawHash.split('-');
    var startHash = hashVals[0].split('.');
    var endHashVal = hashVals[1];
    if(endHashVal==null|endHashVal==undefined){
      var endHash = startHash;
    }
    else{
      var endHash = endHashVal.split('.');
    }
    $('#startRef1').val(startHash[0]).trigger('change');
    $('#endRef1').val(endHash[0]).trigger('change');
    if($.data(document.body, 'textStructure') != 'fragmentary'){
      $('#startRef2').val(startHash[1]);
      $('#endRef2').val(endHash[1]);
      $('#startRef3').val(startHash[2]);
      $('#endRef3').val(endHash[2]);
      $('#startRef4').val(startHash[3]);
      $('#endRef4').val(endHash[3]);
    }
  }

  var StartRef1 = $('#startRef1').val();
  var EndRef1 = $('#endRef1').val();
  var startVal2 = $('#startRef2').val();
  var endVal2 = $('#endRef2').val();
  var startVal3 = $('#startRef3').val();
  var endVal3 = $('#endRef3').val();
  var startVal4 = $('#startRef4').val();
  var endVal4 = $('#endRef4').val();
  var dataString = 'book=' + bookSelected + '&startRef1=' + StartRef1;
  if(startVal2 != null && startVal2 != '' && startVal2 != undefined){
    dataString = dataString + '&startRef2=' + startVal2;
  }
  if(startVal2 != null && startVal3 != '' && startVal3 != undefined){
    dataString = dataString + '&startRef3=' + startVal3;
  }
  if(startVal2 != null && startVal4 != '' && startVal4 != undefined){
    dataString = dataString + '&startRef4=' + startVal4;
  }
  dataString = dataString + '&endRef1=' + EndRef1;
  if(endVal2 != null && endVal2 != '' && endVal2 != undefined){
    dataString = dataString + '&endRef2=' + endVal2;
  }
  if(endVal3 != null && endVal3 != '' && endVal3 != undefined){
    dataString = dataString + '&endRef3=' + endVal3;
  }
  if(endVal4 != null && endVal4 != '' && endVal4 != undefined){
    dataString = dataString + '&endRef4=' + endVal4;
  }
  $('.msDocumentDisplay img').each(function(){$(this).fadeIn('fast');});
  $.ajax({
    type:"GET",
    cache:"false",
    url:"sites/all/modules/bookDisplay/xmlRequest.php",
    data: dataString,
    //dataType:"xml",
    success: function(data){
        $.removeData(document.body, "xmlSnippet");
        $.data(document.body, "xmlSnippet", data);
        setVersionSelectors();
    }
  });
}

//populate dropdown lists to select the version to display in each column
function setVersionSelectors(){
  //get variables stored as data objects
  var versionsXml = $.data(document.body, "versions");
  var textStructure = $.data(document.body, 'textStructure');
  //begin loop for each version column displayed
  $('.versionColumn').each(function(){
    //get id of the current version column
    var versionCol = $(this).attr('id').substr(1,1);
    //get array of versions from versionsXml
    //for fragmentary documents limit selectable versions to those for the current fragment
    var versionsList = $(versionsXml).find('version');
    if(textStructure=='fragmentary'){
      versionsList = $(versionsXml).find('version[fragment="' + $('#startRef1').val() + '"]');
    }
    //clear the pull-down selector so that the options don't duplicate
    $('#v'+ versionCol +' .versionSelector').empty();
    //add option to version selector for each version in array
    $(versionsList).each(function(){
      var versionTitle = $(this).attr('title');
      $('#v'+versionCol + ' .versionSelector').append('<option value="' + versionTitle + '">' + versionTitle + '</option>');
    });
    //retrieve title of the most recent version viewed in this version column (null if column is new)
    var selectedVersion = $.data(document.body, 'versionSelected'+versionCol);
    //identify default version and use if the column is new
    var defaultVersion = $('#v' + versionCol + ' .versionSelector option:selected').text();
    if(selectedVersion == null){selectedVersion = defaultVersion};
    //set version selector to appropriate version
    $('#v' + versionCol + ' .versionSelector').val(selectedVersion);
    //loop through text columns in this version column and trigger setMsSelectors()
    $('#c' + versionCol + ' .textType').each(function(){
      var textCol = $(this).attr('id');
      textCol = textCol.substr(4, 1);
      setMsSelectors(versionCol, textCol, selectedVersion);
    });
    //bind function to change version in this column when version selector option is changed
    $('#v' + versionCol + ' .versionSelector').bind('change', function(){
        //show loader image and hide text
        $('#v' + versionCol + ' .textScroller').each(function(){
          $(this).fadeOut(0);
        });
        $('#v' + versionCol + ' .msDisplayRow img').each(function(){
          $(this).fadeIn(0);
        });
        $('#v' + versionCol + ' .textScroller').each(function(){
            var textCol = $(this).attr('id');
            textCol = textCol.substr(4, 1);
            var selectedVersion = $('#v' + versionCol + ' .versionSelector option:selected').text();
            $.removeData(document.body, 'versionSelected'+versionCol);
            $.data(document.body, 'versionSelected'+versionCol, selectedVersion);
            setMsSelectors(versionCol, textCol, selectedVersion);
        });
    });
  });
}

//populate dropdown lists to select the text type to display in a given column
function setMsSelectors(versionCol, textCol, selectedVersion){

  var xml = $.data(document.body, 'versions');
  var ms = $(xml).find('version[title="' + selectedVersion + '"] manuscripts ms');
  var textSelected = $.data(document.body, 'textSelected'+versionCol+'-'+textCol);
  var textStructure = $.data(document.body, 'textStructure');
  //for fragmentary documents only allow mss that are present in the current fragment
  if(textStructure=='fragmentary'){
    if($.inArray(textSelected, $(ms).attr('abbrev'))==-1){
      textSelected = $(ms).eq(0).attr('abbrev');
    }
  }
  $('#n' + versionCol + '-'+ textCol +' .msSelector').html('');
  $(ms).each(function(){
    var msShow = $(this).attr('show');
    var msAbbrev = $(this).attr('abbrev');
    if(msShow == 'yes'){
      $('#n' + versionCol + '-'+ textCol +' .msSelector').append('<option value="' + msAbbrev + '">' + msAbbrev + '</option>');
    }
    else {}
  });
  if(textSelected != null && textStructure != 'fragmentary'){
    $('#n' + versionCol + '-'+ textCol +' .msSelector').val(textSelected);
  }

  printText(versionCol, textCol);

  //bind function to display new text type when dropdown menu selection is changed
  $('#n' + versionCol + '-'+ textCol +' .msSelector').bind('change', function(){
    //show loader image and hide text
    $('#dd' + versionCol + '-'+ textCol +' .textScroller').fadeOut(0);
    $('#dd' + versionCol + '-'+ textCol +' .msDisplayRow img').fadeIn(0);
    printText(versionCol, textCol);
    var msSelected = $(this).find('option:selected').text();
    $.removeData(document.body, 'textSelected'+versionCol+'-'+textCol);
    $.data(document.body, 'textSelected'+versionCol+'-'+textCol, msSelected);
  });
}

//selects and displays appropriate text from XML snippet
function printText(versionCol, textCol){
  //find version
  var versionChoice = $('#v' + versionCol + ' .versionSelector option:selected').text();
  //variable for the selected text-type
  var textChoice = $('#n' + versionCol + '-' + textCol + ' .msSelector option:selected').text();
  var textChoice = textChoice + ' '; //adds a trailing space to text-type to avoid false matches
  var docDepth = $.data(document.body, 'docDepth'+versionChoice);
  var startRef1 = $('#startRef1').val();
  var endRef1 = $('#endRef1').val();
  //retrieve xml snippet from session memory
  var xml = $.data(document.body, 'xmlSnippet');
  //get language of selected version (used for setting class to use correct fonts and directionality)
  var lang = $(xml).find('version[title="' + versionChoice + '"]').attr('language');
  //empty the current textScroller div and apply appropriate language class
  $('#ts' + versionCol + '-' + textCol).html('').removeClass('Greek').removeClass('Syriac').removeClass('Hebrew').removeClass('English').removeClass('Latin').removeClass('Ethiopic').removeClass('Coptic').addClass(lang);
  //select proper version from the xml snippet and loop though each div1
  $(xml).find('version[title="' + versionChoice + '"] > div').each(function(){
    //find and print div1 number
    var div1Num = $(this).attr('number');
    $('#ts' + versionCol + '-' + textCol).append('<span class="div1Number">' + div1Num + '</span> ');
    if(docDepth=='1'){
    //print readings for each child unit
    $(this).find('unit reading').each(function(){
      if($(this).attr('language')){
        lang = $(this).attr('language');
      }
      var msList = $(this).attr('mss');
      var otherReadings = $(this).siblings().length;
      var optionText = $(this).text();
      var parentUnit = $(this).parent('unit');
      var parentUnitNumber = parentUnit.attr('id');
      var indent = $(this).attr('indent');
      var linebreak = $(this).attr('linebreak')
      printUnit(msList, textChoice, otherReadings, optionText, parentUnitNumber, versionCol, textCol, lang, indent, linebreak);
     });
    }
    else{
      //for each div child of div1
      $(this).find('> div').each(function(){
        //find and print div2 number
        var div2Num = $(this).attr('number');
        if(div2Num != '0'){
          $('#ts' + versionCol + '-' + textCol).append('<span class="div2Number"><sup>' + div2Num + '</sup></span> ');
        }
        if(docDepth=='2'){
          //print readings for each child unit
          $(this).find('unit reading').each(function(){
              if($(this).attr('language')){
                lang = $(this).attr('language');
              }
              var msList = $(this).attr('mss');
              var otherReadings = $(this).siblings().length;
              var optionText = $(this).text();
              var parentUnit = $(this).parent('unit');
              var parentUnitNumber = parentUnit.attr('id');
              var indent = $(this).attr('indent');
              var linebreak = $(this).attr('linebreak')
              printUnit(msList, textChoice, otherReadings, optionText, parentUnitNumber, versionCol, textCol, lang, indent, linebreak);
          });
        }
        else{
          //for each div child of div2
          $(this).find('> div').each(function(){
            var div3Num = $(this).attr('number');
            if(div3Num != '0'){
              $('#ts' + versionCol + '-' + textCol).append('<span class="div3Number"><sup>' + div3Num + '</sup></span> ');
            }
            if(docDepth=='3'){
              //print readings for each child unit
              $(this).find('unit reading').each(function(){
                  if($(this).attr('language')){
                    lang = $(this).attr('language');
                  }
                  var msList = $(this).attr('mss');
                  var otherReadings = $(this).siblings().length;
                  var optionText = $(this).text();
                  var parentUnit = $(this).parent('unit');
                  var parentUnitNumber = parentUnit.attr('id');
                  var indent = $(this).attr('indent');
                  var linebreak = $(this).attr('linebreak')
                  printUnit(msList, textChoice, otherReadings, optionText, parentUnitNumber, versionCol, textCol, lang, indent, linebreak);
              });
            }
            else{
              //for each div child of div3
              $(this).find('> div').each(function(){
                var div4Num = $(this).attr('number');
                if(div4Num != '0'){
                  $('#ts' + versionCol + '-' + textCol).append('<span class="div3Number"><sup>' + div4Num + '</sup></span> ');
                }
                //print readings for each child unit
                $(this).find('unit reading').each(function(){
                  if($(this).attr('language')){
                    lang = $(this).attr('language');
                  }
                  var msList = $(this).attr('mss');
                  var otherReadings = $(this).siblings().length;
                  var optionText = $(this).text();
                  var parentUnit = $(this).parent('unit');
                  var parentUnitNumber = parentUnit.attr('id');
                  var indent = $(this).attr('indent');
                  var linebreak = $(this).attr('linebreak')
                  printUnit(msList, textChoice, otherReadings, optionText, parentUnitNumber, versionCol, textCol, lang, indent, linebreak);
                });
              });
            }
          });
        }
      });
    }
  });

  //bind unit text to printVariants function
  $('.textScroller a').live('click', function(){
    var versionCol = $(this).parents('.textScroller').attr('id').substr(2, 1);
    var parentUnitNumber = $(this).attr('rel');
    var lang = $(this).find('span').attr('class');
    printVariants(versionCol, parentUnitNumber, lang);
    return false;
  });


  //display message if the version lacks any text for the selected section of text
  if($('#ts' + versionCol + '-' + textCol).html() == ''){
    $('#ts' + versionCol + '-' + textCol).append('<span class="textComment">This section of text does not survive in the selected witness. In the case of a manuscript witness, the relevant section of the manuscript has likely been destroyed. In the case of fragmentary quotations in later authors, the quotations simply do not include the relevant section of the document.</span>');
  }

  //hide loading image and show new text
  $('#dd' + versionCol + '-' + textCol + ' img').fadeOut(0, function(){
    $(this).next().fadeIn(200);
  });

  //clean up display dimensions and viewport position
  setTableWidth();
  $('#ts' + versionCol + '-' + textCol).scrollTop(0);

//close printText function
}

//print the appropriate text for a given variation unit (called recursively by printText function)
function printUnit(msList, textChoice, otherReadings, optionText, parentUnitNumber, versionCol, textCol, lang, indent, linebreak){
  var indentVar = '';
  if(indent=='yes'){
    indentVar = 'indented';
  }
  //select readings from selected ms
  if(msList.indexOf(textChoice) != -1){
    //set variables for unicode directional characters
    var dirChar = '&#8206;'; //LTR unicode directional character
    if(lang=='Hebrew'||lang=='Aramaic'||lang=='Syriac'){
      dirChar = '&#8207;'; //RTL unicode directional character
    }
    //display text of reading with no other options
    if(otherReadings < 1){
      $('#ts' + versionCol + '-' + textCol).append(dirChar + '<span class="' + lang + ' ' + indentVar + '"> ' + optionText + '</span> ');
    }
    //display text of reading which does have other options
    else{
     if(optionText == ''){optionText = ' * ';}
     //$.data(document.body, parentUnitNumber, parentUnit); ?? why was this here?
     $('#ts' + versionCol + '-' + textCol).append(dirChar + '<a rel="' + parentUnitNumber + '" href="#"><span class="' + lang + ' ' + indentVar + '">' + optionText + '</span></a>' + ' ');
    }
  }
  if(linebreak == 'following'){
     $('#ts' + versionCol + '-' + textCol).append('<br />');
  }
  if(linebreak == 'doubleFollowing'){
     $('#ts' + versionCol + '-' + textCol).append('<br /><br />');
  }
}

// display variant readings when clicking on a highlighted unit of text
function printVariants(versionCol, parentUnitNumber, lang){
  $('#a' + versionCol + ' .apparatusLabel').fadeOut("fast");
  $('#a' + versionCol + ' .variantRow').each(function(){
    $(this).remove();
  });
  var snippet = $.data(document.body, 'xmlSnippet');
  var parentUnit = $(snippet).find('unit[id=' + parentUnitNumber + ']');
  $(parentUnit).children('reading').each(function(){
    var mss = $(this).attr('mss');
    var readingText = $(this).text();
    if(readingText == ""){
      readingText = '<span class="noEquivalent">no equivalent present</span>';
    }
    $('#a' + versionCol + ' .apparatusTable').append('<tr class="variantRow"><td>' + mss + '</td><td><span class=' + lang + '>' + readingText + '</span></td></tr>');
  });
  $('#a' + versionCol + ' .apparatusTable tr:even').addClass('dark');
  setTableWidth();
}

//add new version column to display
function addVersion(){
  //count the current columns
  var versionCount = $('.versionColumn').size();
  //make sure there are not too many columns for the window width
  if(versionCount > 5){
    alert('Sorry, the maximum number of columns is already open!');
  }
  //insert another column
  else{
    var oldMax = $('.versionColumn:last').attr('id');
    oldMax = oldMax.substr(1,1);
    newMax = parseInt(oldMax)+1;
    $('.versionColumn#v'+oldMax).after('<div id="v'+newMax+'" class="versionColumn"><div class="versionHeader"><form><select class="versionSelector"></select></form><a class="versionCloserLink" href="#" title="Click to close this language version"></a></div><div id="c'+newMax+'" class="containerCell"><div id="tt'+newMax+'-1" class="textType"><div id="n'+newMax+'-1" class="msNavRow"><form><select class="msSelector"></select></form><a href="#" class="msCloser" title="Click top close this text type"></a></div><div id="dd'+newMax+'-1" class="msDisplayRow"><img src="sites/all/modules/bookDisplay/images/ajax-loader.gif" /><div class="textScroller" id="ts'+newMax+'-1"></div></div><div id="h'+newMax+'-1" class="textHandle"></div></div><div class="textAdder"><a class="textAdderLink" href="#" title="Click to add another text type"></a></div></div><div id="a'+newMax+'" class="apparatusCell"><div id="ah'+newMax+'" class="apparatusHandle"></div><table class="apparatusTable"><tr class="apparatusHeaderRow"><th class="apparatusHeader"><span>Text Types</span></th><th class="apparatusHeader"><span>Reading</span> <a class="apparatusToggle">X</a></th></tr></table><span class="apparatusLabel">Click on a section of blue text to view available textual variants for those words.</span></div></div>');
    setVersionSelectors();
    setTableWidth();
    var fontCookie = parseInt($.cookie('text_size'));
    $('#v'+newMax+' .textScroller').css('font-size', fontCookie);
  }
}

//close (remove) the selected version column
function closeVersion(theIndex){
  //send error message if user tries to close the last version
  var versionCount = $('.versionColumn').size();
  if (versionCount < 2){
    alert('Sorry, at least one version must remain open.');
  }
  //otherwise add class to hide cells of selected column
  else{
  $('#v'+theIndex).remove();
  setTableWidth();
  }
}

// add another text-type column within this version
function addTextColumn(targetCell){
  var oldTextCount = $('#c' + targetCell + ' .textScroller').size();
  var newTextCount = oldTextCount + 1;
  if(oldTextCount > 6){
    alert('Sorry, the maximum number of text types is already open!');
  }
  else{
    $('#c' + targetCell + ' .textType:last').after('<div id="tt'+ targetCell +'-'+ newTextCount +'" class="textType"><div id="n'+ targetCell +'-'+ newTextCount +'" class="msNavRow"><form><label>Text type</label> <select class="msSelector"></select></form><a href="#" class="msCloserLink" title="Click to close this text type"></a></div><div id="dd'+ targetCell +'-'+ newTextCount +'" class="msDisplayRow"><img src="sites/all/modules/bookDisplay/images/ajax-loader.gif" /><div class="textScroller" id="ts'+ targetCell +'-'+ newTextCount +'"></div></div><div id="h'+ targetCell +'-'+ newTextCount +'" class="textHandle"></div></div>');
    defaultVersion = $('#v' + targetCell + ' .versionSelector').find('option:first-child').text();
    setMsSelectors(targetCell, newTextCount, defaultVersion);
    setTableWidth();
    var fontCookie = parseInt($.cookie('text_size'));
    $('#ts' + targetCell + '-' + newTextCount).css('font-size', fontCookie);
  }
}

// close (remove) the selected text-type column
function closeText(version, textToClose){
  var oldTextCount = $('#c' + version + ' .textType').size();
  if(oldTextCount == 1){
    alert('Sorry, at least one text type must remain open while this version is displayed. Try closing the version if you no longer want to view this column.');
  }
  else{
    $('#tt' + version + '-' + textToClose).fadeOut('slow', function(){
      $(this).remove();
      setTableWidth();
    });
  }
}

// resize text-display panes to fill (but not overflow) the display window
function setTableWidth(){

  var windowWidth = parseInt($(window).width());
  var tableWidth = windowWidth;
  var windowHeight = parseInt($(window).height());
  var tableHeight = windowHeight-110;

  $('#versionContainer').css('width', tableWidth);
  var versionCount = $('.versionColumn').size();
  var versionAdderSpace = 20;
  var tableLeftAdjust=16;
  var textAdderSingle= 30;
  var textAdderSpace = textAdderSingle*versionCount;
  var textCount = $('.textType').size();
  var textBorderSingle = 4;
  var textBorderSpace = textBorderSingle*textCount;
  var extraSpace = textAdderSpace + textBorderSpace + versionAdderSpace;
  var adjustedTableWidth = tableWidth - extraSpace - tableLeftAdjust;
  var colWidth = adjustedTableWidth / textCount;
  var textPadding = $('.textScroller:first').outerWidth() - $('.textScroller:first').width();
  $('.versionColumn').each(function(){
    var localCount = $(this).find('.textType').size();
    var thisWidth = (localCount * colWidth)+(localCount * textBorderSingle)+textAdderSingle;
    $(this).css("width", thisWidth);
    $(this).find(".apparatusCell").css("width", thisWidth);
  });
  $('.textType, .msDisplayRow').each(function(){
    $(this).css("width", colWidth+4);
  });
  $('.textScroller').each(function(){
    $(this).css("width", colWidth-textPadding);
  });
  //reset table height
  $('.versionColumn').each(function(){
    $(this).css('height', tableHeight);
  });
  var workingHeight = tableHeight-34;
  var textHeight = workingHeight*0.6;
  var scrollerHeight = textHeight-34;
  var apparatusHeight = workingHeight*0.4;
  $('.containerCell').each(function(){
    $(this).css('height', textHeight);
    $(this).find('.textScroller').each(function(){
      $(this).css('height', scrollerHeight-16);
    });
  });
  $('.apparatusCell').each(function(){
    $(this).css('height', apparatusHeight);
  });

  setResizing();

  $('.textScroller').syncScroll();
}

// dynamically resize the text-display panes with drag events
function setResizing(){
  $('.textHandle').each(function(){
    $(this).removeClass('lastCol');
  });

  var $div = $('#versionContainer');
  //when drag starts, get initial dimensions
  $('.textType').drag("start", function(ev, dd){
     	dd.width = $(this).width();
     	dd.versionCount = $($div).find('.versionColumn').size();
    	dd.versionWidth = $(this).parents('.versionColumn').width() + 5;
    	dd.typeCount = $(this).parents('.versionColumn').find('.textType').size();

    	dd.versionAdderWidth = $('.versionAdder').outerWidth();

    	dd.textHandle = $(this).find('.textHandle').width();
    	dd.minWidth = 200;
    	dd.textAdderWidth = $(this).parents('.containerCell').find('.textAdder').width();
    	dd.textPadding = $(this).find('.textScroller').outerWidth() - $(this).find('.textScroller').width();

    	dd.containerWidth = $($div).width();
    	dd.nextTypeWidth = $(this).next('.textType').width();
    	dd.versionRemainder = dd.versionWidth - (dd.width + dd.nextTypeWidth);
    	dd.versionRemainder2 = dd.versionWidth - dd.width;

    	dd.nextVersionWidth = $(this).parents('.versionColumn').next('.versionColumn').width();
    	dd.nextVersionTypeWidth = $(this).parents('.versionColumn').next('.versionColumn').find('.textType:first-child').width();
    	dd.nextVersionRemainder = dd.nextVersionWidth - dd.nextVersionTypeWidth;
    	dd.nextVersionTypeCount = $(this).parents('.versionColumn').next('.versionColumn').find('.textType').size();
    	dd.nextVersionMinWidth = dd.nextVersionTypeCount * dd.minWidth + 30;
    	dd.containerWidthRemainder = dd.containerWidth - dd.versionWidth;
    	dd.containerWidthRemainder2 = dd.containerWidth - dd.versionWidth - dd.nextVersionWidth;
		})    
		//function to execute while drag is in process
		.drag(function(ev, dd){
      //case if the textType IS the last in its version column
			if(!$(this).next('.textType').length){
			  //case if there IS NO following version
        if(!$(this).parents('.versionColumn').next('.versionColumn').length){
          $(this).find('.textHandle').addClass('lastCol');
        }
        //case if there IS a following version
        else{
			    //resize textType width
			    $(this).css({
				    width: Math.min(dd.containerWidth - dd.versionRemainder2 - (dd.containerWidthRemainder - dd.nextVersionTypeWidth + dd.minWidth), Math.max(dd.minWidth, dd.width + dd.deltaX))
			    });
			    //resize width of children
			    $(this).find('.msDisplayRow').css({
				    width: Math.min(dd.containerWidth - dd.versionRemainder2 - (dd.containerWidthRemainder - dd.nextVersionTypeWidth + dd.minWidth), Math.max(dd.minWidth, dd.width + dd.deltaX))
			    });
			    $(this).find('.textScroller').css({
				    width: Math.min(dd.containerWidth - dd.versionRemainder2 - (dd.containerWidthRemainder - dd.nextVersionTypeWidth + dd.minWidth) - dd.textHandle - dd.textPadding, Math.max(dd.minWidth - dd.textHandle - dd.textPadding, dd.width + dd.deltaX - dd.textHandle - dd.textPadding))
			    });
			    //resize parent version
          $(this).parents('.versionColumn').css({
            width: Math.min(dd.containerWidth - (dd.containerWidthRemainder - dd.nextVersionTypeWidth + dd.minWidth) - 5, Math.max(dd.versionRemainder2 - 5 + dd.minWidth, dd.versionWidth + dd.deltaX - 5))
          });
          $(this).parents('.containerCell').next('.apparatusCell').css({
            width: Math.min(dd.containerWidth - (dd.containerWidthRemainder - dd.nextVersionTypeWidth + dd.minWidth) - 5, Math.max(dd.versionRemainder2 - 5 + dd.minWidth, dd.versionWidth + dd.deltaX - 5))
          });
          //resize following version and first textType
          $(this).parents('.versionColumn').next('.versionColumn').css({
            width: Math.min(dd.containerWidth - (dd.versionRemainder2 + dd.minWidth) - dd.containerWidthRemainder2, Math.max(dd.minWidth + dd.nextVersionRemainder, dd.nextVersionWidth - dd.deltaX))
          });
          $(this).parents('.versionColumn').next('.versionColumn').find('.textType:first-child').css({
            width: Math.min(dd.containerWidth - (dd.versionRemainder2 + dd.minWidth) - dd.containerWidthRemainder2 - dd.nextVersionRemainder, Math.max(dd.minWidth, dd.nextVersionTypeWidth - dd.deltaX))
          });
          $(this).parents('.versionColumn').next('.versionColumn').find('.msDisplayRow:first').css({
            width: Math.min(dd.containerWidth - (dd.versionRemainder2 + dd.minWidth) - dd.containerWidthRemainder2 - dd.nextVersionRemainder, Math.max(dd.minWidth, dd.nextVersionTypeWidth - dd.deltaX))
          });
          $(this).parents('.versionColumn').next('.versionColumn').find('.textScroller:first').css({
            width: Math.min(dd.containerWidth - (dd.versionRemainder2 + dd.minWidth) - dd.containerWidthRemainder2 - dd.nextVersionRemainder - dd.textHandle - dd.textPadding, Math.max(dd.minWidth - dd.textHandle - dd.textPadding, dd.nextVersionTypeWidth - dd.deltaX - dd.textHandle - dd.textPadding))
          });
          $(this).parents('.versionColumn').next('.versionColumn').find('.apparatusCell').css({
            width: Math.min(dd.containerWidth - (dd.versionRemainder2 + dd.minWidth) - dd.containerWidthRemainder2, Math.max(dd.minWidth + dd.nextVersionRemainder, dd.nextVersionWidth - dd.deltaX))
          });
        }
      }
      //case if the textType IS NOT the last in its version column
      else{
        //resize textType width
			  $(this).css({
			  width: Math.min(dd.containerWidth - dd.minWidth - dd.versionRemainder - dd.containerWidthRemainder, Math.max(dd.minWidth, dd.width + dd.deltaX))
			  });
			  //resize width of children and
			  $(this).find('.msDisplayRow').css({
			  width: Math.min(dd.containerWidth - dd.minWidth - dd.versionRemainder - dd.containerWidthRemainder, Math.max(dd.minWidth, dd.width + dd.deltaX))
			  });
			  $(this).find('.textScroller').css({
			  width: Math.min(dd.containerWidth - dd.minWidth - dd.textPadding - dd.versionRemainder - dd.containerWidthRemainder - dd.textHandle, Math.max(dd.minWidth - dd.textHandle - dd.textPadding, dd.width - dd.textHandle  - dd.textPadding + dd.deltaX))
			  });
			  //inverse operation for following .textType
			  $(this).next('.textType').css({
			  width: Math.min(dd.containerWidth - dd.minWidth - dd.versionRemainder - dd.containerWidthRemainder, Math.max(dd.minWidth, dd.nextTypeWidth - dd.deltaX))
			  });
			  $(this).next('.textType').find('.msDisplayRow').css({
				  width: Math.min(dd.containerWidth - dd.minWidth - dd.versionRemainder - dd.containerWidthRemainder, Math.max(dd.minWidth, dd.nextTypeWidth - dd.deltaX))
			  });
			  $(this).next('.textType').find('.textScroller').css({
				  width: Math.min(dd.containerWidth - dd.minWidth - dd.textPadding - dd.versionRemainder - dd.containerWidthRemainder - dd.textHandle, Math.max(dd.minWidth - dd.textPadding - dd.textHandle, dd.nextTypeWidth - dd.deltaX - dd.textHandle - dd.textPadding))
			  });
      }
			//add class to handle while dragging to provide visual cue
			$(this).find('.textHandle').addClass('dragging');
			//identify dragging handle
		},{handle: '.textHandle'})
		.drag("end",function(ev, dd){
		  $(this).find('.textHandle').removeClass('dragging');
		});

		//drag resizing of apparatus cells
		$('.apparatusCell').drag('start', function(ev,dd){
			dd.height = $( this ).height();
    	dd.textHeight = $(this).prev('.containerCell').height();
    	dd.containerHeight = $div.height();
    	var $textScroller = $(this).prev('.containerCell').find('.textScroller:first');
    	dd.tsPadding = $textScroller.outerHeight() - $textScroller.height();
    	dd.versionHeader = $(this).parents('.versionColumn').find('.versionHeader').outerHeight();
    	dd.textHeader = $(this).prev('.containerCell').find('.msNavRow').outerHeight();
    	dd.apparatusMin = 40
    	dd.textMin = 32
		})
		//function to execute while drag is in process
		.drag(function(ev, dd){
		  $(this).css({
		    height: Math.min(dd.containerHeight - dd.versionHeader - dd.textHeader - dd.textMin, Math.max(dd.apparatusMin, dd.height - dd.deltaY))
		  });
		  $(this).prev('.containerCell').css({
		    height: Math.max(dd.textMin + dd.textHeader, Math.min(dd.containerHeight - dd.versionHeader - dd.apparatusMin, dd.textHeight + dd.deltaY))
		  });
		  $(this).prev('.containerCell').find('.textType').css({
		    height: Math.max(dd.textMin + dd.textHeader, Math.min(dd.containerHeight - dd.versionHeader - dd.apparatusMin, dd.textHeight + dd.deltaY))
		  });
		  $(this).prev('.containerCell').find('.msDisplayRow').css({
		    height: Math.max(dd.textMin, Math.min(dd.containerHeight - dd.versionHeader - dd.textHeader - dd.apparatusMin,  dd.textHeight + dd.deltaY - dd.textHeader))
		  });
		  $(this).prev('.containerCell').find('.textScroller').css({
		    height: Math.max(dd.textMin - dd.tsPadding, Math.min(dd.containerHeight - dd.versionHeader - dd.textHeader - dd.apparatusMin - dd.tsPadding, dd.textHeight + dd.deltaY - dd.textHeader - dd.tsPadding))
		  });
			//add class to handle while dragging to provide visual cue
			$(this).find('.apparatusHandle').addClass('dragging');
			//identify dragging handle
		},{handle: '.apparatusHandle'})
		.drag("end",function(ev, dd){
		  $(this).find('.apparatusHandle').removeClass('dragging');
		});
}

// called onLoad and by other functions
$.fn.syncScroll = function(){
  var elements = this;
  if (elements.length <= 1) return;
    elements.scroll(function() {
      var left = $(this).scrollLeft();
      var top = $(this).scrollTop();
      elements.each(function() {
        if ($(this).scrollLeft() != left) $(this).scrollLeft(left);
        if ($(this).scrollTop() != top) $(this).scrollTop(top);
      });
    });
}

//produce printer-friendly view of current text
function printerFriendly(){
  var pf = window.open('', 'printer-friendly');

  $.get('sites/all/modules/bookDisplay/php/date.php', function(data){
    var thedate = data;

  var headertitle = $('#headertitle').text();
  var reference = $('#startRef1').html() + ' to ' + $('#endRef1').html();

  var pfc = '<html><head>';
  pfc = pfc + '<title>' + headertitle + ' : Printer Friendly View</title>';
  pfc = pfc + '<link rel="stylesheet" type="text/css" href="sites/all/themes/grammateus/css/printer-friendly.css" />';
  pfc = pfc + '</head>';
  pfc = pfc + '<body>';
  pfc = pfc + '<div id="header"><span class="sbl">An electronic publication of the Society of Biblical Literature</span><h2>The Online Critical Pseudepigrapha</h2><span class="date">Accessed ' + thedate + '</span> <span class="sourceURL">at http://www.purl.org/net/ocp/' + window.location.pathname + window.location.search + '</span><br /><h1>' + headertitle + '</h1>';
  pfc = pfc + '<span class="refs">';

  $('#chapterNav input[name*=start][value!=""]').each(function(){
      pfc = pfc + $(this).prev('label').text() + ' ' + $(this).val();
  });
  $('#chapterNav input[name*=end][value!=""]').each(function(){
      pfc = pfc + ' ' + $(this).prev('label').text();
      var place = $(this).attr('id').substr(6,1);
      pfc = pfc + ' ' + $(this).val() + ' ';
  });

  pfc = pfc + '</span></div>';
  pfc = pfc + '<div id="text"><table cellspacing="0"><tr>';
  $('.versionColumn').each(function(){
    var version = $(this).find('.versionSelector option:selected').text();
    pfc = pfc + '<td><h3>' + version + ' Version</h3>';
    pfc = pfc + '<table cellspacing="0"><tr>';

    $(this).find('.textType').each(function(){
      var textcon = $(this).find('.msDisplayRow').html();
      pfc = pfc + '<td><h4>' + $(this).find('.msSelector option:selected').text() + ' Text</h4><p>' + textcon + '</p></td>';
    });
    pfc = pfc + '</tr></table></td>';
  });
  pfc = pfc + '</tr></table>';
  pfc = pfc + '</div>';
  pfc = pfc + '</body></html>';
  pf.document.open();
  pf.document.write(pfc);
  pf.document.close();

  });
  event.returnValue=false;
  return false;
}

/**
====================================================================================
Everything below this line runs on page load (when the html and styles are finished loading)
====================================================================================
**/
$(document).ready(function(){

//set dimensions of table and bind function to reset them when window is resized
setTableWidth();
$(window).resize(function(){
  setTableWidth();
});

//set value for the document title variable
var bookChosen = $('div.field-item').text();
var bookChosen = $.trim(bookChosen);
$.data(document.body, 'book', bookChosen);

//retrieve hash value on "hashchange" event using jquery ba-BBQ plugin, store the values as data objects, set the values of nav input fields, and trigger retrieval of a new XML snippet
$(window).bind( 'hashchange', function(e) {
  var url = e.fragment;
  if(url==null){
    $('#startRef1').val($.data(document.body, 'firstDiv1'));
    $('#endRef1').val($.data(document.body, 'firstDiv1'));
  }
  else{
    var docDepth = $.data(document.body, 'docDepth');
    var hashVals = url.split('-');
    var startHash = hashVals[0].split('.');
    if(hashVals[1]==null|hashVals[1]=='undefined'){
      var endHash=startHash;
    }
    else{
      var endHash = hashVals[1].split('.');
    }
    $('#startRef1').val(startHash[0]).trigger('change');
    $('#endRef1').val(endHash[0]).trigger('change');
    if(docDepth > 1){
      $('#startRef2').val(startHash[1]);
      $('#endRef2').val(endHash[1]);
      if(docDepth > 2){
        $('#startRef3').val(startHash[2]);
        $('#endRef3').val(endHash[2]);
        if(docDepth > 3){
          $('#startRef4').val(startHash[3]);
          $('#endRef4').val(endHash[3]);
        }
      }
    }
  }
  getSnippet();
});

//fetch list of text versions along with their languages
getVersions();

//bind addVersion function to versionAdder button
$('.versionAdderLink').live('click', function(){
  addVersion();
  return false;
});

//bind closeVersion() to versionCloser button
$('.versionCloserLink').live('click',function(){
  var theID = $(this).parents('.versionColumn').attr('id');
  var theIndex = theID.substr(1, 1);
  closeVersion(theIndex);
  return false;
});

//bind functions to textAdder and msCloser buttons
$('.textAdderLink').live('click', function(){
  var targetCell = $(this).parents('.containerCell').attr('id');
  targetCell = targetCell.substr(1,1);
  addTextColumn(targetCell);
  return false;
});

$('.msCloserLink').live('click', function(){
  var version = $(this).parents('.msNavRow').attr('id').substr(1, 1);
  var textToClose = $(this).parents('.msNavRow').attr('id').substr(3, 1);
  closeText(version, textToClose);
  return false;
});

//when startRef1 textfield value is changed, set appropriate stored variable and set endRef1 textfield to the same value (to avoid invalid ranges)
  $('#startRef1').change(function(){
    var startVal = $('#startRef1').val();
    $.data(document.body, 'startRef1', startVal);
    $('#endRef1').val(startVal);
    $.data(document.body, 'endRef1', startVal);
  });

//when ref1Submit button is clicked, set url hash value to selected divisions (triggering onhashchange event)
  $('#ref1Submit').click(function(){
    //show loader image and hide text
    $('.msDisplayRow img').each(function(){
      $(this).fadeIn(200);
    });
    $('.textScroller').each(function(){
      $(this).fadeOut(0);
    });

    //hide any apparatus readings that were showing
    $('.variantRow').each(function(){
      $(this).fadeOut("slow", function(){
        $(this).remove();
        $('.apparatusLabel').each(function(){
          $(this).fadeIn("fast");
        });
      });
    });
    //assemble hash string providing new passage reference
    var startVal = $('#startRef1').val();
    var endVal = $('#endRef1').val();
    var startVal2 = $('#startRef2').val();
    var endVal2 = $('#endRef2').val();
    var startVal3 = $('#startRef3').val();
    var endVal3 = $('#endRef3').val();
    var startVal4 = $('#startRef4').val();
    var endVal4 = $('#endRef4').val();
    var hashString = '#' + startVal;
    if(startVal2 != null && startVal2 != '' && startVal2 != 'undefined'){
      hashString = hashString + '.' + startVal2;
    }
    if(startVal3 != null && startVal3 != '' && startVal3 != 'undefined'){
      hashString = hashString + '.' + startVal3;
    }
    if(startVal4 != null && startVal4 != '' && startVal4 != 'undefined'){
      hashString = hashString + '.' + startVal4;
    }
    hashString = hashString + '-' + endVal;
    if(endVal2 != null && endVal2 != '' && endVal2 != 'undefined'){
      hashString = hashString + '.' + endVal2;
    }
    if(endVal3 != null && endVal3 != '' && endVal3 != 'undefined'){
      hashString = hashString + '.' + endVal3;
    }
    if(endVal4 != null && endVal4 != '' && endVal4 != 'undefined'){
      hashString = hashString + '.' + endVal4;
    }
    //push the hash string to the url and execute functions bound to "change state" event
    $.bbq.pushState(hashString);
    return false;
  });

//select text in startRef1 and endRef1 fields when they receive focus
  $('#chapterNavForm input[type=text]').bind('click', function(){
      $(this).focus().select();
  });

//function for "beginning" link in nav area
  $('#beginLink').click(function(){
    //show loader image and hide text
    $('.msDisplayRow img').each(function(){
      $(this).fadeIn(200);
    });
    $('.textScroller').each(function(){
      $(this).fadeOut(0);
    });

    if($.data(document.body, 'textStructure')=='fragmentary'){
      var firstDiv1 = $.data(document.body, 'firstFrag');
    }
    else{ var firstDiv1 = $.data(document.body, 'firstDiv1');}
    $('#chapterNavForm input[type=text]').each(function(){
      $(this).val('');
    });
    $('#startRef1').val(firstDiv1);
    $('#endRef1').val(firstDiv1);
    $('.variantRow').each(function(){
      $(this).fadeOut("slow", function(){
        $(this).remove();
        $('.apparatusLabel').each(function(){
          $(this).fadeIn("fast");
        });
      });
    });
    $.bbq.pushState('#' + firstDiv1 + '-' + firstDiv1);
    return false;
  });

//function for "end" link in nav area
  $('#endLink').click(function(){
    //show loader image and hide text
    $('.msDisplayRow img').each(function(){
      $(this).fadeIn(800);
    });
    $('.textScroller').each(function(){
      $(this).fadeOut(0);
    });

    if($.data(document.body, 'textStructure')=='fragmentary'){
      var lastDiv1 = $.data(document.body, 'lastFrag');
    }
    else{var lastDiv1 = $.data(document.body, 'lastDiv1');}
    $('#chapterNavForm input[type=text]').each(function(){
      $(this).val('');
    });
    $('#startRef1').val(lastDiv1);
    $('#endRef1').val(lastDiv1);
    $('.variantRow').each(function(){
      $(this).fadeOut("slow", function(){
        $(this).remove();
        $('.apparatusLabel').each(function(){
          $(this).fadeIn("fast");
        });
      });
    });
    $.bbq.pushState('#' + lastDiv1 + '-' + lastDiv1);
    return false;
  });

  //function for "previous" link in nav area
  $('#prevLink').click(function(){
    //get starting div1 value (stored in input field on page)
    var startRef1 = $('#startRef1').val();
    //get first div1 value for the document
    if($.data(document.body, 'textStructure')=='fragmentary'){
      var firstDiv1 = $.data(document.body, 'firstFrag');
    }
    else{
      var firstDiv1 = $.data(document.body, 'firstDiv1');
    }
    //show message if user is already at the first div1
    if(startRef1==firstDiv1){
      alert('You are already at the beginning of the document');
    }
    //otherwise, change text to display previous div1
    else {
			//show loader image and hide text
			$('.msDisplayRow img').each(function(){
				$(this).fadeIn(200);
			});
			$('.textScroller').each(function(){
				$(this).fadeOut(0);
			});

      var versions = $.data(document.body, 'versions');
      var textStructure = $.data(document.body, 'textStructure');
      if(textStructure == 'fragmentary'){
        var thisDiv1 = $(versions).find('version[fragment="' + startRef1 + '"]').eq(0);
        var prevDiv1 = $(thisDiv1).prev().attr('fragment');
      }
      else{
        var thisDiv1 = $(versions).find('version').eq(0).children('div[number="' + startRef1 + '"]');
        var prevDiv1 = $(thisDiv1).prev().attr('number');
      }
      //set navigation input fields to new div1 values
      $('#chapterNavForm input[type=text]').each(function(){
        $(this).val('');
      });
      $('#startRef1').val(prevDiv1);
      $('#endRef1').val(prevDiv1);
      //hide any visible apparatus info and show default label
      $('.variantRow').each(function(){
        $(this).fadeOut("slow", function(){
          $(this).remove();
          $('.apparatusLabel').each(function(){
            $(this).fadeIn("fast");
          });
        });
      });
      //push new div1 value to the url hash, triggering a new xml call
      $.bbq.pushState('#' + prevDiv1 + '-' + prevDiv1);
    }
    //prevent link from trying to navigate normally
    return false
  });

  //function for "next" link in nav area
  $('#nextLink').click(function(){

    var startRef1 = $('#startRef1').val();
    if($.data(document.body, 'textStructure')=='fragmentary'){
      var lastDiv1 = $.data(document.body, 'lastFrag');
    }
    else{
      var lastDiv1 = $.data(document.body, 'lastDiv1');
    }
    if(startRef1==lastDiv1){
      alert('You are already at the end of the document');
    }
    else {
			$('.msDisplayRow img').each(function(){
				$(this).fadeIn(800);
			});
			$('.textScroller').each(function(){
				$(this).fadeOut(0);
			});
      var versions = $.data(document.body, 'versions');
      var textStructure = $.data(document.body, 'textStructure');
      if(textStructure == 'fragmentary'){
        var thisDiv1 = $(versions).find('version[fragment="' + startRef1 + '"]:last');
        var nextDiv1 = $(thisDiv1).next().attr('fragment');
      }
      else{
        var thisDiv1 = $(versions).find('version:first > div[number="' + startRef1 + '"]');
        var nextDiv1 = $(thisDiv1).next().attr('number');
      }
      $('#chapterNavForm input[type=text]').each(function(){
        $(this).val('');
      });
      $('#startRef1').val(nextDiv1);
      $('#endRef1').val(nextDiv1);
      $('.variantRow').each(function(){
        $(this).fadeOut('slow', function(){
          $(this).remove();
          $('.apparatusLabel').each(function(){
            $(this).fadeIn("fast");
          });
        });
      });
      $.bbq.pushState('#' + nextDiv1 + '-' + nextDiv1);
    }
    return false;
  });

  //set initial font size from cookie (if present)
  if($.cookie('text_size')){
    var fontSize = parseInt($.cookie('text_size'));
    $('.textScroller').each(function(){
      $(this).css('font-size', fontSize);
    });
    $('.apparatusTable').each(function(){
      $(this).css('font-size', fontSize);
    });
  }

  //bind functions for links to change font size;
  $('#fontLarger').click(function(){
    //get value of cookie that holds text size
    var currentSize = $.cookie('text_size');
    //if cookie is empty (or doesn't exist), get current size
    if(currentSize == null){
      var currentSize = $('.textScroller').eq(0).css('font-size');
    }
    //add 1 to current size to yield new size
    var newSize = parseInt(currentSize) + 1;
    //show message if new size would be too big, and don't use it
    if(newSize==24){
      alert('Sorry, the font is already at its maximum size.');
    }
    //otherwise, set font sizes (and cookie) to new size
    else{
      $('.textScroller').each(function(){
        $(this).css('font-size', newSize);
        $.cookie('text_size', newSize, {expires:7});
      });
      $('.apparatusTable').each(function(){
        $(this).css('font-size', newSize);
      });
    }
    //prevent link from trying to navigate normally
    return false;
  });

  $('#fontSmaller').click(function(){
    //get value of cookie that holds text size
    var currentSize = $.cookie('text_size');
    //if cookie is empty (or doesn't exist), get current size
    if(currentSize == null){
      var currentSize = $('.textScroller').eq(0).css('font-size');
    }
    //subtract 1 from current size to yield new size
    var newSize = parseInt(currentSize) - 1;
    //show message if new size would be too small, and don't use it
    if(newSize==6){
      alert('Sorry, the font is already at its minimum size.');
    }
    //otherwise, set font sizes (and cookie) to new size
    else{
      $('.textScroller').each(function(){
        $(this).css('font-size', newSize);
        $.cookie('text_size', newSize, {expires:7});
      });
      $('.apparatusTable').each(function(){
        $(this).css('font-size', newSize);
      });
    }
    //prevent link from trying to navigate normally
    return false;
  });

//bind function for link to open printer-friendly view
  $('#printer-friendly').click(function(){
    printerFriendly();
    event.returnValue=false;
    return false;
  });

//bind function to allow draggable resizing of display panes
  setResizing();

//resize input fields when contents change
$('input').each(function() {
    $(this).after('<span class="inputShadow"></span>');
    var $theShadow = $(this).next('.inputShadow');
    var theVal = $(this).val();
    /*this css is set by javascript so that the script can be self-contained, without an accompanying css sheet*/
    $($theShadow).html(theVal).css({
        'position': 'absolute',
        'top': '-1000px'
    });   

    $(this).bind('change', function() {
        var theVal1 = $(this).val();
        $($theShadow).text(theVal1);

        var theNewWidth1 = $($theShadow).width();
        $(this).animate({
            'width': theNewWidth1 + 12
        }, 0);
    });

    $(this).bind('keyup', function() {
        var theVal2 = $(this).val();
        $($theShadow).text(theVal2);

        var theNewWidth = $($theShadow).width();
        $(this).animate({
            'width': theNewWidth + 12
        }, 0);
    });
});

//close document.ready
});

