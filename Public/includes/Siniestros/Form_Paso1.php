<div class="form-section" id="paso1">
                <h3>
                    <i>📋</i>
                    Paso 1: Datos Básicos del Cliente
                </h3>
                
                <div class="form-grid">
                    <div class="form-group">
                        <label>Tipo de Cliente <span class="required">*</span></label>
                        <select id="tipoCliente" onchange="toggleClienteFields()">
                            <option value="persona">Persona Física</option>
                            <option value="moral">Persona Moral</option>
                        </select>
                    </div>

                    <div class="form-group" id="campoNombre">
                        <label>Nombre completo <span class="required">*</span></label>
                        <input type="text" id="nombreCliente" placeholder="Ej: Juan Pérez García">
                    </div>

                    <div class="form-group" id="campoRazonSocial" style="display: none;">
                        <label>Razón Social <span class="required">*</span></label>
                        <input type="text" id="razonSocial" placeholder="Ej: Empresa S.A. de C.V.">
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