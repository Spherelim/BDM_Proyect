<?php
session_start();
require_once __DIR__ . "/../classes/DB.php";
header('Content-Type: application/json');

$id = $_GET['id_siniestro'] ?? 0;
$db = new DB();

$sql = "SELECT ut.* FROM unidad_tercera ut
        INNER JOIN detalle_siniestro de ON ut.ID_Tercero = de.id_UnidadTercera
        WHERE de.id_Siniestro = ?";
$unidades = $db->query($sql, [$id]);

echo json_encode(['ok' => true, 'unidades' => $unidades]);
?>