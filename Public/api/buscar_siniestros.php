<?php
session_start();
require_once __DIR__ . "/../classes/DB.php";

header('Content-Type: application/json');

if (!isset($_SESSION['usuario'])) {
    echo json_encode(['ok' => false, 'mensaje' => 'No autorizado']);
    exit;
}

$usuario = $_SESSION['usuario'];
$rol = $usuario['rol'];
$nombreUsuario = $usuario['nombre'] . ' ' . ($usuario['apellidos'] ?? '');

$data = json_decode(file_get_contents("php://input"), true);

$fecha_inicio = $data['fecha_inicio'] ?? null;
$fecha_fin = $data['fecha_fin'] ?? null;
$compania = $data['compania'] ?? null;
$poliza = $data['poliza'] ?? null;
$vehiculo = $data['vehiculo'] ?? null;
$cliente = $data['cliente'] ?? null;
$estado = $data['estado'] ?? null;

$db = new DB();

$sql = "SELECT 
            ID_Siniestro as id,
            siniestro,
            Folio as folio,
            HoraSiniestro as fecha_siniestro,
            EstadoDelSiniestro as estado,
            Asegurado as cliente_nombre,
            AliasAsegurado as cliente_alias,
            UnidadDelAsegurado as vehiculo,
            PlacaAsegurado as placas,
            Serie as serie,
            Seguro as compania,
            Ajustador as ajustador_nombre,
            TipoSiniestro as tipo
        FROM v_siniestros WHERE 1=1";

$params = [];

// 🔥 FILTRAR POR ROL (igual que en siniestros.php)
if ($rol === 'ajustador') {
    $sql .= " AND Ajustador LIKE :ajustador_nombre";
    $params[':ajustador_nombre'] = '%' . $nombreUsuario . '%';
} elseif ($rol === 'asegurado') {
    $sql .= " AND Asegurado LIKE :asegurado_nombre";
    $params[':asegurado_nombre'] = '%' . $nombreUsuario . '%';
}

// Filtros de búsqueda
if ($fecha_inicio && $fecha_fin) {
    $sql .= " AND HoraSiniestro BETWEEN :fecha_inicio AND :fecha_fin";
    $params[':fecha_inicio'] = $fecha_inicio;
    $params[':fecha_fin'] = $fecha_fin . ' 23:59:59';
} elseif ($fecha_inicio) {
    $sql .= " AND HoraSiniestro >= :fecha_inicio";
    $params[':fecha_inicio'] = $fecha_inicio;
} elseif ($fecha_fin) {
    $sql .= " AND HoraSiniestro <= :fecha_fin";
    $params[':fecha_fin'] = $fecha_fin . ' 23:59:59';
}

if ($compania) {
    $sql .= " AND Seguro LIKE :compania";
    $params[':compania'] = "%$compania%";
}

if ($poliza) {
    $sql .= " AND CAST(NumeroPolisa AS CHAR) LIKE :poliza";
    $params[':poliza'] = "%$poliza%";
}

if ($vehiculo) {
    $sql .= " AND (PlacaAsegurado LIKE :vehiculo OR Serie LIKE :vehiculo2)";
    $params[':vehiculo'] = "%$vehiculo%";
    $params[':vehiculo2'] = "%$vehiculo%";
}

if ($cliente) {
    $sql .= " AND Asegurado LIKE :cliente";
    $params[':cliente'] = "%$cliente%";
}

if ($estado) {
    $sql .= " AND EstadoDelSiniestro = :estado";
    $params[':estado'] = $estado;
}

$sql .= " ORDER BY HoraSiniestro DESC LIMIT 50";

try {
    $result = $db->query($sql, $params);
    echo json_encode(['ok' => true, 'siniestros' => $result]);
} catch (Exception $e) {
    echo json_encode(['ok' => false, 'mensaje' => $e->getMessage()]);
}