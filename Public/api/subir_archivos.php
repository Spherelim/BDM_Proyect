<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['usuario']) || $_SESSION['usuario']['rol'] !== 'ajustador') {
    echo json_encode(['ok' => false, 'mensaje' => 'No autorizado']);
    exit;
}

$id_siniestro = $_POST['id_siniestro'] ?? 0;
$uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/BDM_Proyect/Public/assets/uploads/siniestros/';
if (!file_exists($uploadDir)) mkdir($uploadDir, 0777, true);

require_once __DIR__ . "/../classes/DB.php";
$db = new DB();

$archivos = [];
foreach ($_FILES['archivos']['tmp_name'] as $key => $tmp) {
    if ($_FILES['archivos']['error'][$key] === UPLOAD_ERR_OK) {
        $nombreOriginal = $_FILES['archivos']['name'][$key];
        $ext = strtolower(pathinfo($nombreOriginal, PATHINFO_EXTENSION));
        $nombreSistema = 'sin_' . time() . '_' . $key . '.' . $ext;
        $ruta = '/BDM_Proyect/Public/assets/uploads/siniestros/' . $nombreSistema;
        $mime = $_FILES['archivos']['type'][$key];
        $tipo = strpos($mime, 'image') !== false ? 'imagen' : 'video';
        
        if (move_uploaded_file($tmp, $uploadDir . $nombreSistema)) {
            $sql = "INSERT INTO archivo_siniestro (id_Siniestro, nombre_original, nombre_sistema, ruta, tipo, mime_type, extencion, tamaño) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            $db->query($sql, [$id_siniestro, $nombreOriginal, $nombreSistema, $ruta, $tipo, $mime, $ext, $_FILES['archivos']['size'][$key]]);
        }
    }
}

echo json_encode(['ok' => true, 'mensaje' => 'Archivos subidos']);
?>