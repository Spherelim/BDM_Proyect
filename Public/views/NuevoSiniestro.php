<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AutoGest Seguros - Nuevo Siniestro</title>
    <link rel="stylesheet" href="../assets/style/nuevosiniestro.css">
</head>
<body>

    <?php include '../includes/header.php' ?>

    <!-- CONTENEDOR PRINCIPAL -->
    <?php include '../includes/Siniestros/Siniestro_Container.php' ?>   

    <!-- MODAL DE CONFIRMACIÓN -->
    <?php include '../includes/Siniestros/Modal_SinReg.php' ?>

    <!-- MODAL DE NOTIFICACIONES -->
    <?php include '../includes/Notificaciones/Modal_Notificaciones.php' ?>

    <script src="../assets/js/nuevosiniestro.js"></script>
    <script src="../assets/js/notificaciones.js"></script>
    
</body>
</html>
