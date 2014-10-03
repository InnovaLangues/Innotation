<?php
$json = array("result"=>"error","texte"=>"");
if(1 || isset($_REQUEST['texte'])){
	
	require_once("../include/connexion.php");
	require_once("../phonetique/corres.json.php");
	require_once("../include/fctSampa.php");
	
	//$phraseDeDepart = $_GET['phrase'];
	
	
	$decoupageMotSyll = array();
	$sampaCorresTab = json_decode(JSON_CORRES,true);
	$sampaWordTab = array();
	$alphabetWordTab = array();
	$html = "";
	$tmpStr="";
	$resultMatch="";
	$correctMatch =""; 
		
	
	//$alphabetStr = 'When the architects of our republic wrote the magnificent words of the Constitution and the Declaration of Independence, they were signing a promissory note to which every American was to fall heir. This note was a promise that all men - yes, black men as well as white men - would be guaranteed the unalienable rights of life, liberty, and the pursuit of happiness. ';	
	$alphabetStr = str_replace('&lt;br&gt;', "<br>",$_REQUEST['texte']);
	//$alphabetStr = str_replace('&lt;br&gt;', "<br>", "Our keynote ' speaker is a man who I'm sure is very well known to all of you.&lt;br&gt;He's Professor of Fruitology at Dubbo University&lt;br&gt;and has written many books on the subject of tropical fruit.");

	
	$sampaWordCorres =  recupSampaCorres($db,$alphabetStr);
	if(textToSampa($sampaWordCorres,$alphabetStr)){
		$nb = count($alphabetWordTab);
		for($i = 0; $i < $nb; $i++){
			$alphabetWord = $alphabetWordTab[$i];
			$sampaWord = $sampaWordTab[$i];
			
			
			//if($alphabetWord == "Declaration") echo "pouetttt";
			
			if($alphabetWord == $sampaWord){
				//traitement de caractère de ponctuation
				
				$html .= $alphabetWord;
			}else{
				$annotatedText ="";
				$spans = "";
				$tm = 0;
				$ts = 0;
				$nbS = strlen($sampaWord); 
				$nbM = strlen($alphabetWord);
				$classCSS="";
				
				while( $ts < $nbS || $tm < $nbM){
					
					$annotatedText_old = $annotatedText;
					$iTm = $iTs = 0;
					
					$cs = ($ts >= $nbS)? "" : $sampaWord[$ts];
					$cm = ($tm >= $nbM)? "" : $alphabetWord[$tm];
					$cs1 = ($ts+1 >= $nbS)? "" : $sampaWord[$ts+1];
					//echo("<br>cm = $cm  ::: ".$alphabetWord."==".$sampaWord."<br>");
					//echo($cm."==".$cs."<br>");
					
					$tmpStr="";
		      $resultMatch="";
		      $correctMatch ="";
		      $corres=false;
					
				
					
					if(!sampaSymbolInStr($cs) && (sampaMatch(substr($sampaWord,$ts,2)) || sampaMatch($cs))){
							
		          $tabMatch = explode(",",$resultMatch);
		          $nbTabMatch = count($tabMatch);
		          for($j=0;$j < $nbTabMatch ;$j++){
		              $tmpChars = substr($alphabetWord,$tm,strlen($tabMatch[$j]));
		              if(!sampaSymbolInStr($tmpStr)){
		                  if(($tabMatch[$j] == strtolower($tmpChars)) && (strlen($tmpChars) > strlen($correctMatch))){
		                      $correctMatch = $tmpChars;
		                  }
		              }
		          }
		          
		          if($correctMatch!=""){
		              $corres=true;
		              $iTm += strlen($correctMatch);
		              $iTs += strlen($tmpStr);
		              $annotatedText .= $correctMatch;
		              
		          }
		      }
		      
		      if(!$corres){	
		          if($cs == $cm){
		              $iTm++;
		              $iTs++;
		              $annotatedText .= $cm;
		          }else if(isVoyelle($cm) && $cs=="s"){
		          		$iTs++;
		          }else if($cs == "" && $cm!=""){
		              $iTm++;
		              $annotatedText .= $cm;
		          }else{
		          		
		              if(sampaSymbolInStr($cs)){
		              	switch($cs){
		              		case".":
		              			$spans .=  "<span class=\"".$classCSS."\">".$annotatedText."</span>";
		              			$annotatedText = "";
		              			$classCSS="A_disabled";
		              			break;
		              		case"\"": 
		              			$classCSS="A_accentPrimaire";
		              			break;
		              		case"%":
		              			$classCSS="A_accentSecondaire";
		              			break;
		              		case"`":
		              			$classCSS="A_voyelleFaible";
		              			break;
		              	}
		              	  
		              	$iTs++;
		              }else if( $cm == $cs1){
		              	
		              	$iTs++;		 
		              }else if($annotatedText_old == $annotatedText){
		                $iTm++;
		                $annotatedText .= $cm;
		              }
		          }                
		      }
		      if(($iTm == 0 && $iTs == 0) || ($tm > $nbS && $tm >= strlen($annotatedText))){
				 			$annotatedText = $alphabetWord;
		          break;
		      }
					
				  	
		      $ts += $iTs;
		      $tm += $iTm;
		      
			}
			
			
			$html.= $spans."<span class=\"".$classCSS."\">".$annotatedText."</span>";
				
			}
			$html.=" ";
		}
		$json = array("result"=>"success","texte"=> htmlspecialchars ($html,  ENT_QUOTES));
	}
}
echo json_encode($json);;





?>