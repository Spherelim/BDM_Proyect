<?php 

class Usuario{
    private $db;

    public function __construct(){
        $this->db = new DB();
    }

    public function registrar($data){
        $resPersona = $this->db->callSP("sp_GestionPersona",[
            1,
            null,
            $data['nombre'],
            $data['apellidos'],
            $data['alias'],
            $data['fechaNacimiento'],
            null,
            $data['genero']
        ]);

        if(!$resPersona["ok"]) return $resPersona;

        $idPersona = $resPersona["data"][0]["IdPersona"];

        $resUsuario = $this->db->callSP("sp_GestionUsuario",[
            1,
            null,
            $data['email'],
            password_hash($data['password'],PASSWORD_DEFAULT),
            $data['rol'],
            $idPersona
        ]);

        return $resUsuario;
    }

}

?>