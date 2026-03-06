
        // ========== CONFIGURACIÓN INICIAL ==========
        let pasoActual = 1;
        let archivosSeleccionados = [];
        let vehiculos = [];

        // Datos del usuario (simulado)
        const currentUser = {
            type: 'ajustador',
            name: 'Juan Pérez',
            alias: 'Juan',
            id: 'AJU001'
        };

        // Actualizar información del usuario
        document.getElementById('userNameDisplay').textContent = currentUser.name;
        document.getElementById('userRoleDisplay').textContent = 
            currentUser.type === 'ajustador' ? 'Ajustador' : 'Supervisor';
        document.getElementById('userAvatar').textContent = currentUser.avatar || 'JP';

        // ========== FUNCIONES DE NAVEGACIÓN ==========
        function cambiarPaso(direccion) {
            if (direccion === 'siguiente') {
                if (!validarPasoActual()) return;
                
                if (pasoActual < 5) {
                    document.getElementById(`paso${pasoActual}`).style.display = 'none';
                    pasoActual++;
                    document.getElementById(`paso${pasoActual}`).style.display = 'block';
                    
                    // Actualizar barra de progreso
                    document.getElementById(`step${pasoActual-1}`).classList.add('completed');
                    document.getElementById(`step${pasoActual}`).classList.add('active');
                    
                    // Actualizar botones
                    document.getElementById('btnAnterior').style.display = 'inline-flex';
                    
                    if (pasoActual === 5) {
                        document.getElementById('btnSiguiente').style.display = 'none';
                        document.getElementById('btnEnviar').style.display = 'inline-flex';
                    }
                }
            } else {
                if (pasoActual > 1) {
                    document.getElementById(`paso${pasoActual}`).style.display = 'none';
                    pasoActual--;
                    document.getElementById(`paso${pasoActual}`).style.display = 'block';
                    
                    // Actualizar barra de progreso
                    document.getElementById(`step${pasoActual+1}`).classList.remove('active', 'completed');
                    document.getElementById(`step${pasoActual}`).classList.add('active');
                    
                    // Actualizar botones
                    if (pasoActual === 1) {
                        document.getElementById('btnAnterior').style.display = 'none';
                    }
                    
                    document.getElementById('btnSiguiente').style.display = 'inline-flex';
                    document.getElementById('btnEnviar').style.display = 'none';
                }
            }
        }

        function validarPasoActual() {
            switch(pasoActual) {
                case 1:
                    return validarPaso1();
                case 2:
                    return validarPaso2();
                case 3:
                    return validarPaso3();
                case 4:
                    return validarPaso4();
                default:
                    return true;
            }
        }

        function validarPaso1() {
            const tipoCliente = document.getElementById('tipoCliente').value;
            const nombre = document.getElementById('nombreCliente').value;
            const razonSocial = document.getElementById('razonSocial').value;
            const rfc = document.getElementById('rfc').value;
            const telefono = document.getElementById('telefono').value;
            const email = document.getElementById('email').value;
            const direccion = document.getElementById('direccion').value;

            if (tipoCliente === 'persona' && !nombre) {
                alert('Por favor ingresa el nombre del cliente');
                return false;
            }

            if (tipoCliente === 'moral' && !razonSocial) {
                alert('Por favor ingresa la razón social');
                return false;
            }

            if (!rfc) {
                alert('Por favor ingresa el RFC');
                return false;
            }

            if (!telefono) {
                alert('Por favor ingresa el teléfono');
                return false;
            }

            if (!email || !email.includes('@')) {
                alert('Por favor ingresa un email válido');
                return false;
            }

            if (!direccion) {
                alert('Por favor ingresa la dirección');
                return false;
            }

            return true;
        }

        function validarPaso2() {
            const compania = document.getElementById('companiaSeguros').value;
            const poliza = document.getElementById('numPoliza').value;
            const marca = document.getElementById('marca').value;
            const modelo = document.getElementById('modelo').value;
            const anio = document.getElementById('anio').value;
            const placas = document.getElementById('placas').value;
            const serie = document.getElementById('serie').value;

            if (!compania) {
                alert('Por favor selecciona la compañía de seguros');
                return false;
            }

            if (!poliza) {
                alert('Por favor ingresa el número de póliza');
                return false;
            }

            if (!marca) {
                alert('Por favor ingresa la marca del vehículo');
                return false;
            }

            if (!modelo) {
                alert('Por favor ingresa el modelo del vehículo');
                return false;
            }

            if (!anio) {
                alert('Por favor selecciona el año del vehículo');
                return false;
            }

            if (!placas) {
                alert('Por favor ingresa las placas del vehículo');
                return false;
            }

            if (!serie || serie.length < 10) {
                alert('Por favor ingresa un número de serie válido (mínimo 10 caracteres)');
                return false;
            }

            return true;
        }

        function validarPaso3() {
            const fecha = document.getElementById('fechaSiniestro').value;
            const tipo = document.getElementById('tipoSiniestro').value;
            const ubicacion = document.getElementById('ubicacion').value;
            const descripcion = document.getElementById('descripcion').value;

            if (!fecha) {
                alert('Por favor selecciona la fecha y hora del siniestro');
                return false;
            }

            if (!tipo) {
                alert('Por favor selecciona el tipo de siniestro');
                return false;
            }

            if (!ubicacion) {
                alert('Por favor ingresa la ubicación del siniestro');
                return false;
            }

            if (!descripcion || descripcion.length < 20) {
                alert('Por favor ingresa una descripción detallada (mínimo 20 caracteres)');
                return false;
            }

            return true;
        }

        function validarPaso4() {
            if (archivosSeleccionados.length === 0) {
                alert('Por favor sube al menos una foto del siniestro');
                return false;
            }
            return true;
        }

        // ========== FUNCIONES DE CAMPOS DINÁMICOS ==========
        function toggleClienteFields() {
            const tipo = document.getElementById('tipoCliente').value;
            const campoNombre = document.getElementById('campoNombre');
            const campoRazonSocial = document.getElementById('campoRazonSocial');

            if (tipo === 'persona') {
                campoNombre.style.display = 'block';
                campoRazonSocial.style.display = 'none';
            } else {
                campoNombre.style.display = 'none';
                campoRazonSocial.style.display = 'block';
            }
        }

        function toggleOtrasUnidades() {
            const tieneOtras = document.getElementById('otrasUnidades').value;
            const container = document.getElementById('otrasUnidadesContainer');
            
            if (tieneOtras === 'si') {
                container.style.display = 'block';
                if (vehiculos.length === 0) {
                    agregarVehiculo();
                }
            } else {
                container.style.display = 'none';
                vehiculos = [];
                document.getElementById('vehiculosList').innerHTML = '';
            }
        }

        function agregarVehiculo() {
            const id = Date.now();
            vehiculos.push(id);
            
            const html = `
                <div class="vehicle-card" id="vehiculo-${id}">
                    <div class="remove-vehicle" onclick="eliminarVehiculo(${id})">✕</div>
                    <h4>
                        <span>🚗</span>
                        Vehículo ${vehiculos.length}
                    </h4>
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Marca/Modelo</label>
                            <input type="text" placeholder="Ej: Chevrolet Aveo">
                        </div>
                        <div class="form-group">
                            <label>Placas</label>
                            <input type="text" placeholder="ABC-123">
                        </div>
                        <div class="form-group">
                            <label>Color</label>
                            <input type="text" placeholder="Rojo">
                        </div>
                        <div class="form-group">
                            <label>Aseguradora</label>
                            <input type="text" placeholder="Seguros MX">
                        </div>
                        <div class="form-group full-width">
                            <label>Daños aparentes</label>
                            <textarea placeholder="Describa los daños del otro vehículo..."></textarea>
                        </div>
                    </div>
                </div>
            `;
            
            document.getElementById('vehiculosList').insertAdjacentHTML('beforeend', html);
        }

        function eliminarVehiculo(id) {
            document.getElementById(`vehiculo-${id}`).remove();
            vehiculos = vehiculos.filter(v => v !== id);
        }

        // ========== FUNCIONES DE ARCHIVOS ==========
        function handleFileSelect(event) {
            const files = Array.from(event.target.files);
            
            files.forEach(file => {
                if (file.size > 50 * 1024 * 1024) {
                    alert(`El archivo ${file.name} excede los 50MB`);
                    return;
                }
                
                archivosSeleccionados.push(file);
                agregarArchivoALista(file);
            });
        }

        function agregarArchivoALista(file) {
            const fileList = document.getElementById('fileList');
            const size = (file.size / 1024 / 1024).toFixed(2);
            const icon = file.type.startsWith('image/') ? '📷' : '🎥';
            
            const html = `
                <div class="file-item" id="file-${file.name}">
                    <div class="remove-file" onclick="eliminarArchivo('${file.name}')">✕</div>
                    <i>${icon}</i>
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${size} MB</div>
                </div>
            `;
            
            fileList.insertAdjacentHTML('beforeend', html);
        }

        function eliminarArchivo(fileName) {
            document.getElementById(`file-${fileName}`).remove();
            archivosSeleccionados = archivosSeleccionados.filter(f => f.name !== fileName);
        }

        // ========== FUNCIONES DE UBICACIÓN ==========
        function obtenerUbicacionActual() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        document.getElementById('ubicacion').value = `Lat: ${lat}, Lng: ${lng}`;
                        alert('Ubicación obtenida. Por favor completa la dirección manualmente.');
                    },
                    function(error) {
                        alert('No se pudo obtener la ubicación: ' + error.message);
                    }
                );
            } else {
                alert('Tu navegador no soporta geolocalización');
            }
        }

        // ========== FUNCIÓN DE ENVÍO ==========
        function enviarSiniestro() {
            if (!document.getElementById('terminos').checked) {
                alert('Debes confirmar que la información es verídica');
                return;
            }

            // Recopilar datos del formulario
            const datosSiniestro = {
                folio: 'SN-2024-' + Math.floor(Math.random() * 1000),
                fechaRegistro: new Date().toISOString(),
                ajustador: currentUser,
                cliente: {
                    tipo: document.getElementById('tipoCliente').value,
                    nombre: document.getElementById('nombreCliente').value,
                    razonSocial: document.getElementById('razonSocial').value,
                    rfc: document.getElementById('rfc').value,
                    telefono: document.getElementById('telefono').value,
                    email: document.getElementById('email').value,
                    direccion: document.getElementById('direccion').value
                },
                vehiculo: {
                    compania: document.getElementById('companiaSeguros').value,
                    poliza: document.getElementById('numPoliza').value,
                    marca: document.getElementById('marca').value,
                    modelo: document.getElementById('modelo').value,
                    anio: document.getElementById('anio').value,
                    placas: document.getElementById('placas').value,
                    serie: document.getElementById('serie').value,
                    color: document.getElementById('color').value,
                    combustible: document.getElementById('combustible').value,
                    kilometraje: document.getElementById('kilometraje').value
                },
                siniestro: {
                    fecha: document.getElementById('fechaSiniestro').value,
                    tipo: document.getElementById('tipoSiniestro').value,
                    ubicacion: document.getElementById('ubicacion').value,
                    descripcion: document.getElementById('descripcion').value,
                    otrasUnidades: document.getElementById('otrasUnidades').value,
                    lesionados: document.getElementById('lesionados').value,
                    autoridades: document.getElementById('autoridades').value
                },
                multimedia: {
                    archivos: archivosSeleccionados.map(f => f.name)
                }
            };

            console.log('Siniestro registrado:', datosSiniestro);
            
            // Mostrar modal de confirmación
            document.getElementById('folioGenerado').textContent = datosSiniestro.folio;
            document.getElementById('confirmModal').classList.add('active');
        }

        function toggleSubmitButton() {
            const terminos = document.getElementById('terminos').checked;
            document.getElementById('btnEnviar').disabled = !terminos;
        }

        function cancelarRegistro() {
            if (confirm('¿Estás seguro de cancelar el registro? Se perderán todos los datos ingresados.')) {
                window.location.href = 'dashboard_ajustador.html';
            }
        }

        // ========== FUNCIONES DEL MODAL ==========
        function verDetalle() {
            alert('Ver detalle del siniestro');
            document.getElementById('confirmModal').classList.remove('active');
        }

        function nuevoRegistro() {
            document.getElementById('confirmModal').classList.remove('active');
            location.reload();
        }

        function irDashboard() {
            window.location.href = 'dashboard_ajustador.html';
        }

        // Inicializar
        document.addEventListener('DOMContentLoaded', function() {
            // Establecer fecha actual como default
            const ahora = new Date();
            const año = ahora.getFullYear();
            const mes = String(ahora.getMonth() + 1).padStart(2, '0');
            const dia = String(ahora.getDate()).padStart(2, '0');
            const hora = String(ahora.getHours()).padStart(2, '0');
            const minutos = String(ahora.getMinutes()).padStart(2, '0');
            
            document.getElementById('fechaSiniestro').value = `${año}-${mes}-${dia}T${hora}:${minutos}`;
        });