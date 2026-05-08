// ========== CONFIGURACIÓN INICIAL ==========
        let pasoActual = 1;
        let archivosSeleccionados = [];
        let vehiculos = [];

// Cargar compañías de seguros desde la BD
async function cargarCompanias() {
    try {
        const response = await fetch('../api/obtener_companias.php');
        const data = await response.json();
        
        if (data.ok && data.companias) {
            const select = document.getElementById('companiaSeguros');
            select.innerHTML = '<option value="">Seleccionar compañía</option>';
            
            data.companias.forEach(compania => {
                select.innerHTML += `<option value="${compania.ID_Seguro}">${compania.Nombre_Empresa}</option>`;
            });
        }
    } catch (error) {
        console.error('Error cargando compañías:', error);
    }
}

// ========== VERIFICAR SESIÓN Y CARGAR HEADER ==========
document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('/BDM_Proyect/Public/api/verificar_sesion.php');
        const data = await response.json();
        
        if (!data.ok) {
            window.location.href = '/BDM_Proyect/Public/views/Login.php';
            return;
        }
        
        // Actualizar header con datos reales
        const nombreMostrar = data.alias || data.nombre || 'Usuario';
        const rolTexto = data.rol === 'ajustador' ? 'Ajustador' :
                         data.rol === 'supervisor' ? 'Supervisor' : 'Asegurado';
        const inicial = (data.nombre || 'U').charAt(0).toUpperCase();
        
        document.getElementById('userNameDisplay').textContent = nombreMostrar;
        document.getElementById('userRoleDisplay').textContent = rolTexto;
        
        const avatar = document.getElementById('userAvatar');
        if (data.foto) {
            avatar.innerHTML = `<img src="${data.foto}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
            avatar.style.background = 'none';
        } else {
            avatar.textContent = inicial;
        }
        
        // Guardar datos para el envío
        window.userData = data;
        
    } catch (error) {
        console.error('Error:', error);
    }
    
    cargarCompanias();

    // Fecha actual para el siniestro
    const ahora = new Date();
    const año = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const dia = String(ahora.getDate()).padStart(2, '0');
    const hora = String(ahora.getHours()).padStart(2, '0');
    const minutos = String(ahora.getMinutes()).padStart(2, '0');
    
    const fechaInput = document.getElementById('fechaSiniestro');
    if (fechaInput) {
        fechaInput.value = `${año}-${mes}-${dia}T${hora}:${minutos}`;
    }
});

// ========== BÚSQUEDA DE PERSONAS ==========
let timeoutBusqueda = null;

async function buscarPersona() {
    const termino = document.getElementById('nombreCliente').value.trim();
    const container = document.getElementById('sugerenciasContainer');
    
    if (timeoutBusqueda) clearTimeout(timeoutBusqueda);
    
    if (termino.length < 3) {
        container.style.display = 'none';
        return;
    }
    
    timeoutBusqueda = setTimeout(async () => {
        try {
            const response = await fetch(`../api/buscar_persona.php?q=${encodeURIComponent(termino)}`);
            
            // Verificar que la respuesta sea JSON
            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error('Respuesta no es JSON:', text);
                return;
            }
            
            if (data.ok && data.personas && data.personas.length > 0) {
                let html = '';
                data.personas.forEach(persona => {
                    html += `
                        <div onclick='seleccionarPersona(
                            "${persona.Nombre.replace(/"/g, '\\"')}", 
                            "${persona.Apellido.replace(/"/g, '\\"')}", 
                            "${persona.RFC || ''}", 
                            "${persona.Telefono || ''}", 
                            "${persona.Correo || ''}", 
                            "${persona.Direccion || ''}"
                        )' 
                             style="padding: 12px 15px; cursor: pointer; border-bottom: 1px solid #f0f0f0;"
                             onmouseover="this.style.background='#e8f0fe'" 
                             onmouseout="this.style.background='white'">
                            <div style="font-weight: 600; color: #003366;">📋 ${persona.nombre_completo}</div>
                            ${persona.Correo ? `<div style="font-size: 0.85rem; color: #666;">📧 ${persona.Correo}</div>` : ''}
                        </div>
                    `;
                });
                container.innerHTML = html;
                container.style.display = 'block';
            } else {
                container.innerHTML = `
                    <div style="padding: 15px; text-align: center; color: #888;">
                        ✨ Se creará nuevo registro
                    </div>
                `;
                container.style.display = 'block';
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }, 400);
}

function seleccionarPersona(nombre, apellido, rfc, telefono, correo, direccion) {
    document.getElementById('nombreCliente').value = nombre + ' ' + apellido;
    document.getElementById('rfc').value = rfc || '';
    document.getElementById('telefono').value = telefono || '';
    document.getElementById('email').value = correo || '';
    document.getElementById('direccion').value = direccion || '';
    
    document.getElementById('sugerenciasContainer').style.display = 'none';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Cerrar sugerencias al hacer clic fuera
document.addEventListener('click', function(event) {
    const container = document.getElementById('sugerenciasContainer');
    const input = document.getElementById('nombreCliente');
    
    if (container && input && event.target !== input && !container.contains(event.target)) {
        container.style.display = 'none';
    }
});

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
            const nombre = document.getElementById('nombreCliente').value;
            const rfc = document.getElementById('rfc').value;
            const telefono = document.getElementById('telefono').value;
            const email = document.getElementById('email').value;
            const direccion = document.getElementById('direccion').value;

            if (!nombre) {
                alert('Por favor ingresa el nombre del cliente');
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

            if (!anio || anio < 1900 || anio > 2099) {
                alert('Por favor ingresa un año válido (Ej: 2024)');
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
            <h4><span>🚗</span> Vehículo ${vehiculos.length}</h4>
            <div class="form-grid">
                <div class="form-group">
                    <label>Marca/Modelo</label>
                    <input type="text" placeholder="Ej: Chevrolet Aveo" class="vh-marca">
                </div>
                <div class="form-group">
                    <label>Placas</label>
                    <input type="text" placeholder="ABC-123" class="vh-placas">
                </div>
                <div class="form-group">
                    <label>Color</label>
                    <input type="text" placeholder="Rojo" class="vh-color">
                </div>
                <div class="form-group full-width">
                    <label>Daños aparentes</label>
                    <textarea placeholder="Describa los daños..." class="vh-danios"></textarea>
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

        // ========== FUNCIONES DE ARCHIVOS MEJORADAS ==========
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
    const size = formatFileSize(file.size);
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    const id = 'file-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
    
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    fileItem.id = id;
    
    if (isImage) {
        // Crear miniatura para imágenes
        const reader = new FileReader();
        reader.onload = function(e) {
            fileItem.innerHTML = `
                <div class="remove-file" onclick="eliminarArchivo('${id}', '${file.name}')">✕</div>
                <div class="file-preview">
                    <img src="${e.target.result}" alt="${file.name}">
                </div>
                <div class="file-info">
                    <div class="file-name" title="${file.name}">${file.name}</div>
                    <div class="file-size">📷 ${size}</div>
                </div>
            `;
        };
        reader.readAsDataURL(file);
    } else if (isVideo) {
        // Crear preview para videos
        const reader = new FileReader();
        reader.onload = function(e) {
            fileItem.innerHTML = `
                <div class="remove-file" onclick="eliminarArchivo('${id}', '${file.name}')">✕</div>
                <div class="file-preview video-preview">
                    <div class="video-placeholder">
                        <span>🎥</span>
                    </div>
                </div>
                <div class="file-info">
                    <div class="file-name" title="${file.name}">${file.name}</div>
                    <div class="file-size">🎬 ${size}</div>
                </div>
            `;
        };
        reader.readAsDataURL(file);
    } else {
        // Otro tipo de archivo
        fileItem.innerHTML = `
            <div class="remove-file" onclick="eliminarArchivo('${id}', '${file.name}')">✕</div>
            <div class="file-preview document-preview">
                <span>📄</span>
            </div>
            <div class="file-info">
                <div class="file-name" title="${file.name}">${file.name}</div>
                <div class="file-size">📁 ${size}</div>
            </div>
        `;
    }
    
    fileList.appendChild(fileItem);
}

function eliminarArchivo(id, fileName) {
    document.getElementById(id)?.remove();
    archivosSeleccionados = archivosSeleccionados.filter(f => f.name !== fileName);
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
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
        async function enviarSiniestro() {
    if (!document.getElementById('terminos').checked) {
        alert('Debes confirmar que la información es verídica');
        return;
    }

    const btn = document.getElementById('btnEnviar');
    btn.disabled = true;
    btn.textContent = 'Registrando...';

    const formData = new FormData();
    
    // Paso 1: Datos del cliente
    formData.append('nombre_cliente', document.getElementById('nombreCliente').value);
    formData.append('rfc', document.getElementById('rfc').value);
    formData.append('telefono', document.getElementById('telefono').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('direccion', document.getElementById('direccion').value);
    
    // Paso 2: Vehículo
    formData.append('compania_id', document.getElementById('companiaSeguros').value);
    formData.append('num_poliza', document.getElementById('numPoliza').value);
    formData.append('marca', document.getElementById('marca').value);
    formData.append('modelo', document.getElementById('modelo').value);
    formData.append('anio', document.getElementById('anio').value);
    formData.append('placas', document.getElementById('placas').value);
    formData.append('serie', document.getElementById('serie').value);
    formData.append('color', document.getElementById('color').value);
    formData.append('combustible', document.getElementById('combustible').value);
    
    // Paso 3: Siniestro
    formData.append('fecha_siniestro', document.getElementById('fechaSiniestro').value.replace('T', ' '));
    formData.append('tipo_siniestro', document.getElementById('tipoSiniestro').value);
    formData.append('ubicacion', document.getElementById('ubicacion').value);
    formData.append('descripcion', document.getElementById('descripcion').value);
    formData.append('lesionados', document.getElementById('lesionados').value);
    formData.append('autoridades', document.getElementById('autoridades').value);
    
    // Unidades terceras como JSON - CORREGIDO
const vehiculosData = [];
document.querySelectorAll('.vehicle-card').forEach(card => {
    const marca = card.querySelector('.vh-marca')?.value || '';
    const placas = card.querySelector('.vh-placas')?.value || '';
    const color = card.querySelector('.vh-color')?.value || '';
    const danios = card.querySelector('.vh-danios')?.value || '';
    const seguro = document.getElementById('companiaSeguros')?.value || '1';
    
    if (marca || placas) { // Solo agregar si tiene datos
        vehiculosData.push({
            marca_modelo: marca,
            placas: placas,
            color: color,
            danios: danios,
            id_seguro: parseInt(seguro)
        });
    }
});
formData.append('vehiculos', JSON.stringify(vehiculosData));
    
    // Paso 4: Archivos
            archivosSeleccionados.forEach(file => {
            formData.append('archivos[]', file);
        });

    try {
        // cambiar cuando arregle el SP
        const response = await fetch('../api/crear_siniestro.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.ok) {
            document.getElementById('folioGenerado').textContent = result.siniestro?.Folio || result.siniestro?.Nombre;
            document.getElementById('confirmModal').classList.add('active');
        } else {
            alert('Error: ' + (result.mensaje || 'Error desconocido'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión con el servidor');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Registrar Siniestro';
    }
}

        function toggleSubmitButton() {
            const terminos = document.getElementById('terminos').checked;
            document.getElementById('btnEnviar').disabled = !terminos;
        }

        function cancelarRegistro() {
            if (confirm('¿Estás seguro de cancelar el registro? Se perderán todos los datos ingresados.')) {
                window.location.href = '../../index.php';
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
            // Mau: Creo... que tienes que quitar esto
            window.location.href = '../../index.php';
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