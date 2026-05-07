<?php
require_once __DIR__ . "/../classes/DB.php";
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['usuario'])) {
    echo json_encode(['ok' => false, 'mensaje' => 'No autorizado']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$usuario = $_SESSION['usuario'];
$usuarioId = $usuario['id'];

if (!$data) {
    echo json_encode(['ok' => false, 'mensaje' => 'No se recibieron datos']);
    exit;
}

$db = new DB();

try {
    // Actualizar persona
    $sql = "UPDATE persona p
            JOIN usuario u ON p.ID_Persona = u.id_persona
            SET p.Nombre = :nombre,
                p.Apellido = :apellidos,
                p.Alias = :alias,
                p.Telefono = :telefono
            WHERE u.ID_Usuario = :usuario_id";
    
    $params = [
        ':nombre' => $data['nombre'],
        ':apellidos' => $data['apellidos'],
        ':alias' => $data['alias'],
        ':telefono' => $data['telefono'],
        ':usuario_id' => $usuarioId
    ];
    
    $db->execute($sql, $params);
    
    // Actualizar sesión
    $_SESSION['usuario']['nombre'] = $data['nombre'] . ' ' . $data['apellidos'];
    $_SESSION['usuario']['alias'] = $data['alias'];
    
    echo json_encode(['ok' => true, 'mensaje' => 'Perfil actualizado correctamente']);
    
} catch (Exception $e) {
    echo json_encode(['ok' => false, 'mensaje' => 'Error: ' . $e->getMessage()]);
}
?>