
        // ========== CONFIGURACIÓN DE USUARIO ==========
        const currentUser = {
            type: 'ajustador',
            id: 'AJU-2024-001',
            nombre: 'Juan',
            apellidos: 'Pérez García',
            nombreCompleto: 'Juan Pérez García',
            fechaNacimiento: '15 de mayo de 1985',
            genero: 'Masculino',
            email: 'juan.perez@autogest.com',
            alias: '@juan_ajustador',
            avatar: 'JP',
            ultimoAcceso: '06 de marzo de 2024, 10:30 hrs'
        };

        // Inicializar perfil
        function initProfile() {
            // Header
            document.getElementById('userNameDisplay').textContent = currentUser.nombre;
            document.getElementById('userRoleDisplay').textContent = 
                currentUser.type === 'supervisor' ? 'Supervisor' :
                currentUser.type === 'ajustador' ? 'Ajustador' : 'Asegurado';
            document.getElementById('userAvatar').textContent = currentUser.avatar;
            
            // Perfil
            document.getElementById('profileAvatar').textContent = currentUser.avatar;
            document.getElementById('profileName').textContent = currentUser.nombreCompleto;
            document.getElementById('profileAlias').textContent = currentUser.alias;
            
            // Datos de registro
            document.getElementById('displayNombre').textContent = currentUser.nombreCompleto;
            document.getElementById('displayApellidos').textContent = currentUser.apellidos;
            document.getElementById('displayFechaNac').textContent = currentUser.fechaNacimiento;
            document.getElementById('displayGenero').textContent = currentUser.genero;
            document.getElementById('displayEmail').textContent = currentUser.email;
            document.getElementById('displayAlias').textContent = currentUser.alias;
            
            // Último acceso
            document.querySelector('.last-access').textContent = `Último acceso: ${currentUser.ultimoAcceso}`;
        }

        // ========== FUNCIONES DE NAVEGACIÓN ==========
        function irDashboard() {
            if (currentUser.type === 'ajustador') {
                window.location.href = 'dashboard_ajustador.html';
            } else if (currentUser.type === 'supervisor') {
                window.location.href = 'dashboard_supervisor.html';
            } else {
                window.location.href = 'dashboard_asegurado.html';
            }
        }

        function irPerfil() {
            // Ya estamos en perfil
            console.log('Ya en perfil');
        }

        function showNotifications() {
            alert('Mostrando notificaciones');
        }

        function cambiarContrasena() {
            document.getElementById('passwordModal').classList.add('active');
        }

        // ========== FUNCIONES DE CIERRE DE SESIÓN ==========
        function mostrarModalLogout() {
            document.getElementById('logoutModal').classList.add('active');
        }

        function cerrarModal(modalId) {
            if (modalId) {
                document.getElementById(modalId).classList.remove('active');
            } else {
                document.getElementById('logoutModal').classList.remove('active');
            }
        }

        function cerrarSesion() {
            alert('Cerrando sesión...');
            // Simular cierre de sesión
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        }

        // ========== INICIALIZACIÓN ==========
        document.addEventListener('DOMContentLoaded', initProfile);