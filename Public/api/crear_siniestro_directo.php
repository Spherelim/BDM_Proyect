<?php
session_start();
header('Content-Type: application/json');

$rutas = [__DIR__ . '/../../config/Conexion.php', 
dirname(__DIR__, 2) . '/config/Conexion.php',
dirname(__DIR__, 1) . '/config/Conexion.php'
];
foreach ($rutas as $r) { if (file_exists($r)) { require_once $r; break; } }

try {
    $pdo = Conexion::conectar();
    $pdo->beginTransaction();
    
    $nombre = $_POST['nombre_cliente'] ?? 'Sin nombre';
    $correo = $_POST['email'] ?? 'sin@email.com';
    $rfc = $_POST['rfc'] ?? '';
    $tel = $_POST['telefono'] ?? '';
    $dir = $_POST['direccion'] ?? '';
    $marca = $_POST['marca'] ?? '';
    $modelo = $_POST['modelo'] ?? '';
    $anio = $_POST['anio'] ?? 2024;
    $color = $_POST['color'] ?? '';
    $serie = $_POST['serie'] ?? '';
    $placas = $_POST['placas'] ?? '';
    $combus = $_POST['combustible'] ?? 'Gasolina';
    $comp_id = $_POST['compania_id'] ?? 1;
    $poliza = $_POST['num_poliza'] ?? 'POL-001';
    $fecha = $_POST['fecha_siniestro'] ?? date('Y-m-d H:i:s');
    $tipo = $_POST['tipo_siniestro'] ?? 'Choque';
    $desc = $_POST['descripcion'] ?? '';
    $ubicacion = $_POST['ubicacion'] ?? '';
    $lesionados = ($_POST['lesionados'] ?? 'no') === 'si' ? 1 : 0;
    $autoridades = ($_POST['autoridades'] ?? 'no') !== 'no' ? 1 : 0;
    $ajustador_id = $_SESSION['usuario']['id'];
    
    // 1. Insertar persona
    $stmt = $pdo->prepare("INSERT INTO persona (Nombre, Apellido, RFC, Telefono, Direccion) VALUES (?, '', ?, ?, ?)");
    $stmt->execute([$nombre, $rfc, $tel, $dir]);
    $persona_id = $pdo->lastInsertId();
    
    // 2. Insertar usuario
    $stmt = $pdo->prepare("INSERT INTO usuario (Correo, id_persona, Activo, id_rol) VALUES (?, ?, 1, 3)");
    $stmt->execute([$correo, $persona_id]);
    $usuario_id = $pdo->lastInsertId();
    
    // 3. Insertar unidad
    $stmt = $pdo->prepare("INSERT INTO unidad (Marca, Modelo, Anio, Color, Serie, Placa, Tipo_Combus, id_Usuario) VALUES (?,?,?,?,?,?,?,?)");
    $stmt->execute([$marca, $modelo, $anio, $color, $serie, $placas, $combus, $usuario_id]);
    $unidad_id = $pdo->lastInsertId();
    
    // 4. Insertar poliza
    $stmt = $pdo->prepare("INSERT INTO poliza (Num_Polisa, id_Usuario, id_Compania) VALUES (?,?,?)");
    $stmt->execute([$poliza, $usuario_id, $comp_id]);
    $poliza_id = $pdo->lastInsertId();
    
    // 5. Insertar siniestro
    $folio = date('Ymd') . rand(100, 999);
    $stmt = $pdo->prepare("INSERT INTO siniestro (Nombre, Folio, Fecha_Hora, Ubicacion, id_Poliza, id_Ajustador) VALUES (?,?,?,?,?,?)");
    $stmt->execute(["SN-$folio", $folio, $fecha, $ubicacion, $poliza_id, $ajustador_id]);
    $siniestro_id = $pdo->lastInsertId();
    
    // 6. Insertar detalle
    $stmt = $pdo->prepare("INSERT INTO detalle_siniestro (id_Siniestro, id_Vehiculo, TipoSiniestro, Descripcion, Lesionados, Autoridad_Pres) VALUES (?,?,?,?,?,?)");
    $stmt->execute([$siniestro_id, $unidad_id, $tipo, $desc, $lesionados, $autoridades]);
    
    $pdo->commit();
    
    echo json_encode([
        'ok' => true,
        'mensaje' => '✅ Siniestro creado',
        'siniestro' => ['Folio' => $folio, 'Nombre' => "SN-$folio"]
    ]);
    
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(['ok' => false, 'mensaje' => 'Error: ' . $e->getMessage()]);
}