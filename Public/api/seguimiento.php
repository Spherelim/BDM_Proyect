<?php
session_start();
require_once __DIR__ . "/../classes/DB.php";
header('Content-Type: application/json');

$id = $_GET['id'] ?? 0;
$db = new DB();

// Obtener seguimiento (línea de tiempo)
$sql = "SELECT s.*, p.Alias, p.Nombre, p.Apellido 
        FROM seguimiento s
        LEFT JOIN usuario u ON s.id_usuario = u.ID_Usuario
        LEFT JOIN persona p ON u.id_persona = p.ID_Persona
        WHERE s.id_siniestro = ?
        ORDER BY s.Fecha_Creacion ASC";
$seguimiento = $db->query($sql, [$id]);

// Verificar si está cerrado
$sql = "SELECT Estado FROM siniestro WHERE ID_Siniestro = ?";
$sin = $db->getRow($sql, [$id]);
$cerrado = $sin && in_array($sin['Estado'], ['Rechazado', 'Pérdida Total']);

echo json_encode([
    'ok' => true,
    'seguimiento' => $seguimiento,
    'cerrado' => $cerrado,
    'estado' => $sin['Estado'] ?? null
]);
?>