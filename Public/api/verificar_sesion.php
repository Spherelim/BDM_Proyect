<?php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['usuario'])) {
    echo json_encode([
        'ok' => true,
        'rol' => $_SESSION['usuario']['rol'],
        'nombre' => $_SESSION['usuario']['nombre'],
        'alias' => $_SESSION['usuario']['alias'],
        'email' => $_SESSION['usuario']['email']
    ]);
} else {
    echo json_encode(['ok' => false]);
}
?>