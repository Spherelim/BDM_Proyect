// ========== VARIABLES GLOBALES ==========
let currentUser = null;
let fotoSeleccionada = null;

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
    
    // Header usuario
    const userNameSpan = document.getElementById('userNameDisplay');
    const userRoleSpan = document.getElementById('userRoleDisplay');
    const userAvatarSpan = document.getElementById('userAvatar');
    
    if (userNameSpan) userNameSpan.textContent = nombreMostrar;
    if (userRoleSpan) userRoleSpan.textContent = rolTexto;
    
    // Avatar del header - con foto o inicial
    if (userAvatarSpan) {
        if (currentUser.foto) {
            userAvatarSpan.innerHTML = `<img src="${currentUser.foto}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
            userAvatarSpan.style.background = 'none';
        } else {
            userAvatarSpan.textContent = inicial;
            userAvatarSpan.style.background = 'linear-gradient(135deg, #ffd700, #ffaa00)';
        }
    }
    
    // PERFIL - CABECERA
    const profileAvatar = document.getElementById('profileAvatar');
    const profileName = document.getElementById('profileName');
    const profileAlias = document.getElementById('profileAlias');
    
    // Avatar del perfil - con foto o inicial
    if (profileAvatar) {
        if (currentUser.foto) {
            profileAvatar.innerHTML = `<img src="${currentUser.foto}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
            profileAvatar.style.background = 'none';
        } else {
            profileAvatar.textContent = inicial;
            profileAvatar.style.background = 'linear-gradient(135deg, #ffd700, #ffaa00)';
        }
    }
    
    if (profileName) profileName.textContent = currentUser.nombre || 'Usuario';
    if (profileAlias) profileAlias.textContent = currentUser.alias || '@usuario';
    
    // INFORMACIÓN PERSONAL
    const displayNombre = document.getElementById('displayNombre');
    const displayApellidos = document.getElementById('displayApellidos');
    const displayFechaNac = document.getElementById('displayFechaNac');
    const displayGenero = document.getElementById('displayGenero');
    const displayEmail = document.getElementById('displayEmail');
    const displayAlias = document.getElementById('displayAlias');
    
    if (displayNombre) displayNombre.textContent = currentUser.nombre || 'No registrado';
    if (displayApellidos) displayApellidos.textContent = currentUser.apellidos || 'No registrado';
    
    if (displayFechaNac) {
        if (currentUser.fecha_nacimiento) {
            const partes = currentUser.fecha_nacimiento.split('-');
            const year = parseInt(partes[0]);
            const month = parseInt(partes[1]) - 1;
            const day = parseInt(partes[2]);
            const fecha = new Date(year, month, day);
            displayFechaNac.textContent = fecha.toLocaleDateString('es-MX', {
                year: 'numeric', month: '2-digit', day: '2-digit'
            });
        } else {
            displayFechaNac.textContent = 'No registrado';
        }
    }
    
    if (displayGenero) {
        if (currentUser.genero == 1) {
            displayGenero.textContent = 'Masculino';
        } else if (currentUser.genero == 0) {
            displayGenero.textContent = 'Femenino';
        } else {
            displayGenero.textContent = 'No registrado';
        }
    }
    
    if (displayEmail) displayEmail.textContent = currentUser.email || 'No registrado';
    if (displayAlias) displayAlias.textContent = currentUser.alias || '@usuario';
    
    const lastAccess = document.querySelector('.last-access');
    if (lastAccess) lastAccess.textContent = `Último acceso: ${new Date().toLocaleString()}`;
}

// ========== EDITAR PERFIL ==========
function abrirModalEditarPerfil() {
    if (!currentUser) {
        alert('No se pudo cargar la información del usuario');
        return;
    }
    
    document.getElementById('editNombre').value = currentUser.nombre || '';
    document.getElementById('editApellidos').value = currentUser.apellidos || '';
    
    if (currentUser.fecha_nacimiento) {
        const fechaStr = currentUser.fecha_nacimiento;
        if (fechaStr.includes('-') && fechaStr.length >= 10) {
            document.getElementById('editFechaNac').value = fechaStr.substring(0, 10);
        }
    } else {
        document.getElementById('editFechaNac').value = '';
    }
    
    document.getElementById('editGenero').value = currentUser.genero || '1';
    document.getElementById('editEmail').value = currentUser.email || '';
    document.getElementById('editAlias').value = currentUser.alias || '';
    
    // Resetear foto
    fotoSeleccionada = null;
    document.getElementById('editFoto').value = '';
    
    // Mostrar foto actual si existe
    if (currentUser.foto) {
        document.getElementById('fotoPreview').src = currentUser.foto;
        document.getElementById('fotoPreview').style.display = 'block';
        document.getElementById('fotoPlaceholder').style.display = 'none';
        document.getElementById('btnEliminarFoto').style.display = 'inline-block';
    } else {
        document.getElementById('fotoPreview').style.display = 'none';
        document.getElementById('fotoPlaceholder').style.display = 'flex';
        document.getElementById('btnEliminarFoto').style.display = 'none';
    }
    
    const mensaje = document.getElementById('editProfileMessage');
    mensaje.className = 'form-message';
    mensaje.style.display = 'none';
    
    document.getElementById('editProfileModal').classList.add('active');
}

function cerrarModalEditProfile() {
    document.getElementById('editProfileModal').classList.remove('active');
}

document.addEventListener('click', function(event) {
    const modal = document.getElementById('editProfileModal');
    if (event.target === modal) cerrarModalEditProfile();
});

// ========== FUNCIONES DE FOTO ==========
function previewFoto(event) {
    const file = event.target.files[0];
    if (file) {
        if (!file.type.startsWith('image/')) {
            alert('Solo se permiten imágenes');
            event.target.value = '';
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            alert('La imagen debe ser menor a 2MB');
            event.target.value = '';
            return;
        }
        
        fotoSeleccionada = file;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('fotoPreview').src = e.target.result;
            document.getElementById('fotoPreview').style.display = 'block';
            document.getElementById('fotoPlaceholder').style.display = 'none';
            document.getElementById('btnEliminarFoto').style.display = 'inline-block';
        };
        reader.readAsDataURL(file);
    }
}

// Quitar la foto actual (ponerla como null)
function quitarFotoActual() {
    fotoSeleccionada = 'QUITAR'; // Valor especial para indicar que se quiere quitar
    document.getElementById('editFoto').value = '';
    document.getElementById('fotoPreview').style.display = 'none';
    document.getElementById('fotoPlaceholder').style.display = 'flex';
    document.getElementById('btnEliminarFoto').style.display = 'none';
}


async function guardarPerfil(event) {
    event.preventDefault();
    
    const btnSave = document.getElementById('btnSaveProfile');
    const mensajeDiv = document.getElementById('editProfileMessage');
    
    const formData = new FormData();
    formData.append('nombre', document.getElementById('editNombre').value.trim());
    formData.append('apellidos', document.getElementById('editApellidos').value.trim());
    formData.append('fecha_nacimiento', document.getElementById('editFechaNac').value);
    formData.append('genero', parseInt(document.getElementById('editGenero').value));
    formData.append('email', document.getElementById('editEmail').value.trim());
    formData.append('alias', document.getElementById('editAlias').value.trim());
    
    // Manejar foto
    if (fotoSeleccionada === 'QUITAR') {
        // Quiere eliminar la foto
        formData.append('quitar_foto', '1');
    } else if (fotoSeleccionada instanceof File) {
        // Nueva foto seleccionada
        formData.append('foto', fotoSeleccionada);
    }
    // Si fotoSeleccionada es null, no se modifica
    
    if (!formData.get('nombre') || !formData.get('apellidos') || !formData.get('fecha_nacimiento') || !formData.get('email')) {
        mostrarMensajeEdicion('❌ Todos los campos con * son obligatorios', 'error');
        return;
    }
    
    btnSave.disabled = true;
    btnSave.innerHTML = '<span>⏳</span> Guardando...';
    
    try {
        const response = await fetch('../api/actualizar_perfil.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.ok) {
            mostrarMensajeEdicion('✅ ' + result.mensaje, 'success');
            
            currentUser.nombre = formData.get('nombre');
            currentUser.apellidos = formData.get('apellidos');
            currentUser.fecha_nacimiento = formData.get('fecha_nacimiento');
            currentUser.genero = parseInt(formData.get('genero'));
            currentUser.email = formData.get('email');
            currentUser.alias = formData.get('alias') || currentUser.alias;
            if (result.foto !== undefined) currentUser.foto = result.foto;
            
            cargarDatosPerfil();
            
            setTimeout(() => {
                cerrarModalEditProfile();
                mensajeDiv.className = 'form-message';
                mensajeDiv.style.display = 'none';
            }, 1500);
        } else {
            mostrarMensajeEdicion('❌ ' + result.mensaje, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensajeEdicion('❌ Error de conexión', 'error');
    } finally {
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

// ========== NAVEGACIÓN ==========
function irDashboard() {
    window.location.href = '/BDM_Proyect/index.php';
}

function showNotifications() {
    alert('📢 No hay notificaciones nuevas');
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
        await fetch('/BDM_Proyect/logout.php');
    } catch (e) {}
    window.location.href = '/BDM_Proyect/Public/views/Login.php';
}

// ========== CAMBIAR CONTRASEÑA ==========
function cambiarContrasena() {
    const modal = document.getElementById('passwordModal');
    if (modal) {
        document.getElementById('passActual').value = '';
        document.getElementById('passNueva').value = '';
        document.getElementById('passConfirmar').value = '';
        document.getElementById('passMensaje').style.display = 'none';
        modal.classList.add('active');
    }
}

async function cambiarContrasenaReal() {
    const passActual = document.getElementById('passActual').value;
    const passNueva = document.getElementById('passNueva').value;
    const passConfirmar = document.getElementById('passConfirmar').value;
    const mensajeDiv = document.getElementById('passMensaje');
    
    if (!passActual || !passNueva || !passConfirmar) {
        mensajeDiv.style.display = 'block';
        mensajeDiv.style.background = '#ffebee';
        mensajeDiv.style.color = '#c62828';
        mensajeDiv.innerHTML = '❌ Todos los campos son obligatorios';
        return;
    }
    
    if (passNueva.length < 8) {
        mensajeDiv.style.display = 'block';
        mensajeDiv.style.background = '#ffebee';
        mensajeDiv.style.color = '#c62828';
        mensajeDiv.innerHTML = '❌ Mínimo 8 caracteres';
        return;
    }
    
    if (passNueva !== passConfirmar) {
        mensajeDiv.style.display = 'block';
        mensajeDiv.style.background = '#ffebee';
        mensajeDiv.style.color = '#c62828';
        mensajeDiv.innerHTML = '❌ No coinciden';
        return;
    }
    
    try {
        const response = await fetch('/BDM_Proyect/Public/api/cambiar_password.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                password_actual: passActual,
                password_nueva: passNueva
            })
        });
        
        const result = await response.json();
        mensajeDiv.style.display = 'block';
        
        if (result.ok) {
            mensajeDiv.style.background = '#e8f5e8';
            mensajeDiv.style.color = '#2e7d32';
            mensajeDiv.innerHTML = '✅ ' + result.mensaje;
            setTimeout(() => cerrarModal('passwordModal'), 2000);
        } else {
            mensajeDiv.style.background = '#ffebee';
            mensajeDiv.style.color = '#c62828';
            mensajeDiv.innerHTML = '❌ ' + result.mensaje;
        }
    } catch (error) {
        mensajeDiv.style.display = 'block';
        mensajeDiv.style.background = '#ffebee';
        mensajeDiv.style.color = '#c62828';
        mensajeDiv.innerHTML = '❌ Error de conexión';
    }
}