<div class="modal-edit" id="editProfileModal">
    <div class="modal-edit-content">
        <div class="modal-edit-header">
            <h2>
                <span>✏️</span> Editar Perfil
            </h2>
            <button class="btn-close-modal" onclick="cerrarModalEditProfile()">&times;</button>
        </div>
        
        <form id="editProfileForm" onsubmit="guardarPerfil(event)" enctype="multipart/form-data">
            <!-- FOTO DE PERFIL -->
            <div class="form-group" style="text-align: center;">
                <label>Foto de perfil</label>
                <div class="foto-preview-container" style="margin-bottom: 10px;">
                    <img id="fotoPreview" src="" alt="Foto de perfil" 
                        style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid #003366; display: none; margin: 0 auto;">
                    <div id="fotoPlaceholder" style="width: 100px; height: 100px; border-radius: 50%; background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 3rem; color: #003366; margin: 0 auto;">
                        👤
                    </div>
                </div>
                <div style="display: flex; gap: 10px; justify-content: center; align-items: center;">
                    <label for="editFoto" style="cursor: pointer; background: #003366; color: white; padding: 8px 16px; border-radius: 8px; font-size: 0.85rem;">
                        📁 Seleccionar foto
                    </label>
                    <input type="file" id="editFoto" accept="image/*" onchange="previewFoto(event)" style="display: none;">
                    <button type="button" onclick="quitarFotoActual()" id="btnEliminarFoto" style="background: #ff4444; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 0.85rem; display: none;">
                        🗑️ Quitar foto
                    </button>
                </div>
            </div>

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