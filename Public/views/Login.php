<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AutoGest Seguros - Registro de Usuarios</title>
    <link rel="stylesheet" href="login.css">
</head>
<body>
    <div class="container">
        <div class="main-card">
            <!-- LADO IZQUIERDO - INFORMACIÓN -->
            <div class="info-side">
                <h1>AutoGest Seguros</h1>
                <h2>Sistema Integral de Gestión de Siniestros</h2>
                
                <ul class="feature-list">
                    <li>
                        <div class="feature-icon">🔧</div>
                        <div class="feature-text">
                            <h3>Ajustadores</h3>
                            <p>Registro de siniestros con evidencia multimedia</p>
                        </div>
                    </li>
                    <li>
                        <div class="feature-icon">✓</div>
                        <div class="feature-text">
                            <h3>Supervisores</h3>
                            <p>Autorización de pagos y evaluación de daños</p>
                        </div>
                    </li>
                    <li>
                        <div class="feature-icon">👤</div>
                        <div class="feature-text">
                            <h3>Asegurados</h3>
                            <p>Seguimiento en tiempo real de reparaciones</p>
                        </div>
                    </li>
                </ul>

                <div class="security-badge">
                    <div class="security-item">
                        <span>🔒</span>
                        SSL 256-bit
                    </div>
                    <div class="security-item">
                        <span>🛡️</span>
                        2FA Available
                    </div>
                    <div class="security-item">
                        <span>✓</span>
                        GDPR Compliant
                    </div>
                </div>
            </div>

            <!-- LADO DERECHO - FORMULARIOS -->
            <div class="forms-side">
                <!-- TABS DE NAVEGACIÓN -->
                <div class="tabs">
                    <div class="tab active" onclick="switchTab('login')">Iniciar Sesión</div>
                    <div class="tab" onclick="switchTab('register')">Registrarse</div>
                </div>

                <!-- FORMULARIO DE LOGIN (simplificado) -->
                <div id="loginForm" class="form-container active">
                    <h2 class="form-title">Bienvenido de vuelta</h2>
                    
                    <div class="form-group">
                        <label>Correo Electrónico <span class="required">*</span></label>
                        <input type="email" id="loginEmail" placeholder="correo@ejemplo.com">
                    </div>

                    <div class="form-group">
                        <label>Contraseña <span class="required">*</span></label>
                        <input type="password" id="loginPassword" placeholder="Ingresa tu contraseña">
                    </div>

                    <button class="btn" onclick="handleLogin()">Iniciar Sesión</button>

                    <!-- Perfiles de demostración -->
                    <div class="demo-profiles">
                        <div style="text-align: center; color: #666;">👇 Perfiles de prueba</div>
                        <div class="profile-badges">
                            <div class="profile-badge" onclick="fillLogin('ajustador@autogest.com', 'Ajustador123!', 'ajustador')">
                                <span>🔧</span> Ajustador
                            </div>
                            <div class="profile-badge" onclick="fillLogin('supervisor@autogest.com', 'Supervisor123!', 'supervisor')">
                                <span>✓</span> Supervisor
                            </div>
                            <div class="profile-badge" onclick="fillLogin('cliente@autogest.com', 'Cliente123!', 'asegurado')">
                                <span>👤</span> Asegurado
                            </div>
                        </div>
                    </div>
                </div>

                <!-- FORMULARIO DE REGISTRO MEJORADO -->
                <div id="registerForm" class="form-container">
                    <h2 class="form-title">
                        Crear cuenta nueva
                        <small>Todos los campos marcados con <span class="required">*</span> son obligatorios</small>
                    </h2>

                    <!-- Selector de tipo de usuario -->
                    <div class="user-type-selector">
                        <div class="user-type" onclick="selectUserType('ajustador')" id="typeAjustador">
                            <div class="user-type-icon">🔧</div>
                            <div class="user-type-name">Ajustador</div>
                            <div class="user-type-desc">Registra siniestros</div>
                        </div>
                        <div class="user-type" onclick="selectUserType('supervisor')" id="typeSupervisor">
                            <div class="user-type-icon">✓</div>
                            <div class="user-type-name">Supervisor</div>
                            <div class="user-type-desc">Autoriza pagos</div>
                        </div>
                        <div class="user-type" onclick="selectUserType('asegurado')" id="typeAsegurado">
                            <div class="user-type-icon">👤</div>
                            <div class="user-type-name">Asegurado</div>
                            <div class="user-type-desc">Da seguimiento</div>
                        </div>
                    </div>

                    <!-- Campos personales -->
                    <div class="form-row">
                        <div class="form-group">
                            <label>Nombre <span class="required">*</span></label>
                            <input type="text" id="regNombre" placeholder="Tu nombre">
                        </div>
                        <div class="form-group">
                            <label>Apellidos <span class="required">*</span></label>
                            <input type="text" id="regApellidos" placeholder="Tus apellidos">
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>Fecha de nacimiento <span class="required">*</span></label>
                            <input type="date" id="regFechaNacimiento" onchange="validateAge()">
                            <small id="ageMessage" style="color: #666; font-size: 0.8rem;"></small>
                        </div>
                        <div class="form-group">
                            <label>Género <span class="required">*</span></label>
                            <select id="regGenero">
                                <option value="">Seleccionar</option>
                                <option value="masculino">Masculino</option>
                                <option value="femenino">Femenino</option>
                                <option value="otro">Otro</option>
                                <option value="prefiero-no-decir">Prefiero no decir</option>
                            </select>
                        </div>
                    </div>

                    <!-- Foto de perfil -->
                    <div class="form-group">
                        <label>Foto de perfil <span class="required">*</span></label>
                        <div class="photo-upload" onclick="document.getElementById('fotoInput').click()">
                            <i>📷</i>
                            <span>Haz clic para subir una foto</span>
                        </div>
                        <input type="file" id="fotoInput" accept="image/*" style="display: none;" onchange="previewPhoto(event)">
                        <div class="photo-preview" id="photoPreview">
                            <img src="" alt="Vista previa">
                            <button class="remove-photo" onclick="removePhoto()">✕</button>
                        </div>
                    </div>

                    <!-- Datos de contacto -->
                    <div class="form-row">
                        <div class="form-group">
                            <label>Correo electrónico <span class="required">*</span></label>
                            <input type="email" id="regEmail" placeholder="correo@ejemplo.com" oninput="validateEmail()">
                        </div>
                        <div class="form-group">
                            <label>Alias <span class="required">*</span></label>
                            <input type="text" id="regAlias" placeholder="Cómo quieres ser llamado">
                        </div>
                    </div>

                    <!-- Contraseña con medidor de seguridad -->
                    <div class="form-group">
                        <label>Contraseña <span class="required">*</span></label>
                        <input type="password" id="regPassword" placeholder="Crea una contraseña segura" oninput="checkPasswordStrength()">
                        
                        <!-- Medidor de fortaleza -->
                        <div class="password-strength">
                            <div class="strength-bar">
                                <div class="strength-fill" id="strengthFill"></div>
                            </div>
                            <span class="strength-text" id="strengthText">Ingresa una contraseña</span>
                            
                            <!-- Requisitos de seguridad -->
                            <div class="strength-requirements">
                                <div class="requirement" id="reqLength">
                                    <span>🔴</span> Mínimo 8 caracteres
                                </div>
                                <div class="requirement" id="reqUpperCase">
                                    <span>🔴</span> Una mayúscula
                                </div>
                                <div class="requirement" id="reqNumber">
                                    <span>🔴</span> Un número
                                </div>
                                <div class="requirement" id="reqSpecial">
                                    <span>🔴</span> Un carácter especial
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Confirmar contraseña <span class="required">*</span></label>
                        <input type="password" id="regConfirmPassword" placeholder="Repite tu contraseña" oninput="validatePasswordMatch()">
                    </div>

                    <!-- Verificación de edad -->
                    <div class="age-verification">
                        <input type="checkbox" id="ageVerification" onchange="toggleRegisterButton()">
                        <label for="ageVerification">Confirmo que soy mayor de 18 años <span class="required">*</span></label>
                    </div>

                    <button class="btn" id="registerBtn" onclick="handleRegister()" disabled>Registrarse</button>
                </div>
            </div>
        </div>
    </div>

    <script src="login.js"></script>
       
</body>
</html>