<?php
session_start();
require_once __DIR__ . "/../classes/DB.php";
header('Content-Type: application/json');

if (!isset($_SESSION['usuario'])) {
    echo json_encode(['ok' => false, 'mensaje' => 'No autorizado']);
    exit;
}

$usuario = $_SESSION['usuario'];
$db = new DB();

// GET - Obtener comentarios
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $id_siniestro = $_GET['id'] ?? 0;
    $sql = "SELECT c.*, p.Nombre, p.Apellido, p.Alias, r.Nombre as rol
            FROM comentario c
            JOIN usuario u ON c.id_usuario = u.ID_Usuario
            JOIN persona p ON u.id_persona = p.ID_Persona
            JOIN rol r ON u.id_rol = r.ID_Rol
            WHERE c.id_siniestro = ? AND c.estado = 1
            ORDER BY c.Fecha_Comentario ASC";
    $comentarios = $db->query($sql, [$id_siniestro]);
    echo json_encode(['ok' => true, 'comentarios' => $comentarios]);
}

// POST - Crear comentario
elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && !isset($_GET['action'])) {
    $data = json_decode(file_get_contents("php://input"), true);
    $sql = "INSERT INTO comentario (id_siniestro, id_usuario, comentario) VALUES (?, ?, ?)";
    $db->query($sql, [$data['id_siniestro'], $usuario['id'], $data['comentario']]);
    
    // NOTIFICAR a todos los involucrados EXCEPTO al que comenta
    $idSiniestro = $data['id_siniestro'];
    
    // Obtener el ajustador del siniestro
    $sql = "SELECT id_Ajustador FROM siniestro WHERE ID_Siniestro = ?";
    $siniestro = $db->getRow($sql, [$idSiniestro]);
    
    // Obtener el asegurado del siniestro
    $sql = "SELECT u.ID_Usuario FROM usuario u 
            JOIN poliza p ON u.ID_Usuario = p.id_Usuario 
            JOIN siniestro s ON p.ID_Poliza = s.id_Poliza 
            WHERE s.ID_Siniestro = ?";
    $asegurado = $db->getRow($sql, [$idSiniestro]);
    
    // Obtener supervisores
    $sql = "SELECT ID_Usuario FROM usuario WHERE id_rol = 2 AND Activo = 1";
    $supervisores = $db->query($sql);
    
    $notificados = []; // Para no duplicar
    
    // Notificar al ajustador (si no es el que comenta)
    if ($siniestro && $siniestro['id_Ajustador'] != $usuario['id'] && !in_array($siniestro['id_Ajustador'], $notificados)) {
        $db->query("INSERT INTO notificacion (id_usuario, tipo, mensaje, id_referencia) VALUES (?, 'comentario', ?, ?)",
            [$siniestro['id_Ajustador'], 'Nuevo comentario en siniestro #' . $idSiniestro, $idSiniestro]);
        $notificados[] = $siniestro['id_Ajustador'];
    }
    
    // Notificar al asegurado (si no es el que comenta)
    if ($asegurado && $asegurado['ID_Usuario'] != $usuario['id'] && !in_array($asegurado['ID_Usuario'], $notificados)) {
        $db->query("INSERT INTO notificacion (id_usuario, tipo, mensaje, id_referencia) VALUES (?, 'comentario', ?, ?)",
            [$asegurado['ID_Usuario'], 'Nuevo comentario en siniestro #' . $idSiniestro, $idSiniestro]);
        $notificados[] = $asegurado['ID_Usuario'];
    }
    
    // Notificar a supervisores (si no son los que comentan)
    foreach ($supervisores as $sup) {
        if ($sup['ID_Usuario'] != $usuario['id'] && !in_array($sup['ID_Usuario'], $notificados)) {
            $db->query("INSERT INTO notificacion (id_usuario, tipo, mensaje, id_referencia) VALUES (?, 'comentario', ?, ?)",
                [$sup['ID_Usuario'], 'Nuevo comentario en siniestro #' . $idSiniestro, $idSiniestro]);
            $notificados[] = $sup['ID_Usuario'];
        }
    }
    
    echo json_encode(['ok' => true, 'mensaje' => 'Comentario agregado']);
}
?>