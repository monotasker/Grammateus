function getVersions(){
  var bookSelected = $.data(document.body, 'book');
  $.ajax({
    cache:"false",
    type: "GET",
    //dataType: "xml",
    url: "sites/all/modules/textEditor/getVersions.php",
    data: "book=" + bookSelected,
    success:function(xml){
        var data = xml;
        $.data(document.body, "versions", data);
        //get text structure information from xml document header
        var textStructure = $(data).find('version').parent('book').attr('textStructure');
        var firstVersion = $(data).find('version:first').attr('title');
        //set initial data value for the selected version
        $.data(document.body, 'versionSelected', firstVersion);

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
         var firstDiv2 = $(data).find('version:first div:first div:first').attr('number');
         $.data(document.body, 'firstDiv2', firstDiv2);
         var div1Label = $(data).find('version:first division:first').attr('label');
         var div1Punct = $(data).find('version:first division:first').attr('delimiter');
         var div2Label = $(data).find('version:first division').eq(1).attr('label');
         var div2Punct = $(data).find('version:first division').eq(1).attr('delimiter');
         var div3Label = $(data).find('version:first division').eq(2).attr('label');
         var div3Punct = $(data).find('version:first division').eq(2).attr('delimiter');
         var div4Label = $(data).find('version:first division').eq(3).attr('label');
         var div4Punct = $(data).find('version:first division').eq(3).attr('delimiter');
          //determine depth of the version's organizational structure and if it is the deepest in the document cache it as data object
/**
        var docDepth = 1;

        $(data).find('version').each(function(){
          if (div2Label==null){
            var thisDocDepth = 1;
            if(thisDocDepth > docDepth){ docDepth = thisDocDepth };
          }
          else{
            if(div3Label==null){
              var thisDocDepth = 2;
              if(thisDocDepth > docDepth){ docDepth = thisDocDepth };
            }
            else{
              if(div4Label==null){
                var thisDocDepth = 3;
                if(thisDocDepth > docDepth){ docDepth = thisDocDepth };
              }
              else{
                var thisDocDepth = 4;
                if(thisDocDepth > docDepth){ docDepth = thisDocDepth };
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
        $('label[for=startRef1]').html(div1Label);
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
**/
    updateVersions();
    }
  });
}

function fetchFileList(){
  var bookSelected = $.data(document.body, "book");
  $.get("sites/all/modules/textEditor/getFileList.php", {book: bookSelected},
      function(data){
      //populate dropdown list of backup files
        $('#backupList li').each(function(){$(this).remove()});
        $.data(document.body, 'fileList', data);
        $(data.split(";")).each(function(index, val){
          $('#backupList').append('<li>' + val + '</li>');
        });
        //bind function to fetch the backup version selected by clicking a row in that list
        $('#getbackup').click(function(){
          var offset = $('#getbackup').offset();
          $('#backupList').css('left', offset.left).removeClass('hidden');
          return false;
        });
        $('#backupList li').live('click', function(){
          var fileName = $(this).text();
          var fileNameClean = fileName.replace(".xml", "");
          $.data(document.body, "book", fileNameClean);
          $.data(document.body, "dir", "backups");
          fetchSnippet();
          updateVersions();
        });
      });
}

function updateVersions(){
  //retrieve list of versions from stored XML
  var versions = $.data(document.body, 'versions');
  var versionList = $(versions).find('version');
  //clear versions select box and repopulate
  $('#versionSelector').empty();
  $(versionList).each(function(){
    versionTitle = $(this).attr('title');
    $('#versionSelector').append('<option value="' + versionTitle + '">' + versionTitle + '</option>');
  });
  //bind function to fetch new snippet when new version chosen
  $('#versionSelector').change(function(){
     var thisVersion = $(this).find('option:selected').text();
     $.data(document.body, 'versionSelected', thisVersion);
     fetchSnippet();
     fillTextTypesPane();
     setMsSelectors();
  });
  //set language appropriate to current version
  var thisVersion = $('#versionSelector option:selected').text();
  var language = $(versions).find('version[title=' + thisVersion + ']').attr('language');
  $.data(document.body, 'language', language);
  $('.tableText').each(function(){
    $(this).addClass(language);
  });
  //populate ms selector dropdown boxes and the pane listing text type data for current versionAdder
  fillTextTypesPane();
  setMsSelectors();
}

function fillTextTypesPane(){
  //find active version of the current document
  var version = $.data(document.body, 'versionSelected');
  //retrieve xml data on versions and manuscripts
  var versions = $.data(document.body, 'versions');

  //append rows for each text type to textTypes table
  var msArray = $(versions).find('version[title=' + version + '] manuscripts ms');
  $(msArray).each(function(){
    newRow = '<tr>';
    newRow = newRow + '<td><input type="text" value="' + $(this).attr('abbrev') + '" /></td>';
    newRow = newRow + '<td><input type="text" value="' + $(this).find('name').text() + '" /></td>';
    newRow = newRow + '<td><textarea value="" /></td>';
    newRow = newRow + '<td><input type="text" value="' + $(this).attr('language') + '" /></td>';
    newRow = newRow + '<td><textarea>' + $(this).find('bibliography').text() + '</textarea></td>';
    newRow = newRow + '<td>' + $(this).attr('show') + '</td>';
    newRow = newRow + '<td><a href="#" class="redGlow veryLittleButton"><img src="/sites/all/modules/textEditor/images/close-white-12.png" /></a></td>';
    newRow = newRow + '</tr>';
    $('#textTypes table').append(newRow);
  });
  $('#textTypes table tr:odd').addClass('odd');

  //remove row for text type when clicking red button at end of row
  $('#textTypes td a').live('click', function(){
      var thisRow = $(this).parents('tr');
      $(thisRow).remove();
      return false;
  });

  //add row for text type when clicking adder button
  $('.msRowAdder').live('click', function(){
    var newRow = '<tr>';
    newRow = newRow + '<td><input type="text" value="" /></td>';
    newRow = newRow + '<td><input type="text" value="" /></td>';
    newRow = newRow + '<td><textarea value="" /></td>';
    newRow = newRow + '<td><input type="text" value="" /></td>';
    newRow = newRow + '<td><textarea value="" /></td>';
    newRow = newRow + '<td></td>';
    newRow = newRow + '<td><a href="#" class="redGlow veryLittleButton"><img src="/sites/all/modules/textEditor/images/close-white-12.png" /></a></td>';
    newRow = newRow + '</tr>';
    $('#textTypes table').append(newRow);
    return false;
  });
}

function setMsSelectors(){
  //find active version of the current document
  var version = $.data(document.body, 'versionSelected');
  //retrieve xml data on versions and manuscripts
  var versions = $.data(document.body, 'versions');
  //append rows for each text type to textTypes table
  var msArray = $(versions).find('version[title=' + version + '] manuscripts ms');

  //autofill lists for ms selection in tables view
  $('#unitstables .mssText').each(function(){
    var mss = $(this).text();
    var mssList = '<table class="autocomplete hidden">';
    $(msArray).each(function(){
      var msAbbrev = $(this).attr('abbrev') + ' ';
      mssList = mssList + '<tr ';
      //show row as selected if its abbreviation is already in the input field
      if(mss.indexOf(msAbbrev) != -1){
        mssList = mssList + 'class="selectedRow"';
      }
      mssList = mssList + '><td>' + $(this).attr('abbrev') + '</td><td><a href="#" class="veryLittleButton"><img src="/sites/all/modules/textEditor/images/close-white-12.png" /></a></td></tr>';
    });
    mssList = mssList + '</table>';
    $(this).parent('td').append(mssList);
  });

  //find functions to show and hide ms selector tables when input field is clicked
    $('#unitstables .mssText').live('click', function(){
      var tableClass = $(this).next('table').attr('class')
      if(tableClass.indexOf('hidden') != -1){
        $(this).next('table').removeClass('hidden');
        $(this).parent('td').addClass('activeMss');
      }
      else{
        $(this).next('table').addClass('hidden');
        $(this).parent('td').removeClass('activeMss');
      }
    });

  //bind function to insert an ms into the input field when row in the list is clicked
  $('.autocomplete tr td:first-child').live('click', function(){
        var thisLine = $(this).text();
        var parentTable = $(this).parents('table');
        $(parentTable).removeClass('hidden');
        var startingVal = $(parentTable).prev('span').text();
        var valArray = startingVal.split(' ');
        if($.inArray(thisLine, valArray) != -1){
          alert("This text type is already selected for this variant reading");
        }
        else{
          $(parentTable).prev('span').text(startingVal + thisLine + ' ');
          $(this).parent('tr').addClass('selectedRow');
        }
   });

  //bind function to remove an ms from the input field when x icon is clicked
  $('.autocomplete tr td a').live('click', function(){
      var thisLine = $(this).parent('td').prev('td').text() + ' ';
      var parentTable = $(this).parents('table');
      var startingVal = $(parentTable).prev('span').text();
      var newVal = startingVal.replace(thisLine, '');
      $(parentTable).prev('span').text(newVal);
      $(this).parents('tr').removeClass('selectedRow');
  });
}

function fetchSnippet(){
  var bookSelected = $.data(document.body, "book");
  var div1val = $('input#div1').val();
  $.data(document.body, "div1", div1val);
  var div2val = $('input#div2').val();
  $.data(document.body, "div2", div2val);
  var dirName = $.data(document.body, "dir");
  var versionSelected = $.data(document.body, "versionSelected");

  $.ajax({
    type: "POST",
    url: "sites/all/modules/textEditor/xmlof.php",
    data: "book=" + bookSelected + "&version=" + versionSelected + "&div1=" + div1val + "&div2=" + div2val + "&directory=" + dirName,
    dataType: 'xml',
    complete: function(xhr, status){
        $.data(document.body, 'xmlData', xhr.responseText);
        var bookChosen = $.trim($('div.field-item').text());
        $.data(document.body, 'book', bookChosen);
        updateTables();
      },
  });
}

function saveSnippet(){
  fillTextArea();
  var bookSelected = $.data(document.body, "book");
  var div1val = $.data(document.body, "div1");
  var div2val = $.data(document.body, "div2");
  var xmlData = $.data(document.body, "xmlData");

  $.ajax({
    type: "POST",
    url: "sites/all/modules/textEditor/saveverse.php",
    data: "book=" + bookSelected + "&div1=" + div1val + "&div2=" + div2val + "&xmltext=" + xmlData,
    dataType: 'xml',
    complete: function(xhr, status){
        alert(xhr.responseText);
        $.data(document.body, "directory", "drafts");
        fetchFileList();
      },
  });
}

function assembleMssXML(){
  var mssXML = '<version title="' + $('#versionSelector option:selected').text() + '" ';
  var mssXML = mssXML + 'language="' + $(this).find('td:nth-child(4)').text() + '" >';
  var mssXML = mssXML + '<manuscripts>';
  $('#textTypes table tr:gt(0)').each(function(){
  var mssXML = mssXML + '<ms abbrev="' + $(this).find('td:nth-child(1)').text() + '" ';
  var mssXML = mssXML + 'language="' + $(this).find('td:nth-child(4)').text() + '" ';
  var mssXML = mssXML + 'show="' + $(this).find('td:nth-child(6)').text() + '">';
  var mssXML = mssXML + '<name>' + $(this).find('td:nth-child(2)').text() + '</name>';
  var mssXML = mssXML + '<bibliography>' + $(this).find('td:nth-child(5)').text() + '</bibliography>';
  var mssXML = mssXML + '</ms>';
  });
  var mssXML = mssXML + '</manuscripts>';
  var mssXML = mssXML + '</version>';
}

function fillTextArea(){
  var xmltxt = '<div number="' + $.data(document.body, 'div2') + '">\n';
  $('#unitstables table.unitTable').each(function(){
    xmltxt = xmltxt + '<unit id="' + $(this).attr('id');
    $(this).find('tr:first-child input:checked').each(function(){
      xmltxt = xmltxt + ' group="' + $(this).val();
    });
    xmltxt = xmltxt + '">\n';
    $(this).find('tr.unitRow:not(:first-child, :last-child)').each(function(){
        xmltxt = xmltxt + '<reading option="' + $(this).attr('id') + '" ';
        //extra space after the mssText value to ensure that each ms siglum is followed by a trailing space in the XML
        xmltxt = xmltxt + 'mss="' + $(this).find('.mssText').text() + ' "> ';
        xmltxt = xmltxt + $(this).find('.tableText').val();
        xmltxt = xmltxt + '</reading>\n';
    });
    xmltxt = xmltxt + '</unit>\n';
  });
  xmltxt = xmltxt + '</div>';
  //fill textarea pane with new xml
  $('#xmltextarea').val(xmltxt);
  //strip out line breaks from new xml and store it as xmlData object
  var strippedXml = xmltxt.replace(new RegExp( "\\n", "g" ),"");
  $.data(document.body, 'xmlData', strippedXml);
}

//create editable tables populated with the text from the xml snippet
function updateTables() {
  //clear tables pane
  $('#unitstables').html("");
  //get xml snippet
  var xmlDoc = $.data(document.body, 'xmlData');
  //insert table for each unit of text
  $(xmlDoc).find('unit').each(function(){
    var unitID = $(this).attr("id");
    var newtbl = '<table id="' + unitID + '" class="unitTable"><tr class="headerRow">';
    newtbl = newtbl + '<td colspan="2"><span class="unitLabel">Unit ' + unitID + '</span>';
    newtbl = newtbl + 'add variant reading <a href="#" id="oa' + unitID + '" class="optionAdder greenGlow veryLittleButton">';
    newtbl = newtbl + '<img src="/sites/all/modules/textEditor/images/plus-white-12.png" />';
    newtbl = newtbl + '</a>';
    newtbl = newtbl + '<span class="groupForm">include in group <label>1</label><input type="checkbox" name="group" value="1" /></span>';
    newtbl = newtbl + '</td>';
    newtbl = newtbl + '<td class="removerColumn"><a href="#" id="ur' + unitID + '" class="unitRemoverLink redGlow littleButton"><img src="/sites/all/modules/textEditor/images/close-white.png" /></a></td>';
    newtbl = newtbl + '</tr>';
    //add a table row for each reading in the unit
    $(this).find('reading').each(function(){
      var rOption = $(this).attr('option');
      var rMss = $(this).attr('mss').trim() + ' ';
      var rTextRaw = $(this).text();
      var rText = $.trim(rTextRaw);
      newtbl = newtbl + '<tr id="' + rOption + '" class="unitRow">';
      newtbl = newtbl + '<td class="mssColumn">';
      newtbl = newtbl + '<span class="mssText" id="m' + unitID + '.' + rOption + '">' + rMss + '</span>';
      newtbl = newtbl + '</td>';
      newtbl = newtbl + '<td class="readingColumn"><textarea class="tableText" >' + rText + '</textarea></td>';
      newtbl = newtbl + '<td class="removerColumn"><span class="optionRemover"><a id="or' + unitID + '.' + rOption + '" href="#" class="optionRemoverLink veryLittleButton redGlow"><img src="/sites/all/modules/textEditor/images/close-white-12.png" /></a></span></td>';
      newtbl = newtbl + '</tr>';
    });
    //create unitAdder link and hint (hint hidden by default).
    newtbl = newtbl + '<tr class="adderRow">';
    newtbl = newtbl + '<td class="adderColumn" colspan="3">';
    newtbl = newtbl + '<a href="#" id="ua' + unitID + '" class="unitAdder greenGlow littleButton"><img src="/sites/all/modules/textEditor/images/plus-white.png" /></a>';
    newtbl = newtbl + '</td>';
    newtbl = newtbl + '</tr>';
    newtbl = newtbl + '</table>';
    $('#unitstables').append(newtbl);

    //bind functions to links in this unit
    bindUnitLinks(unitID);
  });

  //fill xml text area
  fillTextArea();

  //show hint when user hovers over unitAdder link
  unitAdderAnim();

  setResizingTextareas();

}

//bind (or re-bind) functions to the links in the given unit table
function bindUnitLinks(){
    //bind addOption() function to optionAdder link
    $('.optionAdder').live('click', function(){
      var unitID = $(this).parents('table').attr('id');
      addOption(unitID);
      return false;
    });

    //bind removeOption() function to optionRemover link
    $('.optionRemover').live('click', function(){
      var unitID = $(this).parents('table').attr('id');
      var rowNum = $(this).parents('tr').attr('id');
      removeOption(unitID, rowNum);
      return false;
    });


    //bind addUnit() function to unitAdder link
    $('.unitAdder').live ('click', function(){
      var unitID = $(this).parents('table').attr('id');
      addUnit(unitID);
      return false;
    });

    //bind removeUnit() function to unitRemover link
    $('.unitRemoverLink').live('click', function(){
      var unitID = $(this).parents('table').attr('id');
      removeUnit(unitID);
      return false;
    });

    //show helper when mousing over a unitRemover link
    $('.unitRemoverLink').live('mouseover', function(){
      var theTable = $(this).parents('table');
      var thePos = $(theTable).position();
      $('#unitstables').append('<div class="unitRemoveMask"><span>Click to remove this unit from the text</span></div>');
      $('.unitRemoveMask').css({'top': thePos.top, 'left': thePos.left, 'height': $(theTable).height(), 'width': $(theTable).width()}).addClass('active');
      return false;
    });

    $('.unitRemoverLink').live('mouseout', function(){
      $('#unitstables .unitRemoveMask').removeClass('active').remove();
      return false;
    });

    //show helper when mousing over an optionRemover link
    $('.optionRemover').live('mouseover', function(){
      var theRow = $(this).parents('tr');
      var thePos = $(theRow).position();
      $('#unitstables').append('<div class="optionRemoveMask"><span>Click to remove this variant reading from the unit</span></div>');
      $('.optionRemoveMask').css({'top': thePos.top, 'left': thePos.left, 'height': $(theRow).height(), 'width': $(theRow).width()}).addClass('active');
      return false;
    });

    $('.optionRemover').live('mouseout', function(){
      $('#unitstables .optionRemoveMask').removeClass('active').remove();
      return false;
    });

}

//set animation when user hovers over unitAdder button
function unitAdderAnim(){
  $('.unitAdder').hover(function(){
    $(this).parents('tr').stop(true, true).animate({height:40}, 500).css('border-top', '4px solid #fff').css('border-bottom', '4px solid #fff');
  },
  function(){
    $(this).parents('tr').stop(true, true).animate({height:0}, 500).css('border-top', '0').css('border-bottom', '0');
  });
}

function addUnit(unitID){
  //create id for new unit table
  var newUnitID = parseInt(unitID) + 1;

  //create table for new unit
    var newtbl = '<table id="' + newUnitID + '" class="unitTable"><tr>';
    newtbl = newtbl + '<td colspan="2"><span class="unitLabel">Unit ' + newUnitID + '</span>';
    newtbl = newtbl + 'add variant reading <a href="#" id="a' + newUnitID + '" class="optionAdder veryLittleButton greenGlow">';
    newtbl = newtbl + '<img src="/sites/all/modules/textEditor/images/plus-white-12.png" />';
    newtbl = newtbl + '</a>';
    newtbl = newtbl + '<span class="groupForm">include in group <label>1</label><input type="checkbox" name="group" value="1" /></span>';
    newtbl = newtbl + '</td>';
    newtbl = newtbl + '<td class="removerColumn"><a href="#" id="r' + newUnitID + '" class="unitRemoverLink littleButton redGlow"><img src="/sites/all/modules/textEditor/images/close-white.png" /></a></td>';
    newtbl = newtbl + '</tr>';
    newtbl = newtbl + '<tr id="0">';
    newtbl = newtbl + '<td class="mssColumn">';
    newtbl = newtbl + '<span class="mssText" id="m' + newUnitID + '.0"> </span>';
    newtbl = newtbl + '</td>';
    newtbl = newtbl + '<td class="readingColumn">';
    newtbl = newtbl + '<textarea class="tableText" ></textarea></td>';
    newtbl = newtbl + '<td class="removerColumn"><span class="optionRemover"><a href="#" class="optionRemover veryLittleButton redGlow"><img src="/sites/all/modules/textEditor/images/close-white-12.png" /></a></span></td>';
    newtbl = newtbl + '</tr>';
    //create unitAdder link and hint (hint hidden by default).
    newtbl = newtbl + '<tr class="adderRow">';
    newtbl = newtbl + '<td class="adderColumn" colspan="3">';
    newtbl = newtbl + '<a href="#" id="' + newUnitID + '" class="unitAdder greenGlow littleButton"><img src="/sites/all/modules/textEditor/images/plus-white.png" /></a>';
    newtbl = newtbl + '</td>';
    newtbl = newtbl + '</tr>';
    newtbl = newtbl + '</table>';
    $('#unitstables table#' + unitID).after(newtbl);

  //find active version of the current document
  var version = $('#versionSelector option:selected').text();
  //retrieve xml data on versions and manuscripts
  var versions = $.data(document.body, 'versions');
  //append rows for each text type to textTypes table
  var msArray = $(versions).find('version[title=' + version + '] manuscripts ms');
  //autofill lists for ms selection in tables view

  $('#unitstables table[id=' + newUnitID + '] .mssText').each(function(){
    var mss = $(this).text();
    var mssList = '<table class="autocomplete hidden">';
    $(msArray).each(function(){
      var msAbbrev = $(this).attr('abbrev') + ' ';
      mssList = mssList + '<tr ';
      //show row as selected if its abbreviation is already in the input field
      if(mss.indexOf(msAbbrev) != -1){
        mssList = mssList + 'class="selectedRow"';
      }
      mssList = mssList + '><td>' + $(this).attr('abbrev') + '</td><td><a href="#" class="veryLittleButton"><img src="/sites/all/modules/textEditor/images/close-white-12.png" /></a></td></tr>';
    });
    mssList = mssList + '</table>';
    $(this).parent('td').append(mssList);
  });

  //renumber following units
  renumberUnits();

  //show hint when user hovers over unitAdder link
  unitAdderAnim();

  setResizingTextareas();
}

function removeUnit(unitID){
  //remove selected table
  $('#unitstables table#' + unitID).hide('slow', function(){
    $(this).remove();
    var firstID = parseInt($('#unitstables table:first-child').attr('id'));
    var testID = parseInt(unitID) + 1
    if(firstID == testID){
      $('#unitstables table:first-child').attr('id', unitID);
      $('#unitstables table:first-child').find('.unitLabel').html('Unit ' + unitID);
      renumberUnits();
    }
    else{
      renumberUnits();
    }
  })
}

//renumber units
function renumberUnits(){
  $('#unitstables table:gt(0)').each(function(){
    var lastID = parseInt($(this).prev('table').attr('id'));
    var newID = lastID + 1;
    $(this).attr('id', newID);
    $(this).find('.unitLabel').html('Unit ' + newID);
  });
}

function addOption(unitID){
  var tableLength = $('#unitstables table#' + unitID + ' tr').size();
  var newIndex = parseInt(tableLength) - 2;
  var newRow = '<tr id="' + newIndex + '">';
  newRow = newRow + '<td class="mssColumn">';
  newRow = newRow + '<span class="mssText" id="m' + unitID + '.' + newIndex + '" value="" />';
  newRow = newRow + '</td>';
  newRow = newRow + '<td class="readingColumn">';
  newRow = newRow + '<textarea class="tableText" ></textarea>';
  newRow = newRow + '</td>';
  newRow = newRow + '<td class="removerColumn"><a href="#" class="optionRemover redGlow veryLittleButton"><img src="/sites/all/modules/textEditor/images/close-white-12.png" /></a></td>';
  newRow = newRow + '</tr>';
  $('#unitstables table#' + unitID + ' tr.adderRow').before(newRow);
  $('#unitstables table#' + unitID + ' tr#' + newRow).each(function(){
      var rowNum = $(this).parents('tr').attr('id');
      $(this).click(function(){
        removeOption(unitID, rowNum);
        return false;
      });
    });

  //find active version of the current document
  var version = $('#versionSelector option:selected').text();
  //retrieve xml data on versions and manuscripts
  var versions = $.data(document.body, 'versions');
  //append rows for each text type to textTypes table
  var msArray = $(versions).find('version[title=' + version + '] manuscripts ms');
  //autofill lists for ms selection in tables view

  $('#unitstables table#' + unitID + ' tr#' + newIndex + ' .mssText').each(function(){
    var mss = $(this).text();
    var mssList = '<table class="autocomplete hidden">';
    $(msArray).each(function(){
      var msAbbrev = $(this).attr('abbrev') + ' ';
      mssList = mssList + '<tr ';
      //show row as selected if its abbreviation is already in the input field
      if(mss.indexOf(msAbbrev) != -1){
        mssList = mssList + 'class="selectedRow"';
      }
      mssList = mssList + '><td>' + $(this).attr('abbrev') + '</td><td><a href="#" class="veryLittleButton"><img src="/sites/all/modules/textEditor/images/close-white-12.png" /></a></td></tr>';
    });
    mssList = mssList + '</table>';
    $(this).parent('td').append(mssList);
  });
}

function removeOption(unitID, rowNum){
  $('#unitstables table#' + unitID + ' tr#' + rowNum).remove();
  var rows = $('#unitstables table#' + unitID + ' tr:gt(0)');
  $('#unitstables table#' + unitID + ' tr:gt(0)').each(function(){
    var newPos = $(rows).index(this);
    $(this).attr('id', newPos);
    $(this).find('td.mssColumn input').attr('id', 'm' + unitID + '.' + newPos);
  });
}

        function splitReading(ur) {
            var tl = document.getElementById("t" + ur);
            var b = tl.selectionStart;
            var e = tl.selectionEnd;
            if (b<tl.textLength){
                var readingnode = nodeOfOption(tl.id.substring(1));
                var unitnode = readingnode.parentNode;
                var precedingNode = unitnode.cloneNode(true);
                var followingNode = unitnode.cloneNode(true);
                precedingNode.setAttribute("id", "-" + precedingNode.getAttribute("id"));
                followingNode.setAttribute("id", "+" + followingNode.getAttribute("id"));
                unitnode.parentNode.insertBefore(precedingNode,unitnode);
                unitnode.parentNode.insertBefore(followingNode, unitnode.nextSibling);
//                var ur = tl.id.substring(1).split(".");
//                var u = ur[0];
//                var r = ur[1];
                var textbefore = tl.textContent.substring(0, b);
                var textmiddle = tl.textContent.substring(b, e);
                var textafter = tl.textContent.substring(e);
                nodeOfOption("-" + ur).firstChild.nodeValue = textbefore;
                nodeOfOption(ur).firstChild.nodeValue = textmiddle;
                nodeOfOption("+" + ur).firstChild.nodeValue = textafter;
                var addedreadingnode = readingnode.cloneNode(true);
                addedreadingnode.setAttribute("option", "+" + addedreadingnode.getAttribute("option"));
                unitnode.insertBefore(addedreadingnode, readingnode.nextSibling);
                xmlDoc_change();
            }
        }

function setPanelDimensions(){
  var windowHeight = $(window).height();
  var paneHeight = windowHeight - 150;
  var txtareaHeight = paneHeight - 40;
  $('#unitstables').css("height", paneHeight);
  $('#rawxml').css("height", paneHeight);
  $('#xmltextarea').css("height", txtareaHeight);
  $(window).resize(function(){
    setPanelDimensions();
  });
}

function setResizingTextareas(){
  $('.tableText').autoResize({
      // On resize:
      onResize : function() {
          $(this).css({opacity:0.8});
      },
      // After resize:
      animateCallback : function() {
          $(this).css({opacity:1});
      },
      // Quite slow animation:
      animateDuration : 150,
      // More extra space:
      extraSpace : 4
  });
}

//script to run on page load
$(document).ready(function(){

//get book title from drupal node field and store it as a jquery data object
  var bookChosen = $('div.field-item').text();
  var bookChosen = $.trim(bookChosen);
  $.data(document.body, 'book', bookChosen);

  //set height of content panes dynamically
  setPanelDimensions();
  //get information about the document structure
  getVersions();


  //bind functions for tabs
  $('.editorTab:first-child').click(function(){
    $('#unitstables').removeClass('hidden');
    $('#textTypes').addClass('hidden');
    $('#rawxml').addClass('hidden');
    //get value of xmltextarea
    var xmltxt = $('#xmltextarea').val();
    //strip out line breaks from new xml and store it as xmlData object
    var strippedXml = xmltxt.replace(new RegExp( "\\n", "g" ),"");
    $.data(document.body, 'xmlData', strippedXml);
    //rebuild tables view from xml
    updateTables();
    updateVersions();
    $(document).scrollTop(0);
  });

  $('.editorTab:eq(1)').click(function(){
    $('#unitstables').addClass('hidden');
    $('#textTypes').addClass('hidden');
    $('#rawxml').removeClass('hidden');
    fillTextArea();
    $(document).scrollTop(0);
  });

  $('.editorTab:eq(2)').click(function(){
    $('#unitstables').addClass('hidden');
    $('#rawxml').addClass('hidden');
    $('#textTypes').removeClass('hidden');
    fillTextArea();
    $(document).scrollTop(0);
  });

  //populate "book" form field
  var bookChosen = $.data(document.body, 'book');
  $('input#book').val(bookChosen);

  //populate "div1" and "div2" form fields
  $('input#div1').val($.data(document.body, 'firstDiv1'));
  $('input#div2').val($.data(document.body, 'firstDiv2'));

  //bind fetchSnippet function to "getxml" button
  $("#getxml").click(function(){
    fetchSnippet();
    return false;
  });

  //bind saveSnippet function to "savexml" button
  $("#savexml").click(function(){
      saveSnippet();
    return false;
  });

  //set variable so that xml is initially fetched from "drafts" folder on server
  var dirName = $.data(document.body, "dir", "drafts");

  //fetch initial xml snippet to present initial text for editing
  fetchSnippet();
  fetchFileList();

  //add bottom spacing so that everything is visible;
  $('div.block-textEditor .content').append('<div class="spacer">x</div>');

  //bind live functions for buttons etc.
  //hide things when clicking elsewhere on the page;
  $(document).click(function(){
    $('#backupList').addClass('hidden');
  });

});

