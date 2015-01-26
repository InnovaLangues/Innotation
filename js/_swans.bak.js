//<![CDATA[
var $j = jQuery.noConflict();


/***************************
DEFINITION DES CONSTANTES
****************************/

const KEY_ENTREE = 13;
const KEY_ECHAP = 27;
const KEY_ESPACE = 32;
const KEY_FLECHE_GAUCHE = 37;
const KEY_FLECHE_HAUT = 38;
const KEY_FLECHE_DROITE = 39;
const KEY_FLECHE_BAS = 40;
const KEY_DELETE = 48;
const KEY_BACKSPACE = 8;

const ETATS = {"ATTENTE" : 0, "DEPLACER" : 1, "EDITER" : 2};
var IN_FOCUS = false;

var CARET_TEXT = {"start" : 0, "end" : 0, "taille" : 0, "text_selected" : "", "text_before" : "", "text_after" : ""};

const NB_LIGNE_VISIBLE_MAX = 7;

var FOCUS_TEXT = 0;

var IS_WAVEFORM = true;


/**************************
POINT D ENTREE DU PROGRAMME
***************************/
$j(document).ready(function(){
	S_controleClavier();
	S_executeJPlayer();
	S_supprimerLigneTexte();
	S_flecheTexte();
	S_initGraphique();
});



function 	S_initGraphique(){
	$j('.blocSynchroText').resizable({ minHeight: 270,maxHeight: 270 });
	
	
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
}

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



function S_ajouterLigne(num){
	
}



function S_supprimerLigne(num){
	
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


function S_supprimerLigneTexteObjet(objet){
	if($j(".textCol").length > 1 && !$j.isEmptyObject(objet)){
		tr = objet.parent();
		S_deplacerFocusTexte2(tr);
		objet.parent().remove();
	}
}

function S_supprimerLigneTexte(){
	$j("body").on("click", ".suppressionCol", function(event){
		S_supprimerLigneTexteObjet($j(this));
	});
}

function S_flecheTexte(){	
	$j("body").on("click", ".textCol", function(event){
		FOCUS_TEXT = $j(".textCol").index(this);
	});
	
	$j("body").on("click", "#fleche_bas", function(event){
		tr = $j(".textCol").eq(FOCUS_TEXT).parent()
		S_deplacerFocusTexte(tr,KEY_FLECHE_BAS);
	});
	
	$j("body").on("click", "#fleche_haut", function(event){
		tr = $j(".textCol").eq(FOCUS_TEXT).parent()
		S_deplacerFocusTexte(tr,KEY_FLECHE_HAUT);
	});
	
	
}

function S_nbLigne(){
	return $j(".textCol").length;	
}

/***************************
CONTROLE DU CLAVIER
****************************/
function S_controleClavier(){
	
	//SUR LA PAGE PRINCIPALE
	$j("html").keydown(function(event){
		var keyCode = event.which || event.keyCode; 
		switch(keyCode){
			case KEY_BACKSPACE :
				//event.preventDefault();
	 			break;	
		}
	});
	
	
	//SUR LE TABLEAU
	$j("body").on("keydown", ".textCol", function(event){
		if(event.type = "keydown"){
			var tr = $j(this).parent();
			var keyCode = event.which || event.keyCode; 
	  	//var pos = $j(this).selection('getPos');
	  	S_getCaretPosition();
	  	
	  	var html = $j(this).html();
	  	
	  	//console.log(pos);
	  	//console.log(html);
	  	
	  	switch(keyCode){
	  		case KEY_ENTREE :
					if(CARET_TEXT.end > CARET_TEXT.start){//supprimer le texte
						$j(this).html(CARET_TEXT.text_before+CARET_TEXT.text_after);
					}else{//ajouter une ligne
						$j(this).html(CARET_TEXT.text_before);
						tr.after('<tr><td class="timeCol"><input type="text"></td><td class="separation"></td><td class="textCol" contenteditable="true">'+CARET_TEXT.text_after+'</td><td class="suppressionCol"><span></span></td></tr>');
						S_deplacerFocusTexte(tr,KEY_FLECHE_BAS);
					}
					event.preventDefault();		
	  			break;	
	  		case KEY_BACKSPACE ://supprime une ligne et se place sur la précedente si elle existe
	  			var text_prev="";
	  			if(CARET_TEXT.end == 0 && S_nbLigne() > 1 ){
	  				prev = tr.prev();
	  				if(!$j.isEmptyObject(prev)){
	  					td_prev = prev.find(".textCol");
	  					text_prev = td_prev.html();
	  					td_prev.html(text_prev + CARET_TEXT.text_after);
	  					S_nettoyerTexte(td_prev);
	  				}
						S_supprimerLigneTexteObjet($j(this));
						
	  				event.preventDefault();
	  			}
	  			break;
	  		case KEY_FLECHE_BAS :
	  		case KEY_FLECHE_HAUT :
	  		//case KEY_FLECHE_DROITE :
	  		//case KEY_FLECHE_GAUCHE :
	  			S_deplacerFocusTexte(tr,keyCode,-1);
	  			
	  			break;
	  		default :
	  			//S_nettoyerTexte($j(this));
	  			break;
  		}
	  }
  });	
}

function S_deplacerFocusTexte2(tr){
	if(!S_deplacerFocusTexte(tr,KEY_FLECHE_HAUT)) S_deplacerFocusTexte(tr,KEY_FLECHE_BAS);
}



function S_deplacerFocusTexte(tr,direction,caret){
	ret = false;
	if(!caret) caret = 0;
	switch(direction){
		case KEY_FLECHE_HAUT : 
			if(FOCUS_TEXT > 0){
				prev = tr.prev().find(".textCol");
				
				if(caret==-1) caret = S_getRightCaret(prev);
				S_setCaretPosition(prev,caret);
				
				if(S_focus(prev)){
					if(FOCUS_TEXT > 0)	FOCUS_TEXT --;
					ret = true;
				}
			}else{
				if(S_focus(tr.find(".textCol")));
			}
			break;	
		case KEY_FLECHE_BAS : 
			if(FOCUS_TEXT < (S_nbLigne()-1)){
				next = tr.next().find(".textCol");
				
				if(caret==-1) caret = S_getRightCaret(next);
				S_setCaretPosition(next,caret);
				
				if(S_focus(next)){
					if(FOCUS_TEXT < (S_nbLigne()-1))	FOCUS_TEXT ++;
					ret = true;
				}
			}else{
				if(S_focus(tr.find(".textCol")));
			}
			break;
			
	}
	return ret;
}


function S_focus(objet){
	if(!$j.isEmptyObject(objet)){
		objet.focus();
		return true;
	}
	return false;
}

function S_getRightCaret(objet){
	if(CARET_TEXT.start > objet.text().length) return objet.text().length;
	else return CARET_TEXT.start;
}
function S_setCaretPosition(objet,caret){
  var el = objet.get(0).childNodes[0];
  console.log(objet);
	if(typeof el == 'object'){
		console.log('caret : '+caret);
	  var range = document.createRange();
	  var sel = window.getSelection();
	  range.setStart(el,caret);
	  range.collapse(true);
	  sel.removeAllRanges();
	  sel.addRange(range);
	  objet.focus();
  }
}

function S_getCaretPosition(){
		CARET_TEXT = {"start" : 0, "end" : 0, "taille" : 0, "text_selected" : "", "text_before" : "", "text_after" : ""};
		var caretPos = 0, containerEl = null, sel, range;
    if (window.getSelection){
        sel = window.getSelection();
        if (sel.rangeCount){
            range = sel.getRangeAt(0);
            CARET_TEXT.end = range.endOffset;
            CARET_TEXT.start = range.startOffset;
            CARET_TEXT.taille =  CARET_TEXT.end - CARET_TEXT.start;
            texte = (range.startContainer.data || range.endContainer.data || "");
            CARET_TEXT.text_selected = texte.substr(CARET_TEXT.start,CARET_TEXT.taille);
            CARET_TEXT.text_before = texte.substr(0,CARET_TEXT.start);  
            CARET_TEXT.text_after = texte.substr(CARET_TEXT.end,(texte.length-CARET_TEXT.end));          
        }
    }
}


//$j('.annotationTextCol div br').length

//$("#synchonisationAnnotationText").scrollTop(90);


//]]>