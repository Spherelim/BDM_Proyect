<?php
try {
    $pdo = new PDO("mysql:host=localhost:3306;charset=utf8", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stmt = $pdo->query("SHOW DATABASES");
    $databases = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    echo "<h2>Bases de datos disponibles:</h2>";
    echo "<ul>";
    foreach ($databases as $db) {
        echo "<li>" . htmlspecialchars($db) . "</li>";
    }
    echo "</ul>";
    
    // Verificar si bdm_seguros existe
    if (in_array('bdm_seguros', $databases)) {
        echo "<h3 style='color:green'>✅ Base de datos 'bdm_seguros' ENCONTRADA</h3>";
        
        // Conectar específicamente a bdm_seguros
        $pdo2 = new PDO("mysql:host=localhost:3306;dbname=bdm_seguros;charset=utf8", "root", "");
        echo "<h3 style='color:green'>✅ Conexión exitosa a bdm_seguros</h3>";
        
        // Mostrar tablas
        $tablas = $pdo2->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
        echo "<h4>Tablas encontradas:</h4><ul>";
        foreach ($tablas as $tabla) {
            echo "<li>" . htmlspecialchars($tabla) . "</li>";
        }
        echo "</ul>";
        
    } else {
        echo "<h3 style='color:red'>❌ Base de datos 'bdm_seguros' NO ENCONTRADA</h3>";
    }
    
} catch (PDOException $e) {
    echo "<h3 style='color:red'>Error: " . $e->getMessage() . "</h3>";
}
?>