// ========== VARIABLES GLOBALES ==========
let currentUser = null;

// ========== VERIFICAR SESIÓN AL CARGAR ==========
document.addEventListener('DOMContentLoaded', async function() {
    console.log("🔍 Cargando perfil...");
    
    try {
        const response = await fetch('/BDM_Proyect/Public/api/verificar_sesion.php');
        const data = await response.json();
        
        console.log("Respuesta:", data);
        
        if (!data.ok) {
            window.location.href = '/BDM_Proyect/Public/views/Login.php';
            return;
        }
        
        currentUser = data;
        cargarDatosPerfil();
        
    } catch (error) {
        console.error('Error:', error);
        window.location.href = '/BDM_Proyect/Public/views/Login.php';
    }
});

function cargarDatosPerfil() {
    if (!currentUser) return;
    
    console.log("Cargando datos del perfil...");
    
    // HEADER
    const nombreMostrar = currentUser.alias || currentUser.nombre || 'Usuario';
    const rolTexto = currentUser.rol === 'ajustador' ? 'Ajustador' :
                     currentUser.rol === 'supervisor' ? 'Supervisor' : 'Asegurado';
    const inicial = (currentUser.nombre || 'U').charAt(0).toUpperCase();
    
    const userNameSpan = document.getElementById('userNameDisplay');
    const userRoleSpan = document.getElementById('userRoleDisplay');
    const userAvatarSpan = document.getElementById('userAvatar');
    
    if (userNameSpan) userNameSpan.textContent = nombreMostrar;
    if (userRoleSpan) userRoleSpan.textContent = rolTexto;
    if (userAvatarSpan) userAvatarSpan.textContent = inicial;
    
    // PERFIL - CABECERA
    const profileAvatar = document.getElementById('profileAvatar');
    const profileName = document.getElementById('profileName');
    const profileAlias = document.getElementById('profileAlias');
    
    if (profileAvatar) profileAvatar.textContent = inicial;
    if (profileName) profileName.textContent = currentUser.nombre || 'Usuario';
    if (profileAlias) profileAlias.textContent = currentUser.alias || '@usuario';
    
    // INFORMACIÓN PERSONAL
    const displayNombre = document.getElementById('displayNombre');
    const displayApellidos = document.getElementById('displayApellidos');
    const displayFechaNac = document.getElementById('displayFechaNac');
    const displayGenero = document.getElementById('displayGenero');
    const displayEmail = document.getElementById('displayEmail');
    const displayAlias = document.getElementById('displayAlias');
    const lastAccess = document.querySelector('.last-access');
    
    if (displayNombre) displayNombre.textContent = currentUser.nombre || 'No registrado';
    if (displayApellidos) displayApellidos.textContent = currentUser.apellidos || 'No registrado';
    
    if (displayFechaNac) {
        if (currentUser.fecha_nacimiento) {
            const fecha = new Date(currentUser.fecha_nacimiento);
            displayFechaNac.textContent = fecha.toLocaleDateString('es-MX');
        } else {
            displayFechaNac.textContent = 'No registrado';
        }
    }
    
    if (displayGenero) {
        if (currentUser.genero === 1 || currentUser.genero === '1') {
            displayGenero.textContent = 'Masculino';
        } else if (currentUser.genero === 0 || currentUser.genero === '0') {
            displayGenero.textContent = 'Femenino';
        } else {
            displayGenero.textContent = currentUser.genero || 'No registrado';
        }
    }
    
    if (displayEmail) displayEmail.textContent = currentUser.email || 'No registrado';
    if (displayAlias) displayAlias.textContent = currentUser.alias || '@usuario';
    if (lastAccess) lastAccess.textContent = `Último acceso: ${new Date().toLocaleString()}`;
}

// ========== EDITAR PERFIL ==========
function abrirModalEditarPerfil() {
    if (!currentUser) {
        alert('No se pudo cargar la información del usuario');
        return;
    }
    
    // Llenar el formulario con los datos actuales
    document.getElementById('editNombre').value = currentUser.nombre || '';
    document.getElementById('editApellidos').value = currentUser.apellidos || '';
    
    // Formatear fecha para el input date
    if (currentUser.fecha_nacimiento) {
        const fecha = new Date(currentUser.fecha_nacimiento);
        const fechaFormateada = fecha.toISOString().split('T')[0];
        document.getElementById('editFechaNac').value = fechaFormateada;
    } else {
        document.getElementById('editFechaNac').value = '';
    }
    
    document.getElementById('editGenero').value = currentUser.genero || '1';
    document.getElementById('editAlias').value = currentUser.alias || '';
    
    // Limpiar mensaje anterior
    const mensaje = document.getElementById('editProfileMessage');
    mensaje.className = 'form-message';
    mensaje.style.display = 'none';
    
    // Mostrar modal
    document.getElementById('editProfileModal').classList.add('active');
}

function cerrarModalEditProfile() {
    document.getElementById('editProfileModal').classList.remove('active');
}

// Cerrar modal al hacer clic fuera del contenido
document.addEventListener('click', function(event) {
    const modal = document.getElementById('editProfileModal');
    if (event.target === modal) {
        cerrarModalEditProfile();
    }
});

async function guardarPerfil(event) {
    event.preventDefault();
    
    const btnSave = document.getElementById('btnSaveProfile');
    const mensajeDiv = document.getElementById('editProfileMessage');
    
    const datos = {
        nombre: document.getElementById('editNombre').value.trim(),
        apellidos: document.getElementById('editApellidos').value.trim(),
        fecha_nacimiento: document.getElementById('editFechaNac').value,
        genero: parseInt(document.getElementById('editGenero').value),
        alias: document.getElementById('editAlias').value.trim()
    };
    
    // Validar campos obligatorios
    if (!datos.nombre || !datos.apellidos || !datos.fecha_nacimiento) {
        mostrarMensajeEdicion('❌ Todos los campos marcados con * son obligatorios', 'error');
        return;
    }
    
    // Validar fecha
    const fechaNac = new Date(datos.fecha_nacimiento);
    const hoy = new Date();
    if (fechaNac >= hoy) {
        mostrarMensajeEdicion('❌ La fecha de nacimiento debe ser anterior a hoy', 'error');
        return;
    }
    
    // Deshabilitar botón y mostrar loading
    btnSave.disabled = true;
    btnSave.innerHTML = '<span>⏳</span> Guardando...';
    
    try {
        const response = await fetch('../api/actualizar_perfil.php', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        
        const result = await response.json();
        
        if (result.ok) {
            mostrarMensajeEdicion('✅ ' + result.mensaje, 'success');
            
            // Actualizar datos en memoria
            currentUser.nombre = datos.nombre;
            currentUser.apellidos = datos.apellidos;
            currentUser.fecha_nacimiento = datos.fecha_nacimiento;
            currentUser.genero = datos.genero;
            currentUser.alias = datos.alias || currentUser.alias;
            
            // Recargar UI completa
            cargarDatosPerfil();
            
            // Cerrar modal después de 1.5 segundos
            setTimeout(() => {
                cerrarModalEditProfile();
                // Limpiar mensaje para la próxima apertura
                mensajeDiv.className = 'form-message';
                mensajeDiv.style.display = 'none';
            }, 1500);
            
        } else {
            mostrarMensajeEdicion('❌ ' + result.mensaje, 'error');
        }
        
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        mostrarMensajeEdicion('❌ Error de conexión con el servidor', 'error');
    } finally {
        // Restaurar botón
        btnSave.disabled = false;
        btnSave.innerHTML = '<span>💾</span> Guardar Cambios';
    }
}

function mostrarMensajeEdicion(mensaje, tipo) {
    const mensajeDiv = document.getElementById('editProfileMessage');
    mensajeDiv.style.display = 'block';
    mensajeDiv.textContent = mensaje;
    mensajeDiv.className = 'form-message ' + tipo;
}

// ========== FUNCIONES DE NAVEGACIÓN ==========
function irDashboard() {
    window.location.href = '/BDM_Proyect/Public/views/index.php';
}

function showNotifications() {
    alert('📢 Notificaciones: No hay notificaciones nuevas');
}

function irPerfil() {
    console.log('Ya en perfil');
}

// ========== MODALES ==========
function mostrarModalLogout() {
    const modal = document.getElementById('logoutModal');
    if (modal) modal.classList.add('active');
}

function cerrarModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

async function cerrarSesion() {
    try {
        const response = await fetch('/BDM_Proyect/logout.php');
        const data = await response.json();
        
        // Redirigir al login sin importar la respuesta
        window.location.href = '/BDM_Proyect/Public/views/Login.php';
        
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        // Si hay error, igual redirigir
        window.location.href = '/BDM_Proyect/Public/views/Login.php';
    }
}

// ========== CAMBIAR CONTRASEÑA REAL ==========
function cambiarContrasena() {
    // Abrir el modal de cambio de contraseña
    const modal = document.getElementById('passwordModal');
    if (modal) {
        // Limpiar campos anteriores
        const passActual = document.getElementById('passActual');
        const passNueva = document.getElementById('passNueva');
        const passConfirmar = document.getElementById('passConfirmar');
        const mensajeDiv = document.getElementById('passMensaje');
        
        if (passActual) passActual.value = '';
        if (passNueva) passNueva.value = '';
        if (passConfirmar) passConfirmar.value = '';
        if (mensajeDiv) mensajeDiv.style.display = 'none';
        
        modal.classList.add('active');
    } else {
        alert('Funcionalidad en desarrollo');
    }
}

async function cambiarContrasenaReal() {
    console.log("cambiarContrasenaReal ejecutándose...");
    
    const passActual = document.getElementById('passActual');
    const passNueva = document.getElementById('passNueva');
    const passConfirmar = document.getElementById('passConfirmar');
    const mensajeDiv = document.getElementById('passMensaje');
    
    if (!passActual || !passNueva || !passConfirmar) {
        console.error("No se encontraron los campos del formulario");
        alert("Error: No se encontró el formulario");
        return;
    }
    
    const passActualVal = passActual.value;
    const passNuevaVal = passNueva.value;
    const passConfirmarVal = passConfirmar.value;
    
    // Validar campos
    if (!passActualVal || !passNuevaVal || !passConfirmarVal) {
        mensajeDiv.style.display = 'block';
        mensajeDiv.style.background = '#ffebee';
        mensajeDiv.style.color = '#c62828';
        mensajeDiv.innerHTML = '❌ Todos los campos son obligatorios';
        return;
    }
    
    // Validar longitud nueva contraseña
    if (passNuevaVal.length < 8) {
        mensajeDiv.style.display = 'block';
        mensajeDiv.style.background = '#ffebee';
        mensajeDiv.style.color = '#c62828';
        mensajeDiv.innerHTML = '❌ La nueva contraseña debe tener al menos 8 caracteres';
        return;
    }
    
    // Validar que coincidan
    if (passNuevaVal !== passConfirmarVal) {
        mensajeDiv.style.display = 'block';
        mensajeDiv.style.background = '#ffebee';
        mensajeDiv.style.color = '#c62828';
        mensajeDiv.innerHTML = '❌ Las contraseñas nuevas no coinciden';
        return;
    }
    
    // Mostrar loading
    const btn = document.querySelector('#passwordModal .btn-primary');
    const textoOriginal = btn ? btn.textContent : 'Cambiar Contraseña';
    if (btn) {
        btn.disabled = true;
        btn.textContent = 'Procesando...';
    }
    mensajeDiv.style.display = 'none';
    
    try {
        const response = await fetch('/BDM_Proyect/Public/api/cambiar_password.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                password_actual: passActualVal,
                password_nueva: passNuevaVal
            })
        });
        
        const result = await response.json();
        
        mensajeDiv.style.display = 'block';
        
        if (result.ok) {
            mensajeDiv.style.background = '#e8f5e8';
            mensajeDiv.style.color = '#2e7d32';
            mensajeDiv.innerHTML = '✅ ' + result.mensaje;
            
            // Limpiar campos
            passActual.value = '';
            passNueva.value = '';
            passConfirmar.value = '';
            
            // Cerrar modal después de 2 segundos
            setTimeout(() => {
                cerrarModal('passwordModal');
            }, 2000);
        } else {
            mensajeDiv.style.background = '#ffebee';
            mensajeDiv.style.color = '#c62828';
            mensajeDiv.innerHTML = '❌ ' + result.mensaje;
        }
        
    } catch (error) {
        console.error('Error:', error);
        mensajeDiv.style.display = 'block';
        mensajeDiv.style.background = '#ffebee';
        mensajeDiv.style.color = '#c62828';
        mensajeDiv.innerHTML = '❌ Error de conexión con el servidor';
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.textContent = textoOriginal;
        }
    }
}

function irDashboard() {
    window.location.href = '/BDM_PROYECT/index.php';
}