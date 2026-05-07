<?php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['usuario'])) {
    echo json_encode([
        'ok' => true,
        'rol' => $_SESSION['usuario']['rol'],
        'nombre' => $_SESSION['usuario']['nombre'],
        'apellidos' => $_SESSION['usuario']['apellidos'] ?? '',
        'alias' => $_SESSION['usuario']['alias'],
        'email' => $_SESSION['usuario']['email'],
        'fecha_nacimiento' => $_SESSION['usuario']['fecha_nacimiento'] ?? '',
        'genero' => $_SESSION['usuario']['genero'] ?? ''
    ]);
} else {
    echo json_encode(['ok' => false]);
}
?>