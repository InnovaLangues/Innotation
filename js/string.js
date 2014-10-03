/***************************
FONCTIONS DE CHAINES
****************************/
function htmlReplace( all, $1 ){
	return htmlCharMap[ $1 ];
};

	
var	andExp = /&/g;

var	htmlExp = [
		/(<|>|")/g,
		/(<|>|')/g,
		/(<|>|'|")/g
	];

var	htmlCharMap = {
		'<':'&lt;',
		'>':'&gt;',
		"'":'&#039;',
		'"':'&quot;'
	};
	
	
var	htmlCharMapInverse = {
		'&lt;':'<',
		'&gt;':'>',
		'&#039;':"'",
		'&quot;':'"'
	};
// convert special html characters
function htmlspecialchars( string, quot ){	
	return string.replace( andExp, '&amp;' ).replace( htmlExp[ quot || 0 ], htmlReplace );
}


function html_decode( string ){
	return string.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}