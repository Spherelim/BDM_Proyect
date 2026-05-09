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

// Cargar notificaciones cada 30 segundos
cargarNotificaciones();
setInterval(cargarNotificaciones, 30000);

async function cargarNotificaciones() {
    try {
        const response = await fetch('Public/api/notificaciones.php');
        const data = await response.json();
        
        if (data.ok && data.total > 0) {
            const badge = document.querySelector('.notifications');
            if (badge) {
                badge.setAttribute('data-count', data.total);
                badge.style.cssText = `
                    position: relative;
                    cursor: pointer;
                `;
                // Actualizar el pseudo-elemento con CSS
                badge.querySelector('span').textContent = '🔔' + (data.total > 0 ? '🔴' : '');
            }
        }
    } catch (error) {
        console.error('Error cargando notificaciones:', error);
    }
}

// Mostrar notificaciones al hacer clic
function showNotifications() {
    fetch('Public/api/notificaciones.php')
        .then(r => r.json())
        .then(data => {
            if (data.ok && data.notificaciones.length > 0) {
                let mensaje = '📢 Notificaciones:\n\n';
                data.notificaciones.forEach(n => {
                    mensaje += `${n.mensaje}\n`;
                });
                alert(mensaje);
            } else {
                alert('📢 No hay notificaciones nuevas');
            }
        });
}

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
    if (!siniestro) { alert('Siniestro no encontrado'); return; }
    
    window.siniestroActualId = id;
    
    const modal = document.getElementById('detalleModal');
    const content = document.getElementById('detalleContent');
    const detalleId = document.getElementById('detalleId');
    
    detalleId.textContent = '#' + (siniestro.folio || siniestro.id);
    content.innerHTML = '<div style="text-align:center; padding:3rem;">⏳ Cargando detalles...</div>';
    modal.classList.add('active');
    
    const [comentariosData, archivosData, unidadesData] = await Promise.all([
        fetch(`Public/api/comentarios.php?id=${id}`).then(r => r.json()),
        fetch(`Public/api/archivos_siniestro.php?id=${id}`).then(r => r.json()),
        fetch(`Public/api/unidades_terceras.php?id_siniestro=${id}`).then(r => r.json())
    ]);
    
    const comentarios = comentariosData.ok ? comentariosData.comentarios : [];
    const archivos = archivosData.ok ? archivosData.archivos : [];
    const unidades = unidadesData.ok ? unidadesData.unidades : [];
    
    const rol = currentUser.rol;
    const esSupervisor = rol === 'supervisor';
    const esAjustador = rol === 'ajustador';
    const esAsegurado = rol === 'asegurado';
    
    content.innerHTML = `
        <div style="display: grid; gap: 1.5rem;">
            <!-- Info General -->
            <div class="detail-section" style="background: #f8f9fa;">
                <h3>📋 Información General</h3>
                <div class="info-grid">
                    <div class="info-item"><span class="info-label">Folio</span><span class="info-value">${siniestro.folio || 'N/A'}</span></div>
                    <div class="info-item"><span class="info-label">Estado</span><span class="info-value"><span class="siniestro-estado ${getEstadoClass(siniestro.estado)}">${siniestro.estado || 'Pendiente'}</span></span></div>
                    <div class="info-item"><span class="info-label">Fecha</span><span class="info-value">📅 ${formatFecha(siniestro.fecha_siniestro)}</span></div>
                    <div class="info-item"><span class="info-label">Ubicación</span><span class="info-value">📍 ${siniestro.ubicacion || 'N/A'}</span></div>
                    <div class="info-item full-width"><span class="info-label">Descripción</span><span class="info-value">${siniestro.descripcion || 'Sin descripción'}</span></div>
                </div>
            </div>
            
            <!-- Cliente y Vehículo -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                <div class="detail-section" style="background: #e8f0fe;">
                    <h3>👤 Cliente</h3>
                    <p><strong>Nombre:</strong> ${siniestro.cliente_nombre || 'N/A'}</p>
                    ${siniestro.cliente_alias ? `<p><strong>Alias:</strong> ${siniestro.cliente_alias}</p>` : ''}
                </div>
                <div class="detail-section" style="background: #fff3e0;">
                    <h3>🚗 Vehículo</h3>
                    <p><strong>Vehículo:</strong> ${siniestro.vehiculo || 'N/A'}</p>
                    <p><strong>Placas:</strong> ${siniestro.placas || 'N/A'}</p>
                    <p><strong>Compañía:</strong> ${siniestro.compania || 'N/A'}</p>
                </div>
            </div>
            
            <!-- Unidades Terceras -->
            ${unidades.length > 0 ? `
            <div class="detail-section" style="background: #fff8e1;">
                <h3>🚙 Unidades Involucradas</h3>
                ${unidades.map(u => `
                    <div style="background: white; padding: 1rem; border-radius: 12px; margin-bottom: 0.5rem;">
                        <p><strong>Vehículo:</strong> ${u.Marca_Modelo || 'N/A'}</p>
                        <p><strong>Placas:</strong> ${u.Placa || 'N/A'}</p>
                        <p><strong>Color:</strong> ${u.Color || 'N/A'}</p>
                        <p><strong>Daños:</strong> ${u.Danios_Aparentes || 'No especificados'}</p>
                    </div>
                `).join('')}
            </div>` : ''}
            
            <!-- Archivos Multimedia -->
            <div class="detail-section" style="background: #e8f5e8;">
                <h3>📸 Evidencia Multimedia</h3>
                ${archivos.length > 0 ? `
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;">
                    ${archivos.map(a => a.tipo === 'imagen' ? `
                        <div style="cursor: pointer; border-radius: 12px; overflow: hidden; border: 2px solid #e0e0e0;" onclick="window.open('${a.ruta}', '_blank')">
                            <img src="${a.ruta}" style="width: 100%; height: 150px; object-fit: cover;" alt="${a.nombre_original}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📷</text></svg>'">
                            <div style="padding: 0.5rem; font-size: 0.75rem; text-align: center;">${a.nombre_original || 'Imagen'}</div>
                        </div>
                    ` : `
                        <div style="cursor: pointer; border-radius: 12px; overflow: hidden; border: 2px solid #e0e0e0; display: flex; align-items: center; justify-content: center; height: 150px; background: #1a1a2e;" onclick="window.open('${a.ruta}', '_blank')">
                            <div style="text-align: center; color: white;">
                                <div style="font-size: 3rem;">🎥</div>
                                <div style="font-size: 0.75rem;">${a.nombre_original || 'Video'}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                ` : '<p style="color:#888;">No hay archivos multimedia</p>'}
                
                ${esAjustador ? `
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e0e0e0;">
                    <input type="file" id="nuevosArchivos" multiple accept="image/*,video/*" style="display:none;" onchange="subirArchivosSiniestro(${id})">
                    <button onclick="document.getElementById('nuevosArchivos').click()" style="padding: 0.5rem 1.5rem; background: #2196f3; color: white; border: none; border-radius: 10px; cursor: pointer;">📁 Agregar archivos</button>
                </div>` : ''}
            </div>
            
            <!-- Comentarios -->
            <div class="detail-section" style="background: white; border: 2px solid #e0e0e0;">
                <h3>💬 Comentarios y Seguimiento</h3>
                <div id="comentariosContainer" style="max-height: 300px; overflow-y: auto; margin-bottom: 1rem;">
                    ${generarComentariosHtml(comentarios)}
                </div>
                <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                    <textarea id="nuevoComentario" style="flex:1; padding: 0.8rem; border: 2px solid #e0e0e0; border-radius: 12px; resize: vertical; min-height: 60px;" rows="2" placeholder="Escribe tu comentario..."></textarea>
                    <button onclick="agregarComentario()" style="padding: 0 1.5rem; background: #003366; color: white; border: none; border-radius: 12px; cursor: pointer;">💬 Enviar</button>
                </div>
            </div>
            
            <!-- Acciones de Supervisor -->
            ${esSupervisor ? `
            <div class="detail-section" style="background: #e8f0fe;">
                <h3>⚙️ Cambiar Estado del Siniestro</h3>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button onclick="cambiarEstado('Aceptado')" style="background:#4caf50;color:white;border:none;padding:0.6rem 1rem;border-radius:8px;cursor:pointer;">✓ Aceptado</button>
                    <button onclick="cambiarEstado('Aceptado con pago Deducible')" style="background:#2196f3;color:white;border:none;padding:0.6rem 1rem;border-radius:8px;cursor:pointer;">💵 Con Deducible</button>
                    <button onclick="cambiarEstado('Aceptado sin pago Deducible')" style="background:#00bcd4;color:white;border:none;padding:0.6rem 1rem;border-radius:8px;cursor:pointer;">✅ Sin Deducible</button>
                    <button onclick="cambiarEstado('Aplica pago para reparación')" style="background:#ff9800;color:white;border:none;padding:0.6rem 1rem;border-radius:8px;cursor:pointer;">🔧 Reparación</button>
                    <button onclick="cambiarEstado('Rechazado')" style="background:#f44336;color:white;border:none;padding:0.6rem 1rem;border-radius:8px;cursor:pointer;">✗ Rechazado</button>
                    <button onclick="cambiarEstado('Pérdida Total')" style="background:#9c27b0;color:white;border:none;padding:0.6rem 1rem;border-radius:8px;cursor:pointer;">💀 Pérdida Total</button>
                </div>
            </div>` : ''}
        </div>
    `;
}

async function subirArchivosSiniestro(idSiniestro) {
    const files = document.getElementById('nuevosArchivos').files;
    if (!files.length) return;
    
    const formData = new FormData();
    formData.append('id_siniestro', idSiniestro);
    for (let file of files) {
        formData.append('archivos[]', file);
    }
    
    try {
        const response = await fetch('Public/api/subir_archivos.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data.ok) {
            alert('✅ Archivos subidos');
            verDetalle(idSiniestro);
        } else {
            alert('Error: ' + data.mensaje);
        }
    } catch (error) {
        alert('Error al subir archivos');
    }
}

function generarComentariosHtml(comentarios) {
    if (!comentarios.length) {
        return '<div style="text-align:center; padding:2rem; color:#888;">💬 No hay comentarios aún. ¡Sé el primero en comentar!</div>';
    }
    
    const userId = currentUser.id || currentUser.usuario?.id;
    
    return comentarios.map(c => {
        const esAutor = c.id_usuario == userId;
        const colorBorde = c.rol === 'supervisor' ? '#9c27b0' : c.rol === 'ajustador' ? '#2196f3' : '#ff9800';
        
        return `
            <div style="margin-bottom: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 12px; border-left: 4px solid ${colorBorde};" id="comentario-${c.ID_comentario}">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; flex-wrap: wrap;">
                    <div>
                        <strong style="color: #003366;">${c.Alias || c.Nombre || 'Usuario'}</strong>
                        <span style="font-size: 0.75rem; color: #888; margin-left: 8px;">(${c.rol})</span>
                    </div>
                    <div style="font-size: 0.75rem; color: #888;">${formatFecha(c.Fecha_Comentario)}</div>
                </div>
                <p style="margin: 0.5rem 0; color: #333;" id="texto-${c.ID_comentario}">${escapeHtml(c.comentario)}</p>
                ${esAutor ? `
                <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                    <button onclick="editarComentario(${c.ID_comentario})" style="font-size: 0.75rem; padding: 0.3rem 0.8rem; background: #e0e0e0; border: none; border-radius: 6px; cursor: pointer;">✏️ Editar</button>
                    <button onclick="eliminarComentario(${c.ID_comentario})" style="font-size: 0.75rem; padding: 0.3rem 0.8rem; background: #ffebee; color: #c62828; border: none; border-radius: 6px; cursor: pointer;">🗑️ Eliminar</button>
                </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function agregarComentario() {
    const textarea = document.getElementById('nuevoComentario');
    const comentario = textarea.value.trim();
    const id = window.siniestroActualId;
    
    if (!comentario) { alert('Escribe un comentario'); return; }
    
    try {
        const response = await fetch('Public/api/comentarios.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_siniestro: id, comentario })
        });
        const data = await response.json();
        if (data.ok) {
            textarea.value = '';
            verDetalle(id);
        } else {
            alert('Error: ' + data.mensaje);
        }
    } catch (error) {
        alert('Error al enviar comentario');
    }
}

async function editarComentario(idComentario) {
    const nuevoTexto = prompt('Editar comentario:', document.getElementById('texto-' + idComentario)?.textContent || '');
    if (!nuevoTexto || !nuevoTexto.trim()) return;
    
    try {
        const response = await fetch('Public/api/comentarios.php?action=edit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_comentario: idComentario, comentario: nuevoTexto.trim() })
        });
        const data = await response.json();
        if (data.ok) {
            verDetalle(window.siniestroActualId);
        } else {
            alert('Error: ' + data.mensaje);
        }
    } catch (error) {
        alert('Error al editar');
    }
}

async function eliminarComentario(idComentario) {
    if (!confirm('¿Eliminar este comentario?')) return;
    
    try {
        const response = await fetch(`Public/api/comentarios.php?action=delete&id=${idComentario}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        if (data.ok) {
            verDetalle(window.siniestroActualId);
        } else {
            alert('Error: ' + data.mensaje);
        }
    } catch (error) {
        alert('Error al eliminar');
    }
}

async function cambiarEstado(nuevoEstado) {
    const id = window.siniestroActualId;
    if (!confirm('¿Cambiar estado del siniestro?')) return;
    
    try {
        const response = await fetch('Public/api/cambiar_estado.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_siniestro: id, estado: nuevoEstado })
        });
        const data = await response.json();
        if (data.ok) {
            alert('✅ Estado actualizado');
            await cargarSiniestros();
            verDetalle(id);
        } else {
            alert('Error: ' + data.mensaje);
        }
    } catch (error) {
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
    if (!estado || estado === 'null' || estado === null) return 'Pendiente';
    const texts = {
        'Rechazado': 'Rechazado',
        'Aceptado': 'Aceptado',
        'Aceptado con pago Deducible': 'Aceptado con Deducible',
        'Aceptado sin pago Deducible': 'Aceptado sin Deducible',
        'Aplica pago para reparación': 'En Reparación',
        'Pérdida Total': 'Pérdida Total'
    };
    return texts[estado] || estado;
}

function getEstadoClass(estado) {
    if (!estado || estado === 'null' || estado === null) return 'estado-pendiente';
    const classes = {
        'Rechazado': 'estado-rechazado',
        'Aceptado': 'estado-aceptado',
        'Aceptado con pago Deducible': 'estado-deducible',
        'Aceptado sin pago Deducible': 'estado-aceptado',
        'Aplica pago para reparación': 'estado-pendiente',
        'Pérdida Total': 'estado-perdida-total'
    };
    return classes[estado] || 'estado-pendiente';
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