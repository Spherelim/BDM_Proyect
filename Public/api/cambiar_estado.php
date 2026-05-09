<?php
session_start();
require_once __DIR__ . "/../classes/DB.php";
header('Content-Type: application/json');

if (!isset($_SESSION['usuario'])) {
    echo json_encode(['ok' => false, 'mensaje' => 'No autorizado']);
    exit;
}

$usuario = $_SESSION['usuario'];
if ($usuario['rol'] !== 'supervisor') {
    echo json_encode(['ok' => false, 'mensaje' => 'Solo supervisores pueden cambiar estados']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
if (!$data || empty($data['id_siniestro']) || empty($data['estado'])) {
    echo json_encode(['ok' => false, 'mensaje' => 'Faltan datos']);
    exit;
}

$db = new DB();

// Verificar si el siniestro ya está en estado final
$sql = "SELECT Estado FROM siniestro WHERE ID_Siniestro = ?";
$sin = $db->getRow($sql, [$data['id_siniestro']]);

if ($sin && in_array($sin['Estado'], ['Rechazado', 'Pérdida Total'])) {
    echo json_encode(['ok' => false, 'mensaje' => 'Este siniestro ya está cerrado']);
    exit;
}

// Actualizar estado
$sql = "UPDATE siniestro SET Estado = ? WHERE ID_Siniestro = ?";
$db->query($sql, [$data['estado'], $data['id_siniestro']]);

// Registrar en seguimiento
$sql = "INSERT INTO seguimiento (id_siniestro, tipo, titulo, descripcion, id_usuario) VALUES (?, 'estado', ?, ?, ?)";
$descripcion = "Estado cambiado a: " . $data['estado'];
if (in_array($data['estado'], ['Rechazado', 'Pérdida Total'])) {
    $descripcion .= " ⚠️ SINIESTRO CERRADO";
}
$db->query($sql, [$data['id_siniestro'], '⚙️ Cambio de Estado', $descripcion, $usuario['id']]);

// Notificar al ajustador
$sql = "SELECT id_Ajustador FROM siniestro WHERE ID_Siniestro = ?";
$sin = $db->getRow($sql, [$data['id_siniestro']]);
if ($sin) {
    $db->query("INSERT INTO notificacion (id_usuario, tipo, mensaje, id_referencia) VALUES (?, 'cambio_estado', ?, ?)",
        [$sin['id_Ajustador'], 'Estado: ' . $data['estado'], $data['id_siniestro']]);
}

echo json_encode(['ok' => true, 'mensaje' => 'Estado actualizado']);
?>