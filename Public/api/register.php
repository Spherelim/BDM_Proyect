<?php
    require_once __DIR__ . '/../../classes/Autenticacion.php';

    header("Content-Type: application/json");

    // Repetimos, solo POST
    if($_SERVER['REQUEST_METHOD'] !== 'POST'){
        echo json_encode(
            [
                'ok' => false,
                'mensaje' => 'Método no permitido'
            ]
        );
        exit;
    }

    // obtener datitos riquitos
    $data = json_decode(file_get_contents("php://input"),true);

    if(!$data){
        echo json_encode(
            [
                'ok' => false,
                'mensaje' => 'No se recibieron datos'
            ]
        );
        exit;
    }

    $auth = new Autenticacion();
    $resultado = $auth->registrar($data);

    echo json_encode($resultado);

// require_once __DIR__ . "/../classes/DB.php";
// require_once __DIR__ . "/../classes/Usuario.php";

// header("Content-Type: application/json");

// $data = json_decode(file_get_contents("php://input"), true);

// if (!$data) {
//     echo json_encode(['ok' => false, 'mensaje' => 'No se recibieron datos']);
//     exit;
// }

// // Validar campos obligatorios
// if (empty($data['nombre']) || empty($data['apellidos']) || empty($data['alias']) || 
//     empty($data['fechaNacimiento']) || empty($data['email']) || empty($data['password']) || 
//     empty($data['tipoUsuario'])) {
//     echo json_encode(['ok' => false, 'mensaje' => 'Todos los campos son obligatorios']);
//     exit;
// }

// // Mapear rol a ID (1=ajustador, 2=supervisor, 3=asegurado)
// $rolId = 1;
// if ($data['tipoUsuario'] == 'supervisor') $rolId = 2;
// elseif ($data['tipoUsuario'] == 'asegurado') $rolId = 3;

// // Convertir género a bit (1=masculino, 0=femenino)
// $genero = ($data['genero'] == 'masculino' || $data['genero'] == 'Masculino') ? 1 : 0;

// // Preparar datos para la clase Usuario
// $userData = [
//     'nombre' => $data['nombre'],
//     'apellidos' => $data['apellidos'],
//     'alias' => $data['alias'],
//     'fechaNacimiento' => $data['fechaNacimiento'],
//     'genero' => $genero,
//     'email' => $data['email'],
//     'password' => $data['password'],
//     'rol' => $rolId
// ];

// $usuario = new Usuario();
// $resultado = $usuario->registrar($userData);

// echo json_encode($resultado);
?>