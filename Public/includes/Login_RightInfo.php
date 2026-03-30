<div class="forms-side">
                <!-- TABS DE NAVEGACIÓN -->
                <div class="tabs">
                    <div class="tab active" onclick="switchTab('login')">Iniciar Sesión</div>
                    <div class="tab" onclick="switchTab('register')">Registrarse</div>
                </div>

                <!-- FORMULARIO DE LOGIN (simplificado) -->
                <?php include '../includes/Log_Area.php'?>

                <!-- FORMULARIO DE REGISTRO MEJORADO -->
                <?php include '../includes/Reg_Area.php'?>
            </div>