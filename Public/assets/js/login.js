// Variables globales
let selectedUserType = '';
let isPasswordValid = false;
let isEmailValid = false;
let isAgeValid = false;
let fotoSeleccionada = null;

// Cambiar entre tabs
function switchTab(tab) {
    const tabs = document.querySelectorAll('.tab');
    const forms = document.querySelectorAll('.form-container');
    
    tabs.forEach(t => t.classList.remove('active'));
    forms.forEach(f => f.classList.remove('active'));
    
    if (tab === 'login') {
        tabs[0].classList.add('active');
        document.getElementById('loginForm').classList.add('active');
    } else {
        tabs[1].classList.add('active');
        document.getElementById('registerForm').classList.add('active');
    }
}

// Mostrar mensaje en pantalla
function showMessage(message, isError = true) {
    let msgDiv = document.getElementById('floatingMessage');
    if (!msgDiv) {
        msgDiv = document.createElement('div');
        msgDiv.id = 'floatingMessage';
        msgDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 12px;
            color: white;
            font-weight: bold;
            z-index: 9999;
            background: ${isError ? '#dc3545' : '#28a745'};
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(msgDiv);
    }
    
    msgDiv.style.background = isError ? '#dc3545' : '#28a745';
    msgDiv.innerHTML = message;
    msgDiv.style.display = 'block';
    
    setTimeout(() => {
        msgDiv.style.display = 'none';
    }, 4000);
}

// ========== REGISTRO ==========
function selectUserType(type) {
    selectedUserType = type;
    
    document.querySelectorAll('.user-type').forEach(el => {
        el.classList.remove('selected');
    });
    
    document.getElementById(`type${type.charAt(0).toUpperCase() + type.slice(1)}`).classList.add('selected');
    toggleRegisterButton();
}

function validateAge() {
    const fechaNac = new Date(document.getElementById('regFechaNacimiento').value);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--;
    }
    
    const ageMessage = document.getElementById('ageMessage');
    
    if (edad >= 18) {
        ageMessage.style.color = '#28a745';
        ageMessage.textContent = '✓ Edad verificada';
        isAgeValid = true;
    } else {
        ageMessage.style.color = '#dc3545';
        ageMessage.textContent = '❌ Debes ser mayor de 18 años';
        isAgeValid = false;
    }
    
    toggleRegisterButton();
}

function previewPhoto(event) {
    const file = event.target.files[0];
    if (file) {
        fotoSeleccionada = file;
        const reader = new FileReader();
        reader.onload = function(e) {
            document.querySelector('.photo-upload').style.display = 'none';
            const preview = document.getElementById('photoPreview');
            preview.style.display = 'block';
            preview.querySelector('img').src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
    toggleRegisterButton();
}

function removePhoto() {
    document.getElementById('fotoInput').value = '';
    fotoSeleccionada = null;
    document.querySelector('.photo-upload').style.display = 'block';
    document.getElementById('photoPreview').style.display = 'none';
    toggleRegisterButton();
}

function validateEmail() {
    const email = document.getElementById('regEmail').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const input = document.getElementById('regEmail');
    
    if (emailRegex.test(email)) {
        input.classList.remove('error');
        isEmailValid = true;
    } else {
        input.classList.add('error');
        isEmailValid = false;
    }
    
    toggleRegisterButton();
}

function checkPasswordStrength() {
    const password = document.getElementById('regPassword').value;
    
    const hasLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    updateRequirement('reqLength', hasLength);
    updateRequirement('reqUpperCase', hasUpperCase);
    updateRequirement('reqNumber', hasNumber);
    updateRequirement('reqSpecial', hasSpecial);
    
    const strength = [hasLength, hasUpperCase, hasNumber, hasSpecial].filter(Boolean).length;
    const fill = document.getElementById('strengthFill');
    const text = document.getElementById('strengthText');
    
    const strengths = ['Muy débil', 'Débil', 'Media', 'Fuerte', 'Muy fuerte'];
    const colors = ['#dc3545', '#ff6b6b', '#ffd43b', '#51cf66', '#28a745'];
    
    fill.style.width = `${strength * 25}%`;
    fill.style.background = colors[strength];
    text.textContent = `Fortaleza: ${strengths[strength]}`;
    text.style.color = colors[strength];
    
    isPasswordValid = strength >= 3;
    validatePasswordMatch();
}

function updateRequirement(elementId, isMet) {
    const element = document.getElementById(elementId);
    const icon = element.querySelector('span');
    
    if (isMet) {
        element.classList.add('met');
        icon.innerHTML = '✅';
    } else {
        element.classList.remove('met');
        icon.innerHTML = '🔴';
    }
}

function validatePasswordMatch() {
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirmPassword').value;
    const confirmInput = document.getElementById('regConfirmPassword');
    
    if (password && confirm) {
        if (password === confirm) {
            confirmInput.classList.remove('error');
            // ¡CORRECCIÓN! No desactivar isPasswordValid si coinciden
            if (password.length >= 8) {
                isPasswordValid = true;
            }
        } else {
            confirmInput.classList.add('error');
            isPasswordValid = false;
        }
    }
    
    toggleRegisterButton();
}

function toggleRegisterButton() {
    const nombre = document.getElementById('regNombre').value;
    const apellidos = document.getElementById('regApellidos').value;
    const genero = document.getElementById('regGenero').value;
    const email = document.getElementById('regEmail').value;
    const alias = document.getElementById('regAlias').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const ageVerified = document.getElementById('ageVerification').checked;
        
    const allFields = nombre && apellidos && genero && email && alias && 
                     password && confirmPassword && selectedUserType && 
                     isAgeValid && isPasswordValid && isEmailValid && 
                     ageVerified;
    
    const btn = document.getElementById('registerBtn');
    if (btn) btn.disabled = !allFields;
}

// ========== REGISTRO CON PHP ==========

// async function handleRegister() {
//     console.log("Hola soy registro");

//     const btn = document.getElementById('registerBtn');
//     if (btn.disabled) return;
    
//     btn.disabled = true;
//     btn.textContent = 'Registrando...';
    
//     const userData = {
//         tipoUsuario: selectedUserType,
//         nombre: document.getElementById('regNombre').value,
//         apellidos: document.getElementById('regApellidos').value,
//         fechaNacimiento: document.getElementById('regFechaNacimiento').value,
//         genero: document.getElementById('regGenero').value,
//         email: document.getElementById('regEmail').value,
//         alias: document.getElementById('regAlias').value,
//         password: document.getElementById('regPassword').value
//     };
    
//     console.log(userData);

//     try {
//         const response = await fetch('../api/register.php', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(userData)
//         });
        
//         console.log(response);

//         const result = await response.json();

//         if (result.ok) {
//             showMessage(result.mensaje || '✅ Registro exitoso', false);
//             setTimeout(() => {
//                 switchTab('login');
//                 // Limpiar formulario
//                 document.getElementById('regNombre').value = '';
//                 document.getElementById('regApellidos').value = '';
//                 document.getElementById('regFechaNacimiento').value = '';
//                 document.getElementById('regGenero').value = '';
//                 document.getElementById('regEmail').value = '';
//                 document.getElementById('regAlias').value = '';
//                 document.getElementById('regPassword').value = '';
//                 document.getElementById('regConfirmPassword').value = '';
//                 document.getElementById('ageVerification').checked = false;
//                 removePhoto();
//                 selectedUserType = '';
//                 document.querySelectorAll('.user-type').forEach(el => {
//                     el.classList.remove('selected');
//                 });
//             }, 2000);
//         } else {
//             showMessage('❌ Error: ' + (result.mensaje || 'Error desconocido'));
//         }
//     } catch (error) {
//         // console.error('Error:', error);
//         showMessage('❌ Error de conexión con el servidor');
//     } finally {
//         btn.disabled = false;
//         btn.textContent = 'Registrarse';
//     }
// }

async function handleRegister() {
    console.log("Entrando en Registro.");

    const btn = document.getElementById('registerBtn');
    if (btn.disabled) return;

    btn.disabled = true;
    btn.textContent = 'Registrando...';
    
    // Usar FormData para enviar la foto
    const formData = new FormData();
    formData.append('tipoUsuario', selectedUserType);
    formData.append('nombre', document.getElementById('regNombre').value.trim());
    formData.append('apellidos', document.getElementById('regApellidos').value.trim());
    formData.append('fechaNacimiento', document.getElementById('regFechaNacimiento').value);
    formData.append('genero', document.getElementById('regGenero').value);
    formData.append('email', document.getElementById('regEmail').value.trim());
    formData.append('alias', document.getElementById('regAlias').value.trim());
    formData.append('password', document.getElementById('regPassword').value);
    
    // Agregar foto si existe
    if (fotoSeleccionada) {
        formData.append('foto', fotoSeleccionada);
    }

    try {
        console.log("Dentro del Try Catch");

        const response = await fetch('/BDM_Proyect/Public/api/register.php', {
            method: 'POST',
            body: formData  // No usar JSON, usar FormData
        });

        const result = await response.json();

        if (result.ok) {
            showMessage(result.mensaje, false);
            setTimeout(() => {
                switchTab('login');
                limpiarFormularioRegistro();
            }, 2000);
        } else {
            showMessage('ERROR: ' + result.mensaje);
        }
    } catch (error) {
        showMessage('ERROR: Error de conexión con el servidor');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Registrarse';
    }
}

// ========== LOGIN CON PHP ==========
// async function handleLogin() {
//     console.log("🔍 handleLogin ejecutándose...");
    
//     const email = document.getElementById('loginEmail').value;
//     const password = document.getElementById('loginPassword').value;
    
//     if (!email || !password) {
//         showMessage('❌ Por favor completa todos los campos');
//         return;
//     }
    
//     // Crear selector de tipo de usuario si no existe
//     let tipoUsuario = '';
//     let typeSelect = document.getElementById('loginUserType');
    
//     if (!typeSelect) {
//         const loginForm = document.getElementById('loginForm');
//         const btn = loginForm.querySelector('.btn');
//         const selectHtml = `
//             <div class="form-group" id="userTypeGroup">
//                 <label>Tipo de Usuario <span class="required">*</span></label>
//                 <select id="loginUserType">
//                     <option value="">Seleccionar tipo</option>
//                     <option value="ajustador">🔧 Ajustador</option>
//                     <option value="supervisor">✓ Supervisor</option>
//                     <option value="asegurado">👤 Asegurado</option>
//                 </select>
//             </div>
//         `;
//         btn.insertAdjacentHTML('beforebegin', selectHtml);
//         typeSelect = document.getElementById('loginUserType');
//     }
    
//     tipoUsuario = typeSelect.value;
    
//     if (!tipoUsuario) {
//         showMessage('❌ Por favor selecciona el tipo de usuario');
//         return;
//     }
    
//     const loginBtn = document.querySelector('#loginForm .btn');
//     loginBtn.disabled = true;
//     loginBtn.textContent = 'Iniciando sesión...';
    
//     try {
//         const response = await fetch('../api/Log.php', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 email: email,
//                 password: password,
//                 tipoUsuario: tipoUsuario
//             })
//         });
        
//         const result = await response.json();
        
//         if (result.ok) {
//             showMessage(result.mensaje || '✅ Inicio de sesión exitoso', false);
//             setTimeout(() => {
//                 // 🔴 CAMBIO IMPORTANTE: Redirige al mismo dashboard para todos los roles
//                 window.location.href = '/BDM_PROYECT/index.php';
//             }, 1500);
//         } else {
//             showMessage('❌ Error: ' + (result.mensaje || 'Credenciales incorrectas'));
//         }
//     } catch (error) {
//         // console.error('Error:', error);
//         showMessage('❌ Error de conexión con el servidor');
//     } finally {
//         loginBtn.disabled = false;
//         loginBtn.textContent = 'Iniciar Sesión';
//     }
// }

async function handleLogin() {
    console.log("Entro en Log");

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        showMessage('❌ Completa todos los campos');
        return;
    }

    const loginBtn = document.querySelector('#loginForm .btn');
    loginBtn.disabled = true;
    loginBtn.textContent = 'Iniciando...';

    try {
        const response = await fetch('/BDM_Proyect/Public/api/Log.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                password: password
                // Sin tipoUsuario - el backend lo detecta
            })
        });

        const result = await response.json();

        if (result.ok) {
            showMessage(result.mensaje, false);
            setTimeout(() => {
                window.location.href = '/BDM_Proyect/index.php';
            }, 1500);
        } else {
            showMessage('ERROR: ' + result.mensaje);
        }

    } catch (error) {
        showMessage('ERROR: Error de conexión');
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Iniciar Sesión';
    }
}

// Creo que esto no lo vamos a usar
// ↓↓↓↓↓↓↓↓↓
// Autocompletar login
// function fillLogin(email, password, type) {
//     document.getElementById('loginEmail').value = email;
//     document.getElementById('loginPassword').value = password;
    
//     let typeSelect = document.getElementById('loginUserType');
//     if (!typeSelect) {
//         const loginForm = document.getElementById('loginForm');
//         const btn = loginForm.querySelector('.btn');
//         const selectHtml = `
//             <div class="form-group">
//                 <label>Tipo de Usuario <span class="required">*</span></label>
//                 <select id="loginUserType">
//                     <option value="">Seleccionar tipo</option>
//                     <option value="ajustador">🔧 Ajustador</option>
//                     <option value="supervisor">✓ Supervisor</option>
//                     <option value="asegurado">👤 Asegurado</option>
//                 </select>
//             </div>
//         `;
//         btn.insertAdjacentHTML('beforebegin', selectHtml);
//         typeSelect = document.getElementById('loginUserType');
//     }
    
//     typeSelect.value = type;
//     showMessage(`✅ Perfil ${type} cargado. Presiona "Iniciar Sesión"`, false);
// }

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log("✅ DOM cargado, login.js funcionando");
    
    const nombreInput = document.getElementById('regNombre');
    const apellidosInput = document.getElementById('regApellidos');
    const generoSelect = document.getElementById('regGenero');
    const aliasInput = document.getElementById('regAlias');
    
    if (nombreInput) nombreInput.addEventListener('input', toggleRegisterButton);
    if (apellidosInput) apellidosInput.addEventListener('input', toggleRegisterButton);
    if (generoSelect) generoSelect.addEventListener('change', toggleRegisterButton);
    if (aliasInput) aliasInput.addEventListener('input', toggleRegisterButton);
});

// ========== FUNCIONES AUXILIARES ==========
function crearSelectorTipoUsuario() {
    const loginForm = document.getElementById('loginForm');
    const btn = loginForm.querySelector('.btn');
    const selectHtml = `
        <div class="form-group">
            <label>Tipo de Usuario <span class="required">*</span></label>
            <select id="loginUserType">
                <option value="">Seleccionar tipo</option>
                <option value="ajustador">🔧 Ajustador</option>
                <option value="supervisor">✓ Supervisor</option>
                <option value="asegurado">👤 Asegurado</option>
            </select>
        </div>
    `;
    btn.insertAdjacentHTML('beforebegin', selectHtml);
}

function limpiarFormularioRegistro() {
    ['regNombre', 'regApellidos', 'regFechaNacimiento', 'regGenero', 
     'regEmail', 'regAlias', 'regPassword', 'regConfirmPassword'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    
    document.getElementById('ageVerification').checked = false;
    removePhoto();
    selectedUserType = '';
    document.querySelectorAll('.user-type').forEach(el => el.classList.remove('selected'));
}

function showMessage(message, isError = true) {
    let msgDiv = document.getElementById('floatingMessage');
    if (!msgDiv) {
        msgDiv = document.createElement('div');
        msgDiv.id = 'floatingMessage';
        msgDiv.style.cssText = `
            position: fixed; top: 20px; right: 20px; padding: 15px 25px;
            border-radius: 12px; color: white; font-weight: bold; z-index: 9999;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        `;
        document.body.appendChild(msgDiv);
    }

    msgDiv.style.background = isError ? '#dc3545' : '#28a745';
    msgDiv.textContent = message;
    msgDiv.style.display = 'block';

    setTimeout(() => {
        msgDiv.style.display = 'none';
    }, 4000);
}
