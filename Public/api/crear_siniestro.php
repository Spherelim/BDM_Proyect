<?php
session_start();
header('Content-Type: application/json');

// DEBUG - Descomenta para ver qué llega
file_put_contents(__DIR__ . '/debug.log', 
    "Unidades: " . $unidades . "\n" . 
    "Archivos: " . $archivosJson . "\n", 
    FILE_APPEND
);

if (!isset($_SESSION['usuario']['id'])) {
    echo json_encode(['ok' => false, 'mensaje' => 'No autorizado']);
    exit;
}

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
    
    // Datos del formulario
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
    
    // ========== UNIDADES TERCERAS ==========
    $unidades = '[]';
    if (!empty($_POST['vehiculos'])) {
        $unidadesDecoded = json_decode($_POST['vehiculos'], true);
        if (is_array($unidadesDecoded) && count($unidadesDecoded) > 0) {
            $unidades = json_encode($unidadesDecoded);
        }
    }
    
    // ========== ARCHIVOS ==========
    $archivos = [];
    $dir = $_SERVER['DOCUMENT_ROOT'] . '/BDM_Proyect/Public/assets/uploads/siniestros/';
    if (!file_exists($dir)) {
        mkdir($dir, 0777, true);
    }
    
    if (isset($_FILES['archivos'])) {
        $files = $_FILES['archivos'];
        
        // Si es archivo único, convertirlo a array
        if (!is_array($files['name'])) {
            $files = [
                'name' => [$files['name']],
                'type' => [$files['type']],
                'tmp_name' => [$files['tmp_name']],
                'error' => [$files['error']],
                'size' => [$files['size']]
            ];
        }
        
        foreach ($files['tmp_name'] as $key => $tmp) {
            if ($files['error'][$key] === UPLOAD_ERR_OK) {
                $nombreOriginal = $files['name'][$key];
                $ext = strtolower(pathinfo($nombreOriginal, PATHINFO_EXTENSION));
                $nombreSistema = 'sin_' . time() . '_' . $key . '.' . $ext;
                $rutaCompleta = $dir . $nombreSistema;
                
                if (move_uploaded_file($tmp, $rutaCompleta)) {
                    $mime = $files['type'][$key];
                    $tipo = strpos($mime, 'image') !== false ? 'imagen' : 'video';
                    
                    $archivos[] = [
                        'nombre_original' => $nombreOriginal,
                        'nombre_sistema' => $nombreSistema,
                        'ruta' => '/BDM_Proyect/Public/assets/uploads/siniestros/' . $nombreSistema,
                        'tipo' => $tipo,
                        'mime_type' => $mime,
                        'extension' => $ext,
                        'tamano' => $files['size'][$key]
                    ];
                }
            }
        }
    }
    
    $archivosJson = '[]';
    
    // ========== LLAMAR SP ==========
    $sql = "CALL sp_crear_siniestro(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $nombre, $correo, $rfc, $tel, $dir,
        $marca, $modelo, $anio, $color, $serie, $placas,
        $combus, $comp_id, $poliza, $fecha, $tipo,
        $desc, $ubi, $lesionados, $autoridades, $ajustador,
        $unidades, $archivosJson
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