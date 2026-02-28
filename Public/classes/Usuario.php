<?php 

class Usuario{
    public $Nombre;
    public $Apellidos;
    public $Fech_Nac;
    public $Foto;
    public $Genero;
    public $Alias;

    public function __contruct($Nombre,$Apellido,$Fecha_Nac,
    $Foto,$Genero,$Alias)
    {
        $this->Nombre = $Nombre;
        $this->Apellidos = $Apellido;
        $this->Fech_Nac = $Fecha_Nac;
        $this->Foto = $Foto;
        $this->Genero = $Genero;
        $this->Alias = $Alias;
    }

    /*public function __contructor($Nombre,$Apellido)
    {
        $this->Nombre = $Nombre;
        $this->Apellido = $Apellido;
    }*/

    public function MostrarDatos(){
        echo $this->Nombre;
    }

}

?>