<?php
include_once('../include/connexion.php');
$json = array("result"=>"erreur","message"=>"pb_param");
if(isset($_REQUEST['id']) && isset($_REQUEST['temps']) && isset($_REQUEST['texte']) && isset($_REQUEST['titre'])){	
	if($_REQUEST['id'] > 0){
		
		$tabLignes = explode('&lt;br&gt;',$_REQUEST['texte']);
		$nbLigne = count($tabLignes);
		$nbTemps = count(explode(',',$_REQUEST['temps']));
		
		if($nbLigne === $nbTemps){
			$stmt = $db->prepare("UPDATE exo SET titre = :titre, texte_annote = :texte, temps_synchro = :temps  WHERE id_exo = :id_exo");
			$stmt->bindParam(':id_exo', $_REQUEST['id']);
			$stmt->bindParam(':titre', $_REQUEST['titre']);
			$stmt->bindParam(':texte', $_REQUEST['texte']);
			$stmt->bindParam(':temps', $_REQUEST['temps']);
			if($stmt->execute()){	
				$json = array("result"=>"success","message"=>"ok");
			}else{
				$json = array("result"=>"erreur","message"=>"pb_update");
			}
		}/*else{
			echo ('ligne : '.$nbLigne. ' --- temps : '.$nbTemps. ' --- ');
			var_dump($tabLignes);
			die;
		}*/		
	}
}


echo json_encode($json);
?>