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

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Obtener comentarios de un siniestro
    $id_siniestro = $_GET['id'] ?? 0;
    
    $sql = "SELECT c.ID_comentario, c.comentario, c.Fecha_Comentario,
                   u.ID_Usuario, u.Correo, p.Nombre, p.Apellido, p.Alias, p.Foto,
                   r.Nombre as rol
            FROM comentario c
            JOIN usuario u ON c.id_usuario = u.ID_Usuario
            JOIN persona p ON u.id_persona = p.ID_Persona
            JOIN rol r ON u.id_rol = r.ID_Rol
            WHERE c.id_siniestro = :id AND c.estado = 1
            ORDER BY c.Fecha_Comentario ASC";
    
    $comentarios = $db->query($sql, [':id' => $id_siniestro]);
    echo json_encode(['ok' => true, 'comentarios' => $comentarios]);
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Agregar comentario
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data || empty($data['comentario']) || empty($data['id_siniestro'])) {
        echo json_encode(['ok' => false, 'mensaje' => 'Faltan datos']);
        exit;
    }
    
    $sql = "INSERT INTO comentario (id_siniestro, id_usuario, comentario) 
            VALUES (:id_siniestro, :id_usuario, :comentario)";
    
    $db->execute($sql, [
        ':id_siniestro' => $data['id_siniestro'],
        ':id_usuario' => $usuario['id'],
        ':comentario' => $data['comentario']
    ]);
    
    echo json_encode(['ok' => true, 'mensaje' => 'Comentario agregado']);
}
?>