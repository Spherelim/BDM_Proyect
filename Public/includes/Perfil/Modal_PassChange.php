<div class="modal" id="passwordModal">
    <div class="modal-content" style="max-width: 450px;">
        <div class="modal-icon">🔐</div>
        <h3>Cambiar Contraseña</h3>
        <p>Ingresa tu contraseña actual y la nueva contraseña.</p>
        
        <form id="formCambiarPassword" style="text-align: left; margin-top: 20px;">
            <div class="form-group" style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Contraseña actual <span style="color: red;">*</span></label>
                <input type="password" id="passActual" placeholder="Ingresa tu contraseña actual" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px;">
            </div>
            
            <div class="form-group" style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Nueva contraseña <span style="color: red;">*</span></label>
                <input type="password" id="passNueva" placeholder="Mínimo 8 caracteres" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px;">
                <small style="color: #666;">Debe tener al menos 8 caracteres</small>
            </div>
            
            <div class="form-group" style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Confirmar nueva contraseña <span style="color: red;">*</span></label>
                <input type="password" id="passConfirmar" placeholder="Repite la nueva contraseña" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px;">
            </div>
            
            <div id="passMensaje" style="display: none; padding: 10px; border-radius: 8px; margin-bottom: 15px;"></div>
            
            <div class="modal-actions" style="display: flex; gap: 10px; justify-content: center;">
                <button type="button" class="btn btn-primary" onclick="cambiarContrasenaReal()" style="background: #003366; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
                    Cambiar Contraseña
                </button>
                <button type="button" class="btn btn-secondary" onclick="cerrarModal('passwordModal')" style="background: #f0f0f0; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
                    Cancelar
                </button>
            </div>
        </form>
    </div>
</div>