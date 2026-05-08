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
$usuarioId = $usuario['id'];

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(['ok' => false, 'mensaje' => 'No se recibieron datos']);
    exit;
}

$fecha_inicio = $data['fecha_inicio'] ?? null;
$fecha_fin = $data['fecha_fin'] ?? null;
$compania = $data['compania'] ?? null;
$poliza = $data['poliza'] ?? null;
$vehiculo = $data['vehiculo'] ?? null;
$cliente = $data['cliente'] ?? null;
$estado = $data['estado'] ?? null;

$db = new DB();

// Construir consulta con las columnas que SÍ existen en v_siniestros
$sql = "SELECT 
            siniestro, Folio, HoraSiniestro, Ubicacion, Alta, 
            Modificación, EstadoDelSiniestro, NumeroPolisa, Seguro, 
            Telefono_Emergencia, Asegurado, AliasAsegurado, Telefono, Correo,
            Ajustador, AliasAjustador, TelefonoAjustador, TipoSiniestro, 
            Descripcion, Lesionados, AutoridadesPresentes, UnidadDelAsegurado, 
            PlacaAsegurado, Serie, Tipo_Combus
        FROM v_siniestros WHERE 1=1";

$params = [];

if ($fecha_inicio && $fecha_fin) {
    $sql .= " AND HoraSiniestro BETWEEN :fecha_inicio AND :fecha_fin";
    $params[':fecha_inicio'] = $fecha_inicio;
    $params[':fecha_fin'] = $fecha_fin;
} elseif ($fecha_inicio) {
    $sql .= " AND HoraSiniestro >= :fecha_inicio";
    $params[':fecha_inicio'] = $fecha_inicio;
} elseif ($fecha_fin) {
    $sql .= " AND HoraSiniestro <= :fecha_fin";
    $params[':fecha_fin'] = $fecha_fin;
}

if ($compania) {
    $sql .= " AND Seguro = :compania";
    $params[':compania'] = $compania;
}

if ($poliza) {
    $sql .= " AND NumeroPolisa LIKE :poliza";
    $params[':poliza'] = "%$poliza%";
}

if ($vehiculo) {
    $sql .= " AND (PlacaAsegurado LIKE :vehiculo OR Serie LIKE :vehiculo)";
    $params[':vehiculo'] = "%$vehiculo%";
}

if ($cliente) {
    $sql .= " AND Asegurado LIKE :cliente";
    $params[':cliente'] = "%$cliente%";
}

if ($estado) {
    $sql .= " AND EstadoDelSiniestro = :estado";
    $params[':estado'] = $estado;
}

// Filtrar por rol
if ($rol == 'ajustador') {
    $sql .= " AND Ajustador = :ajustador_nombre";
    $params[':ajustador_nombre'] = $usuario['nombre'];
} elseif ($rol == 'asegurado') {
    $sql .= " AND Asegurado = :asegurado_nombre";
    $params[':asegurado_nombre'] = $usuario['nombre'];
}

try {
    $result = $db->query($sql, $params);
    echo json_encode(['ok' => true, 'siniestros' => $result]);
} catch (Exception $e) {
    echo json_encode(['ok' => false, 'mensaje' => $e->getMessage()]);
}
?>