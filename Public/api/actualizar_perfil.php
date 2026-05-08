<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['usuario']['id'])) {
    echo json_encode(['ok' => false, 'mensaje' => 'No autorizado']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['ok' => false, 'mensaje' => 'Método no permitido']);
    exit;
}

// Cargar Conexion - RUTA CORREGIDA
$posiblesRutas = [
    __DIR__ . '/../../config/conexion.php',
    dirname(__DIR__, 2) . '/config/conexion.php',
    dirname(__DIR__, 1) . '/config/conexion.php',
    $_SERVER['DOCUMENT_ROOT'] . '/BDM_PROYECT/config/conexion.php',
];

$conectado = false;
foreach ($posiblesRutas as $ruta) {
    if (file_exists($ruta)) {
        require_once $ruta;
        $conectado = true;
        error_log("✅ Conexion encontrada en: " . $ruta);
        break;
    }
}

if (!$conectado) {
    // Debug: mostrar las rutas que intentó
    echo json_encode([
        'ok' => false, 
        'mensaje' => 'Error: No se encontró Conexion.php. Rutas intentadas: ' . implode(' | ', $posiblesRutas)
    ]);
    exit;
}

try {
    $pdo = Conexion::conectar();
    
    $userId = $_SESSION['usuario']['id'];
    $nombre = trim($_POST['nombre'] ?? '');
    $apellidos = trim($_POST['apellidos'] ?? '');
    $fecha = $_POST['fecha_nacimiento'] ?? '';
    $genero = ($_POST['genero'] == 1) ? 1 : 0;
    $email = trim($_POST['email'] ?? '');
    $alias = trim($_POST['alias'] ?? '');
    
    // Manejar foto
    $fotoRuta = $_SESSION['usuario']['foto'] ?? null;

    // Si se quiere quitar la foto
    if (isset($_POST['quitar_foto']) && $_POST['quitar_foto'] === '1') {
        $fotoRuta = null;
    }
    // Si se sube nueva foto
    elseif (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
        $dir = $_SERVER['DOCUMENT_ROOT'] . '/BDM_Proyect/Public/assets/uploads/fotos/';
        if (!file_exists($dir)) {
            mkdir($dir, 0777, true);
        }
        
        $ext = strtolower(pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION));
        $permitidos = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        
        if (in_array($ext, $permitidos)) {
            $nombreArchivo = 'perfil_' . $userId . '_' . time() . '.' . $ext;
            $rutaCompleta = $dir . $nombreArchivo;
            
            if (move_uploaded_file($_FILES['foto']['tmp_name'], $rutaCompleta)) {
                // Eliminar foto anterior si existe
                if ($fotoRuta) {
                    $fotoAnterior = $_SERVER['DOCUMENT_ROOT'] . $fotoRuta;
                    if (file_exists($fotoAnterior)) @unlink($fotoAnterior);
                }
                $fotoRuta = '/BDM_Proyect/Public/assets/uploads/fotos/' . $nombreArchivo;
            }
        }
    }

    // Buscar persona_id
    $stmt = $pdo->prepare("SELECT id_persona FROM usuario WHERE ID_Usuario = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();
    
    if (!$user) {
        echo json_encode(['ok' => false, 'mensaje' => 'Usuario no encontrado']);
        exit;
    }

    // Actualizar persona (incluyendo foto)
    $sql = "UPDATE persona SET Nombre=?, Apellido=?, FechaNac=?, Genero=?, Alias=?, Foto=? WHERE ID_Persona=?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$nombre, $apellidos, $fecha, $genero, $alias, $fotoRuta, $user['id_persona']]);

    // Actualizar usuario
    $sql2 = "UPDATE usuario SET Correo=? WHERE ID_Usuario=?";
    $stmt2 = $pdo->prepare($sql2);
    $stmt2->execute([$email, $userId]);

    // Actualizar sesión
    $_SESSION['usuario']['nombre'] = $nombre;
    $_SESSION['usuario']['apellidos'] = $apellidos;
    $_SESSION['usuario']['fecha_nacimiento'] = $fecha;
    $_SESSION['usuario']['genero'] = $genero;
    $_SESSION['usuario']['email'] = $email;
    $_SESSION['usuario']['alias'] = $alias;
    $_SESSION['usuario']['foto'] = $fotoRuta;

    echo json_encode([
        'ok' => true, 
        'mensaje' => '✅ Perfil actualizado',
        'foto' => $fotoRuta
    ]);

} catch (Exception $e) {
    echo json_encode(['ok' => false, 'mensaje' => 'Error: ' . $e->getMessage()]);
}