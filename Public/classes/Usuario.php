<?php 
require_once __DIR__ . "/DB.php";

class Usuario{
    private $db;

    public function __construct(){
        $this->db = new DB();
    }

    public function registrar($data){

        $genero = $data['genero'] == "masculino" ? 1 : 0;

        $roles = [
            "ajustador" => 1,
            "supervisor" => 2,
            "asegurador" => 3
        ];

        $idRol = $roles[$data['tipo']] ?? null;

        $resPersona = $this->db->callSP("sp_GestionPersona",[
            1,
            null,
            $data['nombre'],
            $data['apellidos'],
            $data['alias'],
            $data['fechaNacimiento'],
            null,
            $genero
        ]);

        if(!$resPersona["ok"]) return $resPersona;

        $idPersona = $resPersona["data"][0]["IdPersona"];

        $resUsuario = $this->db->callSP("sp_GestionUsuario",[
            1,
            null,
            $data['email'],
            password_hash($data['password'],PASSWORD_DEFAULT),
            $idRol,
            $idPersona
        ]);

        return $resUsuario;
    }

}

?>