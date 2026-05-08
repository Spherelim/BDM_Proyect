<div class="modal-edit" id="editProfileModal">
    <div class="modal-edit-content">
        <div class="modal-edit-header">
            <h2>
                <span>✏️</span> Editar Perfil
            </h2>
            <button class="btn-close-modal" onclick="cerrarModalEditProfile()">&times;</button>
        </div>
        
        <form id="editProfileForm" onsubmit="guardarPerfil(event)">
            <div class="form-group">
                <label for="editNombre">Nombre *</label>
                <input type="text" id="editNombre" placeholder="Tu nombre" required>
            </div>
            
            <div class="form-group">
                <label for="editApellidos">Apellidos *</label>
                <input type="text" id="editApellidos" placeholder="Tus apellidos" required>
            </div>
            
            <div class="form-group">
                <label for="editFechaNac">Fecha de Nacimiento *</label>
                <input type="date" id="editFechaNac" required>
            </div>
            
            <div class="form-group">
                <label for="editGenero">Género *</label>
                <select id="editGenero" required>
                    <option value="1">Masculino</option>
                    <option value="0">Femenino</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="editEmail">Correo electrónico *</label>
                <input type="email" id="editEmail" placeholder="tu@email.com" required>
            </div>
            
            <div class="form-group">
                <label for="editAlias">Alias (opcional)</label>
                <input type="text" id="editAlias" placeholder="@usuario">
            </div>
            
            <div id="editProfileMessage" class="form-message"></div>
            
            <button type="submit" class="btn-save-profile" id="btnSaveProfile">
                <span>💾</span> Guardar Cambios
            </button>
        </form>
    </div>
</div>