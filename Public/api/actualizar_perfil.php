<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

// Verificar sesión activa
if (!isset($_SESSION['usuario']) || !isset($_SESSION['usuario']['id'])) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'mensaje' => 'Sesión no iniciada']);
    exit;
}

// Solo aceptar POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'mensaje' => 'Método no permitido']);
    exit;
}

// Obtener y decodificar datos JSON
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'mensaje' => 'Datos inválidos']);
    exit;
}

// Usar tu clase DB
require_once __DIR__ . '/../models/DB.php';
// O si está en otra ruta, ajusta según tu estructura:
// require_once dirname(__DIR__) . '/config/Conexion.php';
// require_once dirname(__DIR__) . '/models/DB.php';

try {
    $db = DB::getInstance();
    
    $user_id = $_SESSION['usuario']['id'];
    $nombre = trim($input['nombre'] ?? '');
    $apellidos = trim($input['apellidos'] ?? '');
    $fecha_nacimiento = $input['fecha_nacimiento'] ?? '';
    $genero = isset($input['genero']) ? (int)$input['genero'] : null;
    $alias = trim($input['alias'] ?? '');

    // Validaciones básicas
    if (empty($nombre) || strlen($nombre) < 2) {
        echo json_encode(['ok' => false, 'mensaje' => 'El nombre debe tener al menos 2 caracteres']);
        exit;
    }

    if (empty($apellidos) || strlen($apellidos) < 2) {
        echo json_encode(['ok' => false, 'mensaje' => 'Los apellidos deben tener al menos 2 caracteres']);
        exit;
    }

    if (empty($fecha_nacimiento)) {
        echo json_encode(['ok' => false, 'mensaje' => 'La fecha de nacimiento es obligatoria']);
        exit;
    }

    // Validar fecha
    $fecha_obj = DateTime::createFromFormat('Y-m-d', $fecha_nacimiento);
    if (!$fecha_obj || $fecha_obj->format('Y-m-d') !== $fecha_nacimiento) {
        echo json_encode(['ok' => false, 'mensaje' => 'Formato de fecha inválido']);
        exit;
    }

    // Verificar que no sea fecha futura
    if ($fecha_obj > new DateTime()) {
        echo json_encode(['ok' => false, 'mensaje' => 'La fecha de nacimiento no puede ser futura']);
        exit;
    }

    // Verificar edad mínima (18 años)
    $hoy = new DateTime();
    $edad = $hoy->diff($fecha_obj)->y;
    if ($edad < 18) {
        echo json_encode(['ok' => false, 'mensaje' => 'Debes ser mayor de 18 años']);
        exit;
    }

    if (!in_array($genero, [0, 1])) {
        echo json_encode(['ok' => false, 'mensaje' => 'Género inválido']);
        exit;
    }

    // Validar alias único si se proporciona
    if (!empty($alias)) {
        if (strlen($alias) < 3) {
            echo json_encode(['ok' => false, 'mensaje' => 'El alias debe tener al menos 3 caracteres']);
            exit;
        }
        
        // Verificar que el alias no esté en uso por otro usuario
        $aliasExiste = $db->getRow(
            "SELECT COUNT(*) as total 
             FROM persona p
             INNER JOIN usuario u ON p.ID_Persona = u.id_persona
             WHERE p.Alias = :alias AND u.ID_Usuario != :user_id",
            [':alias' => $alias, ':user_id' => $user_id]
        );
        
        if ($aliasExiste['total'] > 0) {
            echo json_encode(['ok' => false, 'mensaje' => 'Este alias ya está en uso por otro usuario']);
            exit;
        }
    }

    // Obtener id_persona del usuario
    $usuario = $db->getRow(
        "SELECT id_persona FROM usuario WHERE ID_Usuario = :user_id",
        [':user_id' => $user_id]
    );
    
    if (!$usuario) {
        echo json_encode(['ok' => false, 'mensaje' => 'Usuario no encontrado']);
        exit;
    }
    
    $id_persona = $usuario['id_persona'];
    
    // Preparar la actualización según si hay alias o no
    if (!empty($alias)) {
        $sql = "UPDATE persona 
                SET Nombre = :nombre, 
                    Apellido = :apellidos, 
                    FechaNac = :fecha_nacimiento, 
                    Genero = :genero, 
                    Alias = :alias 
                WHERE ID_Persona = :id_persona";
        
        $params = [
            ':nombre' => $nombre,
            ':apellidos' => $apellidos,
            ':fecha_nacimiento' => $fecha_nacimiento,
            ':genero' => $genero,
            ':alias' => $alias,
            ':id_persona' => $id_persona
        ];
    } else {
        $sql = "UPDATE persona 
                SET Nombre = :nombre, 
                    Apellido = :apellidos, 
                    FechaNac = :fecha_nacimiento, 
                    Genero = :genero 
                WHERE ID_Persona = :id_persona";
        
        $params = [
            ':nombre' => $nombre,
            ':apellidos' => $apellidos,
            ':fecha_nacimiento' => $fecha_nacimiento,
            ':genero' => $genero,
            ':id_persona' => $id_persona
        ];
    }
    
    $resultado = $db->query($sql, $params);
    
    // Actualizar la sesión con los nuevos datos
    $_SESSION['usuario']['nombre'] = $nombre;
    $_SESSION['usuario']['apellidos'] = $apellidos;
    $_SESSION['usuario']['fecha_nacimiento'] = $fecha_nacimiento;
    $_SESSION['usuario']['genero'] = $genero;
    if (!empty($alias)) {
        $_SESSION['usuario']['alias'] = $alias;
    }
    
    echo json_encode([
        'ok' => true, 
        'mensaje' => 'Perfil actualizado exitosamente',
        'datos' => [
            'nombre' => $nombre,
            'apellidos' => $apellidos,
            'fecha_nacimiento' => $fecha_nacimiento,
            'genero' => $genero,
            'alias' => !empty($alias) ? $alias : null
        ]
    ]);
    
} catch (Exception $e) {
    error_log("Error al actualizar perfil: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'ok' => false, 
        'mensaje' => 'Error al actualizar el perfil: ' . $e->getMessage()
    ]);
}
?>

<!-- <?php
require_once __DIR__ . "/../classes/DB.php";
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['usuario'])) {
    echo json_encode(['ok' => false, 'mensaje' => 'No autorizado']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$usuario = $_SESSION['usuario'];
$usuarioId = $usuario['id'];

if (!$data) {
    echo json_encode(['ok' => false, 'mensaje' => 'No se recibieron datos']);
    exit;
}

$db = new DB();

try {
    // Actualizar persona
    $sql = "UPDATE persona p
            JOIN usuario u ON p.ID_Persona = u.id_persona
            SET p.Nombre = :nombre,
                p.Apellido = :apellidos,
                p.Alias = :alias,
                p.Telefono = :telefono
            WHERE u.ID_Usuario = :usuario_id";
    
    $params = [
        ':nombre' => $data['nombre'],
        ':apellidos' => $data['apellidos'],
        ':alias' => $data['alias'],
        ':telefono' => $data['telefono'],
        ':usuario_id' => $usuarioId
    ];
    
    $db->execute($sql, $params);
    
    // Actualizar sesión
    $_SESSION['usuario']['nombre'] = $data['nombre'] . ' ' . $data['apellidos'];
    $_SESSION['usuario']['alias'] = $data['alias'];
    
    echo json_encode(['ok' => true, 'mensaje' => 'Perfil actualizado correctamente']);
    
} catch (Exception $e) {
    echo json_encode(['ok' => false, 'mensaje' => 'Error: ' . $e->getMessage()]);
}
?> -->