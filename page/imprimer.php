<?php
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header("Expires: -1");

include_once('../include/connexion.php');

$FICHIER="";
$results = array();
$tabLignes = array();
$nbLignes = 0;
$titre="";
if(isset($_REQUEST['id'])){
	if($req = $db->query('SELECT * FROM exo WHERE id_exo = '.$_REQUEST['id'])){
		if($req->columnCount() > 0){
			$results = $req->fetchAll(PDO::FETCH_ASSOC);
			if(count($results) > 0){
				$FICHIER = $results[0]["nom_fichier"];
				$titre= $results[0]["titre"];
				
				$tabLignes = explode('&lt;br&gt;',$results[0]["texte_annote"]);
				$nbLignes = count($tabLignes);
			}
		}
	}
}
$titre = "<h1>".$titre."</h1>";

$p = "";
if($nbLignes > 0){
	foreach($tabLignes as $ligne){
	    $p .= '<p class="textCol">'.html_entity_decode($ligne).'<p>';
	}	
}else{
	$p = "Impossible d'afficher l'exercice demand&eacute;.";	
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
    </head>
    <body>
  		<div id="main">
 				<!-- EN TETE LOGO -->
  			<div id="header">
  					<a href="index.php" title="Afficher la liste des exercices"><span id="logo"></span></a>
  			</div>
				
				
				<div id="impressionText">
	   			<?php 
	   				echo($titre . $p); 
	   			?>
				</div>
  		</div>
    </body>
</html>

