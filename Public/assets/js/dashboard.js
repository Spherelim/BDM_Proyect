
        // ========== CONFIGURACIÓN DE USUARIO ==========
        // Cambiar este objeto para simular diferentes tipos de usuario
        const currentUser = {
            type: 'supervisor', // 'supervisor', 'ajustador', 'asegurado'
            id: 'USR001',
            name: 'Juan Pérez',
            alias: 'Juan',
            email: 'juan.perez@autogest.com',
            avatar: 'JP'
        };

        // ========== DATOS DE EJEMPLO ==========
        const siniestros = [
            {
                id: 'SN-2024-0123',
                compania: 'Seguros MX',
                poliza: 'POL-2024-12345',
                cliente: {
                    nombre: 'María González',
                    telefono: '555-123-4567',
                    email: 'maria.g@email.com'
                },
                vehiculo: {
                    marca: 'Honda',
                    modelo: 'CR-V',
                    año: 2022,
                    placas: 'ABC-123',
                    serie: 'JHMEU27403K123456'
                },
                siniestro: {
                    fecha: '2024-03-15',
                    hora: '14:30',
                    ubicacion: 'Av. Reforma #123, Col. Centro',
                    otrasUnidades: 'Vehículo particular - Chevrolet Aveo',
                    descripcion: 'Impacto lateral en intersección. El otro vehículo no respetó el alto.',
                    fechaRegistro: '2024-03-15'
                },
                ajustador: {
                    id: 'USR001',
                    nombre: 'Juan Pérez'
                },
                multimedia: {
                    fotos: ['foto1.jpg', 'foto2.jpg', 'foto3.jpg'],
                    videos: ['video1.mp4']
                },
                estado: 'aceptado con deducible',
                flujo: [
                    { fecha: '2024-03-15', hora: '14:30', accion: 'Registro de siniestro', usuario: 'Juan Pérez', completado: true },
                    { fecha: '2024-03-16', hora: '10:15', accion: 'Revisión de documentación', usuario: 'Ana López', completado: true },
                    { fecha: '2024-03-17', hora: '11:30', accion: 'Aprobación con deducible', usuario: 'Ana López', completado: true },
                    { fecha: '2024-03-20', hora: '09:00', accion: 'Pago de deducible', usuario: 'Cliente', completado: false },
                    { fecha: '2024-03-25', hora: null, accion: 'Inicio de reparación', usuario: null, completado: false },
                    { fecha: '2024-04-05', hora: null, accion: 'Entrega de unidad', usuario: null, completado: false }
                ],
                deducible: {
                    monto: 8500,
                    pagado: false,
                    fechaPago: null
                },
                reparacion: {
                    taller: 'Taller Central',
                    fechaInicio: null,
                    fechaEstimada: '2024-04-05',
                    costo: 45000
                },
                comentarios: [
                    { autor: 'María González', fecha: '2024-03-16', texto: '¿Cuánto tiempo tomará la reparación?' },
                    { autor: 'Juan Pérez', fecha: '2024-03-16', texto: 'Estamos esperando la autorización del supervisor para iniciar.' }
                ]
            },
            {
                id: 'SN-2024-0089',
                compania: 'Aseguradora Total',
                poliza: 'POL-2024-67890',
                cliente: {
                    nombre: 'Carlos Rodríguez',
                    telefono: '555-987-6543',
                    email: 'carlos.r@email.com'
                },
                vehiculo: {
                    marca: 'Toyota',
                    modelo: 'Corolla',
                    año: 2023,
                    placas: 'XYZ-789',
                    serie: 'JTEHU27403K789012'
                },
                siniestro: {
                    fecha: '2024-03-10',
                    hora: '09:15',
                    ubicacion: 'Periférico Sur #456',
                    otrasUnidades: 'Ninguna',
                    descripcion: 'Choque por alcance contra barrera de contención.',
                    fechaRegistro: '2024-03-10'
                },
                ajustador: {
                    id: 'USR002',
                    nombre: 'Ana López'
                },
                multimedia: {
                    fotos: ['foto1.jpg', 'foto2.jpg'],
                    videos: []
                },
                estado: 'perdida total',
                flujo: [
                    { fecha: '2024-03-10', hora: '09:15', accion: 'Registro de siniestro', usuario: 'Ana López', completado: true },
                    { fecha: '2024-03-11', hora: '14:30', accion: 'Revisión de documentación', usuario: 'Ana López', completado: true },
                    { fecha: '2024-03-12', hora: '10:00', accion: 'Evaluación de daños', usuario: 'Supervisor', completado: true },
                    { fecha: '2024-03-13', hora: '11:30', accion: 'Determinación de pérdida total', usuario: 'Supervisor', completado: true },
                    { fecha: '2024-03-15', hora: null, accion: 'Cálculo de indemnización', usuario: null, completado: false },
                    { fecha: '2024-03-20', hora: null, accion: 'Pago de indemnización', usuario: null, completado: false }
                ],
                deducible: null,
                perdidaTotal: {
                    valorComercial: 285000,
                    indemnizacion: 256500,
                    fechaPago: null
                },
                comentarios: [
                    { autor: 'Carlos Rodríguez', fecha: '2024-03-13', texto: '¿Me pagarán el valor completo del auto?' },
                    { autor: 'Ana López', fecha: '2024-03-13', texto: 'Se está calculando la indemnización según la póliza.' }
                ]
            },
            {
                id: 'SN-2024-0056',
                compania: 'Seguros MX',
                poliza: 'POL-2024-34567',
                cliente: {
                    nombre: 'Ana Martínez',
                    telefono: '555-456-7890',
                    email: 'ana.m@email.com'
                },
                vehiculo: {
                    marca: 'Nissan',
                    modelo: 'Versa',
                    año: 2023,
                    placas: 'DEF-456',
                    serie: '3N1CE2CK8ML123456'
                },
                siniestro: {
                    fecha: '2024-03-05',
                    hora: '18:45',
                    ubicacion: 'Av. Universidad #789',
                    otrasUnidades: 'Motocicleta - Italika',
                    descripcion: 'Golpe lateral al dar vuelta. Motociclista lesionado.',
                    fechaRegistro: '2024-03-05'
                },
                ajustador: {
                    id: 'USR001',
                    nombre: 'Juan Pérez'
                },
                multimedia: {
                    fotos: ['foto1.jpg', 'foto2.jpg', 'foto3.jpg', 'foto4.jpg'],
                    videos: ['video1.mp4', 'video2.mp4']
                },
                estado: 'rechazado',
                flujo: [
                    { fecha: '2024-03-05', hora: '18:45', accion: 'Registro de siniestro', usuario: 'Juan Pérez', completado: true },
                    { fecha: '2024-03-06', hora: '09:30', accion: 'Revisión de documentación', usuario: 'Supervisor', completado: true },
                    { fecha: '2024-03-07', hora: '14:15', accion: 'Determinación de rechazo', usuario: 'Supervisor', completado: true },
                    { fecha: '2024-03-08', hora: '10:00', accion: 'Notificación a cliente', usuario: 'Juan Pérez', completado: true }
                ],
                rechazo: {
                    motivo: 'El siniestro no está cubierto por la póliza',
                    fecha: '2024-03-07',
                    observaciones: 'La póliza no cubre daños por competencias no autorizadas.'
                },
                comentarios: [
                    { autor: 'Ana Martínez', fecha: '2024-03-08', texto: '¿Por qué rechazaron mi siniestro?' },
                    { autor: 'Juan Pérez', fecha: '2024-03-08', texto: 'Le explicamos por teléfono, pero puede venir a oficinas para más detalles.' }
                ]
            },
            {
                id: 'SN-2024-0034',
                compania: 'Protección Aseguradora',
                poliza: 'POL-2024-90123',
                cliente: {
                    nombre: 'Roberto Sánchez',
                    telefono: '555-321-0987',
                    email: 'roberto.s@email.com'
                },
                vehiculo: {
                    marca: 'Mazda',
                    modelo: 'CX-5',
                    año: 2023,
                    placas: 'GHI-789',
                    serie: 'JMZCR6EJ7N1234567'
                },
                siniestro: {
                    fecha: '2024-03-01',
                    hora: '12:30',
                    ubicacion: 'Carretera México-Toluca km 45',
                    otrasUnidades: 'Ninguna',
                    descripcion: 'Salida de camino por pavimento mojado. Impacto contra poste.',
                    fechaRegistro: '2024-03-01'
                },
                ajustador: {
                    id: 'USR003',
                    nombre: 'Carlos Ruiz'
                },
                multimedia: {
                    fotos: ['foto1.jpg', 'foto2.jpg'],
                    videos: []
                },
                estado: 'aceptado sin deducible',
                flujo: [
                    { fecha: '2024-03-01', hora: '12:30', accion: 'Registro de siniestro', usuario: 'Carlos Ruiz', completado: true },
                    { fecha: '2024-03-02', hora: '11:00', accion: 'Revisión de documentación', usuario: 'Supervisor', completado: true },
                    { fecha: '2024-03-03', hora: '09:15', accion: 'Aprobación sin deducible', usuario: 'Supervisor', completado: true },
                    { fecha: '2024-03-04', hora: '10:30', accion: 'Asignación a taller', usuario: 'Carlos Ruiz', completado: true },
                    { fecha: '2024-03-05', hora: null, accion: 'Inicio de reparación', usuario: null, completado: false },
                    { fecha: '2024-03-20', hora: null, accion: 'Entrega de unidad', usuario: null, completado: false }
                ],
                deducible: {
                    monto: 0,
                    pagado: true,
                    fechaPago: '2024-03-03'
                },
                reparacion: {
                    taller: 'Carrocerías Unidas',
                    fechaInicio: null,
                    fechaEstimada: '2024-03-20',
                    costo: 38000
                },
                comentarios: [
                    { autor: 'Roberto Sánchez', fecha: '2024-03-04', texto: '¿A qué taller debo llevar mi auto?' },
                    { autor: 'Carlos Ruiz', fecha: '2024-03-04', texto: 'Ya asignamos taller, le llegará un mensaje con los detalles.' }
                ]
            }
        ];

        // ========== FUNCIONES DE INICIALIZACIÓN ==========
        function initDashboard() {
            // Actualizar información del usuario
            document.getElementById('userNameDisplay').textContent = currentUser.name;
            document.getElementById('userRoleDisplay').textContent = 
                currentUser.type === 'supervisor' ? 'Supervisor' :
                currentUser.type === 'ajustador' ? 'Ajustador' : 'Asegurado';
            document.getElementById('userAvatar').textContent = currentUser.avatar;

            // Mostrar banner de bienvenida
            mostrarBienvenida();

            // Cargar siniestros iniciales
            buscarSiniestros();
        }

        function mostrarBienvenida() {
            const banner = document.getElementById('welcomeBanner');
            let mensaje = '';
            
            if (currentUser.type === 'supervisor') {
                mensaje = `
                    <div class="welcome-content">
                        <div class="welcome-title">¡Bienvenido, Supervisor ${currentUser.alias}!</div>
                        <div class="welcome-text">Tienes 12 siniestros pendientes de revisión. Gestiona las autorizaciones y pagos desde aquí.</div>
                        <div class="quick-actions">
                            <div class="quick-action-btn" onclick="abrirModalNuevoSiniestro()">
                                <span>➕</span> Nuevo Siniestro
                            </div>
                            <div class="quick-action-btn" onclick="generarReporte()">
                                <span>📊</span> Generar Reporte
                            </div>
                        </div>
                    </div>
                `;
            } else if (currentUser.type === 'ajustador') {
                mensaje = `
                    <div class="welcome-content">
                        <div class="welcome-title">¡Bienvenido, Ajustador ${currentUser.alias}!</div>
                        <div class="welcome-text">Registra nuevos siniestros y da seguimiento a tus casos activos.</div>
                        <div class="quick-actions">
                            <div class="quick-action-btn" onclick="abrirModalNuevoSiniestro()">
                                <span>➕</span> Nuevo Siniestro
                            </div>
                            <div class="quick-action-btn" onclick="subirEvidencia()">
                                <span>📸</span> Subir Evidencia
                            </div>
                        </div>
                    </div>
                `;
            } else {
                mensaje = `
                    <div class="welcome-content">
                        <div class="welcome-title">¡Hola, ${currentUser.alias}!</div>
                        <div class="welcome-text">Da seguimiento a tus siniestros y mantente informado del progreso.</div>
                        <div class="quick-actions">
                            <div class="quick-action-btn" onclick="contactarSoporte()">
                                <span>💬</span> Contactar Soporte
                            </div>
                            <div class="quick-action-btn" onclick="verDocumentos()">
                                <span>📄</span> Mis Documentos
                            </div>
                        </div>
                    </div>
                `;
            }
            
            banner.innerHTML = mensaje;
        }

        // ========== FUNCIONES DE BÚSQUEDA ==========
        function buscarSiniestros() {
            // Obtener filtros
            const fechaInicio = document.getElementById('fechaInicio').value;
            const fechaFin = document.getElementById('fechaFin').value;
            const compania = document.getElementById('companiaSeguros').value;
            const poliza = document.getElementById('numPoliza').value;
            const vehiculo = document.getElementById('vehiculo').value;
            const cliente = document.getElementById('cliente').value;
            const estado = document.getElementById('estadoSiniestro').value;

            // Filtrar según el tipo de usuario
            let siniestrosFiltrados = siniestros.filter(s => {
                // Filtro por tipo de usuario
                if (currentUser.type === 'ajustador') {
                    return s.ajustador.id === currentUser.id;
                } else if (currentUser.type === 'asegurado') {
                    return s.cliente.nombre === currentUser.name; // Simplificado
                }
                return true; // Supervisor ve todos
            });

            // Aplicar filtros de búsqueda
            siniestrosFiltrados = siniestrosFiltrados.filter(s => {
                // Filtro por fechas
                if (fechaInicio && s.siniestro.fecha < fechaInicio) return false;
                if (fechaFin && s.siniestro.fecha > fechaFin) return false;
                
                // Filtro por compañía
                if (compania && s.compania.toLowerCase() !== compania.toLowerCase()) return false;
                
                // Filtro por póliza
                if (poliza && !s.poliza.includes(poliza)) return false;
                
                // Filtro por vehículo (placas o serie)
                if (vehiculo) {
                    const searchTerm = vehiculo.toLowerCase();
                    const placas = s.vehiculo.placas.toLowerCase();
                    const serie = s.vehiculo.serie.toLowerCase();
                    if (!placas.includes(searchTerm) && !serie.includes(searchTerm)) return false;
                }
                
                // Filtro por cliente
                if (cliente && !s.cliente.nombre.toLowerCase().includes(cliente.toLowerCase())) return false;
                
                // Filtro por estado
                if (estado && s.estado !== estado) return false;
                
                return true;
            });

            // Mostrar resultados
            mostrarResultados(siniestrosFiltrados);
        }

        function mostrarResultados(siniestros) {
            const container = document.getElementById('siniestrosContainer');
            const countElement = document.getElementById('resultCount');
            
            countElement.textContent = `Mostrando ${siniestros.length} siniestro${siniestros.length !== 1 ? 's' : ''}`;
            
            if (siniestros.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 3rem; color: #888;">
                        <div style="font-size: 4rem; margin-bottom: 1rem;">🔍</div>
                        <h3>No se encontraron siniestros</h3>
                        <p>Intenta con otros criterios de búsqueda</p>
                    </div>
                `;
                return;
            }

            let html = '';
            siniestros.forEach(s => {
                const estadoClass = getEstadoClass(s.estado);
                const estadoText = getEstadoText(s.estado);
                
                html += `
                    <div class="siniestro-item" onclick="verDetalle('${s.id}')">
                        <div class="siniestro-header">
                            <span class="siniestro-id">${s.id}</span>
                            <span class="siniestro-estado ${estadoClass}">${estadoText}</span>
                        </div>
                        
                        <div class="siniestro-details">
                            <div class="detail-item">
                                <span class="detail-label">Cliente</span>
                                <span class="detail-value">${s.cliente.nombre}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Vehículo</span>
                                <span class="detail-value">${s.vehiculo.marca} ${s.vehiculo.modelo} ${s.vehiculo.año}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Placas</span>
                                <span class="detail-value">${s.vehiculo.placas}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Compañía</span>
                                <span class="detail-value">${s.compania}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Póliza</span>
                                <span class="detail-value">${s.poliza}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Ajustador</span>
                                <span class="detail-value">${s.ajustador.nombre}</span>
                            </div>
                        </div>
                        
                        <div class="siniestro-footer">
                            <div class="fechas">
                                <span>📅 Siniestro: ${formatFecha(s.siniestro.fecha)}</span>
                                <span>📝 Registro: ${formatFecha(s.siniestro.fechaRegistro)}</span>
                            </div>
                            <button class="btn-ver-detalle" onclick="event.stopPropagation(); verDetalle('${s.id}')">
                                Ver detalle
                            </button>
                        </div>
                    </div>
                `;
            });
            
            container.innerHTML = html;
        }

        function limpiarBusqueda() {
            document.getElementById('fechaInicio').value = '';
            document.getElementById('fechaFin').value = '';
            document.getElementById('companiaSeguros').value = '';
            document.getElementById('numPoliza').value = '';
            document.getElementById('vehiculo').value = '';
            document.getElementById('cliente').value = '';
            document.getElementById('estadoSiniestro').value = '';
            buscarSiniestros();
        }

        // ========== FUNCIONES DE DETALLE ==========
        function verDetalle(id) {
            const siniestro = siniestros.find(s => s.id === id);
            if (!siniestro) return;

            document.getElementById('detalleId').textContent = siniestro.id;
            
            const contenido = generarDetalleHTML(siniestro);
            document.getElementById('detalleContent').innerHTML = contenido;
            
            document.getElementById('detalleModal').classList.add('active');
        }

        function generarDetalleHTML(s) {
            const estadoClass = getEstadoClass(s.estado);
            const estadoText = getEstadoText(s.estado);
            
            return `
                <!-- Estado actual -->
                <div class="detail-section">
                    <h3>
                        <span>📊</span>
                        Estado Actual
                    </h3>
                    <div style="display: flex; gap: 2rem; align-items: center; flex-wrap: wrap;">
                        <span class="siniestro-estado ${estadoClass}" style="font-size: 1.1rem; padding: 0.6rem 1.5rem;">${estadoText}</span>
                        ${s.estado === 'aceptado con deducible' ? `
                            <span style="color: #666;">Deducible: $${s.deducible.monto.toLocaleString()} MXN</span>
                            <span style="color: ${s.deducible.pagado ? '#4caf50' : '#ff9800'};">
                                ${s.deducible.pagado ? '✅ Pagado' : '⏳ Pendiente de pago'}
                            </span>
                        ` : ''}
                    </div>
                </div>

                <!-- Información del cliente -->
                <div class="detail-section">
                    <h3>
                        <span>👤</span>
                        Datos del Cliente
                    </h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">Nombre</span>
                            <span class="info-value">${s.cliente.nombre}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Teléfono</span>
                            <span class="info-value">${s.cliente.telefono}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Email</span>
                            <span class="info-value">${s.cliente.email}</span>
                        </div>
                    </div>
                </div>

                <!-- Información de la unidad -->
                <div class="detail-section">
                    <h3>
                        <span>🚗</span>
                        Datos de la Unidad
                    </h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">Marca/Modelo</span>
                            <span class="info-value">${s.vehiculo.marca} ${s.vehiculo.modelo} ${s.vehiculo.año}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Placas</span>
                            <span class="info-value">${s.vehiculo.placas}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Número de serie</span>
                            <span class="info-value">${s.vehiculo.serie}</span>
                        </div>
                    </div>
                </div>

                <!-- Información del seguro -->
                <div class="detail-section">
                    <h3>
                        <span>📄</span>
                        Datos del Seguro
                    </h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">Compañía</span>
                            <span class="info-value">${s.compania}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Número de póliza</span>
                            <span class="info-value">${s.poliza}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Ajustador asignado</span>
                            <span class="info-value">${s.ajustador.nombre}</span>
                        </div>
                    </div>
                </div>

                <!-- Detalles del siniestro -->
                <div class="detail-section">
                    <h3>
                        <span>📍</span>
                        Detalles del Siniestro
                    </h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">Fecha y hora</span>
                            <span class="info-value">${formatFecha(s.siniestro.fecha)} - ${s.siniestro.hora}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Ubicación</span>
                            <span class="info-value">${s.siniestro.ubicacion}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Otras unidades involucradas</span>
                            <span class="info-value">${s.siniestro.otrasUnidades}</span>
                        </div>
                        <div class="info-item full-width">
                            <span class="info-label">Descripción del asegurado</span>
                            <span class="info-value" style="background: #f0f0f0; padding: 1rem; border-radius: 10px;">
                                ${s.siniestro.descripcion}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Multimedia -->
                <div class="detail-section">
                    <h3>
                        <span>📸</span>
                        Evidencia Multimedia
                    </h3>
                    <div class="media-gallery">
                        ${s.multimedia.fotos.map((foto, index) => `
                            <div class="media-item" onclick="verMedia('${foto}')">
                                <div class="media-icon">📷</div>
                                <div class="media-name">Foto ${index + 1}</div>
                            </div>
                        `).join('')}
                        ${s.multimedia.videos.map((video, index) => `
                            <div class="media-item" onclick="verMedia('${video}')">
                                <div class="media-icon">🎥</div>
                                <div class="media-name">Video ${index + 1}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Línea de tiempo del flujo -->
                <div class="detail-section">
                    <h3>
                        <span>⏳</span>
                        Flujo del Siniestro
                    </h3>
                    <div class="timeline">
                        ${s.flujo.map(item => `
                            <div class="timeline-item ${item.completado ? 'completed' : 'pending'}">
                                <div class="timeline-date">
                                    ${item.fecha} ${item.hora ? item.hora : ''}
                                </div>
                                <div class="timeline-title">
                                    ${item.accion} ${item.usuario ? `- ${item.usuario}` : ''}
                                </div>
                                ${item.completado ? '<div class="timeline-desc">Completado</div>' : 
                                  '<div class="timeline-desc" style="color: #ff9800;">Pendiente</div>'}
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Fechas importantes -->
                ${s.estado.includes('perdida total') ? `
                    <div class="detail-section">
                        <h3>
                            <span>💰</span>
                            Información de Pérdida Total
                        </h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <span class="info-label">Valor comercial</span>
                                <span class="info-value">$${s.perdidaTotal.valorComercial.toLocaleString()} MXN</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Indemnización</span>
                                <span class="info-value">$${s.perdidaTotal.indemnizacion.toLocaleString()} MXN</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Fecha estimada de pago</span>
                                <span class="info-value">${s.perdidaTotal.fechaPago ? formatFecha(s.perdidaTotal.fechaPago) : 'Por determinar'}</span>
                            </div>
                        </div>
                    </div>
                ` : s.reparacion ? `
                    <div class="detail-section">
                        <h3>
                            <span>🔧</span>
                            Información de Reparación
                        </h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <span class="info-label">Taller asignado</span>
                                <span class="info-value">${s.reparacion.taller}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Costo de reparación</span>
                                <span class="info-value">$${s.reparacion.costo.toLocaleString()} MXN</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Fecha estimada de entrega</span>
                                <span class="info-value">${formatFecha(s.reparacion.fechaEstimada)}</span>
                            </div>
                        </div>
                    </div>
                ` : ''}

                ${s.rechazo ? `
                    <div class="detail-section">
                        <h3>
                            <span>❌</span>
                            Motivo de Rechazo
                        </h3>
                        <div class="info-item full-width">
                            <span class="info-label">Motivo</span>
                            <span class="info-value" style="background: #ffebee; padding: 1rem; border-radius: 10px; color: #c62828;">
                                ${s.rechazo.motivo}
                            </span>
                        </div>
                        <div class="info-item" style="margin-top: 1rem;">
                            <span class="info-label">Observaciones</span>
                            <span class="info-value">${s.rechazo.observaciones}</span>
                        </div>
                    </div>
                ` : ''}

                <!-- Sistema de comentarios -->
                <div class="detail-section">
                    <h3>
                        <span>💬</span>
                        Comentarios y Preguntas
                    </h3>
                    
                    <div class="comments-section">
                        ${s.comentarios.map(c => `
                            <div class="comment">
                                <div class="comment-header">
                                    <span class="comment-author">${c.autor}</span>
                                    <span class="comment-date">${formatFecha(c.fecha)}</span>
                                </div>
                                <div class="comment-text">${c.texto}</div>
                            </div>
                        `).join('')}
                        
                        <div class="comment-form">
                            <textarea placeholder="Escribe tu comentario o pregunta..."></textarea>
                            <button class="btn-send" onclick="enviarComentario('${s.id}')">Enviar</button>
                        </div>
                    </div>
                </div>

                <!-- Acciones según el rol del usuario -->
                ${currentUser.type === 'supervisor' ? `
                    <div class="detail-section">
                        <h3>
                            <span>⚙️</span>
                            Acciones de Supervisor
                        </h3>
                        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                            <button class="btn btn-primary" onclick="cambiarEstado('${s.id}', 'aceptado')">✓ Aceptar</button>
                            <button class="btn btn-secondary" onclick="cambiarEstado('${s.id}', 'rechazado')">✗ Rechazar</button>
                            ${s.estado === 'aceptado con deducible' ? `
                                <button class="btn btn-primary" onclick="registrarPagoDeducible('${s.id}')">💰 Registrar Pago Deducible</button>
                            ` : ''}
                            ${s.estado === 'perdida total' ? `
                                <button class="btn btn-primary" onclick="registrarPagoIndemnizacion('${s.id}')">💰 Registrar Pago Indemnización</button>
                            ` : ''}
                        </div>
                    </div>
                ` : currentUser.type === 'ajustador' ? `
                    <div class="detail-section">
                        <h3>
                            <span>⚙️</span>
                            Acciones de Ajustador
                        </h3>
                        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                            <button class="btn btn-primary" onclick="subirEvidencia('${s.id}')">📸 Agregar Evidencia</button>
                            <button class="btn btn-secondary" onclick="editarSiniestro('${s.id}')">✏️ Editar Información</button>
                        </div>
                    </div>
                ` : ''}
            `;
        }

        function cerrarModal() {
            document.getElementById('detalleModal').classList.remove('active');
        }

        // ========== FUNCIONES AUXILIARES ==========
        function getEstadoClass(estado) {
            const classes = {
                'rechazado': 'estado-rechazado',
                'aceptado': 'estado-aceptado',
                'aceptado con deducible': 'estado-deducible',
                'aceptado sin deducible': 'estado-aceptado',
                'reparacion': 'estado-pendiente',
                'perdida total': 'estado-perdida-total'
            };
            return classes[estado] || 'estado-pendiente';
        }

        function getEstadoText(estado) {
            const texts = {
                'rechazado': 'Rechazado',
                'aceptado': 'Aceptado',
                'aceptado con deducible': 'Aceptado con Deducible',
                'aceptado sin deducible': 'Aceptado sin Deducible',
                'reparacion': 'En Reparación',
                'perdida total': 'Pérdida Total'
            };
            return texts[estado] || estado;
        }

        function formatFecha(fecha) {
            if (!fecha) return '';
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            return new Date(fecha).toLocaleDateString('es-MX', options);
        }

        // ========== FUNCIONES DE ACCIÓN ==========
        function verMedia(archivo) {
            alert(`Viendo archivo: ${archivo}`);
        }

        function enviarComentario(id) {
            const textarea = document.querySelector('.comment-form textarea');
            const comentario = textarea.value.trim();
            
            if (comentario) {
                alert(`Comentario enviado para el siniestro ${id}: ${comentario}`);
                textarea.value = '';
            } else {
                alert('Por favor escribe un comentario');
            }
        }

        function cambiarEstado(id, nuevoEstado) {
            alert(`Cambiando estado del siniestro ${id} a: ${nuevoEstado}`);
        }

        function registrarPagoDeducible(id) {
            alert(`Registrando pago de deducible para el siniestro ${id}`);
        }

        function registrarPagoIndemnizacion(id) {
            alert(`Registrando pago de indemnización para el siniestro ${id}`);
        }

        function subirEvidencia(id) {
            alert(`Subir evidencia para el siniestro ${id}`);
        }

        function editarSiniestro(id) {
            alert(`Editando siniestro ${id}`);
        }

        function abrirModalNuevoSiniestro() {
            alert('Abrir formulario para nuevo siniestro');
        }

        function generarReporte() {
            alert('Generando reporte...');
        }

        function contactarSoporte() {
            alert('Contactando a soporte...');
        }

        function verDocumentos() {
            alert('Viendo documentos...');
        }

        function showNotifications() {
            alert('Mostrando notificaciones');
        }

        function toggleUserMenu() {
            alert('Menú de usuario');
        }

        // Inicializar al cargar la página
        document.addEventListener('DOMContentLoaded', initDashboard);