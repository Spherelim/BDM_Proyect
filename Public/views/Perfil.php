<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AutoGest Seguros - Mi Perfil</title>
    <link rel="stylesheet" href="../assets/style/perfil.css">
</head>
<body>
    <!-- HEADER -->
    <?php include '../includes/Perfil/Perfil_Header.php' ?>
    <!-- <header class="header">
        <div class="logo" onclick="irDashboard()">
            <h1>AutoGest Seguros</h1>
            <span>Mi Perfil</span>
        </div>
        <div class="user-menu">
            <div class="notifications" onclick="showNotifications()">
                <span>🔔</span>
            </div>
            <div class="user-info" onclick="irPerfil()">
                <div class="user-details">
                    <div class="user-name" id="userNameDisplay">Juan</div>
                    <div class="user-role" id="userRoleDisplay">Ajustador</div>
                </div>
                <div class="avatar" id="userAvatar">JP</div>
            </div>
        </div>
    </header> -->

    <!-- CONTENEDOR PRINCIPAL -->
    <?php include '../includes/Perfil/Perfil_Container.php' ?>

    <!-- MODAL DE CIERRE DE SESIÓN -->
    <?php include '../includes/Perfil/Modal_CerrarSes.php' ?>

    <!-- MODAL DE CAMBIO DE CONTRASEÑA (simulado) -->
    <?php include '../includes/Perfil/Modal_PassChange.php'?>

    <script src="../assets/js/perfil.js"></script>
    
</body>
</html>