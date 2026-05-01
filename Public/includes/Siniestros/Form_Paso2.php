<div class="form-section" id="paso2" style="display: none;">
                <h3>
                    <i>🚗</i>
                    Paso 2: Datos del Vehículo y Seguro
                </h3>

                <div class="form-grid">
                    <div class="form-group">
                        <label>Compañía de Seguros <span class="required">*</span></label>
                        <select id="companiaSeguros">
                            <option value="">Seleccionar compañía</option>
                            <option value="seguros mx">Seguros MX</option>
                            <option value="aseguradora total">Aseguradora Total</option>
                            <option value="proteccion aseguradora">Protección Aseguradora</option>
                            <option value="seguros nacional">Seguros Nacional</option>
                            <option value="otra">Otra (especificar)</option>
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
                        <select id="anio">
                            <option value="">Seleccionar año</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                            <option value="2022">2022</option>
                            <option value="2021">2021</option>
                            <option value="2020">2020</option>
                            <!-- Agregar más años según necesidad -->
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Placas <span class="required">*</span></label>
                        <input type="text" id="placas" placeholder="Ej: ABC-123">
                    </div>

                    <div class="form-group">
                        <label>Número de Serie (VIN) <span class="required">*</span></label>
                        <input type="text" id="serie" placeholder="Ej: 3N1CE2CK8ML123456">
                        <div class="field-hint">17 caracteres alfanuméricos</div>
                    </div>

                    <div class="form-group">
                        <label>Color</label>
                        <input type="text" id="color" placeholder="Ej: Rojo">
                    </div>

                    <div class="form-group">
                        <label>Tipo de Combustible</label>
                        <select id="combustible">
                            <option value="gasolina">Gasolina</option>
                            <option value="diesel">Diesel</option>
                            <option value="hibrido">Híbrido</option>
                            <option value="electrico">Eléctrico</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Kilometraje</label>
                        <input type="number" id="kilometraje" placeholder="Ej: 15000">
                    </div>
                </div>
            </div>