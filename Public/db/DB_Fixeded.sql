CREATE DATABASE IF NOT EXISTS bdm_seguros;
USE bdm_seguros;

-- =====================
-- TABLAS
-- =====================

CREATE TABLE persona (
  ID_Persona INT AUTO_INCREMENT PRIMARY KEY,
  Nombre VARCHAR(50),
  Apellido VARCHAR(50),
  FechaNac DATE,
  Foto BLOB,
  Genero BIT,
  Alias VARCHAR(50)
);

CREATE TABLE rol (
  ID_Rol INT AUTO_INCREMENT PRIMARY KEY,
  Nombre ENUM('supervisor','ajustador','asegurado'),
  id_Compania INT
);

CREATE TABLE unidad (
  ID_Unidad INT AUTO_INCREMENT PRIMARY KEY,
  Placa VARCHAR(50),
  Marca VARCHAR(50),
  Modelo VARCHAR(50),
  Color VARCHAR(50),
  Serie VARCHAR(50)
);

CREATE TABLE usuario (
  ID_Usuario INT AUTO_INCREMENT PRIMARY KEY,
  Correo VARCHAR(50),
  Contra VARCHAR(255),
  Activo BIT DEFAULT 1,
  id_rol INT,
  id_persona INT,
  Fech_Alta DATETIME DEFAULT CURRENT_TIMESTAMP,
  Fech_Mod DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================
-- FUNCIONES
-- =====================

DELIMITER $$

CREATE FUNCTION fn_ExistePersona(F_IdPersona INT)
RETURNS INT
BEGIN
    DECLARE Existe INT;
    SELECT COUNT(*) INTO Existe FROM persona WHERE ID_Persona = F_IdPersona;
    RETURN Existe;
END$$

CREATE FUNCTION fn_ExisteUsuario(P_Correo VARCHAR(50))
RETURNS INT
BEGIN
    IF EXISTS(SELECT 1 FROM usuario WHERE Correo=P_Correo) THEN
        RETURN 1;
    ELSE
        RETURN 0;
    END IF;
END$$

DELIMITER ;

-- =====================
-- PROCEDIMIENTOS
-- =====================

DELIMITER $$

CREATE PROCEDURE sp_DeletePersona(IN P_IdPersona INT)
BEGIN
    IF fn_ExistePersona(P_IdPersona)=1 THEN
        DELETE FROM persona WHERE ID_Persona=P_IdPersona;
        SELECT 'Usuario Eliminado' AS MESSAGE_TEXT;
    ELSE
        SELECT 'Usuario Inexistente' AS MESSAGE_TEXT;
    END IF;
END$$

CREATE PROCEDURE sp_InsertPersona(
    IN P_Nombre VARCHAR(50),
    IN P_Apellido VARCHAR(50),
    IN P_Alias VARCHAR(50),
    IN P_FechaNac DATE,
    IN P_Foto BLOB,
    IN P_Genero BIT
)
BEGIN
    INSERT INTO persona(Nombre,Apellido,Genero,Alias,FechaNac,Foto)
    VALUES(P_Nombre,P_Apellido,P_Genero,P_Alias,P_FechaNac,P_Foto);

    SELECT 'Usuario Agregado' AS MESSAGE_TEXT;
END$$

DELIMITER ;

-- =====================
-- VISTAS (CORREGIDAS)
-- =====================

CREATE VIEW v_persona AS
SELECT 
    CONCAT(Nombre, ' ', Apellido) AS NombreCompleto,
    Genero,
    Alias,
    FechaNac,
    Foto
FROM persona;

CREATE VIEW v_usuario AS
SELECT 
    u.Correo,
    r.Nombre AS Rol,
    CONCAT(p.Nombre, ' ', p.Apellido) AS NombreCompleto,
    p.Alias,
    p.FechaNac
FROM usuario u
JOIN rol r ON u.id_rol = r.ID_Rol
JOIN persona p ON u.id_persona = p.ID_Persona;

CREATE VIEW v_unidad AS
SELECT 
    CONCAT(Marca, ', ', Modelo) AS Unidad,
    Placa,
    Color,
    Serie
FROM unidad;

-- =====================
-- TRIGGERS (OPCIONAL)
-- =====================

DELIMITER $$

CREATE TRIGGER tr_BajaPersona
BEFORE DELETE ON persona
FOR EACH ROW
BEGIN
    UPDATE usuario
    SET Activo = 0
    WHERE id_persona = OLD.ID_Persona;

    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Baja lógica aplicada';
END$$

DELIMITER ;