<?php
require_once __DIR__ . "/../classes/DB.php";
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['usuario'])) {
    echo json_encode(['ok' => false, 'mensaje' => 'No autorizado']);
    exit;
}

$usuario = $_SESSION['usuario'];
$rol = $usuario['rol'];
$usuarioId = $usuario['id'];

$db = new DB();

$sql = "SELECT 
            s.ID_Siniestro as id,
            s.Folio as folio,
            s.Fecha_Hora as fecha_siniestro,
            s.Estatus as estado,
            pe.Nombre as cliente_nombre,
            u.Marca as marca,
            u.Modelo as modelo,
            u.Placa as placas,
            c.Nombre_Empresa as compania,
            aj.Nombre as ajustador_nombre
        FROM siniestro s
        JOIN poliza p ON s.id_Poliza = p.ID_Poliza
        JOIN compania_seguro c ON p.id_Compania = c.ID_Seguro
        JOIN usuario usu ON p.id_Usuario = usu.ID_Usuario
        JOIN persona pe ON usu.id_persona = pe.ID_Persona
        JOIN unidad u ON s.id_Unidad = u.ID_Unidad
        LEFT JOIN usuario usu_aj ON s.id_Ajustador = usu_aj.ID_Usuario
        LEFT JOIN persona aj ON usu_aj.id_persona = aj.ID_Persona";

if ($rol == 'ajustador') {
    $sql .= " WHERE s.id_Ajustador = :usuario_id";
} elseif ($rol == 'asegurado') {
    $sql .= " WHERE usu.ID_Usuario = :usuario_id";
}

try {
    $result = $db->query($sql, $params ?? []);
    echo json_encode(['ok' => true, 'siniestros' => $result]);
} catch (Exception $e) {
    echo json_encode(['ok' => false, 'mensaje' => $e->getMessage()]);
}
?>