<?php

class Conexion{
    private static $host;
    private static $db;
    private static $user;
    private static $pass;
    private static $port;

    private static $conexion = null;

    private static $configuracionCargada = false;

    /*
        AQUI SE CARGA TODA LA CONFIGURACION DEL .env
    */
    private static function LoadConfiguration(){

        if(self::$configuracionCargada){
            return;
        }

        
        $envFile = dirname(__DIR__,2) . '/.env';

        if(!file_exists($envFile)){
            $mensaje = "ERROR CRÍTICO: Archivo .env no encontrado en:" . realpath(__DIR__ . '/..') . "/\n";
            $mensaje .= "Pasos a seguir:\n";
            $mensaje .= "   1. Copia el archivo .env.example a .env\n";
            $mensaje .= "   2. Configura tus credenciales de base de datos en .env\n";
            $mensaje .= "   3. Ejecuta: cp .env.example .env\n";

            self::registrarError($mensaje);
            throw new Exception($mensaje);
        }

        $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        
        if($lines === false){
            throw new Exception("No se pudo leer el archivo .env");
        }
        
        $envVars = [];

        foreach($lines as $line){

            $line = trim($line);

            // esto salta los comentarios
            if(empty($line) || strpos(trim($line), '#') === 0){
                continue;
            } 

            $parts = explode('=',$line,2);

            // lo canvie a una Clave=Valor
            if(count($parts) === 2){
                $key = trim($parts[0]);
                $value = trim($parts[1]);

                /* 
                en caso de que por error pongan "valor" 
                osea las comillas.
                */
                
                $value = trim($value, '"\'');

                $envVars[$key] = $value;
            }
        }

        // validar 
        $requeridas = ['DB_HOST','DB_NAME','DB_USER'];
        $faltantes = [];

        foreach($requeridas as $campo){
            if(!isset($envVars[$campo]) || empty($envVars[$campo])){
                $faltantes[] = $campo;
            }
        }

        if(!empty($faltantes)){
            $mensaje = "ERROR: Faltan variables requeridas en .env:\n";
            $mensaje .= "   - " . implode("\n   - ", $faltantes) . "\n";
            $mensaje .= " Verifica que tu archivo .env tenga estos campos configurados.\n";
            
            self::registrarError($mensaje);
            throw new Exception($mensaje);
        }

        self::$host = $envVars['DB_HOST'];
        self::$port = isset($envVars['DB_PORT']) ? $envVars['DB_PORT'] : '3306';
        // self::$host .= ':' . $port;
        self::$db = $envVars['DB_NAME'];
        self::$user = $envVars['DB_USER'];
        self::$pass = isset($envVars['DB_PASS']) ? $envVars['DB_PASS'] : '';

        // Debug
        if(($envVars['APP_DEBUG'] ?? 'false') === 'true'){
            error_log("configuración cargada desde .env");
            error_log("Host: " . self::$host . ":" . self::$port);
            error_log("Base de datos: " . self::$db);
            error_log("Usuario: " . self::$user);
        }

        self::$configuracionCargada = true;
        
    }

    private static function registrarError($mensaje) {
        // Log del servidor PHP
        error_log($mensaje);
        
        // Intentar mostrar en consola del navegador (solo si hay salida HTML)
        if (php_sapi_name() !== 'cli') {
            echo "<script>
                console.error(" . json_encode($mensaje) . ");
                console.log('%c Error de Configuración %cRevisa la consola del servidor para más detalles', 
                    'font-size: 16px; color: red;', 'font-size: 12px;');
            </script>";
        }
    }

    public static function conectar(){
        if(self::$conexion === null){
            try {

                self::LoadConfiguration();

                $dsn = "mysql:host=" . self::$host . ";port=" . self::$port . ";dbname=" . self::$db . ";charset=utf8mb4";

                self::$conexion = new PDO($dsn,self::$user,self::$pass,[
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]);

                self::$conexion->exec("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");

                if(self::$conexion){
                    error_log("Conexión exitosa a: " . self::$db . "@" . self::$host . ":" . self::$port);
                }

                // self::$conexion = new PDO(
                //     "mysql:host=".self::$host.";dbname=".self::$db,
                //     self::$user,
                //     self::$pass
                // );
                // self::$conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                // self::$conexion->exec("SET NAMES 'utf8'");

                //echo "Conectado";

            } catch (PDOException $e) {
                $mensaje = "ERROR DE CONEXIÓN MySQL:\n";
                $mensaje .= "   Host: " . self::$host . ":" . self::$port . "\n";
                $mensaje .= "   Base de datos: " . self::$db . "\n";
                $mensaje .= "   Error: " . $e->getMessage() . "\n";
                $mensaje .= " Verifica:\n";
                $mensaje .= "   1. Que MySQL esté corriendo\n";
                $mensaje .= "   2. Que el puerto sea correcto\n";
                $mensaje .= "   3. Que la base de datos '" . self::$db . "' exista\n";
                $mensaje .= "   4. Que el usuario y contraseña sean correctos\n";
                
                self::registrarError($mensaje);
                die("Error de conexión a la base de datos. Revisa los logs del servidor para más detalles.");
            }

        }

        return self::$conexion;
    }

    public static function cerrar(){
        self::$conexion = null;
        error_log("Conexión Cerrada");
    }

    public static function obtenerInfoConexion(){
        if(self::$conexion === null){
            return null;
        }

        return[
            'host' => self::$host,
            'port' => self::$port,
            'database' => self::$db,
            'user' => self::$user,
            'status' => 'Conectado ✅'
        ];
    }

}


?>