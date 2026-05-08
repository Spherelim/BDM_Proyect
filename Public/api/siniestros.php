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
$nombreUsuario = $usuario['nombre'] . ' ' . ($usuario['apellidos'] ?? '');

$db = new DB();

// Usar la vista v_siniestros
$sql = "SELECT 
            ID_Siniestro as id,
            siniestro,
            Folio as folio,
            HoraSiniestro as fecha_siniestro,
            Ubicacion as ubicacion,
            EstadoDelSiniestro as estado,
            NumeroPolisa as num_poliza,
            Seguro as compania,
            Asegurado as cliente_nombre,
            AliasAsegurado as cliente_alias,
            Ajustador as ajustador_nombre,
            AliasAjustador as ajustador_alias,
            TipoSiniestro as tipo,
            Descripcion as descripcion,
            Lesionados as lesionados,
            AutoridadesPresentes as autoridades,
            UnidadDelAsegurado as vehiculo,
            PlacaAsegurado as placas,
            Serie as serie,
            Tipo_Combus as combustible,
            Telefono_Emergencia as telefono_emergencia
        FROM v_siniestros WHERE 1=1";

$params = [];

// 🔥 FILTRAR POR ROL
if ($rol === 'ajustador') {
    // El ajustador solo ve SUS siniestros
    $sql .= " AND Ajustador LIKE :ajustador_nombre";
    $params[':ajustador_nombre'] = '%' . $nombreUsuario . '%';
} elseif ($rol === 'asegurado') {
    // El asegurado solo ve siniestros donde él es el asegurado
    $sql .= " AND Asegurado LIKE :asegurado_nombre";
    $params[':asegurado_nombre'] = '%' . $nombreUsuario . '%';
}
// Si es supervisor, no se agrega filtro (ve TODOS)

$sql .= " ORDER BY HoraSiniestro DESC LIMIT 50";

try {
    $result = $db->query($sql, $params);
    echo json_encode(['ok' => true, 'siniestros' => $result]);
} catch (Exception $e) {
    echo json_encode(['ok' => false, 'mensaje' => $e->getMessage()]);
}