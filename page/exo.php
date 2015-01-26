<?php
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header("Expires: -1");

include_once('../include/connexion.php');

define('CREATION',-1);
define('LECTURE',0);
define('ECRITURE',1);


$ETAT = CREATION;
$FICHIER="";
$TYPEMEDIA = "";
$id = 0;
$results = array();
$tabLignes = array();
$nbLignes = 0;
$editable	= 'false';

if(isset($_REQUEST['id'])){
	if($req = $db->query('SELECT * FROM exo WHERE id_exo = '.$_REQUEST['id'])){
		if($req->columnCount() > 0){
			$results = $req->fetchAll(PDO::FETCH_ASSOC);
			if(count($results) > 0){
				$FICHIER = $results[0]["nom_fichier"];
				$TYPEMEDIA = $results[0]["type_media"];
				$tabLignes = explode('&lt;br&gt;',$results[0]["texte_annote"]);
				$nbLignes = count($tabLignes);

				$id = $_REQUEST['id'];
				switch($_REQUEST['edit']){
					case ECRITURE :
						$editable = 'true';
					case LECTURE :
						$ETAT = $_REQUEST['edit'];
						break;
				}
			}
		}
	}
}


?>				
<!DOCTYPE html>
    <head>
      <meta charset="utf-8">
      <title></title>
      <meta name="description" content="">
      <meta name="viewport" content="width=device-width">
      <link rel="stylesheet" href="../css/reset.css">
      <link rel="stylesheet" href="../css/main.css">
			<link href="../css/swans_player.css" rel="stylesheet" type="text/css" />
 			<link rel="stylesheet" href="../css/smoothness/jquery-ui-1.10.3.custom.css"/>
      <script type="text/javascript" src="../js/jquery-1.10.1.min.js"></script>
 			<script type="text/javascript" src="../js/jquery-ui.js"></script>
			<script type="text/javascript" src="../js/jquery.jplayer.min.js"></script>
                        <script type="text/javascript" src="../js/waveform.js"></script>
                        <script type="text/javascript" src="../js/jquery.selection.js"></script>
			<!--
			
			<script type="text/javascript" src="../js/jquery.iframe-transport.js"></script>
                        -->
			<script type="text/javascript" src="../js/jquery.fileupload.js"></script>
			<script type="text/javascript">
				<?php echo ('var NOM_FICHIER = "'.$FICHIER.'";'); ?>
				<?php echo ('var ETAT = '.$ETAT.';'); ?>
				<?php echo ('var TYPEMEDIA = "'.$TYPEMEDIA.'";'); ?>
			</script>
			<script type="text/javascript" src="../js/string.js"></script>
			<script type="text/javascript" src="../js/swans.js"></script>

    </head>
    <body>
  		<div id="main">
 				<!-- EN TETE LOGO -->
  			<div id="header">
  					<a href="index.php" title="Afficher la liste des exercices"><span id="logo"></span></a>
  					
  					<?php if($ETAT == ECRITURE || $ETAT == LECTURE){ ?>
  					<div id="controlesPrincipaux">
	  					<ul class="jp-controls">
								<?php if($ETAT == ECRITURE){ ?>
									<li><a href="javascript:;"id="saveExo" title="Sauvegarder" class="jp-save" tabindex="1">sauvegarder</a></li>
								<?php } ?>
								<li><a href="imprimer.php?id=<?php  echo $id ; ?>"  target='_blank' id="imprimExo" title="Imprimer" class="jp-imprim" tabindex="1">imprimer</a></li>
							
								<li><span class="separateur"></span></li>
								<li><a href="javascript:;" title="Afficher le texte" id="toggle_texte" class="jp-show-text" tabindex="1">text</a></li>
								<li><a href="javascript:;" title="Afficher le multim&eacute;dia" id="toggle_media" class="jp-show-media" tabindex="1">multimedia</a></li>
								
							
							</ul>
						</div>
						<ul class="jp-toggles-header afficherVideo">
							<li><a href="javascript:;" id="toggle_waveform" class="jp-show-waveform " tabindex="1">waveform</a></li>
						</ul>
					<?php  } ?>
  			</div>
				
				
       	<?php 
       		//BLOC LECTEUR AUDIO ET VIDEO 
       		include('../include/lecteurVideo.php'); 
       		//BLOC ANNOTATION ET SYNCHRONISATION
       	  include('../include/synchonisationAnnotation.php'); 
       	?>
    		
      	
  		</div>
    </body>
</html>

