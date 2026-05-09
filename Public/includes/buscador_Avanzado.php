<div class="search-section">
    <h3>
        <span>🔍</span>
        Búsqueda de Siniestros
    </h3>
    <div class="search-grid">
                
        <div class="search-field">
            <label>Rango de fechas</label>
            <div class="date-range">
                <input type="date" id="fechaInicio" placeholder="Fecha inicial">
                <input type="date" id="fechaFin" placeholder="Fecha final">
            </div>
        </div>

        <div class="search-field">
            <label>Compañía de seguros</label>
            <select id="companiaSeguros">
                <option value="">Todas las compañías</option>
                <option value="seguros mx">Seguros MX</option>
                <option value="aseguradora total">Aseguradora Total</option>
                <option value="proteccion aseguradora">Protección Aseguradora</option>
                <option value="seguros nacional">Seguros Nacional</option>
            </select>
        </div>

        <div class="search-field">
            <label>Número de póliza</label>
            <input type="text" id="numPoliza" placeholder="Ingrese número de póliza">
        </div>

        <div class="search-field">
            <label>Vehículo (placas/serie)</label>
            <input type="text" id="vehiculo" placeholder="Placas o número de serie">
        </div>

        <div class="search-field">
            <label>Cliente</label>
            <div style="position: relative;">
                <input type="text" id="cliente" placeholder="Nombre del cliente" autocomplete="off" oninput="buscarClienteEnDashboard()">
                <div id="sugerenciasClienteDashboard" style="display: none; position: absolute; top: 100%; left: 0; right: 0; background: white; border: 2px solid #e0e0e0; border-radius: 12px; max-height: 200px; overflow-y: auto; z-index: 50; box-shadow: 0 5px 15px rgba(0,0,0,0.1);"></div>
            </div>
        </div>

        <div class="search-field">
            <label>Estado del siniestro</label>
            <select id="estadoSiniestro">
                <option value="">Todos los estados</option>
                <option value="rechazado">Rechazado</option>
                <option value="aceptado">Aceptado</option>
                <option value="aceptado con deducible">Aceptado con pago de deducible</option>
                <option value="aceptado sin deducible">Aceptado sin pago de deducible</option>
                <option value="reparacion">Aplica pago para reparación</option>
                <option value="perdida total">Pérdida total</option>
            </select>
        </div>

        <div class="search-buttons">
            <button class="btn btn-secondary" onclick="limpiarBusqueda()">
                <span>🔄</span> Limpiar
            </button>
            <button class="btn btn-primary" onclick="buscarSiniestros()">
                <span>🔍</span> Buscar Siniestros
            </button>
        </div>
</div>