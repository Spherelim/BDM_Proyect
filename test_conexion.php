<?php
// test_conexion.php - Versión simplificada

require_once __DIR__ . '/Public/config/conexion.php';

echo "<h1>Test de Conexion .env</h1>";

// Verificar si existe .env
$envPath = __DIR__ . '/.env';

if (!file_exists($envPath)) {
    echo "<div style='background: #ffe6e6; padding: 20px; border-left: 5px solid red;'>";
    echo "<h2 style='color: red;'>ERROR: Archivo .env NO encontrado</h2>";
    echo "<p>Buscado en: <code>" . $envPath . "</code></p>";
    echo "<p><strong>Solucion:</strong></p>";
    echo "<ol>";
    echo "<li>Copia <code>.env.example</code> a <code>.env</code> en la raiz del proyecto</li>";
    echo "<li>Ejecuta en terminal: <code>cp .env.example .env</code></li>";
    echo "</ol>";
    echo "</div>";
    exit;
}

echo "<p>✅ Archivo .env encontrado</p>";

try {
    $pdo = Conexion::conectar();

    echo "<div style='background: #e6ffe6; padding: 20px; border-left: 5px solid green;'>";
    echo "<h2 style='color: green;'>✅ Conexion exitosa!</h2>";

    $info = Conexion::obtenerInfoConexion();

    if ($info) {
        echo "<h3>Informacion de conexion:</h3>";
        echo "<ul>";
        echo "<li><strong>Host:</strong> " . htmlspecialchars($info['host']) . "</li>";
        echo "<li><strong>Puerto:</strong> " . htmlspecialchars($info['port']) . "</li>";
        echo "<li><strong>Base de datos:</strong> " . htmlspecialchars($info['database']) . "</li>";
        echo "<li><strong>Usuario:</strong> " . htmlspecialchars($info['user']) . "</li>";
        echo "<li><strong>Estado:</strong> " . htmlspecialchars($info['status']) . "</li>";
        echo "</ul>";
    }

    // Mostrar bases de datos
    $stmt = $pdo->query("SHOW DATABASES");
    $databases = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo "<h3>Bases de datos disponibles:</h3>";
    echo "<ul>";
    foreach ($databases as $db) {
        $icon = (isset($info['database']) && $db === $info['database']) ? '✅' : '📁';
        echo "<li>" . $icon . " " . htmlspecialchars($db) . "</li>";
    }
    echo "</ul>";
    echo "</div>";
} catch (Exception $e) {
    echo "<div style='background: #ffe6e6; padding: 20px; border-left: 5px solid red;'>";
    echo "<h2 style='color: red;'>ERROR</h2>";
    echo "<pre style='background: #fff; padding: 10px;'>" . htmlspecialchars($e->getMessage()) . "</pre>";
    echo "</div>";
}

echo "<hr>";
echo "<p><small>PHP Version: " . phpversion() . " | PDO Drivers: " . implode(', ', PDO::getAvailableDrivers()) . "</small></p>";
?>