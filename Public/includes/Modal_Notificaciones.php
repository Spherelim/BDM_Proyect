<!-- MODAL DE NOTIFICACIONES -->
<div class="modal" id="notificacionesModal">
    <div class="modal-content" style="max-width: 500px;">
        <div class="modal-header">
            <h2>🔔 Notificaciones</h2>
            <span class="close-modal" onclick="cerrarModalNotificaciones()">&times;</span>
        </div>
        <div class="modal-body">
            <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                <span id="totalNotificaciones" style="color: #888;"></span>
                <button onclick="marcarTodasLeidas()" style="background: none; border: none; color: #003366; cursor: pointer; font-size: 0.9rem;">✓ Marcar todas leídas</button>
            </div>
            <div id="listaNotificaciones" style="max-height: 400px; overflow-y: auto;">
                <div style="text-align:center; padding:2rem; color:#888;">⏳ Cargando...</div>
            </div>
        </div>
    </div>
</div>