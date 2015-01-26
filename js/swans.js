//<![CDATA[
var $j = jQuery.noConflict();





/***************************
 DEFINITION DES varANTES CLAVIERS
 ****************************/

ETATS = {"CREATION": -1, "LECTURE": 0, "ECRITURE": 1};

var KEY_ENTREE = 13;
var KEY_ECHAP = 27;
var KEY_ESPACE = 32;
var KEY_FLECHE_GAUCHE = 37;
var KEY_FLECHE_HAUT = 38;
var KEY_FLECHE_DROITE = 39;
var KEY_FLECHE_BAS = 40;
var KEY_DELETE = 46;
var KEY_BACKSPACE = 8;
var KEY_TAB = 9;
var TAB_WIDTH_BLOC = {};

var SCROLL_NAV = 0;
var DUREE_MEDIA = 0;

var MESSAGE_ECRAN = false;


/***************************
 DEFINITION DES VARIABLES GLOBALES et ETATS
 ****************************/
var IS_MEDIA = true;
var IS_VIDEO = true;
var IS_WAVEFORM = true;
var IS_TEXTE = true;
var IS_ANNOTATED = true;
var IS_PLAYING = false;
var TEXT_IS_ANNOTATED = false;
var EN_TRAIN_DE_SUPPRIMER = false;

var DURATION = 0;
var PLAY_TIME = 0;
var PLAYER;

//Le nombres de lignes du texte

var NB_LIGNES_MAX = 7;

//Le numero de l'élément qui a le focus
var FOCUS = -1;

//Le numero de l'élément qui a le focus
var CARET = {"start": 0, "end": 0, "taille": 0, "text_selected": "--TEST--", "text_before": "", "text_after": ""};


var HAUTEUR_MAX = 270;
var BLOC_SYNCHRO = {"childNodes": {}, "container": 0};
var DATA_ANNOTATION = {"texte": "", "temps": "", "titre": "", id: 0};

function S_initGraphique() {


    switch (ETAT) {
        case ETATS.ECRITURE :



            //focus si clic sur bloc de synchronized	
            $j("body").on("mousedown", ".blocSynchroText", function (event) {
                num = $j(".blocSynchroText").index(this);
                S_focusLigne(num);
            });

            //focus si clic sur ligne de texte	
            $j("body").on("mousedown", ".textCol", function (event) {
                num = $j(".textCol").index(this);
                S_focusLigne(num);
                S_getCaretPosition();
            });


            $j("#fleche_bas, #navDroite").click(function () {
                S_focusLigne(FOCUS + 1);
            });

            $j("#fleche_haut, #navGauche").click(function () {
                S_focusLigne(FOCUS - 1);
            });

            $j("body").on("click", ".suppressionCol", function (event) {
                num = $j(".suppressionCol").index(this);
                if (S_supprimerLigne(num)) {
                    if (!S_focusLigne(num, true))
                        S_focusLigne(num - 1, true);
                }
            });



            /*****************************
             BLOC TRANSFORMATION ANNOTATION
             ******************************/
            $j('#bloc_alphabetNormal').click(function () {
                S_annoterTexteManuellement();
            });

            $j('#bloc_accentPrimaire').click(function () {
                S_annoterTexteManuellement('A_accentPrimaire');
            });

            $j('#bloc_accentSecondaire').click(function () {
                S_annoterTexteManuellement('A_accentSecondaire');
            });

            $j('#bloc_voyelleFaible').click(function () {
                S_annoterTexteManuellement('A_voyelleFaible');
            });

            //AnnoterExo EXERCICE
            $j("#bloc_annotationAuto").click(function () {
                S_annoterTexteAutomatiquement();
            });


            var OBJECT_PASTE;
            //RECUPER LE PASTE SUR LES LES LIGNES et nettoie le code tout en créant de nouvelles lignes a chaque BR
            $j("body").on("paste", ".textCol", function (event) {
                //console.log('dapart');
                setTimeout(function () {
                    S_nettoyerPaste();
                }, 100);
            });

            //BLOC DE SYNCHRONISATION
            //redimensionement des blocs de synchronisation
            $j("body").on("resize", ".blocSynchroText", function (event, ui) {
                //calculer l'info temporelle
                bloc_suivant = ui.element.next();
                num = $j(".blocSynchroText").index(this);
                TAB_WIDTH_BLOC[num] = 0;
                if (!TAB_WIDTH_BLOC[num + 1])
                    TAB_WIDTH_BLOC[num + 1] = bloc_suivant.width() + ui.originalSize.width;
                taille = TAB_WIDTH_BLOC[num + 1] - ui.size.width;
                position = ui.position.left + ui.size.width;
                bloc_suivant.css({"width": taille, "left": position});
                S_redimensionnerBlocSynchro();
            });

            //SAUVEGARDE DE L EXERCICE EN BDD
            $j("#saveExo").click(function () {
                S_sauvegarderExo();
            });




        case ETATS.LECTURE :


            //toggle d'affichage de l'annotation..rend juste l'annotation invisble
            $j("#afficherAnnotation").click(function () {
                if (IS_ANNOTATED) {
                    if (ETAT == ETATS.ECRITURE)
                        $j("#bloc_accent").hide();
                    $j(this).find(".cocher").removeClass("cocher").addClass("decocher");
                    $j(".A_accentPrimaire,.A_accentSecondaire,.A_voyelleFaible").addClass("A_disabled");
                    IS_ANNOTATED = false;
                } else {
                    if (ETAT == ETATS.ECRITURE)
                        $j("#bloc_accent").show();
                    $j(this).find(".decocher").removeClass("decocher").addClass("cocher");
                    $j(".A_disabled").removeClass("A_disabled");
                    IS_ANNOTATED = true;
                }
            });



            //switche entre la video et la forme d'ondes
            $j("#toggle_waveform").click(function () {
                if (IS_WAVEFORM) {
                    $j(this).removeClass("jp-show-waveform").addClass("jp-show-video");
                    $j("#waveform").hide();
                    PLAYER.show();
                    $j("#fullScreen").css({"display": "block"});
                    IS_WAVEFORM = false;
                } else {
                    $j(this).removeClass("jp-show-video").addClass("jp-show-waveform");
                    PLAYER.hide();
                    $j("#waveform").show();
                    $j("#fullScreen").hide();
                    IS_WAVEFORM = true;
                }
            });

            //cache le bloc de texte
            $j("#toggle_texte").click(function () {
                if (IS_TEXTE) {
                    $j("#synchonisationAnnotation").hide();
                    $j("#couleurAnnotation").hide();
                    IS_TEXTE = false;
                } else {
                    $j("#synchonisationAnnotation").show();
                    $j("#couleurAnnotation").show();
                    IS_TEXTE = true;
                }
            });


            $j("#toggle_media").click(function () {
                if (IS_MEDIA) {
                    $j("#lecteurAudio_multimedia").hide();
                    if (IS_VIDEO)
                        $j("#toggle_waveform").hide();
                    IS_MEDIA = false;
                } else {
                    $j("#lecteurAudio_multimedia").show();
                    if (IS_VIDEO)
                        $j("#toggle_waveform").show();
                    IS_MEDIA = true;
                }
            });




            $j("body").on("dblclick", ".blocSynchroText", function (event, ui) {
                num = $j(".blocSynchroText").index(this);
                tps = BLOC_SYNCHRO.childNodes[num].ratioPosition * DURATION;
                PLAYER.jPlayer("play", tps);
            });


            //redimensionement de la fenetre et des objets qui en dependent
            $j(window).resize(function () {
                width_cadre = S_getTailleWaveform();
                $j("#waveform_img canvas").width(width_cadre);
                S_redimensionnerBlocSynchroSelonTailleWaveform();
            });

            $j("#lirePrecedent").click(function () {
                LireSuivantOUPrecedent(false)
            });


            $j("#lireSuivant").click(function () {
                LireSuivantOUPrecedent(true)
            });
    }
}

/*****************************
 FONCTION DE LECTURE PLAYER
 ******************************/

function LireSuivantOUPrecedent(suivant) {
    //si suivant = faux lire precedent
    if (!suivant)
        suivant = false;
    objEnCours = $j("#cadreSynchro .focusLigne");
    num = $j(".blocSynchroText").index(objEnCours);
    var tps = 0;
    if (suivant) {
        if (num >= (S_nbLigne() - 1)) {
            tps = 0;
        } else {
            tps = BLOC_SYNCHRO.childNodes[num + 1].ratioPosition * DURATION;
        }
        num++;
    } else {
        if (num <= 0) {
            tps = 0;
        } else {
            tps = BLOC_SYNCHRO.childNodes[num - 1].ratioPosition * DURATION;
        }
        num--;
    }
    if (IS_PLAYING) {
        PLAYER.jPlayer("play", tps);
    } else {
        S_focusLigne(num);
    }

}

function S_teteDeLectureVersFocus(tps) {
    for (i in BLOC_SYNCHRO.childNodes) {
        i = parseInt(i);
        if (tps >= BLOC_SYNCHRO.childNodes[i].ratioPosition)
        {
            if (typeof BLOC_SYNCHRO.childNodes[i + 1] == "object") {
                if (tps < BLOC_SYNCHRO.childNodes[i + 1].ratioPosition) {
                    S_focusLigne(i, true);
                    return true;
                }
            } else {
                S_focusLigne(i, true);
                return true;
            }
        }
    }
    return false;
}



/*****************************
 AJOUT ET SUPRESSION DE LIGNES
 ******************************/

function $_supprimerTexteSelection() {
    var texte = $j.selection();
    if (texte != "") {
        document.execCommand('delete', false, null);
        return true;
    }
    return false;
}

function S_ajouterLigneTemps(FOCUS, txt) {
    var padding = 1;
    if (PLAY_TIME > padding && PLAY_TIME < (DURATION - padding)) {

        position = (PLAY_TIME / DURATION) * S_getTailleWaveform();
        S_ajouterLigne(FOCUS, txt, position);
    }
}

function S_ajouterLigne(num, texte, positionBlocCree) {
    if (!texte)
        texte = "";
    ligne = '<tr><td class="timeCol"></td><td class="separation"></td><td  class="TDtextCol"><div class="textCol" contenteditable="true">' + texte + '</div></td><td class="suppressionCol"><span></span></td></tr>';

    $j(".textCol").eq(num).parent().parent().after(ligne);

    bloc_courant = $j(".blocSynchroText").eq(num);
    ancienneTaille = bloc_courant.width();

    if (!positionBlocCree) {
        taille = ancienneTaille / 2;
        bloc_courant.width(taille);
        position = bloc_courant.position().left + taille;
        bloc = '<div class="blocSynchroText" style="width:' + taille + 'px;left:' + position + 'px"></div>';
    } else {
        tailleCourant = bloc_courant.position().left - positionBlocCree;
        bloc_courant.width(tailleCourant);
        taille = ancienneTaille - position;
        bloc = '<div class="blocSynchroText" style="width:' + taille + 'px;left:' + positionBlocCree + 'px"></div>';
    }
    bloc_courant.after(bloc);

    S_focusLigne(num + 1);
    S_setCaretPosition(0);
    S_redimensionnerBlocSynchro();
    TAB_WIDTH_BLOC = {};
}


function S_supprimerLigne(num) {
    if (EN_TRAIN_DE_SUPPRIMER)
        return false;
    EN_TRAIN_DE_SUPPRIMER = true;
    if (S_nbLigne() > 1 && num > 0) {
        if (S_supprimerInputTemps(num)) {
            $j(".textCol").eq(num).parent().parent().remove();
            bloc_courant = $j(".blocSynchroText").eq(num);
            bloc_precedent = bloc_courant.prev();
            bloc_courant.remove();
            S_redimensionnerBlocSynchro();
            TAB_WIDTH_BLOC = {};
            EN_TRAIN_DE_SUPPRIMER = false;
            return true
        }
    }
    EN_TRAIN_DE_SUPPRIMER = false;
    return false;
}



/*****************************
 ACCESSEUR DIVERS
 ******************************/



function S_nbLigne() {
    return $j(".textCol:visible").length;
}


function S_getTrLigneCourante() {
    return S_getLigneCourante().parent();
}

function S_getLigneCourante() {
    return $j(".textCol").eq(FOCUS);
}

function S_getTailleWaveform() {
    return $j('#waveform').width();
}


function S_getPositionTextCol(num) {
    position = 0;
    for (i = 0; i < num; i++) {
        position += $j(".textCol").eq(i).parent().parent().height();
    }
    return position;
}



function S_scrollTopText(num) {
    position = S_getPositionTextCol(num);
    blocTexte = $j("#synchonisationAnnotationText");
    tailleReelle = blocTexte.get(0).scrollHeight;
    tailleVisible = blocTexte.height();
    var scrollPosition = 0;
    if (num < 4) {
        scrollPosition = 0;
    } else if (num > (S_nbLigne() - 4)) {
        scrollPosition = tailleReelle;
    } else {
        tailleLigne = $j(".textCol").eq(num).parent().parent().height();
        scrollPosition = position + tailleLigne / 2 - tailleVisible / 2;
    }
    blocTexte.scrollTop(scrollPosition);
}

/*****************************
 DONNE LE FOCUS A UNE LIGNE
 ******************************/

function S_focusLigne(num, force) {
    if (FOCUS == num)
        return false;
    if (!force)
        force = false;
    if (IS_PLAYING == false || force == true) {
        if (num >= 0 && num < S_nbLigne()) {
            $j(".textCol, .blocSynchroText").each(function () {
                $j(this).removeClass("focusLigne");
                $j(this).attr("contenteditable", "false");
            });
            ligne = $j(".textCol").eq(num);
            if (ETAT == ETATS.ECRITURE)
                ligne.attr("contenteditable", "true");
            ligne.focus().addClass("focusLigne");
            $j(".blocSynchroText").eq(num).addClass("focusLigne");
            S_scrollTopText(num);
            FOCUS = num;
            return true;
        }
    } else {
        return false;
    }

}




/*****************************
 CONTROLE DU CLAVIER - KEYCODE
 ******************************/


function keyCodeAutoriseTime(keyCode) {
    return ((keyCode >= 37 && keyCode <= 58) || keyCode == KEY_BACKSPACE);
}

function S_getKeyCode(event) {
    return event.which || event.keyCode;
}


function S_controleClavier() {

    //SUR LA PAGE PRINCIPALE
    $j("html").keydown(function (event) {
        var keyCode = event.which || event.keyCode;
        switch (keyCode) {
            case KEY_TAB :

                event.preventDefault();

                break;
        }
    });


    /*
     $j("body").on("keydown", ".timeCol", function(event){
     if(event.type = "keydown"){
     var keyCode = S_getKeyCode(event);
     if(!keyCodeAutoriseTime(keyCode)) event.preventDefault();
     }
     });
     */

    //SUR LE TABLEAU
    $j("body").on("keydown", ".textCol", function (event) {
        if (event.type = "keydown") {
            var tr = $j(this).parent().parent();
            S_getCaretPosition();
            var keyCode = S_getKeyCode(event);
            var html = $j(this).html();
            switch (keyCode) {
                case KEY_ENTREE :
                    if (!$_supprimerTexteSelection()) {//si pas supprimer le texte alors
                        //ajouter une ligne
                        if (!TEXT_IS_ANNOTATED) {
                            var txt = "";
                            $j(this).html(CARET.text_before);
                            txt = CARET.text_after;
                            if (IS_PLAYING) {
                                S_ajouterLigneTemps(FOCUS, txt);
                            } else {
                                S_ajouterLigne(FOCUS, txt);
                            }
                        } else {
                            S_ajouterLigne(FOCUS, "");
                        }

                    }
                    event.preventDefault();
                    break;
                case KEY_BACKSPACE ://supprime une ligne et se place sur la précedente si elle existe
                    if (CARET.end == 0 && S_nbLigne() > 1 && FOCUS > 0) {
                        var text_prev = "";
                        prev = tr.prev();
                        td_prev = prev.find(".textCol");
                        text_prev = td_prev.html();
                        td_prev.html(text_prev + CARET.text_after);
                        S_nettoyerTexte(td_prev);
                        if (S_supprimerLigne(FOCUS)) {
                            if (S_focusLigne(FOCUS - 1))
                                S_setCaretPosition(text_prev.length);
                        }
                        event.preventDefault();
                    }
                    break;
                case KEY_DELETE :
                    $j.selection('html');

                    var text_len = $j(this).text().length
                    if (CARET.start == text_len && FOCUS < (S_nbLigne() - 1) && S_nbLigne() > 1) {
                        var text_suiv = "";
                        tr_next = tr.next();
                        td_next = tr_next.find(".textCol");
                        text_next = td_next.html();
                        S_nettoyerTexte($j(this));
                        $j(this).html($j(this).html() + text_next);
                        if (S_supprimerLigne(FOCUS + 1)) {
                            S_setCaretPosition(CARET.start);
                        }
                        event.preventDefault();
                    }
                    break;
                case KEY_FLECHE_BAS :
                    S_focusLigne(FOCUS + 1);
                    S_setCaretPosition(S_getRightCaret());
                    event.preventDefault();
                    break;
                case KEY_FLECHE_HAUT :
                    S_focusLigne(FOCUS - 1);
                    S_setCaretPosition(S_getRightCaret());
                    event.preventDefault();
                    break;
                case KEY_FLECHE_GAUCHE :
                    if (CARET.end == 0) {
                        S_focusLigne(FOCUS - 1);
                        S_setCaretPosition(S_getLigneCourante().text().length);
                        event.preventDefault();
                    }
                    break;
                case KEY_FLECHE_DROITE :
                    if (CARET.end == S_getLigneCourante().text().length) {
                        S_focusLigne(FOCUS + 1);
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

function S_getRightCaret() {
    objet = S_getLigneCourante();
    if (CARET.start > objet.text().length)
        return objet.text().length;
    else
        return CARET.start;
}


function S_setCaretPosition(start) {
    var el = S_getLigneCourante().get(0).childNodes[0];
    if (typeof el == 'object') {
        var range = document.createRange();
        var sel = window.getSelection();
        range.setStart(el, start);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
    }
}


function S_getCaretPosition() {
    var sel, range;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            CARET.end = range.endOffset;
            CARET.start = range.startOffset;
            CARET.taille = CARET.end - CARET.start;
            texte = (range.startContainer.data || range.endContainer.data || "");
            CARET.text_selected = texte.substr(CARET.start, CARET.taille);
            CARET.text_before = texte.substr(0, CARET.start);
            CARET.text_after = texte.substr(CARET.end, (texte.length - CARET.end));
        }
    }
}


function S_fichierMultimediaInexistant() {
    dataJson = {"type": "erreur", "message": "Le fichier multimédia est indisponible pour le moment ou semble avoir été supprimé."};
    S_afficherMsg(dataJson);
}

function S_fichierJSONInexistant() {
    dataJson = {"type": "erreur", "message": "Le fichier permettant la création de la forme d'ondes est indisponible pour le moment ou semble avoir été supprimé."};
    S_afficherMsg(dataJson);
}

function S_initMultimedia() {
    var WAVEFORM;
    /***************************
     LANCEMENT DU LECTEUR VIDEO
     ****************************/
    var mediaExo = {};
    var typeMediaExo = "";
    PLAYER = $j("#" + TYPEMEDIA);
    switch (TYPEMEDIA) {
        case 'video' :
            mediaExo = {
                ogv: "../media/video/" + NOM_FICHIER + ".ogv",
                poster: "../media/png/default.png"
            };
            typeMediaExo = "ogv";
            break;
        case 'audio' :
            IS_VIDEO = false;
            $j('#toggle_waveform').hide();
            var mediaExo = {
                mp3: "../media/audio/" + NOM_FICHIER + ".mp3"
            };
            typeMediaExo = "mp3";
            break;

    }

    PLAYER.bind($j.jPlayer.event.loadeddata, function (event) {
        if (TYPEMEDIA == 'video') {
            stat = event.jPlayer.status;
            //console.log(event)
            DURATION = stat.duration;
            S_initBlock();
        }
    });




    PLAYER.jPlayer({
        ready: function () {            
            MEDIA = $j(this).jPlayer("setMedia", mediaExo);
            if (TYPEMEDIA == 'audio') {
                PLAYER.jPlayer("play", 0);
                PLAYER.jPlayer("stop");
            }
        },
        error: function () {
            S_fichierMultimediaInexistant();
        },
        swfPath: "js",
        supplied: typeMediaExo,
        size: {
            width: (HAUTEUR_MAX * 16 / 9) + "px",
            height: HAUTEUR_MAX + "px"
        },
        smoothPlayBar: false,
        keyEnabled: false
    });

    $j.getJSON('../media/json/' + NOM_FICHIER + '.json', function (dataJson) {
        WAVEFORM = new Waveform({
            container: document.getElementById("waveform_img"),
            interpolate: true,
            height: HAUTEUR_MAX,
            innerColor: function (x, y) {
                if (x > SCROLL_NAV) {
                    return '#172B32'
                } else {
                    return '#00A1E5'
                }
            },
            data: dataJson
        });



        PLAYER.bind($j.jPlayer.event.loadstart, function (event) {
            if (TYPEMEDIA == 'audio') {
                setTimeout(function () {

                    var time = $j(".jp-duration").text().split(':');
                    duree = 0;
                    for (i = 0; i < time.length; i++) {
                        duree += (Math.pow(60, (time.length - i - 1)) * parseInt(time[i]))
                    }
                    DURATION = duree;
                    S_initBlock();
                }, 1000);

            }

        });

        PLAYER.bind($j.jPlayer.event.timeupdate, function (event) {
            stat = event.jPlayer.status;
            SCROLL_NAV = stat.currentTime / stat.duration;
            WAVEFORM.redraw();
            PLAY_TIME = stat.currentTime;
            S_teteDeLectureVersFocus(SCROLL_NAV);
        });

        PLAYER.bind($j.jPlayer.event.ended, function (event) {
            IS_PLAYING = false;
            SCROLL_NAV = 0;
            WAVEFORM.redraw();
        });

        PLAYER.bind($j.jPlayer.event.play, function (event) {
            IS_PLAYING = true;
        });

        PLAYER.bind($j.jPlayer.event.pause, function (event) {
            IS_PLAYING = false;

        });

    }).fail(function () {
        S_fichierJSONInexistant();
    });

    return true;
}


/*****************************
 GESTION DES MESSAGES
 ******************************/

function S_afficherMsg(json) {
    if (!MESSAGE_ECRAN) {
        MESSAGE_ECRAN = true;
        switch (json.type) {
            case "erreur" :
            case "info" :
            case "valide" :
                $j("#infoMsg").removeClass("erreur");
                $j("#infoMsg").removeClass("info");
                $j("#infoMsg").removeClass("valide");

                $j("#messageAlerte").html(json.message);
                $j("#infoMsg").addClass(json.type).slideDown().delay(3000).slideUp();
                break;
        }
        setTimeout(function () {
            MESSAGE_ECRAN = false;
        }, 5000);

    }
}






function S_afficherMultimedia() {
    $j('#containerImport').hide();
    $j('.afficherVideo').show();

}

function S_afficherImporterFichier() {
    $j('#containerImport').show();
    $j('.afficherVideo').hide();
}


function S_uploadFichier() {
    /*
     $j("#containerImport").click(function () {
     $j("#fileupload").trigger('click');
     });
     */
    var url = '../ajax/upload/';
    $j('#fileupload').fileupload({
        url: url,
        dataType: 'json',
        done: function (e, data) {
            S_gestionErreurUpload(e, data, 'done');
        },
        fail: function (e, data) {
            S_gestionErreurUpload(e, data, 'fail');            
        },
        error: function (e, data) {
            S_gestionErreurUpload(e, data, 'error');
        },
        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $j('#progress .bar').css('width', progress + '%');
        }
    });

}

function S_gestionErreurUpload(e, data, nom_fonction) {
    data.textStatus = (data.textStatus != "undefined") ? data.textStatus : e.error;   
    dataJson = {"type": "erreur", "message": ""};
    switch (data.textStatus) {
        case 'bad_format' :
            dataJson.message = "Le fichier n'a pas le format attendu.";
            break;
        case 'error_conversion' :
            dataJson.message = "Pour être lu, votre fichier doit être converti mais cette opération a échoué.";
            break;
        case 'error_json' :
            dataJson.message = "La création de la forme d'ondes a échoué.";
            break;
        case 'error_bdd' :
            dataJson.message = "Il y a apparement un problème de communication avec la base de données.";
            break;
        case 'success' :
            info = data.jqXHR.responseJSON.files[0];
            url = "exo.php?edit=1&id=" + info.id_exo;
            dataJson.type = "info";
            dataJson.message = "Le fichier a bien été uploadé et votre exercice sauvegardé en base de données.<br>";
            S_afficherMsg(dataJson);
            setTimeout(function () {
                $j(location).attr('href', url);
            }, 4000);
            break;
        default :
            dataJson.message = "Il y a pb au niveau de l'upload de votre fichier.";
            break;
    }
    if (dataJson.message != "") {
        $j('#progress .bar').css('width', '0%');
        S_afficherMsg(dataJson);
    }
}


/***************************
 FONCTION TEMPORELLES
 ****************************/

function S_setTemps(num, tps) {
    num = parseInt(num);
    if (typeof BLOC_SYNCHRO.childNodes[num] == "object") {
        if (typeof BLOC_SYNCHRO.childNodes[num] != tps) {
            BLOC_SYNCHRO.childNodes[num].temps = tps;
            S_majInputTemps(num, tps);
            tps = $j.jPlayer.convertTime(BLOC_SYNCHRO.childNodes[num].ratioPosition * DURATION);
            $j('.timeCol').eq(num).text(tps);
        }
    }
}

function S_supprimerInputTemps(num) {
    inputTemps = $j("#tempsSynchroHidden");
    var tabTps = inputTemps.val().split(',');
    if (typeof tabTps[num] != "undefined") {
        delete tabTps[num];
        var result = "";
        var nb = tabTps.length;
        for (i = 0; i < nb; i++) {
            if (typeof tabTps[i] != "undefined") {
                result += tabTps[i];
                if (i < (nb - 2))
                    result += ",";
            }
        }
        inputTemps.val(result);
        return true;
    }
    return false;
}


function S_majInputTemps(num, tps) {
    inputTemps = $j("#tempsSynchroHidden");
    var tabTps = inputTemps.val().split(',');
    tabTps[num] = tps;
    result = tabTps.join(",");
    inputTemps.val(result);
}


/***************************
 BLOCS DE SYNCHRONISATION
 ****************************/
function S_initBlock() {
    if (DURATION != 0) {
        var tabTps = $j("#tempsSynchroHidden").val().split(',');
        BLOC_SYNCHRO.childNodes = {};
        BLOC_SYNCHRO.container = S_getTailleWaveform();
        for (i = 0; i < tabTps.length; i++) {
            BLOC_SYNCHRO.childNodes[i] = {"position": 0, "ratioPosition": 0, "temps": 0};
            BLOC_SYNCHRO.childNodes[i].ratioPosition = parseFloat(tabTps[i]) / DURATION;
            S_setTemps(i, parseFloat(tabTps[i]));
            BLOC_SYNCHRO.childNodes[i].position = BLOC_SYNCHRO.container * BLOC_SYNCHRO.childNodes[i].ratioPosition;

        }
        S_redimensionnerBlocSynchro(true);
    } else {
        dataJson = {"type": "erreur", "message": "L'exercice n'a pas été correctement initialisé"};
        S_afficherMsg(dataJson);
    }
}

function S_redimensionnerBlocSynchroSelonTailleWaveform() {
    BLOC_SYNCHRO.container = S_getTailleWaveform();
    $j(".blocSynchroText").each(function (i) {
        BLOC_SYNCHRO.childNodes[i].position = BLOC_SYNCHRO.childNodes[i].ratioPosition * BLOC_SYNCHRO.container;
    });

    S_retracerBlocSynchro();
}


function S_calculerRatioBlocSynchro() {
    BLOC_SYNCHRO.childNodes = {};
    BLOC_SYNCHRO.container = S_getTailleWaveform();
    $j(".blocSynchroText").each(function (i) {
        BLOC_SYNCHRO.childNodes[i] = {"position": 0, "ratioPosition": 0, "temps": 0};
        BLOC_SYNCHRO.childNodes[i].position = $j(this).position().left;
        BLOC_SYNCHRO.childNodes[i].ratioPosition = BLOC_SYNCHRO.childNodes[i].position / BLOC_SYNCHRO.container;
        S_setTemps(i, BLOC_SYNCHRO.childNodes[i].ratioPosition * DURATION);
    });
}


function S_retracerBlocSynchro() {
    for (i in BLOC_SYNCHRO.childNodes) {
        blocCourant = $j(".blocSynchroText").eq(i);
        blocInfoCourant = BLOC_SYNCHRO.childNodes[i];
        var tailleBloc = 0;
        if (ETAT == ETATS.ECRITURE)
            blocCourant.resizable({minHeight: HAUTEUR_MAX, maxHeight: HAUTEUR_MAX});
        i = parseInt(i);
        if (typeof BLOC_SYNCHRO.childNodes[i + 1] == "object") {//LE SUIVANT EXISTE
            tailleBloc = BLOC_SYNCHRO.childNodes[i + 1].position - blocInfoCourant.position;
            if (ETAT == ETATS.ECRITURE)
                blocCourant.resizable("enable");
        } else {
            tailleBloc = BLOC_SYNCHRO.container - blocInfoCourant.position;
            if (ETAT == ETATS.ECRITURE)
                blocCourant.resizable("disable");
        }
        blocCourant.css({"width": tailleBloc});
        blocCourant.css({"left": blocInfoCourant.position});
    }
}


function S_redimensionnerBlocSynchro(init) {
    if (!init) {
        S_calculerRatioBlocSynchro();
    }
    S_retracerBlocSynchro();
}


/***************************
 SAUVEGARDE EN BDD
 ****************************/

function S_sauvegarderExo() {
    S_recupererDataAnnotation();
    var dataJson = {"type": "erreur", "message": "il y a eu un souci lors de la mise à jour."};
    $j.ajax({
        url: '../ajax/saveExo.php',
        type: 'POST',
        data: {id: DATA_ANNOTATION.id, titre: DATA_ANNOTATION.titre, temps: DATA_ANNOTATION.temps, texte: DATA_ANNOTATION.texte},
        dataType: 'json',
        success: function (json) {
            if (typeof json == "object") {
                switch (json.result) {
                    case "success":
                        dataJson = {"type": "info", "message": "Votre exercice a été mis à jour."};
                        break;
                }
                ;
                S_afficherMsg(dataJson);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            S_afficherMsg(dataJson);
        }
    });
}

function S_recupererDataAnnotation() {
    DATA_ANNOTATION.titre = htmlspecialchars($j("#edit_titre_exo").text());
    DATA_ANNOTATION.id = $j("#idExo").val();
    DATA_ANNOTATION.temps = $j("#tempsSynchroHidden").val();
    DATA_ANNOTATION.texte = S_recupererHtml();
}


function S_recupererHtml() {
    var html = "";
    var nb = $j('.textCol').length;
    $j('.textCol').each(function (i) {
        S_nettoyerTexte($j(this));
        html += htmlspecialchars($j(this).html());
        if (i < (nb - 1))
            html += htmlspecialchars("<br>");
    });
    return html;
}

function S_recupererTexte() {
    var txt = "";
    var nb = $j('.textCol').length;
    $j('.textCol').each(function (i) {
        S_nettoyerTexte($j(this));
        txt += htmlspecialchars($j(this).text());
        if (i < (nb - 1))
            txt += htmlspecialchars("<br>");
    });
    return txt;
}

function S_nettoyerPaste() {
    objet = $j('.textCol').eq(FOCUS);
    var txt = objet.text();
    objet.html("")
    objet.html(txt);
}

function S_nettoyerTexte(objet) {
    var whitelist = ".A_accentPrimaire, .A_accentSecondaire, .A_voyelleFaible, .A_disabled"; // for more tags use the multiple selector, e.g. "p, img"
    objet.find('*').not(whitelist).each(function () {
        var content = $j(this).contents();
        $j(this).replaceWith(content);
    });
}



/**********
 ANNOTATION 
 ***********/

function S_annoterTexteAutomatiquement() {

    var OK = confirm("IMPORTANT !\n\nL'annotation automatique vous fera perdre toute les annotations précédentes.\nVoulez vous continuer ?\n");
    if (!OK)
        return false;

    var txt = S_recupererTexte();
    var dataJson = {"type": "erreur", "message": "il y a eu un souci lors de l'annotation automatique."};
    $j.ajax({
        url: '../ajax/annoterTexte.php',
        type: 'POST',
        data: {texte: txt},
        dataType: 'json',
        success: function (json) {
            if (typeof json == "object") {
                switch (json.result) {
                    case "success":
                        var tabLigne = json.texte.split('&lt;br&gt;');
                        $j('.textCol').each(function (i) {
                            $j(this).html(html_decode(tabLigne[i]));
                        });
                        dataJson = {"type": "info", "message": "L'annotation automatique s'est bien déroulée."};
                        break;
                }
                S_afficherMsg(dataJson);
                TEXT_IS_ANNOTATED = true;
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            S_afficherMsg(dataJson);
        }
    });
}



function S_annoterTexteManuellement(classeCSS) {
    if (!IS_ANNOTATED)
        return false;
    var texte = $j.selection();
    if (texte != "") {
        if (!classeCSS) {
            document.execCommand('insertHTML', false, texte);
        } else {
            document.execCommand('insertHTML', false, '<span class="' + classeCSS + '">' + texte + '</span>');
        }
        TEXT_IS_ANNOTATED = true;
    }
}





/***************************
 FONCTION D INITIALISATION
 ****************************/
function S_lancerMultimedia() {
    if (NOM_FICHIER == "" || NOM_FICHIER == "undefined") {
        S_uploadFichier();
        S_afficherImporterFichier();
        return false;
    }

    S_initGraphique();
    if (ETAT == ETATS.ECRITURE) {
        S_controleClavier();
    }
    S_initMultimedia();
    S_afficherMultimedia();


    return true;
}



/***************************
 POINT D ENTREE DU PROGRAMME
 ****************************/
$j(document).ready(function () {


    S_lancerMultimedia();
});


//]]>

