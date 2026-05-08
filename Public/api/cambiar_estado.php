<?php
session_start();
require_once __DIR__ . "/../classes/DB.php";

header('Content-Type: application/json');

if (!isset($_SESSION['usuario'])) {
    echo json_encode(['ok' => false, 'mensaje' => 'No autorizado']);
    exit;
}

$usuario = $_SESSION['usuario'];

// Solo supervisor puede cambiar estados
if ($usuario['rol'] !== 'supervisor') {
    echo json_encode(['ok' => false, 'mensaje' => 'Solo los supervisores pueden cambiar estados']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['id_siniestro']) || empty($data['estado'])) {
    echo json_encode(['ok' => false, 'mensaje' => 'Faltan datos']);
    exit;
}

// Mapear estados
$estados = [
    'aceptado' => 'Aceptado',
    'rechazado' => 'Rechazado',
    'aceptado_con_deducible' => 'Aceptado con pago Deducible',
    'aceptado_sin_deducible' => 'Aceptado sin pago Deducible',
    'reparacion' => 'Aplica pago para reparación',
    'perdida_total' => 'Pérdida Total'
];

$estadoFinal = $estados[$data['estado']] ?? $data['estado'];

$db = new DB();

$sql = "UPDATE siniestro SET Estado = :estado WHERE ID_Siniestro = :id";
$db->execute($sql, [
    ':estado' => $estadoFinal,
    ':id' => $data['id_siniestro']
]);

echo json_encode(['ok' => true, 'mensaje' => 'Estado actualizado']);
?>