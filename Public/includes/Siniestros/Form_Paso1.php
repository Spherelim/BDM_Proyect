<div class="form-section" id="paso1">
    <h3>
        <i>📋</i>
        Paso 1: Datos del Cliente
    </h3>
    
    <div class="form-grid">
        <div class="form-group">
            <label>Buscar cliente <span class="required">*</span></label>
            <input type="text" id="nombreCliente" placeholder="Nombre completo o correo del cliente" oninput="buscarPersona()" autocomplete="off">
            <small style="color: #888;">Escribe el nombre o correo para buscar coincidencias</small>
            <!-- Lista de sugerencias -->
            <div id="sugerenciasContainer" style="display: none; background: white; border: 2px solid #e0e0e0; border-radius: 12px; margin-top: 5px; max-height: 250px; overflow-y: auto; box-shadow: 0 5px 15px rgba(0,0,0,0.1);"></div>
        </div>

        <div class="form-group">
            <label>RFC <span class="required">*</span></label>
            <input type="text" id="rfc" placeholder="XXXX000000XXX">
        </div>

        <div class="form-group">
            <label>Teléfono <span class="required">*</span></label>
            <input type="tel" id="telefono" placeholder="55 1234 5678">
        </div>

        <div class="form-group">
            <label>Email <span class="required">*</span></label>
            <input type="email" id="email" placeholder="cliente@email.com">
        </div>

        <div class="form-group full-width">
            <label>Dirección <span class="required">*</span></label>
            <input type="text" id="direccion" placeholder="Calle, número, colonia, ciudad, estado">
        </div>
    </div>
</div>