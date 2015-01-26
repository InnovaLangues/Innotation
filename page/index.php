<?php
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header("Expires: -1");
?>
<!DOCTYPE html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width">

    <link rel="stylesheet" href="../css/reset.css">
    <link rel="stylesheet" href="../css/main.css">		

    <script type="text/javascript" src="../js/jquery-1.10.1.min.js"></script>   
    <script type="text/javascript" src="../js/index.js"></script>
</head>
<body>
    <div id="main">
        <!-- EN TETE LOGO -->
        <div id="header">
            <a href="index.php" title="Afficher la liste des exercices"><span id="logo"></span></a>
        </div>

        <!-- BLOC DES COULEURS -->
        <div id="listeExo">
            <table>
                <tfoot>
                    <tr>
                        <td colspan="3">
                            <a href="exo.php" title="Ajouter un exercice"><span id="ajouterExo"></span></a>
                        </td>
                    </tr>	
                </tfoot>
                <?php
                include("../include/recupExo.php");
                ?>
            </table>
        </div>

    </div>

    <?php
    include('../include/footer.php');
    ?>		
</body>
</html>



