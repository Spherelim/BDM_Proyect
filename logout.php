<?php

    require_once __DIR__ . '/../../classes/Autenticacion.php';

    $auth = new Autenticacion();
    $auth->logout();

    header('Location: /BDM_PROYECCT/Public/views/Login.php');
    exit;

// no se registra en el htlm es en el php
// session_start();
// session_destroy();
// header('Location: login.html');
// exit;
?>