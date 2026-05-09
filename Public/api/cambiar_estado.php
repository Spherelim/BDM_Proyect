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

$sql = "UPDATE siniestro SET Estado = ? WHERE ID_Siniestro = ?";
$db->query($sql, [$data['estado'], $data['id_siniestro']]);

// Después de cambiar estado
// Notificar al ajustador
$sql = "SELECT id_Ajustador FROM siniestro WHERE ID_Siniestro = ?";
$sin = $db->getRow($sql, [$data['id_siniestro']]);
if ($sin) {
    $db->query("INSERT INTO notificacion (id_usuario, tipo, mensaje, id_referencia) VALUES (?, 'cambio_estado', ?, ?)",
        [$sin['id_Ajustador'], 'Estado actualizado: ' . $data['estado'], $data['id_siniestro']]);
}

echo json_encode(['ok' => true, 'mensaje' => 'Estado actualizado']);
?>