// ========== VARIABLES GLOBALES ==========
let currentUser = null;
let siniestrosReales = [];

// ========== VERIFICAR SESIÓN AL CARGAR ==========
document.addEventListener('DOMContentLoaded', async function() {
    console.log("🔍 Verificando sesión...");
    
    try {
        const response = await fetch('Public/api/verificar_sesion.php');
        const data = await response.json();
        
        console.log("Respuesta de verificar_sesion:", data);
        
        if (!data.ok) {
            console.log("No hay sesión, redirigiendo a login...");
            window.location.href = 'login.html';
            return;
        }
        
        // Guardar usuario real logueado
        currentUser = data;
        console.log("Usuario logueado:", currentUser);
        
        // Actualizar header con datos reales
        actualizarHeader();
        
        // Mostrar banner según el rol
        mostrarBienvenida();
        
        // Cargar siniestros desde la base de datos
        await cargarSiniestros();
        
    } catch (error) {
        console.error('Error al verificar sesión:', error);
        window.location.href = 'login.html';
    }
});

function actualizarHeader() {
    if (!currentUser) return;
    
    const nombreMostrar = currentUser.alias || currentUser.nombre || 'Usuario';
    const rolTexto = currentUser.rol === 'ajustador' ? 'Ajustador' :
                     currentUser.rol === 'supervisor' ? 'Supervisor' : 'Asegurado';
    const inicial = (currentUser.nombre || 'U').charAt(0).toUpperCase();
    
    document.getElementById('userNameDisplay').textContent = nombreMostrar;
    document.getElementById('userRoleDisplay').textContent = rolTexto;
    document.getElementById('userAvatar').textContent = inicial;
}

function mostrarBienvenida() {
    const banner = document.getElementById('welcomeBanner');
    const nombre = currentUser.alias || currentUser.nombre || 'Usuario';
    let mensaje = '';
    
    if (currentUser.rol === 'supervisor') {
        mensaje = `
            <div class="welcome-content">
                <div class="welcome-title">¡Bienvenido, Supervisor ${nombre}!</div>
                <div class="welcome-text">Gestiona las autorizaciones y pagos de siniestros desde aquí.</div>
                <div class="quick-actions">
                    <div class="quick-action-btn" onclick="generarReporte()">
                        <span>📊</span> Generar Reporte
                    </div>
                </div>
            </div>
        `;
    } else if (currentUser.rol === 'ajustador') {
        mensaje = `
            <div class="welcome-content">
                <div class="welcome-title">¡Bienvenido, Ajustador ${nombre}!</div>
                <div class="welcome-text">Registra nuevos siniestros y da seguimiento a tus casos activos.</div>
                <div class="quick-actions">
                    <div class="quick-action-btn" onclick="window.location.href='Public/views/NuevoSiniestro.php'">
                        <span>➕</span> Nuevo Siniestro
                    </div>
                </div>
            </div>
        `;
    } else {
        mensaje = `
            <div class="welcome-content">
                <div class="welcome-title">¡Hola, ${nombre}!</div>
                <div class="welcome-text">Da seguimiento a tus siniestros y mantente informado del progreso.</div>
                <div class="quick-actions">
                    <div class="quick-action-btn" onclick="contactarSoporte()">
                        <span>💬</span> Contactar Soporte
                    </div>
                </div>
            </div>
        `;
    }
    
    banner.innerHTML = mensaje;
}

async function cargarSiniestros() {
    try {
        const container = document.getElementById('siniestrosContainer');
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <div style="font-size: 2rem;">⏳</div>
                <h3>Cargando siniestros...</h3>
            </div>
        `;
        
        // Llamar a la API que trae los siniestros según el rol
        const response = await fetch(`Public/api/siniestros.php`);
        const data = await response.json();
        
        console.log("Siniestros recibidos:", data);
        
        if (data.ok && data.siniestros) {
            siniestrosReales = data.siniestros;
            
            if (siniestrosReales.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 3rem; color: #888;">
                        <div style="font-size: 4rem; margin-bottom: 1rem;">📋</div>
                        <h3>No hay siniestros registrados</h3>
                        <p>${currentUser.rol === 'ajustador' ? 'Registra tu primer siniestro.' : 'No se encontraron siniestros para mostrar.'}</p>
                    </div>
                `;
                document.getElementById('resultCount').textContent = 'Mostrando 0 siniestros';
                return;
            }
            
            mostrarResultados(siniestrosReales);
        } else {
            mostrarError(data.mensaje || 'Error al cargar siniestros');
        }
        
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error de conexión con el servidor');
    }
}

function mostrarResultados(siniestros) {
    const container = document.getElementById('siniestrosContainer');
    const countElement = document.getElementById('resultCount');
    
    countElement.textContent = `Mostrando ${siniestros.length} siniestro${siniestros.length !== 1 ? 's' : ''}`;
    
    let html = '';
    siniestros.forEach(s => {
        const estadoClass = getEstadoClass(s.estado);
        const estadoText = getEstadoText(s.estado);
        
        html += `
            <div class="siniestro-item" onclick="verDetalle(${s.id})">
                <div class="siniestro-header">
                    <span class="siniestro-id">${s.folio || 'SN-' + s.id}</span>
                    <span class="siniestro-estado ${estadoClass}">${estadoText}</span>
                </div>
                <div class="siniestro-details">
                    <div class="detail-item">
                        <span class="detail-label">Cliente</span>
                        <span class="detail-value">${s.cliente_nombre || 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Vehículo</span>
                        <span class="detail-value">${s.vehiculo || 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Placas</span>
                        <span class="detail-value">${s.placas || 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Compañía</span>
                        <span class="detail-value">${s.compania || 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Ajustador</span>
                        <span class="detail-value">${s.ajustador_nombre || 'N/A'}</span>
                    </div>
                </div>
                <div class="siniestro-footer">
                    <div class="fechas">
                        <span>📅 ${formatFecha(s.fecha_siniestro)}</span>
                    </div>
                    <button class="btn-ver-detalle" onclick="event.stopPropagation(); verDetalle(${s.id})">
                        Ver detalle
                    </button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function mostrarError(mensaje) {
    const container = document.getElementById('siniestrosContainer');
    container.innerHTML = `
        <div style="text-align: center; padding: 3rem; color: #c62828;">
            <div style="font-size: 4rem;">⚠️</div>
            <h3>Error al cargar datos</h3>
            <p>${mensaje}</p>
            <button class="btn btn-primary" onclick="cargarSiniestros()" style="margin-top: 1rem;">Reintentar</button>
        </div>
    `;
}

function buscarSiniestros() {
    if (!siniestrosReales.length) return;
    
    const fechaInicio = document.getElementById('fechaInicio')?.value;
    const fechaFin = document.getElementById('fechaFin')?.value;
    const compania = document.getElementById('companiaSeguros')?.value;
    const poliza = document.getElementById('numPoliza')?.value;
    const vehiculo = document.getElementById('vehiculo')?.value;
    const cliente = document.getElementById('cliente')?.value;
    const estado = document.getElementById('estadoSiniestro')?.value;
    
    let resultados = [...siniestrosReales];
    
    if (fechaInicio) resultados = resultados.filter(s => s.fecha_siniestro >= fechaInicio);
    if (fechaFin) resultados = resultados.filter(s => s.fecha_siniestro <= fechaFin);
    if (compania) resultados = resultados.filter(s => s.compania === compania);
    if (poliza) resultados = resultados.filter(s => s.num_poliza && s.num_poliza.includes(poliza));
    if (vehiculo) {
        const term = vehiculo.toLowerCase();
        resultados = resultados.filter(s => 
            (s.placas && s.placas.toLowerCase().includes(term)) ||
            (s.serie && s.serie.toLowerCase().includes(term))
        );
    }
    if (cliente) {
        resultados = resultados.filter(s => 
            s.cliente_nombre && s.cliente_nombre.toLowerCase().includes(cliente.toLowerCase())
        );
    }
    if (estado) resultados = resultados.filter(s => s.estado === estado);
    
    mostrarResultados(resultados);
}

function limpiarBusqueda() {
    document.getElementById('fechaInicio').value = '';
    document.getElementById('fechaFin').value = '';
    document.getElementById('companiaSeguros').value = '';
    document.getElementById('numPoliza').value = '';
    document.getElementById('vehiculo').value = '';
    document.getElementById('cliente').value = '';
    document.getElementById('estadoSiniestro').value = '';
    mostrarResultados(siniestrosReales);
}

function verDetalle(id) {
    window.location.href = `detalle_siniestro.html?id=${id}`;
}

function cerrarModal() {
    document.getElementById('detalleModal').classList.remove('active');
}

function getEstadoClass(estado) {
    const classes = {
        'rechazado': 'estado-rechazado',
        'aceptado': 'estado-aceptado',
        'aceptado con deducible': 'estado-deducible',
        'aceptado sin deducible': 'estado-aceptado',
        'reparacion': 'estado-pendiente',
        'perdida total': 'estado-perdida-total'
    };
    return classes[estado] || 'estado-pendiente';
}

function getEstadoText(estado) {
    const texts = {
        'rechazado': 'Rechazado',
        'aceptado': 'Aceptado',
        'aceptado con deducible': 'Aceptado con Deducible',
        'aceptado sin deducible': 'Aceptado sin Deducible',
        'reparacion': 'En Reparación',
        'perdida total': 'Pérdida Total'
    };
    return texts[estado] || estado;
}

function formatFecha(fecha) {
    if (!fecha) return '';
    try {
        return new Date(fecha).toLocaleDateString('es-MX');
    } catch {
        return fecha;
    }
}

// Acciones
function generarReporte() { alert('Generando reporte...'); }
function contactarSoporte() { alert('Contactando a soporte...'); }
function showNotifications() { alert('Notificaciones'); }
function goToLogin() { window.location.href = "Public/views/Login.php"; }
function toggleUserMenu() { if (confirm('¿Cerrar sesión?')) window.location.href = 'logout.php'; }
function verMedia(archivo) { alert(`Viendo: ${archivo}`); }
function cambiarEstado(id, estado) { alert(`Cambiando estado de ${id} a ${estado}`); }
function registrarPagoDeducible(id) { alert(`Registrar pago deducible ${id}`); }
function registrarPagoIndemnizacion(id) { alert(`Registrar pago indemnización ${id}`); }
function subirEvidencia(id) { alert(`Subir evidencia ${id}`); }
function editarSiniestro(id) { alert(`Editar siniestro ${id}`); }