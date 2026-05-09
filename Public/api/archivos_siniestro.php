<?php
session_start();
require_once __DIR__ . "/../classes/DB.php";
header('Content-Type: application/json');

$id = $_GET['id'] ?? 0;
$db = new DB();

$sql = "SELECT * FROM archivo_siniestro WHERE id_Siniestro = ?";
$archivos = $db->query($sql, [$id]);

echo json_encode(['ok' => true, 'archivos' => $archivos]);
?>