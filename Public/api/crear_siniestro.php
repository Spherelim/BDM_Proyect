<?php
error_reporting(E_ALL & ~E_WARNING);
ini_set('display_errors', 0);

session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['usuario']['id'])) {
    echo json_encode(['ok' => false, 'mensaje' => 'No autorizado']);
    exit;
}

$rutas = [
    __DIR__ . '/../../config/Conexion.php',
    dirname(__DIR__, 2) . '/config/Conexion.php',
    dirname(__DIR__, 1) . '/config/Conexion.php'
];

$conexionEncontrada = false;
foreach ($rutas as $r) {
    if (file_exists($r)) { 
        require_once $r; 
        $conexionEncontrada = true;
        break; 
    }
}

if (!$conexionEncontrada) {
    echo json_encode(['ok' => false, 'mensaje' => 'No se encontró el archivo de conexión']);
    exit;
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
    $anio = intval($_POST['anio'] ?? date('Y'));
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
    $uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/BDM_Proyect/Public/assets/uploads/siniestros/';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }
    
    if (isset($_FILES['archivos']) && !empty($_FILES['archivos']['name'][0])) {
        $files = $_FILES['archivos'];
        
        // Asegurarse que sea un array
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
                $rutaCompleta = $uploadDir . $nombreSistema;
                
                if (move_uploaded_file($tmp, $rutaCompleta)) {
                    $mime = $files['type'][$key];
                    $tipoArchivo = strpos($mime, 'image') !== false ? 'imagen' : 'video';
                    
                    $archivos[] = [
                        'nombre_original' => $nombreOriginal,
                        'nombre_sistema' => $nombreSistema,
                        'ruta' => '/BDM_Proyect/Public/assets/uploads/siniestros/' . $nombreSistema,
                        'tipo' => $tipoArchivo,
                        'mime_type' => $mime,
                        'extension' => $ext,
                        'tamano' => $files['size'][$key]
                    ];
                }
            }
        }
    }
    
    $archivosJson = json_encode($archivos);
    
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
    
    // Registrar en seguimiento
$db = new DB();
$db->query("INSERT INTO seguimiento (id_siniestro, tipo, titulo, descripcion, id_usuario) VALUES (?, 'registro', ?, ?, ?)",
    [$result['ID_Siniestro'], '📋 Siniestro Registrado', 'Siniestro creado por el ajustador', $ajustador]);

    // Notificar al supervisor
$sql = "SELECT ID_Usuario FROM usuario WHERE id_rol = 2 AND Activo = 1";
$supervisores = $db->query($sql);
foreach ($supervisores as $sup) {
    $db->query("INSERT INTO notificacion (id_usuario, tipo, mensaje, id_referencia) VALUES (?, 'siniestro_nuevo', ?, ?)", 
        [$sup['ID_Usuario'], 'Nuevo siniestro: ' . $nombre, $result['ID_Siniestro'] ?? 0]);
}

    // IMPORTANTE: Mover al siguiente resultset para obtener el resultado
    $stmt->nextRowset();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'ok' => true,
        'mensaje' => $result['Mensaje'] ?? '✅ Siniestro creado exitosamente',
        'siniestro' => $result
    ]);
    
} catch (Exception $e) {
    error_log("Error en crear_siniestro: " . $e->getMessage());
    echo json_encode(['ok' => false, 'mensaje' => 'Error: ' . $e->getMessage()]);
}
?>