<?php

$tr = "";
$tdFin = '';
$tdDebut ='';

if($ETAT == ECRITURE){
	$tdDebut .= '<td class="timeCol"></td>';
	$tdDebut .= '<td class="separation"></td>';
	$tdFin .= '<td class="suppressionCol"><span></span></td>'; 
}

if($nbLignes > 0){
	foreach($tabLignes as $ligne){
		$tr .= '<tr>';
			$tr .= $tdDebut;		
	    $tr .= '<td class="TDtextCol"><div contenteditable="'.$editable.'" class="textCol">'.html_entity_decode($ligne).'</div></td>';
	    $tr .= $tdFin;
		$tr .= '</tr>';
	}	
	$tps = ($results[0]["temps_synchro"]!="") ? $results[0]["temps_synchro"] : 0;
	$input ='<input type="hidden" id="tempsSynchroHidden" value="'.$tps.'"/>';
}else{
	$tr .= '<tr>';
		$tr .= $tdDebut;
    $tr .= '<td class="TDtextCol"><div contenteditable="'.$editable.'" class="textCol">Votre texte ici...</div></td>';
   	$tr .= $tdFin;
	$tr .= '</tr>';
	$input ='<input type="hidden" id="tempsSynchroHidden" value="0"/>';
}
	$input .='<input type="hidden" id="idExo" value="'.$id.'"/>';


if($ETAT == ECRITURE){ 	
?>
	<div id="synchonisationAnnotation" class="afficherVideo">
		<div id="fleche_haut"><span></span></div>
		<div id="synchonisationAnnotationText">
    	<table>
    		<tbody>	
					<?php echo($tr); ?>
       	</tbody>
       	
     	</table>
    </div>
		<div id="fleche_bas"><span></span></div>
	</div>
	<!-- BLOC DES COULEURS -->
 	<div id="couleurAnnotation" class="afficherVideo">
 		<table>
   		<thead>
   			<tr>
   				<th colspan="5">
   					<span id="afficherAnnotation">
   						<span class="cocher"></span>&nbsp;annotation
   					</span>
   				</th>
   			</tr>	
   		</thead>
   		<tbody id="bloc_accent">
     		<tr>
     			<td><input title="Accent primaire" type="button" id="bloc_accentPrimaire"></td>
     			<td><input title="Accent secondaire" type="button" id="bloc_accentSecondaire"></td>
     			<td><input title="Voyelle faible" type="button" id="bloc_voyelleFaible"></td>
     			<td><input title="Texte normal" type="button" id="bloc_alphabetNormal"></td>
     			<td><input title="Annotation automatique" type="button" id="bloc_annotationAuto" value="Auto"></td>
     		</tr>       		
     	</tbody>
   	</table>
 	</div>
 	
 	
 	
 	
<?php 
	echo $input;


	}else if($ETAT == LECTURE){ 
?>
	<div id="synchonisationAnnotation" class="afficherVideo">
		<div id="synchonisationAnnotationText">
	  	<table>
	  		<tbody>	
	     		<?php echo($tr); ?>
	     	</tbody>
	   	</table>
	  </div>
	</div>
		<!-- BLOC DES COULEURS -->
 	<div id="couleurAnnotation" class="afficherVideo">
 		<table>
   		<thead>
   			<tr>
   				<th colspan="5">
   					<span id="afficherAnnotation">
   						<span class="cocher"></span>&nbsp;annotation
   					</span>
   				</th>
   			</tr>	
   		</thead>
   	</table>
 	</div>
 	
 	
<?php 
	echo $input;
	
	} 
?>