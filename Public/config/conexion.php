<?php

class Conexion{
    private static $host = "";
    private static $db = "";
    private static $user = "";
    private static $pass = "";

    private static $conexion = null;

    public static function conectar(){
        if(self::$conexion === null){
            try {
                self::$conexion = new PDO(
                    "mysql:host=".self::$host.";dbname=".self::$db,
                    self::$user,
                    self::$pass
                );
                self::$conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                self::$conexion->exec("SET NAMES 'utf8'");

                echo "Conectado";

            } catch (PDOException $e) {
                die("Error: ".$e->getMessage());
            }

        }

        return self::$conexion;
    }

    public static function cerrar(){
        self::$conexion = null;
    }

}


?>