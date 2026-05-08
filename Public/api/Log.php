<?php
require_once __DIR__ . '/../classes/Autenticacion.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['ok' => false, 'mensaje' => 'Método no permitido']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || empty($input['email']) || empty($input['password'])) {
    echo json_encode(['ok' => false, 'mensaje' => 'Email y contraseña requeridos']);
    exit;
}

$auth = new Autenticacion();
$resultado = $auth->loginSinTipo($input['email'], $input['password']);

echo json_encode($resultado);
?>