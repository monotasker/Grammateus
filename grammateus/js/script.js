$(document).ready(function(){

  /* assign classes to menu list items to prepare for displaying them in columns */
  $('.nice-menu > li > ul > li:gt(10)').addClass('col2');
  $('.nice-menu > li > ul > li:eq(11)').addClass('col2reset');
  $('.nice-menu > li > ul > li:gt(21)').addClass('col3');  
  $('.nice-menu > li > ul > li:eq(22)').addClass('col3reset');  

  /* remove colons from field labels 
  $('.view-content label, #nodecontent .field-label').each(function(){
    var str = $(this).text();
    newstr = str.replace(":", "");
    $(this).text(newstr);
  });*/

  /* set up qtip tooltips */
  $('#nav img, .versionAdderLink, .versionCloserLink, .textAdderLink, .msCloserLink').qtip({
	style: {
	  'font-size':'.9em',
	  padding:6,
	  opacity:'1',
	  color:'#fff',
	  background:'#96bc44',
	  name: 'green',
	  'box-shadow':'0px 2px 6px 0px #000',
	  border: { width:1, radius:6, color:'#96bc44'},
	  width: { min:200, max:340},
	  tip: true
	},
	position: {
		corner: {
			target: 'topLeft',
			tooltip: 'bottomRight'
		}
	}
  });
	  

  /* insert id's into field divs in #main so that jump links in #sidebar-right can find them */
  $('#block-block-8 li').each(function(){
    var lab = $(this).find('a').attr('rel');
    if($('.field-field-' + lab).length){
      $(this).css('display', 'block');
      $('.field-field-' + lab).attr('id', lab);
    }
  });

});

