<?php
// srry te cambie casi todo xd
require_once __DIR__ . '/../../classes/Autenticacion.php';

header("Content-Type: application/json");

// solamente POST papi
if($_SERVER['REQUEST_METHOD'] !== 'POST'){
    echo json_encode([
        'ok' => false,
        'mensaje' => 'Método no permitido'
    ]);
    exit;
}

// obtener datos
$data = json_decode(file_get_contents("php://input"),true);

if(!$data){
    echo json_encode([
        'ok' => false,
        'mensaje' => 'No se recibieron datos'
    ]);
    exit;
}

// validat campos
if(empty($data['email']) || empty($data['password']) || empty($data['tipoUsuario'])){
    echo json_encode([
        'ok' => false,
        'mensaje' => 'Todos los campos son obligatorios'
    ]);
    exit;
} 

// Procesame el login
$auth = new Autenticacion();
$resultado = $auth->login($data['email'],$data['password'],$data['tipoUsuario']);

echo json_encode($resultado);


// DEJO COMENTADO TODO POR SI LO REQUERIMOS ALGÚN DIA
// require_once __DIR__ . "/../classes/DB.php";

// // Limpiar cualquier salida anterior
// ob_clean();

// // Mostrar errores directamente en la pantalla
// ini_set('display_errors', 1);
// error_reporting(E_ALL);

// header("Content-Type: application/json");

// $data = json_decode(file_get_contents("php://input"), true);

// // Si no hay datos, mostrar error simple
// if (!$data) {
//     echo json_encode(['ok' => false, 'mensaje' => 'No se recibieron datos']);
//     exit;
// }

// // Verificar que la clase DB existe
// if (!class_exists('DB')) {
//     echo json_encode(['ok' => false, 'mensaje' => 'Clase DB no encontrada']);
//     exit;
// }

// try {
//     $db = new DB();
    
//     // Probar conexión con una consulta simple
//     $testQuery = $db->query("SELECT 1 as test");
    
//     if (empty($testQuery)) {
//         echo json_encode(['ok' => false, 'mensaje' => 'Error de conexión a la base de datos']);
//         exit;
//     }
    
//     // Consultar usuario
//     $sql = "SELECT ID_Usuario, Correo, Contra FROM usuario WHERE Correo = :email LIMIT 1";
//     $result = $db->query($sql, [':email' => $data['email']]);
    
//     if (empty($result)) {
//         echo json_encode(['ok' => false, 'mensaje' => 'Usuario no encontrado: ' . $data['email']]);
//         exit;
//     }
    
//     $usuario = $result[0];
    
//     echo json_encode([
//         'ok' => true, 
//         'mensaje' => 'Usuario encontrado',
//         'correo' => $usuario['Correo'],
//         'password_length' => strlen($usuario['Contra'])
//     ]);
    
// } catch (Exception $e) {
//     echo json_encode(['ok' => false, 'mensaje' => 'Excepción: ' . $e->getMessage()]);
// }
?>