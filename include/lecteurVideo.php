<div id="lecteurAudio">
	<div id="containerImport">
		<div id="fake-open-container" title="Importer un fichier multim&eacute;dia">
			<br><b>&nbsp;Importer un fichier multim&eacute;dia : </b>	<input id="fileupload" type="file" name="files[]" multiple ><br>
			<br><span class="itemContainer"><span class="itemvideo"></span></span><i>Format conseill&eacute; :</i> "ogv" <i>&nbsp;&nbsp;&nbsp;Autres formats :</i> "avi, mp4, mpeg, mpg, webm"
			<br><br><span class="itemContainer"><span class="itemaudio"></span></span><i>Format conseill&eacute; :</i> "mp3" <i>&nbsp;&nbsp;&nbsp;Autres formats :</i> "wav"
			
			<br><br><i>Les autres formats n&eacute;cessitent une conversion qui peut engendrer<br> un temps de chargement sup&eacute;rieur &agrave; 60 secondes.</i>
			<br>
			<div id="progress" class="progress">
      	<div class="bar"></div>
	 		</div>
		</div>
	</div>
		
	<div id="jp_container_1" class="jp-<?php echo($TYPEMEDIA); ?> jp-video-swans afficherVideo">
		<div class="jp-type-single">
			<table id="lecteurAudio_multimedia">
				<tbody>	
       		<tr>
       			<?php if($ETAT == ECRITURE){ ?>
       				<td id="navGauche"><span></span></td>
       			<?php } ?>
       			<td>
       				<div id="visuel">
	       				<div id="waveform">
	       					<div id="waveform_img"></div>
	       					<div id="cadreSynchro">
	    							<?php
	    							if($nbLignes > 0){
											for( $i = 0; $i < $nbLignes; $i++ ){
												echo('<div class="blocSynchroText"></div>');
											}
										}else{
											echo('<div class="blocSynchroText"></div>');
										}
	    							?>
	    						</div>
	       				</div>
								<div id="<?php echo($TYPEMEDIA); ?>" class="jp-jplayer"></div>
							</div>
  					</td>
  					<?php if($ETAT == ECRITURE){ ?>
       				<td id="navDroite"><span></span></td>
       			<?php } ?>
       		</tr>
				</tbody>
  		</table>
			<div class="jp-gui">
				<div class="jp-interface">
					<div class="jp-barre-titre">
						<div class="jp-title">
							<?php
								$titre= ($nbLignes > 0) ? $results[0]["titre"] : '';							
								$divTitre='<div id="edit_titre_exo" contenteditable="'.$editable.'">'.html_entity_decode($titre).'</div>';
								echo($divTitre);
							?>
							<div class="jp-duree">
								<span class="jp-current-time"></span>&nbsp;-&nbsp;<span class="jp-duration"></span>
							</div>
						</div>
						<div class="jp-progress">
							<div class="jp-seek-bar">
								<div class="jp-play-bar"></div>
							</div>
						</div>
					</div>
					 		
					<div class="jp-controls-holder">
						<ul class="jp-controls">
							<li><a href="javascript:;" title="Stop" class="jp-stop" tabindex="1">stop</a></li>
							<li><a href="javascript:;" id="lirePrecedent" title="Pr&eacutec&eacutedent" class="jp-precedent" tabindex="1">pr&eacutec&eacutedent</a></li>
							<li><a href="javascript:;" title="Lecture" class="jp-play" tabindex="1">play</a></li>
							<li><a href="javascript:;" title="Pause" class="jp-pause" tabindex="1">pause</a></li>
							<li><a href="javascript:;" id="lireSuivant" title="Suivant" class="jp-suivant" tabindex="1">suivant</a></li>
								
						</ul>
						<ul class="jp-toggles">											
							<li><a href="javascript:;" id="fullScreen" title="Mettre la vid&eacute;o en plein &eacute;cran" class="jp-full-screen" tabindex="1" title="full screen">full screen</a></li>
							</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div id="infoMsg" class="jp-no-solution">
	<div class="imageAlerte"><span></span></div>
	<div id="messageAlerte">
		Mise a jour requise !<br>								
		Pour utiliser cette application, vous devez mettre a jour votre navigateur 
		et votre version de : 
		<a href="http://get.adobe.com/flashplayer/">Adobe flash Player</a>.	
	</div>
</div>