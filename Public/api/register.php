<?php
require_once "../../clases/DB.php";

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$db = new DB();

$res = $db->callSP("sp_GestionUsuario", [
    1,
    null,
    $data['nombre'],
    $data['apellidos'],
    $data['email'],
    $data['alias'],
    $data['password'],
    $data['tipo']
]);

echo json_encode($res);