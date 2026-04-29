<?php
    // lo necesitara?
    require_once __DIR__ . "/../config/Conexion.php";

    class DB{
        private $conn;
        private static $instance = null;

        public function __construct(){
            $this->conn = Conexion::conectar();
        }

        // Hola Singleton
        public static function getInstance(){
            if(self::$instance === null){
                self::$instance = new self();
            }
            return self::$instance;
        }

        public function query($sql,$params = []){
            try{
                $stmt = $this->conn->prepare($sql);
                $stmt->execute($params);

                // SELECT
                if(stripos(trim($sql),'SELECT') === 0){
                    return $stmt->fetchAll(PDO::FETCH_ASSOC);
                }

                // INSERT, devolviendo el ID
                if(stripos(trim($sql),'INSERT') === 0){
                    return $this->conn->lastInsertId();
                }

                // UPDATE y DELETE, devuelve las filas afectadas
                return $stmt->rowCount();

            }catch (PDOException $e){
                error_log("Error DB: " . $e->getMessage());
                throw new Exception("Error en la base de datos: " . $e->getMessage());
            }

        }

        // obtener un solo registro
        public function getRow($sql, $params = []){
            $result = $this->query($sql,$params);
            return !empty($result) ? $result[0] : null;
        }

        // obtener conexxion PDO directamente
        public function getPdo(){
            return $this->conn;
        }

        // // Por si se tiene que usar un SELECT
        // public function query($sql,$params = []){
        //     $stmt = $this->conn->prepare($sql);
        //     $stmt->execute($params);
        //     return $stmt->fetchAll(PDO::FETCH_ASSOC);
        // }

        // // Por si se necesita usar un INS,UPD,DEL
        // public function execute($sql,$params=[]){
        //     $stmt = $this->conn->prepare($sql);
        //     return $stmt->execute($params);
        // }

        // // Para usar los SP
        // public function callSP($sp,$params=[]){
        //     $placeholders = implode(',',array_fill(0,count($params),'?'));
        //     $sql = "CALL $sp($placeholders)";

        //     $stmt = $this->conn->prepare($sql);
        //     $stmt->execute(array_values($params));

        //     $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);
        //     $stmt->closeCursor();

        //     if(count($resultados) > 0 && isset($resultados[0]['Mensaje'])){
        //         return[
        //             "ok"=>false,
        //             "mensaje"=>$resultados[0]['Mensaje']
        //         ];
        //     }

        //     return[
        //         "ok" => true,
        //         "data"=>$resultados
        //     ];

        // }

        // // Por si se requiere usar las FN
        // public function callFN($fn,$params=[]){
        //     $placeholders = implode(',',array_fill(0,count($params),'?'));
        //     $sql = "SELECT $fn($placeholders) AS resultado";

        //     $stmt = $this->conn->prepare($sql);
        //     $stmt->execute(array_values($params));

        //     return $stmt->fetch(PDO::FETCH_ASSOC)['resultado'];
        // }

        // public function cerrar(){
        //     Conexion::cerrar();
        // }

    }
?>