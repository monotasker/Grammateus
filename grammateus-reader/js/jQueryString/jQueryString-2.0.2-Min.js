/* jQueryString v2.0.2
 By James Campbell
 */
(function($){$.unserialise=function(Data){var Data=Data.split("&");var Serialised=new Array();$.each(Data,function(){var Properties=this.split("=");Serialised[Properties[0]]=Properties[1];});return Serialised;};$.getAllQueryStrings=function(Option){Option=$.extend({URL:location.href,callback:function(Options,Result){}},Option);var Result=new Array();try{var QS=Option.URL.split("?")[1].split("#")[0];}
catch(e){Option.callback(Option,Result);return Result;}
Result=$.unserialise(QS);Option.callback(Option,Result);return Result;}
$.QueryStringExist=function(Option){Option=$.extend({URL:location.href,callback:function(Option,Result){}},Option);var Result=(typeof($.getAllQueryStrings({URL:Option.URL})[Option.ID])!="undefined");Option.callback(Option,Result);return Result;}
$.getQueryString=function(Option){Option=$.extend({URL:location.href,onStart:function(Option){},onError:function(Option){},onSuccess:function(Option,Result){},callback:function(Option,Result){}},Option);var Result=Option.DefaultValue;Option.onStart(Option);if($.QueryStringExist({ID:Option.ID,URL:Option.URL})){Result=$.getAllQueryStrings({URL:Option.URL})[Option.ID];Option.onSuccess(Option,Result);}
else{Option.onError(Option);};Option.callback(Option,Result);return Result;};})(jQuery);