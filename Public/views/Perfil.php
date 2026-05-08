<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AutoGest Seguros - Mi Perfil</title>
    <link rel="stylesheet" href="../assets/style/perfil.css">
</head>
<body>

    <!-- MODAL DE EDICIÓN DE PERFIL -->
    <?php include '../includes/Perfil/Modal_EditProfile.php' ?>

    <!-- HEADER DE NAVEGACIÓN (similar al dashboard) -->
    <?php include '../includes/Perfil/Perfil_Header.php' ?>

    <!-- CONTENEDOR PRINCIPAL DEL PERFIL -->
    <?php include '../includes/Perfil/Perfil_Container.php' ?>

    <!-- MODAL DE CIERRE DE SESIÓN -->
    <?php include '../includes/Perfil/Modal_CerrarSes.php' ?>

    <!-- MODAL DE CAMBIO DE CONTRASEÑA -->
    <?php include '../includes/Perfil/Modal_PassChange.php'?>

    <script src="../assets/js/perfil.js"></script>
</body>
</html>