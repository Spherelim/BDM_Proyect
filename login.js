
        // Variables globales
        let selectedUserType = '';
        let isPasswordValid = false;
        let isEmailValid = false;
        let isAgeValid = false;

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

        // Seleccionar tipo de usuario
        function selectUserType(type) {
            selectedUserType = type;
            
            document.querySelectorAll('.user-type').forEach(el => {
                el.classList.remove('selected');
            });
            
            document.getElementById(`type${type.charAt(0).toUpperCase() + type.slice(1)}`).classList.add('selected');
            toggleRegisterButton();
        }

        // Validar edad
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

        // Vista previa de foto
        function previewPhoto(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.querySelector('.photo-upload').style.display = 'none';
                    const preview = document.getElementById('photoPreview');
                    preview.style.display = 'block';
                    preview.querySelector('img').src = e.target.result;
                }
                reader.readAsDataURL(file);
            }
        }

        function removePhoto() {
            document.getElementById('fotoInput').value = '';
            document.querySelector('.photo-upload').style.display = 'block';
            document.getElementById('photoPreview').style.display = 'none';
        }

        // Validar email
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

        // Verificar fortaleza de contraseña
        function checkPasswordStrength() {
            const password = document.getElementById('regPassword').value;
            
            // Requisitos
            const hasLength = password.length >= 8;
            const hasUpperCase = /[A-Z]/.test(password);
            const hasNumber = /[0-9]/.test(password);
            const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
            
            // Actualizar indicadores
            updateRequirement('reqLength', hasLength);
            updateRequirement('reqUpperCase', hasUpperCase);
            updateRequirement('reqNumber', hasNumber);
            updateRequirement('reqSpecial', hasSpecial);
            
            // Calcular fortaleza
            const strength = [hasLength, hasUpperCase, hasNumber, hasSpecial].filter(Boolean).length;
            const fill = document.getElementById('strengthFill');
            const text = document.getElementById('strengthText');
            
            const strengths = ['Muy débil', 'Débil', 'Media', 'Fuerte', 'Muy fuerte'];
            const colors = ['#dc3545', '#ff6b6b', '#ffd43b', '#51cf66', '#28a745'];
            
            fill.style.width = `${strength * 25}%`;
            fill.style.background = colors[strength];
            text.textContent = `Fortaleza: ${strengths[strength]}`;
            text.style.color = colors[strength];
            
            isPasswordValid = strength >= 3; // Requerimos al menos 3 de 4 requisitos
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

        // Validar que las contraseñas coincidan
        function validatePasswordMatch() {
            const password = document.getElementById('regPassword').value;
            const confirm = document.getElementById('regConfirmPassword').value;
            const confirmInput = document.getElementById('regConfirmPassword');
            
            if (password && confirm) {
                if (password === confirm) {
                    confirmInput.classList.remove('error');
                } else {
                    confirmInput.classList.add('error');
                    isPasswordValid = false;
                }
            }
            
            toggleRegisterButton();
        }

        // Habilitar/deshabilitar botón de registro
        function toggleRegisterButton() {
            const nombre = document.getElementById('regNombre').value;
            const apellidos = document.getElementById('regApellidos').value;
            const genero = document.getElementById('regGenero').value;
            const email = document.getElementById('regEmail').value;
            const alias = document.getElementById('regAlias').value;
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;
            const ageVerified = document.getElementById('ageVerification').checked;
            const foto = document.getElementById('fotoInput').files.length > 0;
            
            const allFields = nombre && apellidos && genero && email && alias && 
                             password && confirmPassword && selectedUserType && 
                             isAgeValid && isPasswordValid && isEmailValid && 
                             ageVerified && foto;
            
            document.getElementById('registerBtn').disabled = !allFields;
        }

        // Manejar registro
        function handleRegister() {
            if (document.getElementById('registerBtn').disabled) return;
            
            const userData = {
                tipo: selectedUserType,
                nombre: document.getElementById('regNombre').value,
                apellidos: document.getElementById('regApellidos').value,
                fechaNacimiento: document.getElementById('regFechaNacimiento').value,
                genero: document.getElementById('regGenero').value,
                email: document.getElementById('regEmail').value,
                alias: document.getElementById('regAlias').value,
                password: document.getElementById('regPassword').value
            };
            
            console.log('Registrando usuario:', userData);
            alert(`✅ Registro exitoso como ${selectedUserType}!\nBienvenido ${userData.alias}`);
            
            // Limpiar formulario y cambiar a login
            setTimeout(() => {
                switchTab('login');
            }, 1500);
        }

        // Autocompletar login
        function fillLogin(email, password, type) {
            document.getElementById('loginEmail').value = email;
            document.getElementById('loginPassword').value = password;
        }

        // Manejar login
        function handleLogin() {
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            if (email && password) {
                alert('✅ Inicio de sesión exitoso');
            } else {
                alert('❌ Por favor completa todos los campos');
            }
        }

        // Event listeners para validación en tiempo real
        document.getElementById('regNombre').addEventListener('input', toggleRegisterButton);
        document.getElementById('regApellidos').addEventListener('input', toggleRegisterButton);
        document.getElementById('regGenero').addEventListener('change', toggleRegisterButton);
        document.getElementById('regAlias').addEventListener('input', toggleRegisterButton);