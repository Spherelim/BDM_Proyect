<?php
// Desactivar cualquier salida de errores
error_reporting(0);
ini_set('display_errors', 0);

session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['usuario'])) {
    echo json_encode(['ok' => false]);
    exit;
}

$termino = trim($_GET['q'] ?? '');

if (strlen($termino) < 3) {
    echo json_encode(['ok' => true, 'personas' => []]);
    exit;
}

// Buscar Conexion.php
$rutas = [
    __DIR__ . '/../../config/Conexion.php',
    dirname(__DIR__, 2) . '/config/Conexion.php',
    dirname(__DIR__, 1) . '/config/Conexion.php'
];

$conectado = false;
foreach ($rutas as $r) {
    if (file_exists($r)) { 
        require_once $r; 
        $conectado = true; 
        break; 
    }
}

if (!$conectado) {
    echo json_encode(['ok' => false, 'mensaje' => 'Error de config']);
    exit;
}

try {
    $pdo = Conexion::conectar();
    
    $sql = "SELECT 
                p.Nombre, 
                p.Apellido, 
                COALESCE(p.RFC, '') as RFC,
                COALESCE(p.Telefono, '') as Telefono,
                COALESCE(p.Direccion, '') as Direccion,
                COALESCE(u.Correo, '') as Correo,
                CONCAT(p.Nombre, ' ', p.Apellido) AS nombre_completo
            FROM persona p
            LEFT JOIN usuario u ON p.ID_Persona = u.id_persona
            WHERE p.Nombre LIKE :q1 
               OR p.Apellido LIKE :q2 
               OR CONCAT(p.Nombre, ' ', p.Apellido) LIKE :q3
               OR u.Correo LIKE :q4
            LIMIT 5";
    
    $stmt = $pdo->prepare($sql);
    $q = "%$termino%";
    $stmt->execute([
        ':q1' => $q,
        ':q2' => $q,
        ':q3' => $q,
        ':q4' => $q
    ]);
    
    $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'ok' => true,
        'personas' => $resultados
    ]);
    
} catch (Exception $e) {
    echo json_encode(['ok' => false, 'mensaje' => 'Error']);
}
?>