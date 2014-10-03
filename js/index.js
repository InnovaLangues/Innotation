//<![CDATA[
var $j = jQuery.noConflict();


/***************************
POINT D ENTREE DU PROGRAMME
****************************/
$j(document).ready(function(){
	$j('.supprimerExo').click(function(){
		var OK = confirm("IMPORTANT !\n\nVoulez vous vraiment supprimer cet exercice ?\n");
  	if(!OK) return false;
  	
		url = $j(this).attr("lien");
		$j(location).attr('href',url);
		
		
	});
});


//]]>

