<?php
require_once __DIR__ . "/../../classes/Usuario.php";
require_once "../../classes/DB.php";

$ruta = __DIR__ . "/../../classes/Usuario.php";

echo "Ruta: " . $ruta . "<br>";

if(file_exists($ruta)){
    echo "✅ SI EXISTE";
}else{
    echo "❌ NO EXISTE";
}

exit;

$usuario = new Usuario();
$res = $usuario->registrar($data);

var_dump($res);
exit;
try{
    echo json_encode($res);    
} catch(Throwable $e){
    echo json_encode([
        "ok" => false,
        "mensaje" => $e->getMessage()
    ]);
}

?>