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

                    <!-- Fecha y Genero -->
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
                                <!-- <option value="otro">Otro</option>
                                <option value="prefiero-no-decir">Prefiero no decir</option> -->
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