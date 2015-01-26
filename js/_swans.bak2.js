//<![CDATA[
var $j = jQuery.noConflict();


/***************************
DEFINITION DES CONSTANTES CLAVIERS
****************************/
const KEY_ENTREE = 13;
const KEY_ECHAP = 27;
const KEY_ESPACE = 32;
const KEY_FLECHE_GAUCHE = 37;
const KEY_FLECHE_HAUT = 38;
const KEY_FLECHE_DROITE = 39;
const KEY_FLECHE_BAS = 40;
const KEY_DELETE = 46;
const KEY_BACKSPACE = 8;

/***************************
DEFINITION DES VARIABLES GLOBALES
****************************/
const ETATS = {"ATTENTE" : 0, "DEPLACER" : 1, "EDITER" : 2};

var IS_WAVEFORM = true;
var IS_TEXTE = true;

//Le nombres de lignes du texte
var NB_LIGNES = 0;
const NB_LIGNES_MAX = 7;

//Le numero de l'élément qui a le focus
var FOCUS = -1;

//Le numero de l'élément qui a le focus
var CARET = {"start" : 0, "end" : 0, "taille" : 0, "text_selected" : "--TEST--", "text_before" : "", "text_after" : ""};


/**************************
POINT D ENTREE DU PROGRAMME
***************************/
$j(document).ready(function(){
	NB_LIGNES = S_nbLigne();
	S_controleClavier();


	S_initGraphique();	
	S_executeJPlayer();
});



function 	S_initGraphique(){
	$j('.blocSynchroText').resizable({ minHeight: 270,maxHeight: 270 });
	
	//switche entre la video et la forme d'ondes
	$j("#toggle_waveform").click(function(){
		if(IS_WAVEFORM){
			$j(this).removeClass("jp-show-waveform").addClass("jp-show-video");
			$j("#waveform").hide();
			$j("#video").show();
			IS_WAVEFORM = false;
		}else{
			$j(this).removeClass("jp-show-video").addClass("jp-show-waveform");
			$j("#video").hide();
			$j("#waveform").show();
			waveform
			IS_WAVEFORM = true;	
		}
	});
	
	//cache le bloc de texte
 	$j("#toggle_texte").click(function(){
		if(IS_TEXTE){
			$j("#synchonisationAnnotation").hide();
			$j("#couleurAnnotation").hide();
			IS_TEXTE = false;
		}else{
			$j("#synchonisationAnnotation").show();
			$j("#couleurAnnotation").show();
			IS_TEXTE = true;	
		}
	});
	
	//focus si clic sur bloc de synchronized	
	$j("body").on("click", ".blocSynchroText", function(event){
		num = $j(".blocSynchroText").index(this);
		S_focusLigne(num);
	});
	
	//focus si clic sur ligne de texte	
	$j("body").on("click", ".textCol", function(event){
		num = $j(".textCol").index(this);
		S_focusLigne(num);
		S_getCaretPosition();
	});
	
	
	$j("#fleche_bas").click(function(){
		S_focusLigne(FOCUS+1);
	});
	
	$j("#fleche_haut").click(function(){
		S_focusLigne(FOCUS-1);
	});
	
	$j("body").on("click", ".suppressionCol", function(event){
		num = $j(".suppressionCol").index(this);
		S_supprimerLigne(num);
		if(!S_focusLigne(num,true))S_focusLigne(num-1);
	});
	
	
	
	/*****************************
	BLOC TRANSFORMATION ANNOTATION
	******************************/


	$j('#bloc_alphabetNormal').click(function(){
			S_annoterTexteManuellement();
	});
	
	$j('#bloc_accentPrimaire').click(function(){
			S_annoterTexteManuellement('A_accentPrimaire');
			
	});
	
	$j('#bloc_accentSecondaire').click(function(){
			S_annoterTexteManuellement('A_accentSecondaire');
	});
	
	$j('#bloc_voyelleFaible').click(function(){	
			S_annoterTexteManuellement('A_voyelleFaible');	                   
	});
	
	
	
	//RECUPER LE PASTE SUR LES LES LIGNES et nettoie le code tout en créant de nouvelles lignes a chaque BR
	$j("body").on("paste", ".textCol", function(event){
		//console.log('paste : '+ $j(this).html());
		
	});
}

function S_annoterTexteManuellement(classeCSS){
	var texte = $j.selection();
	if(texte!=""){
		if(!classeCSS){
			document.execCommand ('insertHTML', false, texte);	
		}else{
			document.execCommand ('insertHTML', false, '<span class="'+classeCSS+'">' + texte + '</span>');				
		}
	
	}
}


function $_supprimerTexteSelection(){
	
	var texte = $j.selection();
	if(texte!=""){
		document.execCommand ('delete', false, null);
		return true;
	}
	return false;
}



function S_ajouterLigne(num,texte){
	if(!texte) texte ="";
	ligne = '<tr><td class="timeCol"><input type="text"></td><td class="separation"></td><td class="textCol" contenteditable="true">'+ texte +'</td><td class="suppressionCol"><span></span></td></tr>';
	bloc = '<div class="blocSynchroText"></div>';
	$j(".textCol").eq(num).parent().after(ligne);
	$j(".blocSynchroText").eq(num).after(bloc);
	$j(".blocSynchroText").eq(num+1).resizable({ minHeight: 270,maxHeight: 270 });
	NB_LIGNES++
	S_focusLigne(num+1); 
	S_setCaretPosition(0);
}



function S_supprimerLigne(num){
	if(NB_LIGNES > 1){
		$j(".textCol").eq(num).parent().remove();
		$j(".blocSynchroText").eq(num).remove();
		NB_LIGNES--;
	}
}

function S_nbLigne(){
	return $j(".textCol:visible").length;	
}


function S_getTrLigneCourante(){
	return S_getLigneCourante().parent();
}

function S_getLigneCourante(){
	return $j(".textCol").eq(FOCUS);
}



function S_focusLigne(num,force){
	if(!force) force = false;
	if((FOCUS != num || force == true) && num >= 0 && num < S_nbLigne()){
		if(!force) S_getLigneCourante().removeClass("focusLigne");
		$j(".textCol").eq(num).addClass("focusLigne");
		$j(".textCol").eq(num).focus();
		
		if(!force) $j(".blocSynchroText").eq(FOCUS).removeClass("focusLigne");
		$j(".blocSynchroText").eq(num).addClass("focusLigne");
		FOCUS = num;
		return true;
	}
	return false;
}


function $_sauvegarderEnBDD(){
	
}


function S_nettoyerTexte(objet){
	var whitelist = "span"; // for more tags use the multiple selector, e.g. "p, img"
	objet.find('*').not(whitelist).each(function() {
  	var content = $j(this).contents();
  	$j(this).replaceWith(content);
	});	
}



/*****************************
CONTROLE DU CLAVIER - KEYCODE
******************************/


function keyCodeAutoriseTime(keyCode){
		return ((keyCode >= 37 && keyCode <= 58) || keyCode == KEY_BACKSPACE);
}

function S_getKeyCode(event){
	return event.which || event.keyCode; 
}


function S_controleClavier(champ,keyCode){
	
	//SUR LA PAGE PRINCIPALE
	/*
	$j("html").keydown(function(event){
		var keyCode = event.which || event.keyCode; 
		switch(keyCode){
			case KEY_BACKSPACE :
				//event.preventDefault();
	 			break;	
		}
	});
	*/
	
	$j("body").on("keydown", ".timeCol", function(event){
		if(event.type = "keydown"){
			var keyCode = S_getKeyCode(event);
			if(!keyCodeAutoriseTime(keyCode)) event.preventDefault();
		}
	 });
	 	
	  		
	//SUR LE TABLEAU
	$j("body").on("keydown", ".textCol", function(event){
		
	  
	  	
		if(event.type = "keydown"){
			var tr = $j(this).parent();
			S_getCaretPosition();
			var keyCode = S_getKeyCode(event);
	  	var html = $j(this).html();
	  	//console.log(pos);
	  	//console.log(html);
	  	switch(keyCode){
	  		case KEY_ENTREE :
					if(!$_supprimerTexteSelection()){//si pas supprimer le texte alors
						//ajouter une ligne
						//$j(this).html(CARET.text_before);
						S_ajouterLigne(FOCUS,"");
					}
					event.preventDefault();
	  			break;	
	  		case KEY_BACKSPACE ://supprime une ligne et se place sur la précedente si elle existe
	  			if(CARET.end == 0 && S_nbLigne() > 1 && FOCUS > 0 ){
	  				var	text_prev="";
	  				prev = tr.prev();
  					td_prev = prev.find(".textCol");
  					text_prev = td_prev.html();
  					td_prev.html(text_prev + CARET.text_after);
  					S_nettoyerTexte(td_prev);
						S_supprimerLigne(FOCUS);
						if(S_focusLigne(FOCUS-1)) S_setCaretPosition(text_prev.length);	
						event.preventDefault();
	  			}
	  			break;
	  		case KEY_DELETE :
		  		$j.selection('html');
		  		
	  			var text_len = $j(this).text().length
	  			if(CARET.start == text_len && FOCUS < (S_nbLigne()-1) && S_nbLigne() > 1){
	  				var text_suiv="";
	  				tr_next = tr.next();
  					td_next = tr_next.find(".textCol");
  					text_next = td_next.html();
  					S_nettoyerTexte($j(this));
  					$j(this).html($j(this).html() + text_next);  					
						S_supprimerLigne(FOCUS+1);
						S_setCaretPosition(CARET.start);
						event.preventDefault();
	  			}
	  			break;
	  		case KEY_FLECHE_BAS : 
	  			S_focusLigne(FOCUS+1); 
	  			S_setCaretPosition(S_getRightCaret());
	  			event.preventDefault();
	  			break;
	  		case KEY_FLECHE_HAUT : 
	  			S_focusLigne(FOCUS-1); 
	  			S_setCaretPosition(S_getRightCaret());
	  			event.preventDefault();
	  			break;
	  		case KEY_FLECHE_GAUCHE :
	  			if(CARET.end == 0){
	  				S_focusLigne(FOCUS-1);
	  				S_setCaretPosition(S_getLigneCourante().text().length);
	  				event.preventDefault();
	  			}
	  			break;
	  		case KEY_FLECHE_DROITE : 
	  			if(CARET.end == S_getLigneCourante().text().length){
	  				S_focusLigne(FOCUS+1);
	  				S_setCaretPosition(0);
	  				event.preventDefault();
	  			}
	  			break;
  		}
	  }
  });	
}


/********************************
FONCTION DE POSTIONNEMENT CURSEUR
********************************/

function S_getRightCaret(){
	objet = S_getLigneCourante();
	if(CARET.start > objet.text().length) return objet.text().length;
	else return CARET.start;
}


function S_setCaretPosition(start){
  var el = S_getLigneCourante().get(0).childNodes[0];
  if(typeof el == 'object'){
  	var range = document.createRange();
	  var sel = window.getSelection();
	  range.setStart(el,start);
	  range.collapse(true);
	  sel.removeAllRanges();
	  sel.addRange(range);
  }
}


function S_getCaretPosition(){
	var sel, range;
  if (window.getSelection){
    sel = window.getSelection();
    if (sel.rangeCount){
  		range = sel.getRangeAt(0);
      CARET.end = range.endOffset;
      CARET.start = range.startOffset;
      
      CARET.taille =  CARET.end - CARET.start;
      texte = range.toString();
      CARET.text_selected = texte.substr(CARET.start,CARET.taille);
      CARET.text_before = texte.substr(0,CARET.start);  
      CARET.text_after = texte.substr(CARET.end,(texte.length-CARET.end));     
    }
  }
}


//$j('.annotationTextCol div br').length

//$("#synchonisationAnnotationText").scrollTop(90);



/***************************
LANCEMENT DU LECTEUR VIDEO
****************************/
function S_executeJPlayer(){
	$j("#video").jPlayer({
		ready: function () {
			$j(this).jPlayer("setMedia", {
				m4v: "http://www.jplayer.org/video/m4v/Big_Buck_Bunny_Trailer.m4v",
				ogv: "http://www.jplayer.org/video/ogv/Big_Buck_Bunny_Trailer.ogv",
				webmv: "http://www.jplayer.org/video/webm/Big_Buck_Bunny_Trailer.webm",
				poster: "http://www.jplayer.org/video/poster/Big_Buck_Bunny_Trailer_480x270.png"
			});
		},
		swfPath: "js",
		supplied: "webmv, ogv, m4v",
		size: {
			width: "480px",
			height: "270px"
		},
		smoothPlayBar: true,
		keyEnabled: false
	});
}






//]]>

