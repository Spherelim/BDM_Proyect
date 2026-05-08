<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/../classes/Autenticacion.php';

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['ok' => false, 'mensaje' => 'Método no permitido']);
    exit;
}

// Obtener datos del FormData
$data = [
    'tipoUsuario' => $_POST['tipoUsuario'] ?? '',
    'nombre' => $_POST['nombre'] ?? '',
    'apellidos' => $_POST['apellidos'] ?? '',
    'fechaNacimiento' => $_POST['fechaNacimiento'] ?? '',
    'genero' => $_POST['genero'] ?? '',
    'email' => $_POST['email'] ?? '',
    'alias' => $_POST['alias'] ?? '',
    'password' => $_POST['password'] ?? ''
];

// Manejar la foto
$fotoRuta = null;
if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
    $dir = $_SERVER['DOCUMENT_ROOT'] . '/BDM_Proyect/Public/assets/uploads/fotos/';
    
    // Crear carpeta si no existe
    if (!file_exists($dir)) {
        mkdir($dir, 0777, true);
    }
    
    $ext = strtolower(pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION));
    $permitidos = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    
    if (in_array($ext, $permitidos)) {
        $nombreArchivo = 'perfil_' . time() . '_' . rand(1000, 9999) . '.' . $ext;
        $rutaCompleta = $dir . $nombreArchivo;
        
        if (move_uploaded_file($_FILES['foto']['tmp_name'], $rutaCompleta)) {
            $fotoRuta = '/BDM_Proyect/Public/assets/uploads/fotos/' . $nombreArchivo;
        }
    }
}

// Agregar la ruta de la foto a los datos
$data['foto'] = $fotoRuta;

if (!$data['nombre'] || !$data['email'] || !$data['password']) {
    echo json_encode(['ok' => false, 'mensaje' => 'Faltan datos obligatorios']);
    exit;
}

$auth = new Autenticacion();
$resultado = $auth->registrar($data);

echo json_encode($resultado);
?>