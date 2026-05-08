<div class="form-section" id="paso2" style="display: none;">
    <h3>
        <i>🚗</i>
        Paso 2: Datos del Vehículo y Seguro
    </h3>

    <div class="form-grid">
        <div class="form-group">
            <label>Compañía de Seguros <span class="required">*</span></label>
            <select id="companiaSeguros">
                <option value="">Cargando compañías...</option>
            </select>
        </div>

        <div class="form-group">
            <label>Número de Póliza <span class="required">*</span></label>
            <input type="text" id="numPoliza" placeholder="Ej: POL-2024-12345">
        </div>

        <div class="form-group">
            <label>Marca <span class="required">*</span></label>
            <input type="text" id="marca" placeholder="Ej: Toyota">
        </div>

        <div class="form-group">
            <label>Modelo <span class="required">*</span></label>
            <input type="text" id="modelo" placeholder="Ej: Corolla">
        </div>

        <div class="form-group">
            <label>Año <span class="required">*</span></label>
            <input type="number" id="anio" placeholder="Ej: 2024" min="1900" max="2099" step="1">
        </div>

        <div class="form-group">
            <label>Placas <span class="required">*</span></label>
            <input type="text" id="placas" placeholder="Ej: ABC-123">
        </div>

        <div class="form-group">
            <label>Número de Serie (VIN) <span class="required">*</span></label>
            <input type="text" id="serie" placeholder="Ej: 3N1CE2CK8ML123456" maxlength="17">
            <div class="field-hint">17 caracteres alfanuméricos</div>
        </div>

        <div class="form-group">
            <label>Color</label>
            <input type="text" id="color" placeholder="Ej: Rojo">
        </div>

        <div class="form-group">
            <label>Tipo de Combustible</label>
            <select id="combustible">
                <option value="Gasolina">Gasolina</option>
                <option value="Diesel">Diesel</option>
                <option value="Híbrido">Híbrido</option>
                <option value="Eléctrico">Eléctrico</option>
            </select>
        </div>
    </div>
</div>