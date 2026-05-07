<?php

    // esta mauser va manejar el registro y el login.

    require_once __DIR__ . '/DB.php';

    class Autenticacion{
        private $db;

        public function __construct(){
            $this->db = new DB();
        }

        /* registrame papito que no tengo tiempito */
        public function registrar($datos){
            try{

                //validamos antes que nada
                $this->validarDatosRegistro($datos);

                // email único
                if($this->emailExiste($datos['email'])){
                    return [
                        'ok' => false,
                        'mensaje' => 'Este correo ya está registrada'
                    ];
                }

                // alias unico
                if($this->aliasExiste($datos['alias'])){
                    return [
                        'ok' => false,
                        'mensaje' => 'Este alias ya está en uso'
                    ];
                }

                // te hasheo papito, por que te me chingan
                $passwordHash = password_hash(
                    $datos['password'],
                    PASSWORD_BCRYPT,
                    ['cost' => 12]
                );

                $roles = [
                    'ajustador' => 1,
                    'supervisor' => 2,
                    'asegurado' => 3
                ];

                $rolId = $roles[$datos['tipoUsuario']] ?? 3;
                $genero = ($datos['genero'] === 'masculino') ? 1 : 0;

                // cambiar a SP
                // PRIMERO: Insertar en persona
                $sqlPersona = "INSERT INTO persona (Nombre, Apellido, FechaNac, Genero, Alias) 
                            VALUES (:nombre, :apellido, :fecha_nacimiento, :genero, :alias)";
                
                $paramsPersona = [
                    ':nombre' => $datos['nombre'],
                    ':apellido' => $datos['apellidos'],
                    ':fecha_nacimiento' => $datos['fechaNacimiento'],
                    ':genero' => $genero,
                    ':alias' => $datos['alias']
                ];

                $idPersona = $this->db->query($sqlPersona, $paramsPersona);

                // SEGUNDO: Insertar en usuario con el id_persona
                $sqlUsuario = "INSERT INTO usuario (Correo, Contra, id_rol, id_persona, Activo) 
                            VALUES (:email, :password, :rol, :id_persona, 1)";
                
                $paramsUsuario = [
                    ':email' => $datos['email'],
                    ':password' => $passwordHash,
                    ':rol' => $rolId,
                    ':id_persona' => $idPersona
                ];

                $userId = $this->db->query($sqlUsuario, $paramsUsuario);

                return [
                    'ok' => true,
                    'mensaje' => 'Registro exitoso. Ahora puedes iniciar sesión.',
                    'userId' => $userId
                ];

            } catch (Exception $e) {
                error_log("Error en registro: " . $e->getMessage());
                return [
                    'ok' => false,
                    'mensaje' => 'Error al registrar: ' . $e->getMessage()
                ];
            }
        }

        // no ves? o no ubicas que es Ingresar
        public function login($email,$password,$tipoUsuario){
            try{
                //Buscar el Usuario por email
                // AHORA INCLUYE p.FechaNac para la sesión
                $sql = "SELECT u.ID_Usuario, p.Nombre, p.Apellido, p.Alias, 
                           u.Correo, u.Contra, p.Genero, p.Foto, p.FechaNac,
                           r.Nombre AS Nombre_Rol
                    FROM usuario u
                    INNER JOIN rol r ON u.id_rol = r.ID_Rol
                    INNER JOIN persona p ON u.id_persona = p.ID_Persona
                    WHERE u.Correo = :email 
                    AND LOWER(r.Nombre) = LOWER(:tipo)
                    LIMIT 1";

                $usuario = $this->db->getRow($sql, [
                    ':email' => $email,
                    ':tipo' => $tipoUsuario
                ]);

                if(!$usuario){
                    return [
                        'ok' => false,
                        'mensaje' => 'usuario no encontrado o tipo incorrecto'
                    ];
                }

                // verificar la contraseña
                $verifyResult = password_verify($password, $usuario['Contra']);
                $debug['password_verify_result'] = $verifyResult;

                if (!$verifyResult) {
                    return [
                        'ok' => false,
                        'mensaje' => 'Contraseña Incorrecta',
                        'debug' => $debug
                    ];
                }

                // Si todo está bien, iniciar sesión
                $this->iniciarSesion($usuario);

                 return [
                    'ok' => true,
                    'mensaje' => '¡Bienvenido ' . $usuario['Nombre'] . '!',
                    'usuario' => [
                        'id' => $usuario['ID_Usuario'],
                        'nombre' => $usuario['Nombre'],
                        'alias' => $usuario['Alias'],
                        'rol' => $usuario['Nombre_Rol']
                    ],
                    'debug' => $debug
                ];


            } catch (Exception $e){
                error_log("Error en login: " . $e->getMessage());
                return [
                    'ok' => false,
                    'mensaje' => 'Error al iniciar sesión' . $e->getMessage()
                ];
            }
        }

        // pos que más? cerrar sesion xd
        public function logout(){
            if(session_status() === PHP_SESSION_NONE){
                session_start();
            }
            session_destroy();
            return [
                'ok' => true,
                'mensaje' => 'Sesión cerrada'
            ];
        }

        // washate si hay sesión papito luego me regañan
        public static function verificarSesion(){
            if(session_status() === PHP_SESSION_NONE){
                session_start();
            }

            if(isset($_SESSION['usuario'])){
                return [
                    'ok' => true,
                    'usuario' => $_SESSION['usuario']
                ];
            }

            return [
                'ok' => false
            ];
        }

        //
        private function validarDatosRegistro($datos){
            $requeridos = ['nombre','apellidos','alias',
            'fechaNacimiento','genero','email','password',
            'tipoUsuario'];

            foreach ($requeridos as $campo){
                if(empty($datos[$campo])){
                    throw new Exception("El campo '$campo' es obligatorio");
                }
            }

            // valida tu correo chiquita que tengo prisa
            if(!filter_var($datos['email'],FILTER_VALIDATE_EMAIL)){
                throw new Exception('Email no válido');
            }

            // tambien tú contraseña
            if(strlen($datos['password']) < 8){
                throw new Exception('La contraseña debe tener al menos 8 caracteres');
            }

            // cuantos años tienes papito?
            $fechaNac = new DateTime($datos['fechaNacimiento']);
            $hoy = new DateTime();
            $edad = $hoy->diff($fechaNac)->y;

            if($edad < 18){
                throw new Exception('Debes ser mayor de 18 años');
            }

        }

        private function emailExiste($email){
            // cambiar por un SP
            $result = $this->db->getRow(
                "SELECT ID_Usuario FROM usuario WHERE Correo = :email",
            [':email' => $email]
            );

            return !empty($result);
        }

        private function aliasExiste($alias){
            // cambiar por un SP
            $result = $this->db->getRow(
                "SELECT ID_Persona FROM persona WHERE Alias = :alias",
            [':alias' => $alias]
            );
            return !empty($result);
        }

        private function iniciarSesion($usuario){
            if(session_status() === PHP_SESSION_NONE){
                session_start();
            }

            $_SESSION['usuario'] = [
                'id' => $usuario['ID_Usuario'],
                'nombre' => $usuario['Nombre'],
                'apellidos' => $usuario['Apellido'],
                'alias' => $usuario['Alias'],
                'email' => $usuario['Correo'],
                'rol' => $usuario['Nombre_Rol'],
                'foto' => $usuario['Foto'] ?? null,
                'fecha_nacimiento' => $usuario['FechaNac'] ?? null,
                'genero' => $usuario['Genero'] ?? null
            ];

            session_regenerate_id(true);
        }

    }

?>