<div class="form-section" id="paso3" style="display: none;">
                <h3>
                    <i>📍</i>
                    Paso 3: Detalles del Siniestro
                </h3>

                <div class="form-grid">
                    <div class="form-group">
                        <label>Fecha y hora del siniestro <span class="required">*</span></label>
                        <input type="datetime-local" id="fechaSiniestro">
                    </div>

                    <div class="form-group">
                        <label>Tipo de siniestro <span class="required">*</span></label>
                        <select id="tipoSiniestro">
                            <option value="">Seleccionar tipo</option>
                            <option value="choque">Choque</option>
                            <option value="volcadura">Volcadura</option>
                            <option value="incendio">Incendio</option>
                            <option value="robo">Robo</option>
                            <option value="impacto">Impacto contra objeto fijo</option>
                            <option value="fenomeno">Fenómeno natural</option>
                            <option value="vandalismo">Vandalismo</option>
                            <option value="otro">Otro</option>
                        </select>
                    </div>

                    <div class="form-group full-width">
                        <label>Ubicación del siniestro <span class="required">*</span></label>
                        <div class="location-picker">
                            <input type="text" id="ubicacion" placeholder="Calle, número, colonia, ciudad, estado, referencias">
                            <button class="btn-location" onclick="obtenerUbicacionActual()">
                                <span>📍</span> Ubicación actual
                            </button>
                        </div>
                    </div>

                    <div class="form-group full-width">
                        <label>Descripción del asegurado <span class="required">*</span></label>
                        <textarea id="descripcion" placeholder="Describa detalladamente lo sucedido según el asegurado..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>¿Hubo otras unidades involucradas?</label>
                        <select id="otrasUnidades" onchange="toggleOtrasUnidades()">
                            <option value="no">No</option>
                            <option value="si">Sí</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>¿Hubo lesionados?</label>
                        <select id="lesionados">
                            <option value="no">No</option>
                            <option value="si">Sí</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>¿Hubo autoridades presentes?</label>
                        <select id="autoridades">
                            <option value="no">No</option>
                            <option value="policia">Policía</option>
                            <option value="transito">Tránsito</option>
                            <option value="fiscalia">Fiscalía</option>
                        </select>
                    </div>
                </div>

                <!-- Sección de otras unidades involucradas (dinámica) -->
                <div id="otrasUnidadesContainer" style="display: none;">
                    <h4 style="color: #003366; margin: 1rem 0;">Vehículos involucrados</h4>
                    <div id="vehiculosList"></div>
                    <button class="btn-add-vehicle" onclick="agregarVehiculo()">
                        <span>➕</span> Agregar otro vehículo
                    </button>
                </div>
            </div>