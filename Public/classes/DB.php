<?php
    require_once __DIR__ . "/../config/Conexion.php";

    class DB{
        private $conn;

        public function __construct(){
            $this->conn = Conexion::conectar();
        }

        // Por si se tiene que usar un SELECT
        public function query($sql,$params = []){
            $stmt = $this->conn->prepare($sql);
            $stmt->execute($params);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        // Por si se necesita usar un INS,UPD,DEL
        public function execute($sql,$params=[]){
            $stmt = $this->conn->prepare($sql);
            return $stmt->execute($params);
        }

        // Para usar los SP
        public function callSP($sp,$params=[]){
            $placeholders = implode(',',array_fill(0,count($params),'?'));
            $sql = "CALL $sp($placeholders)";

            $stmt = $this->conn->prepare($sql);
            $stmt->execute(array_values($params));

            $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $stmt->closeCursor();

            if(count($resultados) > 0 && isset($resultados[0]['Mensaje'])){
                return[
                    "ok"=>false,
                    "mensaje"=>$resultados[0]['Mensaje']
                ];
            }

            return[
                "ok" => true,
                "data"=>$resultados
            ];

        }

        // Por si se requiere usar las FN
        public function callFN($fn,$params=[]){
            $placeholders = implode(',',array_fill(0,count($params),'?'));
            $sql = "SELECT $fn($placeholders) AS resultado";

            $stmt = $this->conn->prepare($sql);
            $stmt->execute(array_values($params));

            return $stmt->fetch(PDO::FETCH_ASSOC)['resultado'];
        }

        public function cerrar(){
            Conexion::cerrar();
        }

    }
?>