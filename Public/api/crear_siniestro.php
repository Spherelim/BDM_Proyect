<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['usuario']['id'])) {
    echo json_encode(['ok' => false, 'mensaje' => 'No autorizado']);
    exit;
}

// Buscar Conexion.php
$rutas = [
    __DIR__ . '/../../config/Conexion.php',
    dirname(__DIR__, 2) . '/config/Conexion.php',
    dirname(__DIR__, 1) . '/config/Conexion.php'
];

foreach ($rutas as $r) {
    if (file_exists($r)) { require_once $r; break; }
}

try {
    $pdo = Conexion::conectar();
    
    // Recoger datos del POST
    $nombre = $_POST['nombre_cliente'] ?? 'Sin nombre';
    $correo = $_POST['email'] ?? 'sin@email.com';
    $rfc = $_POST['rfc'] ?? '';
    $tel = $_POST['telefono'] ?? '';
    $dir = $_POST['direccion'] ?? '';
    $marca = $_POST['marca'] ?? '';
    $modelo = $_POST['modelo'] ?? '';
    $anio = intval($_POST['anio'] ?? 2024);
    $color = $_POST['color'] ?? '';
    $serie = $_POST['serie'] ?? '';
    $placas = $_POST['placas'] ?? '';
    $combus = $_POST['combustible'] ?? 'Gasolina';
    $comp_id = intval($_POST['compania_id'] ?? 1);
    $poliza = $_POST['num_poliza'] ?? 'POL-001';
    $fecha = $_POST['fecha_siniestro'] ?? date('Y-m-d H:i:s');
    $tipo = $_POST['tipo_siniestro'] ?? 'Choque';
    $desc = $_POST['descripcion'] ?? '';
    $ubi = $_POST['ubicacion'] ?? '';
    $lesionados = ($_POST['lesionados'] ?? 'no') === 'si' ? 1 : 0;
    $autoridades = ($_POST['autoridades'] ?? 'no') !== 'no' ? 1 : 0;
    $ajustador = $_SESSION['usuario']['id'];
    
    // JSON para unidades y archivos (vacíos por ahora)
    $unidades = $_POST['vehiculos'] ?? '[]';
    $archivos = '[]';
    
    // Llamar al SP con 23 parámetros
    $sql = "CALL sp_crear_siniestro(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $nombre, $correo, $rfc, $tel, $dir,
        $marca, $modelo, $anio, $color, $serie, $placas,
        $combus, $comp_id, $poliza, $fecha, $tipo,
        $desc, $ubi, $lesionados, $autoridades, $ajustador,
        $unidades, $archivos
    ]);
    
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'ok' => true,
        'mensaje' => $result['Mensaje'] ?? '✅ Siniestro creado',
        'siniestro' => $result
    ]);
    
} catch (Exception $e) {
    echo json_encode(['ok' => false, 'mensaje' => 'Error: ' . $e->getMessage()]);
}
?>