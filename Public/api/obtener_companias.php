<?php
// Quitar cualquier salida antes del JSON
ob_clean();
error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json');

// Buscar Conexion.php
$rutas = [
    __DIR__ . '/../../config/conexion.php',
    dirname(__DIR__, 2) . '/config/conexion.php',
    dirname(__DIR__, 1) . '/config/conexion.php',
    $_SERVER['DOCUMENT_ROOT'] . '/BDM_Proyect/config/conexion.php',
];

$ok = false;
foreach ($rutas as $r) {
    if (file_exists($r)) {
        require_once $r;
        $ok = true;
        break;
    }
}

if (!$ok) {
    echo json_encode(['ok' => false, 'mensaje' => 'Error de configuración']);
    exit;
}

try {
    $pdo = Conexion::conectar();
    
    // Consulta directa (sin SP, para evitar problemas)
    $sql = "SELECT ID_Seguro, Nombre_Empresa FROM compania_seguro ORDER BY Nombre_Empresa";
    $stmt = $pdo->query($sql);
    $companias = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'ok' => true,
        'companias' => $companias
    ]);
    
} catch (Exception $e) {
    echo json_encode(['ok' => false, 'mensaje' => 'Error: ' . $e->getMessage()]);
}
?>