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

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    echo json_encode(['ok' => false, 'mensaje' => 'Sin datos']);
    exit;
}

// INTENTAR MÚLTIPLES RUTAS PARA Conexion.php
$rutas = [
    __DIR__ . '/../../config/Conexion.php',
    dirname(__DIR__, 2) . '/config/Conexion.php',
    $_SERVER['DOCUMENT_ROOT'] . '/BDM_Proyect/config/Conexion.php',
    '../config/Conexion.php'
];

$conectado = false;
foreach ($rutas as $ruta) {
    if (file_exists($ruta)) {
        require_once $ruta;
        $conectado = true;
        break;
    }
}

if (!$conectado) {
    echo json_encode([
        'ok' => false, 
        'mensaje' => 'Error: No se encontró Conexion.php',
        'debug' => $rutas
    ]);
    exit;
}

try {
    $pdo = Conexion::conectar();
    
    $userId = $_SESSION['usuario']['id'];
    $nombre = trim($input['nombre'] ?? '');
    $apellidos = trim($input['apellidos'] ?? '');
    $fecha = $input['fecha_nacimiento'] ?? '';
    $genero = ($input['genero'] == 1) ? 1 : 0;
    $email = trim($input['email'] ?? '');
    $alias = trim($input['alias'] ?? '');

    // Buscar persona_id
    $stmt = $pdo->prepare("SELECT id_persona FROM usuario WHERE ID_Usuario = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();
    
    if (!$user) {
        echo json_encode(['ok' => false, 'mensaje' => 'Usuario no encontrado']);
        exit;
    }

    // ACTUALIZAR
    $genero = ($input['genero'] == 1) ? 1 : 0;

    $sql = "UPDATE persona SET Nombre=?, Apellido=?, FechaNac=?, Genero=CAST(? AS UNSIGNED), Alias=? WHERE ID_Persona=?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$nombre, $apellidos, $fecha, $genero, $alias, $user['id_persona']]);
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

    echo json_encode(['ok' => true, 'mensaje' => '✅ Perfil actualizado']);

} catch (Exception $e) {
    echo json_encode(['ok' => false, 'mensaje' => 'Error SQL: ' . $e->getMessage()]);
}