//<![CDATA[
var $j = jQuery.noConflict();


/***************************
DEFINITION DES varANTES CLAVIERS
****************************/
var KEY_ENTREE = 13;
var KEY_ECHAP = 27;
var KEY_ESPACE = 32;
var KEY_FLECHE_GAUCHE = 37;
var KEY_FLECHE_HAUT = 38;
var KEY_FLECHE_DROITE = 39;
var KEY_FLECHE_BAS = 40;
var KEY_DELETE = 46;
var KEY_BACKSPACE = 8;


var NOM_FICHIER = "";//ep14


var TAB_WIDTH_BLOC = {};
	
var SCROLL_NAV = 0;
var DUREE_MEDIA = 0;

/***************************
DEFINITION DES VARIABLES GLOBALES
****************************/
var ETATS = {"ATTENTE" : 0, "DEPLACER" : 1, "EDITER" : 2};

var IS_WAVEFORM = true;
var IS_TEXTE = true;
var IS_ANNOTATED = true;
var IS_PLAYING = false;

var DURATION = 0;
var PLAYER;
	
//Le nombres de lignes du texte
var NB_LIGNES = 0;
var NB_LIGNES_MAX = 7;

//Le numero de l'élément qui a le focus
var FOCUS = -1;

//Le numero de l'élément qui a le focus
var CARET = {"start" : 0, "end" : 0, "taille" : 0, "text_selected" : "--TEST--", "text_before" : "", "text_after" : ""};


var HAUTEUR_MAX = 270;
var BLOC_SYNCHRO = {"childNodes":{}, "container":0};

/**************************
POINT D ENTREE DU PROGRAMME
***************************/
$j(document).ready(function(){
	NB_LIGNES = S_nbLigne();
	S_lancerMultimedia();
});


function S_calculerRatioBlocSynchro(){
	BLOC_SYNCHRO.childNodes = {};
	BLOC_SYNCHRO.container = S_getTailleCadreSynchro();
	$j(".blocSynchroText").each(function(i){
			BLOC_SYNCHRO.childNodes[i] = {"position":0,"ratioPosition":0};
			BLOC_SYNCHRO.childNodes[i].position = $j(this).position().left;
			BLOC_SYNCHRO.childNodes[i].ratioPosition =	BLOC_SYNCHRO.childNodes[i].position / BLOC_SYNCHRO.container;	
	});
}


function 	S_initGraphique(){
	
	S_calculerRatioBlocSynchro();
	
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
	
	//toggle d'affichage de l'annotation..rend juste l'annotation invisble
 	$j("#afficherAnnotation").click(function(){
		if(IS_ANNOTATED){
			$j("#bloc_accent").hide();
			$j(this).find(".cocher").removeClass("cocher").addClass("decocher");
			$j(".A_accentPrimaire,.A_accentSecondaire,.A_voyelleFaible").addClass("A_disabled");
			IS_ANNOTATED = false;
		}else{
			$j("#bloc_accent").show();
			$j(this).find(".decocher").removeClass("decocher").addClass("cocher");
			$j(".A_disabled").removeClass("A_disabled");
			IS_ANNOTATED = true;	
		}
	});
	
	
	
	//focus si clic sur bloc de synchronized	
	$j("body").on("mousedown", ".blocSynchroText", function(event){
		num = $j(".blocSynchroText").index(this);
		S_focusLigne(num);
	});
	
	//focus si clic sur ligne de texte	
	$j("body").on("mousedown", ".textCol", function(event){
		num = $j(".textCol").index(this);
		S_focusLigne(num);
		S_getCaretPosition();
	});
	
	
	$j("#fleche_bas, #navDroite").click(function(){
		S_focusLigne(FOCUS+1);
	});
	
	$j("#fleche_haut, #navGauche").click(function(){
		S_focusLigne(FOCUS-1);
	});
	
	$j("body").on("click", ".suppressionCol", function(event){
		num = $j(".suppressionCol").index(this);
		S_supprimerLigne(num);
		if(!S_focusLigne(num,true))S_focusLigne(num-1,true);
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
	
	});
	
	//BLOC DE SYNCHRONISATION
	//redimensionement des blocs de synchronisation
	$j("body").on("resize", ".blocSynchroText", function(event, ui ){
		//calculer l'info temporelle
		bloc_suivant = ui.element.next();		
		num = $j(".blocSynchroText").index(this);
		TAB_WIDTH_BLOC[num] = 0;
		if(!TAB_WIDTH_BLOC[num + 1]) TAB_WIDTH_BLOC[num + 1] = bloc_suivant.width() + ui.originalSize.width;
		taille = TAB_WIDTH_BLOC[num + 1] - ui.size.width;
		position = ui.position.left + ui.size.width;
		bloc_suivant.css({"width":taille ,"left":position});
		S_calculerRatioBlocSynchro();
		$_MAJTemps();
	});
	
	$j("body").on("dblclick", ".blocSynchroText", function(event, ui ){	
		num = $j(".blocSynchroText").index(this);
		tps = BLOC_SYNCHRO.childNodes[num].ratioPosition * DURATION;
		PLAYER.jPlayer("play", tps);
	});
	
	
	//redimensionement de la fenetre et des objets qui en dependent
	$j(window).resize(function(){
		width_cadre = S_getTailleWaveform();
		//redimension la forme d'ondes
		$j("#waveform_img canvas").width(width_cadre);
		
		S_redimensionnerBlocSynchro();
	});
}


function S_teteDeLectureVersFocus(tps){
	for(i in BLOC_SYNCHRO.childNodes){
		i = parseInt(i);
		if(tps >= BLOC_SYNCHRO.childNodes[i].ratioPosition) 
		{
			if(typeof BLOC_SYNCHRO.childNodes[i+1] == "object"){
				if(tps < BLOC_SYNCHRO.childNodes[i+1].ratioPosition){
					S_focusLigne(i,true);
					return true;
				}
			}else{
				S_focusLigne(i,true);
				return true;
			}
		}
	}
	return false;
}


function $_MAJTemps(){
	$j('.timeCol').each(function(i){
		tps = $j.jPlayer.convertTime(BLOC_SYNCHRO.childNodes[i].ratioPosition * DURATION);
		$j(this).text(tps);
	});
}

function S_retracerBlocSynchro(){
	$j(".blocSynchroText").each(function(i){
		blocInfo = BLOC_SYNCHRO.childNodes[i];
		if(typeof BLOC_SYNCHRO.childNodes[i + 1] == "object"){//le bloc suivant n'existe pas
			blocInfo_suivant = BLOC_SYNCHRO.childNodes[i+1];
			taille = blocInfo_suivant.position - blocInfo.position ;
		}else{
			taille = BLOC_SYNCHRO.container - blocInfo.position;
		}
		$j(this).css({"width": taille});
	});
}


function S_redimensionnerBlocSynchro(){
	tailleContainer = S_getTailleWaveform();
	//positionnement des curseurs
	for(i in BLOC_SYNCHRO.childNodes){
			blocInfo = BLOC_SYNCHRO.childNodes[i];
			blocInfo.position = blocInfo.ratioPosition * tailleContainer;
	
			blocInfo.ratioPosition = blocInfo.position / tailleContainer;
			
			bloc = $j(".blocSynchroText").eq(i);
			bloc.css({"left": blocInfo.position});
	}
	
	//calcul des taille
	S_retracerBlocSynchro();
	//attribution de la nouvelle taille
	BLOC_SYNCHRO.container = tailleContainer;
}


function S_annoterTexteManuellement(classeCSS){
	if(!IS_ANNOTATED) return false;
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
	ligne = '<tr><td class="timeCol"></td><td class="separation"></td><td class="textCol" contenteditable="true">'+ texte +'</td><td class="suppressionCol"><span></span></td></tr>';
	bloc = '<div class="blocSynchroText"></div>';
	$j(".textCol").eq(num).parent().after(ligne);
	
	bloc_courant = $j(".blocSynchroText").eq(num);
	taille = bloc_courant.width()/2;
	bloc_courant.after(bloc);
	bloc_suivant = 	bloc_courant.next();
	bloc_courant.css({"width":taille});
	bloc_suivant.css({"width":taille,"left":(bloc_courant.position().left+taille)});

	var bloc_resize = bloc_courant;
	if(num + 1 != NB_LIGNES) bloc_resize = bloc_suivant;
	
	bloc_resize.resizable({ minHeight: HAUTEUR_MAX,maxHeight: HAUTEUR_MAX});
	bloc_resize.resizable("enable");
	
	NB_LIGNES++
	S_focusLigne(num+1); 
	S_setCaretPosition(0);
	
	S_calculerRatioBlocSynchro();
	TAB_WIDTH_BLOC = {};
}



function S_supprimerLigne(num){
	if(NB_LIGNES > 1 && num > 0){
		$j(".textCol").eq(num).parent().remove();
		bloc_courant = $j(".blocSynchroText").eq(num);
		bloc_precedent = bloc_courant.prev();
		taille = bloc_precedent.width() + bloc_courant.width();
		bloc_courant.remove();
		
		bloc_precedent.css({"width":taille});
		if(num + 1 == NB_LIGNES) bloc_precedent.resizable( "disable" );
		NB_LIGNES--;
		S_calculerRatioBlocSynchro();
		TAB_WIDTH_BLOC = {};
		return true
	}
	return false;
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

function S_getTailleWaveform(){
	return $j('#waveform').width();
}

function S_getTailleCadreSynchro(){
	return $j('#cadreSynchro').width();
}

function S_focusLigne(num,force){
	if(!force) force = false;
	
	if(IS_PLAYING == false || force == true){
		if((FOCUS != num || force == true) && num >= 0 && num < S_nbLigne()){
			$j(".textCol, .blocSynchroText").each(function(){
					$j(this).removeClass("focusLigne");
					$j(this).attr("contenteditable","false");
			});
			$j(".textCol").eq(num).attr("contenteditable","true").focus().addClass("focusLigne");
			$j(".blocSynchroText").eq(num).addClass("focusLigne"); 
			FOCUS = num;
			return true;
		}
	}else{
		return false;	
	}
	
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


function S_controleClavier(){
	
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



function S_initMultimedia(){
	var WAVEFORM ;
	/***************************
	LANCEMENT DU LECTEUR VIDEO
	****************************/
	PLAYER = $j("#video");
	
		
	PLAYER.bind($j.jPlayer.event.loadeddata, function(event){
		stat = event.jPlayer.status;
		DURATION = stat.duration;
	});	
	
	PLAYER.jPlayer({
		ready: function (){
			MEDIA = $j(this).jPlayer("setMedia", {
				ogv: "../media/video/"+NOM_FICHIER+".ogv",
				poster: "../media/png/default.png"
			});			
		},
		swfPath: "js",
		supplied: "ogv",
		size: {
			width: (HAUTEUR_MAX * 16 / 9) + "px",
			height: HAUTEUR_MAX+"px"
		},
		smoothPlayBar: false,
		keyEnabled: false
	});
	
	
	$j.getJSON('../media/json/'+NOM_FICHIER+'.json', function(dataJson){
		WAVEFORM = new Waveform({
		  container: document.getElementById("waveform_img"),
		  interpolate: true,
		  height : HAUTEUR_MAX,
		  innerColor: function(x,y){
		  	if(x > SCROLL_NAV){
		  		return '#172B32'
		  	}else{
		  		return '#00A1E5'
		  	}
		  },
		  data:dataJson
  	});
		
		PLAYER.bind($j.jPlayer.event.timeupdate, function(event){	
			stat = event.jPlayer.status;
			SCROLL_NAV = stat.currentTime / stat.duration;
			WAVEFORM.redraw();
			S_teteDeLectureVersFocus(SCROLL_NAV);
		});
		
		PLAYER.bind($j.jPlayer.event.ended, function(event){
			IS_PLAYING = false;	
	    SCROLL_NAV = 0;
			WAVEFORM.redraw();
		});
		
		PLAYER.bind($j.jPlayer.event.play, function(event){
			IS_PLAYING = true;
		});
		
		PLAYER.bind($j.jPlayer.event.pause, function(event){	
	    IS_PLAYING = false;
	    
		});


	});
	
	return true;
}


function S_afficherMsg(json){
	switch(json.type){
		case "erreur" :
		case "info" :
		case "valide" : 
			$j("#infoMsg").removeClass("erreur");
			$j("#infoMsg").removeClass("info");
			$j("#infoMsg").removeClass("valide");

			$j("#messageAlerte").html(json.message);
			$j("#infoMsg").addClass(json.type).slideDown().delay(2000).slideUp();
			
			break;
	}
}




function S_lancerMultimedia(){
	if(NOM_FICHIER =="" || NOM_FICHIER =="undefined"){
		S_uploadFichier();
		S_afficherImporterFichier();
		return false;
	}
	
	S_controleClavier();
	S_initGraphique();
	S_initMultimedia();
	S_afficherMultimedia();
	return true;
}



function S_afficherMultimedia(){
	$j('#containerImport').hide();	
	$j('.afficherVideo').show();

}

function S_afficherImporterFichier(){
	$j('#containerImport').show();	
	$j('.afficherVideo').hide();
}


function S_uploadFichier(){
			$j("#containerImport").click(function () {
				$j("#fileupload").trigger('click');
			});
			
	    var url = '../ajax/upload/';
	    $j('#fileupload').fileupload({
	        url: url,
	        dataType: 'json',
	        done: function (e, data) {
	        		if(data.textStatus == "success"){
		        		dataJson = {"type":"info","message":"le fichier a bien été uploadé"};
		        		console.log(data);
			            
		        		if(data.result.files[0].name != ""){
	        				NOM_FICHIER = data.result.files[0].name;
	        				//$(location).attr('href',url);
			            S_lancerMultimedia();
			            S_afficherMsg(dataJson);
		        		}
		        		
		        		
	            }else{
			          console.log(data);
			        	dataJson = {"type":"erreur","message":"Une erreur s'est produite lors du téléchargement de vote fichier !<br>Essayer plus tard ou contacter l'administrateur..."};
			        	S_afficherMsg(dataJson);	
	            }
	        },
	        error: function(e, data) {
	        	console.log(data);
	        	dataJson = {"type":"erreur","message":"Une erreur s'est produite lors du téléchargement de vote fichier !<br>Essayer plus tard ou contacter l'administrateur..."};
	        	S_afficherMsg(dataJson);
	        },
	        progressall: function (e, data) {
	        		console.log(data);
	            var progress = parseInt(data.loaded / data.total * 100, 10);
	            $j('#progress .bar').css('width', progress + '%');
	        }
	    });

}


//]]>

