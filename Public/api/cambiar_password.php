<?php
// Cambiar contraseña - API
session_start();

// Limpiar buffer
while (ob_get_level()) ob_end_clean();
header('Content-Type: application/json');

try {
    require_once __DIR__ . "/../classes/DB.php";
    
    if (!isset($_SESSION['usuario'])) {
        throw new Exception('No autorizado');
    }
    
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método no permitido');
    }
    
    $rawData = file_get_contents("php://input");
    $data = json_decode($rawData, true);
    
    if (!$data) {
        throw new Exception('Datos inválidos');
    }
    
    if (empty($data['password_actual']) || empty($data['password_nueva'])) {
        throw new Exception('Faltan datos');
    }
    
    $usuarioId = $_SESSION['usuario']['id'];
    $passActual = $data['password_actual'];
    $passNueva = $data['password_nueva'];
    
    if (strlen($passNueva) < 8) {
        throw new Exception('La nueva contraseña debe tener al menos 8 caracteres');
    }
    
    $db = new DB();
    
    // Obtener contraseña actual
    $sql = "SELECT Contra FROM usuario WHERE ID_Usuario = :id";
    $result = $db->query($sql, [':id' => $usuarioId]);
    
    if (empty($result)) {
        throw new Exception('Usuario no encontrado');
    }
    
    $usuario = $result[0];
    
    if (!password_verify($passActual, $usuario['Contra'])) {
        throw new Exception('Contraseña actual incorrecta');
    }
    
    // Hashear nueva contraseña
    $nuevaHash = password_hash($passNueva, PASSWORD_DEFAULT);
    
    // Actualizar usando query (que maneja UPDATE)
    $updateSql = "UPDATE usuario SET Contra = :nueva_password WHERE ID_Usuario = :id";
    $db->query($updateSql, [
        ':nueva_password' => $nuevaHash,
        ':id' => $usuarioId
    ]);
    
    echo json_encode(['ok' => true, 'mensaje' => 'Contraseña actualizada correctamente']);
    
} catch (Exception $e) {
    echo json_encode(['ok' => false, 'mensaje' => $e->getMessage()]);
}
?>