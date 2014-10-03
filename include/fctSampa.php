<?php


//Crée un tableau avec les mots SAMPA correspondants au mot de l'alphabet Normal
//grâce au dictionnaire fourni en BDD
function recupSampaCorres($db,$phraseDeDepart=""){
	$corresTab = array();		
	if($phraseDeDepart!=""){
		$trouve  = array('.',',','?','!',':','-');			$remplace = array('','','','','');
		$phraseRecherche = strtolower(str_replace($trouve, $remplace, $phraseDeDepart));
		$motRechercheTab = array_unique(explode(" ",$phraseRecherche));
		$motRechercheTab = '"'.implode('","', $motRechercheTab).'"';
		
		//requete BDD
		if($req = $db->query('SELECT mot, sampa FROM dictionnaire WHERE nbSyll >1 AND LOWER(mot) in ('.$motRechercheTab.')')){
			if($req->columnCount() > 0){
				$results = $req->fetchAll(PDO::FETCH_ASSOC);
				
				foreach($results as $id => $tab){
					$corresTab[$tab["mot"]] = $tab["sampa"];
				}
			}
		}
	}
	return $corresTab;
}


//Remplace les mots par leur correspondant SAMPA
function textToSampa($corresTab,$phrase=""){
	global $sampaWordTab, $alphabetWordTab;
	
	if($phrase!=""){
		$trouve  = array('.', ',', '?', '!', ':');			$remplace = array(' .', ' ,', ' ?', ' !', ' :');
		$phrase = str_replace($trouve, $remplace, $phrase);
		$alphabetWordTab = explode(" ",$phrase);
		$sampaWordTab = $alphabetWordTab;
		
		foreach($sampaWordTab as $key => $motCourant){
			if(array_key_exists(strtolower($motCourant), $corresTab)){
				$sampaWordTab[$key]=$corresTab[strtolower($motCourant)];
			}
		}

		//var_dump($sampaWordTab);die;
		//$phrase = implode(" ",$motTab);
		//$phrase = str_replace($remplace, $trouve, $phrase);
		return true;
	}
	return false;
}

function sampaMatch($ch=""){
	global $resultMatch, $tmpStr, $sampaCorresTab;
	$resultMatch ="";
	$tmpStr="";
	if (is_string($ch) && array_key_exists($ch,$sampaCorresTab)){
	    $resultMatch = $sampaCorresTab[$ch];
	    $tmpStr = $ch;
	    
	    return true;
	}

	return false;
}




function sampaSymbolInStr($ch){
    return (preg_match("#\.|\%|\"|\=|\`#",$ch))? true : false ;
}   

                                         
function isVoyelle($ch){                  
	  return (preg_match("#a|e|i|o|u|y#i",$ch))? true : false ;
}


/*
	

	
	function isVoyelle(ch){
		  reg=new RegExp("a|e|i|o|u|y","i");
	    return (reg.exec(ch))? true : false ;
	}
*/

?>