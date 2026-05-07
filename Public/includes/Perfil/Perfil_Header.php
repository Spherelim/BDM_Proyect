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