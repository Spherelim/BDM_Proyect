<?php
session_start();
require_once __DIR__ . "/../classes/DB.php";
header('Content-Type: application/json');

if (!isset($_SESSION['usuario'])) {
    echo json_encode(['ok' => false]);
    exit;
}

$usuario = $_SESSION['usuario'];
$rol = $usuario['rol'];
$userId = $usuario['id'];
$db = new DB();

// Acción: marcar como leída
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $accion = $data['accion'] ?? '';
    
    if ($accion === 'marcar_leida') {
        $id = $data['id'] ?? 0;
        $db->query("UPDATE notificacion SET leida = 1 WHERE ID_Notificacion = ? AND id_usuario = ?", [$id, $userId]);
    } elseif ($accion === 'marcar_todas') {
        $db->query("UPDATE notificacion SET leida = 1 WHERE id_usuario = ? AND leida = 0", [$userId]);
    } elseif ($accion === 'eliminar') {
        $id = $data['id'] ?? 0;
        $db->query("DELETE FROM notificacion WHERE ID_Notificacion = ? AND id_usuario = ?", [$id, $userId]);
    }
    
    echo json_encode(['ok' => true]);
    exit;
}

// GET: Obtener notificaciones no leídas
$sql = "SELECT * FROM notificacion WHERE id_usuario = ? AND leida = 0 ORDER BY Fecha_Creacion DESC LIMIT 10";
$notificaciones = $db->query($sql, [$userId]);
$total = count($notificaciones);

echo json_encode([
    'ok' => true,
    'total' => $total,
    'notificaciones' => $notificaciones
]);
?>