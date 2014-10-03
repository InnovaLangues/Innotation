<?php
include_once('../include/connexion.php');
if(isset($_REQUEST['id'])){
	if($req = $db->query('SELECT * FROM exo WHERE id_exo ='.$_REQUEST['id'])){
		if($req->columnCount() > 0){
			$results = $req->fetchAll(PDO::FETCH_ASSOC);
			if(count($results) > 0){
				$stmt = $db->prepare("DELETE FROM exo WHERE id_exo = :id_exo");
				$stmt->bindParam(':id_exo', $_REQUEST['id']);
				if($stmt->execute()){
					$chemin = "../media/";
					$cheminVideo = $chemin ."video/".	$results[0]["nom_fichier"].".ogv";
					$cheminAudio = $chemin ."audio/".	$results[0]["nom_fichier"].".mp3";
					$cheminJSON = $chemin ."json/".	$results[0]["nom_fichier"].".json";
					if(file_exists($cheminVideo)) unlink($cheminVideo); 
					if(file_exists($cheminAudio)) unlink($cheminAudio); 
					if(file_exists($cheminJSON)) unlink($cheminJSON); 
				}	
			}
		}
	}	
}
header("Location:index.php"); 
?>
