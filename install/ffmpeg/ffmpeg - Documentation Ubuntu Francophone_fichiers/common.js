/*
 * This sets a cookie by JavaScript
 *
 * @see http://www.webreference.com/js/column8/functions.html
 */
function setCookie(name, value, expires, path, domain, secure) {
  var curCookie = name + "=" + escape(value) +
      ((expires) ? "; expires=" + expires.toGMTString() : "") +
      ((path) ? "; path=" + path : "") +
      ((domain) ? "; domain=" + domain : "") +
      ((secure) ? "; secure" : "");
  document.cookie = curCookie;
}

/*
 * This reads a cookie by JavaScript
 *
 * @see http://www.webreference.com/js/column8/functions.html
 */
function getCookie(name) {
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin == -1) {
    begin = dc.indexOf(prefix);
    if (begin != 0) return null;
  } else
    begin += 2;
  var end = document.cookie.indexOf(";", begin);
  if (end == -1)
    end = dc.length;
  return unescape(dc.substring(begin + prefix.length, end));
}

/*
 * This is needed for the cookie functions
 *
 * @see http://www.webreference.com/js/column8/functions.html
 */
function fixDate(date) {
  var base = new Date(0);
  var skew = base.getTime();
    date.setTime(date.getTime() - skew);
} 


/*
 *  Vide ou remplit le champ Recherche
 *
 *  McPeter - 30/01/2011
 */
function inputLook() {
  var inputElement = document.getElementsByTagName('input');
  var inputElementNum = inputElement.length;
  for (var i=0; i<inputElementNum; i++) { 
    inputElement[i].onfocus = thisInputFocus(i);
    inputElement[i].onblur = thisInputBlur(i);
  }
  var textareaElement = document.getElementsByTagName('textarea');
  var textareaElementNum = textareaElement.length;
  for (var i=0; i<inputElementNum; i++) { 
    if (textareaElement[i])
    {
      textareaElement[i].onfocus = thisInputFocus(i);
      textareaElement[i].onblur = thisInputBlur(i);
    }
  }
}

function thisInputFocus(i) {
  return function() {
    this.className='input_focused';
    var inputElement = document.getElementsByTagName('input')[i];
    /*inputElement.className='input_focused';*/
    if (inputElement.id=='qsearch__in') {
      if (inputElement.value == 'Recherche rapide....') inputElement.value = '';
    }else if(inputElement.id=='u_field') {
      if (inputElement.value == 'Identifiant') inputElement.value = '';
    }else if(inputElement.id=='p_field') {
      if (inputElement.value == 'Mot de passe') inputElement.value = '';
    }
  }
}

function thisInputBlur(i) {
  return function() {
    this.className='';
    var inputElement = document.getElementsByTagName('input')[i];
    /*inputElement.className='';*/
    if (inputElement.id=='qsearch__in') {
      if (inputElement.value.length<1) inputElement.value = 'Recherche rapide....';
    }else if(inputElement.id=='u_field') {
      if (inputElement.value.length<1) inputElement.value = 'Identifiant';
    }else if(inputElement.id=='p_field') {
      if (inputElement.value.length<1) inputElement.value = 'Mot de passe';
    }
  }
}







