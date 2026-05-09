// ========== NOTIFICACIONES ==========

// Detectar ruta base según la página
function getApiUrl(endpoint) {
    if (window.location.href.includes('/views/')) {
        return '../api/' + endpoint;
    }
    return 'Public/api/' + endpoint;
}

async function showNotifications() {
    const modal = document.getElementById('notificacionesModal');
    if (modal) {
        modal.classList.add('active');
        await cargarNotificacionesModal();
    }
}

async function cargarNotificacionesModal() {
    const container = document.getElementById('listaNotificaciones');
    const totalSpan = document.getElementById('totalNotificaciones');
    if (!container || !totalSpan) return;
    
    try {
        const response = await fetch(getApiUrl('notificaciones.php'));
        const data = await response.json();
        
        totalSpan.textContent = `${data.total} notificaciones`;
        
        if (!data.notificaciones || data.notificaciones.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:2rem; color:#888;">✅ No hay notificaciones nuevas</div>';
            return;
        }
        
        const iconos = { 'siniestro_nuevo': '📋', 'cambio_estado': '⚙️', 'comentario': '💬' };
        
        container.innerHTML = data.notificaciones.map(n => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 1rem; margin-bottom: 0.5rem; background: #f8f9fa; border-radius: 12px; border-left: 4px solid #003366;">
                <div style="flex: 1;">
                    <div style="font-size: 1.2rem;">${iconos[n.tipo] || '📌'}</div>
                    <div style="font-weight: 500;">${n.mensaje}</div>
                    <div style="font-size: 0.75rem; color: #888;">${formatFecha(n.Fecha_Creacion)}</div>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button onclick="marcarLeida(${n.ID_Notificacion})" style="background: #4caf50; color: white; border: none; padding: 0.3rem 0.8rem; border-radius: 6px; cursor: pointer;">✓</button>
                    <button onclick="eliminarNotificacion(${n.ID_Notificacion})" style="background: #f44336; color: white; border: none; padding: 0.3rem 0.8rem; border-radius: 6px; cursor: pointer;">✕</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        container.innerHTML = '<div style="text-align:center; padding:2rem; color:#c62828;">❌ Error al cargar</div>';
    }
}

async function marcarLeida(id) {
    await fetch(getApiUrl('notificaciones.php'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'marcar_leida', id })
    });
    cargarNotificacionesModal();
    actualizarBadge();
}

async function marcarTodasLeidas() {
    await fetch(getApiUrl('notificaciones.php'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'marcar_todas' })
    });
    cargarNotificacionesModal();
    actualizarBadge();
}

async function eliminarNotificacion(id) {
    await fetch(getApiUrl('notificaciones.php'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'eliminar', id })
    });
    cargarNotificacionesModal();
    actualizarBadge();
}

async function actualizarBadge() {
    try {
        const response = await fetch(getApiUrl('notificaciones.php'));
        const data = await response.json();
        const badge = document.querySelector('.notifications');
        if (badge) {
            badge.setAttribute('data-count', data.total);
        }
    } catch (e) {}
}

async function marcarLeida(id) {
    await fetch('Public/api/notificaciones.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'marcar_leida', id })
    });
    cargarNotificacionesModal();
    actualizarBadge();
}

async function marcarTodasLeidas() {
    await fetch('Public/api/notificaciones.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'marcar_todas' })
    });
    cargarNotificacionesModal();
    actualizarBadge();
}

async function eliminarNotificacion(id) {
    await fetch('Public/api/notificaciones.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'eliminar', id })
    });
    cargarNotificacionesModal();
    actualizarBadge();
}

function cerrarModalNotificaciones() {
    const modal = document.getElementById('notificacionesModal');
    if (modal) modal.classList.remove('active');
}

async function actualizarBadge() {
    try {
        const response = await fetch('Public/api/notificaciones.php');
        const data = await response.json();
        const badge = document.querySelector('.notifications');
        if (badge) {
            badge.setAttribute('data-count', data.total);
        }
    } catch (e) {}
}

setInterval(actualizarBadge, 30000);