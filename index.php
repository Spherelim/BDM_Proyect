<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aseguradora el Lic</title>
    <link rel="stylesheet" href="/Public/assets/style/index.css"></link>
</head>
<body>
    <?php
        include 'Public/includes/header.php';
        include 'Public/classes/Usuario.php';
    ?>
    
    <!-- <a href="youtube.com"><#?php echo"Pagina principal"?></a> -->

    <h1>

        <?php 
        $my_Class = new Usuario("Mauricio","Ortiz","12/06/2004","fotoxd","Masculino","XD");
        
        $my_Class->MostrarDatos();
        ?>
    </h1>

    <?php
        include 'Public/includes/footer.php'
    ?>
</body>
</html>