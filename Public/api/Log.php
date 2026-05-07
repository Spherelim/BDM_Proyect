<?php
// DEBUG
error_reporting(E_ALL);
ini_set('display_errors',1);

require_once __DIR__ . '/../classes/Autenticacion.php';

header("Content-Type: application/json");

// solamente POST
if($_SERVER['REQUEST_METHOD'] !== 'POST'){
    echo json_encode([
        'ok' => false,
        'mensaje' => 'Método no permitido'
    ]);
    exit;
}

// obtener datos
$rawData = file_get_contents("php://input");
$data = json_decode($rawData,true);

if(!$data){
    echo json_encode([
        'ok' => false,
        'mensaje' => 'No se recibieron datos'
    ]);
    exit;
}

// validar campos
if(empty($data['email']) || empty($data['password']) || empty($data['tipoUsuario'])){
    echo json_encode([
        'ok' => false,
        'mensaje' => 'Todos los campos son obligatorios'
    ]);
    exit;
}

// Procesar el login
$auth = new Autenticacion();
$resultado = $auth->login($data['email'], $data['password'], $data['tipoUsuario']);

// Si el login fue exitoso, asegurarnos que la sesión tenga todos los datos necesarios
if ($resultado['ok'] && isset($_SESSION['usuario'])) {
    // Aquí podemos agregar más datos a la sesión si es necesario
    // pero la clase Autenticacion ya debería hacerlo
}

echo json_encode($resultado);
?>