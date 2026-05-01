<div class="form-section" id="paso4" style="display: none;">
                <h3>
                    <i>📸</i>
                    Paso 4: Evidencia Multimedia
                </h3>

                <div class="file-upload-area" onclick="document.getElementById('fileInput').click()">
                    <i>📁</i>
                    <span>Haz clic para subir archivos o arrastra y suelta aquí</span>
                    <small>Formatos soportados: JPG, PNG, MP4, MOV (Max 50MB por archivo)</small>
                </div>
                <input type="file" id="fileInput" multiple accept="image/*,video/*" style="display: none;" onchange="handleFileSelect(event)">

                <div class="file-list" id="fileList"></div>

                <div style="margin-top: 1rem; padding: 1rem; background: #e8f0fe; border-radius: 12px;">
                    <h4 style="color: #003366; margin-bottom: 0.5rem;">Recomendaciones para la evidencia:</h4>
                    <ul style="margin-left: 1.5rem; color: #666;">
                        <li>Toma fotos de los daños desde diferentes ángulos</li>
                        <li>Incluye fotos de las placas del vehículo</li>
                        <li>Fotografía el lugar del siniestro</li>
                        <li>Si hay otros vehículos, captura sus placas y daños</li>
                        <li>Videos cortos del contexto general</li>
                    </ul>
                </div>
            </div>