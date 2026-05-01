<?php

    // esta mauser va manejar el registro y el login.

    require_once __DIR__ . '/DB.php'

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
                if($this->aliasExistente($datos['alias'])){
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
                    'asegurador' => 3
                ];

                $rolId = $roles[$datos['tipoUsuario']] ?? 3;
                $genero = ($datos['genero'] === 'masculino') ? 1 : 0;

                // cambiar a SP
                $sql = "INSERT INTO usuario (
                        Nombre, Apellidos, Alias, Fecha_Nacimiento, 
                        Genero, Correo, Contra, ID_Rol
                    ) VALUES (
                        :nombre, :apellidos, :alias, :fecha_nacimiento,
                        :genero, :email, :password, :rol
                    )";

                $params = [
                    ':nombre' => $datos['nombre'],
                    ':apellidos' => $datos['apellidos'],
                    ':alias' => $datos['alias'],
                    ':fecha_nacimiento' => $datos['fechaNacimiento'],
                    ':genero' => $genero,
                    ':email' => $datos['email'],
                    ':password' => $passwordHash,
                    ':rol' => $rolId
                ];

                $userId = $this->db->query($sql,$params);

                return [
                    'ok' => true,
                    'mensaje' => 'Registro exitoso. Ahora puedes iniciar sesión.',
                    'userId' => $userId
                ];

            } catch (Exceptioon $e){
                error_log("Error en registro: " . $e->getMessage());
                return [
                    'ok' => true,
                    'mensaje' => 'Error al registrar: ' . $e->getMessage()
                ];
            }
        }

        // no ves? o no ubicas que es Ingresar
        public function login($email,$password,$tipoUsuario){
            try{
                //Buscar el Usuario por email
                // cambiar por un SP
                // $sql = "SELECT u.ID_Usuario, u.Nombre, u.Apellidos, u.Alias, 
                //            u.Correo, u.Contra, u.Genero, u.Foto_Perfil,
                //            r.Nombre_Rol
                //     FROM usuario u
                //     INNER JOIN rol r ON u.ID_Rol = r.ID_Rol
                //     WHERE u.Correo = :email 
                //     AND LOWER(r.Nombre_Rol) = LOWER(:tipo)
                //     LIMIT 1";

                $sql = "SELECT ID_Usuario, Correo, Contra FROM usuario WHERE Correo = :email LIMIT 1"

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
                if(!password_verify($password,$usuario['Contra'])){
                    return[
                        'ok' => true,
                        'mensaje' => '¡Bienvenido ' . $usuario['nombre'] . '!',
                        'usuario' => [
                            'id' => $usuario['ID_Usuario'],
                            'nombre' => $usuario['Nombre'],
                            'alias' => $usuario['Alias'],
                            'rol' => $usuario['Nombre_Rol']
                        ]
                    ];
                }
            } catch (Exception $e){
                error_log("Error en login: " . $e->getMessage());
                return [
                    'ok' => false,
                    'mensaje' => 'Error al iniciar sesión'
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
                "SELECT ID_Usuario FROM usuario WHERE Alias = :alias",
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
                'apellidos' => $usuario['Apellidos'],
                'alias' => $usuario['Alias'],
                'email' => $usuario['Correo'],
                'rol' => $usuario['Nombre_Rol'],
                'foto' => $usuario['Foto_Perfil'] ?? null
            ];

            session_regenerate_id(true);
        }



    }

?>