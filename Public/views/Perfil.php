<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AutoGest Seguros - Mi Perfil</title>
    <link rel="stylesheet" href="../assets/style/perfil.css">
</head>
<body>
    <!-- HEADER DE NAVEGACIÓN (similar al dashboard) -->
    <header class="header">
    <div class="logo" onclick="irDashboard()" style="cursor: pointer;">
        <h1>AutoGest Seguros</h1>
        <span>Mi Perfil</span>
    </div>
    <div class="user-menu">
        <div class="notifications" onclick="showNotifications()">
            <span>🔔</span>
        </div>
        <div class="user-info" onclick="toggleUserMenu()" style="cursor: pointer;">
            <div class="user-details">
                <div class="user-name" id="userNameDisplay">Cargando...</div>
                <div class="user-role" id="userRoleDisplay"></div>
            </div>
            <div class="avatar" id="userAvatar"></div>
        </div>
    </div>
</header>

    <!-- CONTENEDOR PRINCIPAL DEL PERFIL -->
    <?php include '../includes/Perfil/Perfil_Container.php' ?>

    <!-- MODAL DE CIERRE DE SESIÓN -->
    <?php include '../includes/Perfil/Modal_CerrarSes.php' ?>

    <!-- MODAL DE CAMBIO DE CONTRASEÑA -->
    <?php include '../includes/Perfil/Modal_PassChange.php'?>

    <script src="../assets/js/perfil.js"></script>
</body>
</html>