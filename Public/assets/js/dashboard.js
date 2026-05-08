// ========== VARIABLES GLOBALES ==========
let currentUser = null;
let siniestrosReales = [];

// ========== VERIFICAR SESIÓN AL CARGAR ==========
document.addEventListener('DOMContentLoaded', async function() {
    console.log("🔍 Verificando sesión...");
    
    try {

        cargarCompaniasDashboard();
        
        const response = await fetch('Public/api/verificar_sesion.php');
        const data = await response.json();
        
        console.log("Respuesta de verificar_sesion:", data);
        
        if (!data.ok) {
            console.log("No hay sesión, redirigiendo a login...");
            window.location.href = 'Public/views/login.php';
            return;
        }
        
        currentUser = data;
        console.log("Usuario logueado:", currentUser);
        
        actualizarHeader();
        mostrarBienvenida();
        await cargarSiniestros();
        
    } catch (error) {
        console.error('Error al verificar sesión:', error);
        window.location.href = 'Public/views/login.php';
    }
});

// Cargar compañías para el buscador
async function cargarCompaniasDashboard() {
    try {
        const response = await fetch('Public/api/obtener_companias.php');
        const data = await response.json();
        
        if (data.ok && data.companias) {
            const select = document.getElementById('companiaSeguros');
            if (select) {
                select.innerHTML = '<option value="">Todas las compañías</option>';
                data.companias.forEach(compania => {
                    select.innerHTML += `<option value="${compania.Nombre_Empresa}">${compania.Nombre_Empresa}</option>`;
                });
            }
        }
    } catch (error) {
        console.error('Error cargando compañías:', error);
    }
}

function actualizarHeader() {
    if (!currentUser) return;
    
    const nombreMostrar = currentUser.alias || currentUser.nombre || 'Usuario';
    const rolTexto = currentUser.rol === 'ajustador' ? 'Ajustador' :
                     currentUser.rol === 'supervisor' ? 'Supervisor' : 'Asegurado';
    const inicial = (currentUser.nombre || 'U').charAt(0).toUpperCase();
    
    document.getElementById('userNameDisplay').textContent = nombreMostrar;
    document.getElementById('userRoleDisplay').textContent = rolTexto;
    
    // Avatar con foto o inicial
    const userAvatar = document.getElementById('userAvatar');
    if (userAvatar) {
        if (currentUser.foto) {
            userAvatar.innerHTML = `<img src="${currentUser.foto}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
            userAvatar.style.background = 'none';
        } else {
            userAvatar.textContent = inicial;
            userAvatar.style.background = 'linear-gradient(135deg, #ffd700, #ffaa00)';
        }
    }
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

async function buscarSiniestros() {
    console.log("🔍 Ejecutando búsqueda...");
    
    const fechaInicio = document.getElementById('fechaInicio')?.value || null;
    const fechaFin = document.getElementById('fechaFin')?.value || null;
    const compania = document.getElementById('companiaSeguros')?.value || null;
    const poliza = document.getElementById('numPoliza')?.value || null;
    const vehiculo = document.getElementById('vehiculo')?.value || null;
    const cliente = document.getElementById('cliente')?.value || null;
    const estado = document.getElementById('estadoSiniestro')?.value || null;
    
    const container = document.getElementById('siniestrosContainer');
    container.innerHTML = `<div style="text-align:center; padding:3rem;">⏳ Buscando siniestros...</div>`;
    
    try {
        const response = await fetch('Public/api/buscar_siniestros.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fecha_inicio: fechaInicio,
                fecha_fin: fechaFin,
                compania: compania,
                poliza: poliza,
                vehiculo: vehiculo,
                cliente: cliente,
                estado: estado
            })
        });
        
        const data = await response.json();
        
        if (data.ok) {
            console.log("Siniestros encontrados:", data.siniestros.length);
            mostrarResultados(data.siniestros);
        } else {
            container.innerHTML = `<div style="text-align:center; padding:3rem; color:#c62828;">❌ ${data.mensaje}</div>`;
        }
    } catch (error) {
        console.error('Error en búsqueda:', error);
        container.innerHTML = `<div style="text-align:center; padding:3rem; color:#c62828;">❌ Error de conexión con el servidor</div>`;
    }
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

// ========== DETALLE DE SINIESTRO CON COMENTARIOS ==========
async function verDetalle(id) {
    const siniestro = siniestrosReales.find(s => s.id == id);
    if (!siniestro) {
        alert('Siniestro no encontrado');
        return;
    }
    
    // Cargar comentarios
    let comentariosHtml = '<div style="text-align:center; padding:1rem;">⏳ Cargando comentarios...</div>';
    
    try {
        const response = await fetch(`Public/api/comentarios.php?id=${id}`);
        const data = await response.json();
        if (data.ok && data.comentarios) {
            comentariosHtml = generarComentariosHtml(data.comentarios);
        }
    } catch (error) {
        console.error('Error cargando comentarios:', error);
        comentariosHtml = '<div style="text-align:center; color:#c62828;">❌ Error al cargar comentarios</div>';
    }
    
    const modal = document.getElementById('detalleModal');
    const content = document.getElementById('detalleContent');
    const detalleId = document.getElementById('detalleId');
    
    detalleId.textContent = '#' + (siniestro.folio || siniestro.id);
    
    const rol = currentUser.rol;
    const esAjustador = rol === 'ajustador';
    const esSupervisor = rol === 'supervisor';
    
    content.innerHTML = `
        <div style="display: grid; gap: 1.5rem;">
            <!-- Info principal -->
            <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 15px;">
                <h4 style="color: #003366; margin-bottom: 1rem;">📋 Información General</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div><strong>Folio:</strong> ${siniestro.folio || 'N/A'}</div>
                    <div><strong>Estado:</strong> <span class="siniestro-estado ${getEstadoClass(siniestro.estado)}">${getEstadoText(siniestro.estado)}</span></div>
                    <div><strong>Fecha:</strong> 📅 ${formatFecha(siniestro.fecha_siniestro)}</div>
                    <div><strong>Ubicación:</strong> 📍 ${siniestro.ubicacion || 'N/A'}</div>
                </div>
            </div>
            
            <!-- Cliente -->
            <div style="background: #e8f0fe; padding: 1.5rem; border-radius: 15px;">
                <h4 style="color: #003366; margin-bottom: 1rem;">👤 Cliente</h4>
                <p><strong>Nombre:</strong> ${siniestro.cliente_nombre || 'N/A'}</p>
            </div>
            
            <!-- Vehículo -->
            <div style="background: #fff3e0; padding: 1.5rem; border-radius: 15px;">
                <h4 style="color: #003366; margin-bottom: 1rem;">🚗 Vehículo</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div><strong>Vehículo:</strong> ${siniestro.vehiculo || 'N/A'}</div>
                    <div><strong>Placas:</strong> ${siniestro.placas || 'N/A'}</div>
                    <div><strong>Serie:</strong> ${siniestro.serie || 'N/A'}</div>
                </div>
            </div>
            
            <!-- Siniestro -->
            <div style="background: #fce4ec; padding: 1.5rem; border-radius: 15px;">
                <h4 style="color: #003366; margin-bottom: 1rem;">⚠️ Siniestro</h4>
                <p><strong>Tipo:</strong> ${siniestro.tipo || 'N/A'}</p>
                <p><strong>Descripción:</strong> ${siniestro.descripcion || 'Sin descripción'}</p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
                    <div><strong>Lesionados:</strong> ${siniestro.lesionados || 'No'}</div>
                    <div><strong>Autoridades:</strong> ${siniestro.autoridades || 'No'}</div>
                </div>
            </div>
            
            <!-- Ajustador -->
            <div style="background: #e8f5e8; padding: 1.5rem; border-radius: 15px;">
                <h4 style="color: #003366; margin-bottom: 1rem;">🔧 Ajustador</h4>
                <p><strong>Nombre:</strong> ${siniestro.ajustador_nombre || 'N/A'}</p>
            </div>
            
            <!-- SECCIÓN DE COMENTARIOS -->
            <div style="background: white; border: 2px solid #e0e0e0; border-radius: 15px; padding: 1.5rem;">
                <h4 style="color: #003366; margin-bottom: 1rem;">💬 Comentarios y Seguimiento</h4>
                
                <div id="comentariosContainer" style="max-height: 300px; overflow-y: auto; margin-bottom: 1rem;">
                    ${comentariosHtml}
                </div>
                
                <!-- Formulario para agregar comentario -->
                <div style="display: flex; gap: 1rem; margin-top: 1rem; flex-wrap: wrap;">
                    <textarea id="nuevoComentario" style="flex:1; padding: 0.8rem; border: 2px solid #e0e0e0; border-radius: 12px; resize: vertical; min-height: 60px;" rows="2" placeholder="Escribe tu comentario o pregunta..."></textarea>
                    <button onclick="agregarComentario(${id})" style="padding: 0 1.5rem; background: #003366; color: white; border: none; border-radius: 12px; cursor: pointer;">
                        Enviar
                    </button>
                </div>
            </div>
            
            <!-- Acciones según rol -->
            ${(esAjustador || esSupervisor) ? `
            <div style="background: #e8f0fe; padding: 1.5rem; border-radius: 15px;">
                <h4 style="color: #003366; margin-bottom: 1rem;">⚙️ Acciones</h4>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    ${esSupervisor ? `
                        <button class="btn-accion" onclick="cambiarEstadoSiniestro(${id}, 'aceptado')" style="background: #4caf50;">✓ Aceptar</button>
                        <button class="btn-accion" onclick="cambiarEstadoSiniestro(${id}, 'rechazado')" style="background: #f44336;">✗ Rechazar</button>
                        <button class="btn-accion" onclick="cambiarEstadoSiniestro(${id}, 'aceptado_con_deducible')" style="background: #ff9800;">💵 Aceptar con Deducible</button>
                        <button class="btn-accion" onclick="cambiarEstadoSiniestro(${id}, 'perdida_total')" style="background: #9c27b0;">💀 Pérdida Total</button>
                    ` : ''}
                    ${esAjustador ? `
                        <button class="btn-accion" onclick="subirEvidencia(${id})" style="background: #2196f3;">📸 Subir Evidencia</button>
                    ` : ''}
                </div>
            </div>
            ` : ''}
        </div>
    `;
    
    modal.classList.add('active');
}

function generarComentariosHtml(comentarios) {
    if (!comentarios.length) {
        return '<div style="text-align:center; padding:2rem; color:#888;">💬 No hay comentarios aún. ¡Sé el primero en comentar!</div>';
    }
    
    let html = '';
    comentarios.forEach(c => {
        const colorBorde = c.rol === 'supervisor' ? '#2196f3' : c.rol === 'ajustador' ? '#4caf50' : '#ff9800';
        const rolNombre = c.rol === 'supervisor' ? 'Supervisor' : c.rol === 'ajustador' ? 'Ajustador' : 'Asegurado';
        
        html += `
            <div style="margin-bottom: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 12px; border-left: 4px solid ${colorBorde};">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; flex-wrap: wrap;">
                    <div>
                        <strong style="color: #003366;">${c.Alias || c.Nombre || 'Usuario'}</strong>
                        <span style="font-size: 0.8rem; color: #666; margin-left: 8px;">(${rolNombre})</span>
                    </div>
                    <div style="font-size: 0.8rem; color: #888;">${formatFecha(c.Fecha_Comentario)}</div>
                </div>
                <p style="margin: 0; color: #333;">${escapeHtml(c.comentario)}</p>
            </div>
        `;
    });
    return html;
}

function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

async function agregarComentario(idSiniestro) {
    const textarea = document.getElementById('nuevoComentario');
    const comentario = textarea.value.trim();
    
    if (!comentario) {
        alert('Por favor escribe un comentario');
        return;
    }
    
    try {
        const response = await fetch('Public/api/comentarios.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_siniestro: idSiniestro,
                comentario: comentario
            })
        });
        
        const data = await response.json();
        
        if (data.ok) {
            textarea.value = '';
            verDetalle(idSiniestro); // Recargar detalle
        } else {
            alert('Error: ' + data.mensaje);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al enviar comentario');
    }
}

async function cambiarEstadoSiniestro(id, nuevoEstado) {
    const estadosTexto = {
        'aceptado': 'Aceptado',
        'rechazado': 'Rechazado',
        'aceptado_con_deducible': 'Aceptado con Deducible',
        'perdida_total': 'Pérdida Total'
    };
    
    if (!confirm(`¿Estás seguro de cambiar el estado a "${estadosTexto[nuevoEstado] || nuevoEstado}"?`)) return;
    
    try {
        const response = await fetch('Public/api/cambiar_estado.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_siniestro: id,
                estado: nuevoEstado
            })
        });
        
        const data = await response.json();
        
        if (data.ok) {
            alert('✅ Estado actualizado');
            await cargarSiniestros(); // Recargar lista
            verDetalle(id); // Recargar detalle
        } else {
            alert('❌ Error: ' + data.mensaje);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cambiar estado');
    }
}

function cerrarModal() {
    document.getElementById('detalleModal').classList.remove('active');
}

// Cerrar modal al hacer clic fuera
document.addEventListener('click', function(event) {
    const modal = document.getElementById('detalleModal');
    if (event.target === modal) {
        cerrarModal();
    }
});

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
function subirEvidencia(id) { alert('Subir evidencia para siniestro ' + id); }

// ========== REDIRECCIÓN AL PERFIL ==========
function irPerfil() {
    console.log("🔄 Redirigiendo al perfil...");
    window.location.href = 'Public/views/Perfil.php';
}