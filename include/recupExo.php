<?php
include_once('connexion.php');
$str = '<tbody>';

if($req = $db->query('SELECT * FROM exo')){
	if($req->columnCount() > 0){
		$results = $req->fetchAll(PDO::FETCH_ASSOC);
		if(count($results) > 0){
			foreach($results as $tab){
				$id = $tab["id_exo"];
				$str.='<tr>';
					$str.='<td class="titreExo"><a  href="exo.php?edit=0&id='.$id.'"><span class="item'.$tab["type_media"].'"></span><span>'.$tab["titre"].'</span></a></td>';
					$str.='<td class="editExo"><a title="Modifier" href="exo.php?edit=1&id='.$id.'"><span></span></a></td>';
					$str.='<td class="supprExo"><a title="Supprimer" class="supprimerExo" href="javascript:;" lien="supprimer.php?id='.$id.'"><span></span></a></td>';
				$str.='</tr>';
			}
		}else{
			$str.='<tr>';
				$str.='<td class="titreExo" rowspan="3" style="text-align:center;"><a href="exo.php">
				<br><br>
				Il n\'existe actuellement aucun exercice<br>
				mais vous pouvez en créer un en cliquant ici.<br><br>
				
				</a></td>';
			$str.='</tr>';
		}
	}
}else{
	$str.='<tr>';
		$str.='<td class="titreExo" rowspan="3">Problème d\'accés à la base de données</td>';
	$str.='</tr>';
}
$str.= '</tbody>';
echo $str;


?>
