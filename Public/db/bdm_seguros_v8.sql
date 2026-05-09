-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 09-05-2026 a las 02:28:24
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bdm_seguros`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_buscar_siniestros` (IN `p_fecha_inicio` DATE, IN `p_fecha_fin` DATE, IN `p_compania_seguro` VARCHAR(100), IN `p_poliza` VARCHAR(100), IN `p_placas` VARCHAR(20), IN `p_serie` VARCHAR(50), IN `p_cliente` VARCHAR(150), IN `p_estado` VARCHAR(50))   BEGIN
    SELECT 
        s.siniestro,
        s.Folio,
        s.HoraSiniestro,
        s.Ubicacion,
        s.Alta,
        s.Modificación,
        s.EstadoDelSiniestro,
        s.NumeroPolisa,
        s.Seguro,
        s.Telefono_Emergencia,
        s.Asegurado,
        s.AliasAsegurado,
        s.Telefono,
        s.Correo,
        s.Ajustador,
        s.AliasAjustador,
        s.TelefonoAjustador,
        s.TipoSiniestro,
        s.Descripcion,
        s.Lesionados,
        s.AutoridadesPresentes,
        s.UnidadDelAsegurado,
        s.PlacaAsegurado,
        s.Serie,
        s.Tipo_Combus,
        s.UnidadesAfectadas
    FROM v_siniestros s
    WHERE
        (p_fecha_inicio IS NULL OR s.HoraSiniestro >= p_fecha_inicio)
        AND (p_fecha_fin IS NULL OR s.HoraSiniestro <= p_fecha_fin)
        AND (p_compania_seguro IS NULL OR s.Seguro = p_compania_seguro)
        AND (p_poliza IS NULL OR s.NumeroPolisa LIKE CONCAT('%', p_poliza, '%'))
        AND (p_placas IS NULL OR s.PlacaAsegurado LIKE CONCAT('%', p_placas, '%'))
        AND (p_serie IS NULL OR s.Serie LIKE CONCAT('%', p_serie, '%'))
        AND (p_cliente IS NULL OR s.Asegurado LIKE CONCAT('%', p_cliente, '%'))
        AND (p_estado IS NULL OR s.EstadoDelSiniestro = p_estado);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_cambiar_contrasena` (IN `p_id_usuario` INT, IN `p_contra_actual` VARCHAR(255), IN `p_contra_nueva` VARCHAR(255), IN `p_ip_origen` VARCHAR(45))   BEGIN
    DECLARE v_contra_almacenada VARCHAR(255);
    DECLARE v_ultimo_cambio DATETIME;
    DECLARE v_dias_espera INT DEFAULT 30;
    DECLARE v_horas_espera INT DEFAULT 0;
    DECLARE v_puede_cambiar BOOLEAN DEFAULT FALSE;
    
    -- Variables para el mensaje de error
    DECLARE v_mensaje_error VARCHAR(255);
    DECLARE v_horas_restantes INT;
    DECLARE v_dias_restantes INT;
    DECLARE v_horas INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error al cambiar contraseña.';
    END;
    
    START TRANSACTION;
    
    -- Obtener datos del usuario
    SELECT Contra, Fecha_Ultimo_Cambio 
    INTO v_contra_almacenada, v_ultimo_cambio
    FROM usuario 
    WHERE ID_Usuario = p_id_usuario;
    
    -- Validar que el usuario existe
    IF v_contra_almacenada IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Usuario no encontrado.';
    END IF;
    
    -- Validar contraseña actual
    IF v_contra_almacenada != p_contra_actual THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La contraseña actual es incorrecta.';
    END IF;
    
    -- Validar que la nueva contraseña sea diferente
    IF p_contra_actual = p_contra_nueva THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La nueva contraseña debe ser diferente a la actual.';
    END IF;
    
    -- Validar longitud mínima
    IF LENGTH(p_contra_nueva) < 8 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La contraseña debe tener al menos 8 caracteres.';
    END IF;
    
    -- Verificar si puede cambiar por tiempo
    IF v_ultimo_cambio IS NOT NULL THEN
        -- Verificar si ya pasó el tiempo de espera
        IF TIMESTAMPDIFF(HOUR, v_ultimo_cambio, NOW()) < (v_dias_espera * 24 + v_horas_espera) THEN
            -- Calcular tiempo restante
            SET v_horas_restantes = (v_dias_espera * 24 + v_horas_espera) - TIMESTAMPDIFF(HOUR, v_ultimo_cambio, NOW());
            SET v_dias_restantes = FLOOR(v_horas_restantes / 24);
            SET v_horas = v_horas_restantes % 24;
            
            -- Construir mensaje en variable
            SET v_mensaje_error = CONCAT('Debe esperar ', v_dias_restantes, ' días y ', v_horas, ' horas para cambiar su contraseña nuevamente.');
            
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_mensaje_error;
        END IF;
    END IF;
    
    -- Verificar que la nueva contraseña no esté en el historial
    IF EXISTS (
        SELECT 1 FROM historial_contrasenas 
        WHERE id_Usuario = p_id_usuario 
        AND Contra_Nueva = p_contra_nueva
        ORDER BY Fecha_Cambio DESC
        LIMIT 5
    ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No puede usar una contraseña que ya haya utilizado recientemente.';
    END IF;
    
    -- Guardar contraseña anterior en historial
    INSERT INTO historial_contrasenas (id_Usuario, Contra_Anterior, Contra_Nueva, IP_Origen)
    VALUES (p_id_usuario, v_contra_almacenada, p_contra_nueva, p_ip_origen);
    
    -- Actualizar contraseña
    UPDATE usuario 
    SET Contra = p_contra_nueva,
        Fecha_Ultimo_Cambio = NOW(),
        Intentos_Cambio = Intentos_Cambio + 1,
        Fech_Mod = NOW()
    WHERE ID_Usuario = p_id_usuario;
    
    COMMIT;
    
    -- Retornar éxito
    SELECT 
        'Contraseña actualizada exitosamente' AS Mensaje,
        DATE_ADD(NOW(), INTERVAL v_dias_espera DAY) AS Proximo_Cambio_Permitido,
        v_dias_espera AS Dias_Espera;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_crear_comentario` (IN `p_id_siniestro` INT, IN `p_id_usuario` INT, IN `p_comentario` TEXT)   BEGIN
    DECLARE v_siniestro_existe INT;
    DECLARE v_usuario_existe INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error al crear comentario.';
    END;
    
    START TRANSACTION;
    
    -- Validar que el siniestro existe
    SELECT COUNT(*) INTO v_siniestro_existe
    FROM siniestro 
    WHERE ID_Siniestro = p_id_siniestro;
    
    IF v_siniestro_existe = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El siniestro no existe.';
    END IF;
    
    -- Validar que el usuario existe
    SELECT COUNT(*) INTO v_usuario_existe
    FROM usuario 
    WHERE ID_Usuario = p_id_usuario;
    
    IF v_usuario_existe = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El usuario no existe.';
    END IF;
    
    -- Validar que el comentario no esté vacío
    IF p_comentario IS NULL OR TRIM(p_comentario) = '' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El comentario no puede estar vacío.';
    END IF;
    
    -- Insertar comentario
    INSERT INTO comentario (id_siniestro, id_usuario, comentario)
    VALUES (p_id_siniestro, p_id_usuario, p_comentario);
    
    COMMIT;
    
    -- Retornar el comentario creado con datos completos
    SELECT 
        c.ID_comentario,
        c.id_siniestro,
        c.id_usuario,
        CONCAT(p.Nombre, ' ', p.Apellido) AS Usuario,
        p.Alias,
        c.comentario,
        c.Fecha_Comentario,
        c.estado
    FROM comentario c
    INNER JOIN usuario u ON c.id_usuario = u.ID_Usuario
    INNER JOIN persona p ON u.id_persona = p.ID_Persona
    WHERE c.ID_comentario = LAST_INSERT_ID();
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Crear_Roles` ()   BEGIN
	INSERT INTO rol(Nombre)
    VALUES ('ajustador'),('supervisor'),('asegurado');
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_crear_siniestro` (IN `p_nombre_completo` VARCHAR(100), IN `p_correo` VARCHAR(100), IN `p_rfc` TEXT, IN `p_telefono` TEXT, IN `p_direccion` TEXT, IN `p_marca` VARCHAR(50), IN `p_modelo` VARCHAR(50), IN `p_anio` INT, IN `p_color` VARCHAR(50), IN `p_serie` VARCHAR(50), IN `p_placas` VARCHAR(20), IN `p_tipo_combus` VARCHAR(50), IN `p_compania_id` INT, IN `p_poliza` VARCHAR(100), IN `p_fecha` DATETIME, IN `p_tipo` VARCHAR(50), IN `p_descripcion` TEXT, IN `p_ubicacion` VARCHAR(100), IN `p_lesionados` BIT, IN `p_autoridades` BIT, IN `p_ajustador_id` INT, IN `p_unidades_terceras` TEXT, IN `p_archivos` TEXT)   BEGIN
    DECLARE v_usuario_id INT DEFAULT NULL;
    DECLARE v_persona_id INT DEFAULT NULL;
    DECLARE v_unidad_id INT DEFAULT NULL;
    DECLARE v_poliza_id INT DEFAULT NULL;
    DECLARE v_siniestro_id INT DEFAULT NULL;
    DECLARE v_ultimo_folio VARCHAR(50);
    DECLARE v_nuevo_folio VARCHAR(50);
    DECLARE v_nombre_siniestro VARCHAR(100);
    DECLARE v_anio_actual VARCHAR(4);
    DECLARE v_index INT DEFAULT 0;
    DECLARE v_count INT DEFAULT 0;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error al crear siniestro.';
    END;
    
    START TRANSACTION;
    
    SELECT u.ID_Usuario, u.id_persona 
    INTO v_usuario_id, v_persona_id
    FROM usuario u
    WHERE u.Correo = p_correo LIMIT 1;
    
    IF v_usuario_id IS NULL AND p_nombre_completo != '' THEN
        SELECT u.ID_Usuario, u.id_persona 
        INTO v_usuario_id, v_persona_id
        FROM usuario u
        INNER JOIN persona p2 ON u.id_persona = p2.ID_Persona
        WHERE CONCAT(p2.Nombre, ' ', p2.Apellido) LIKE CONCAT('%', p_nombre_completo, '%') LIMIT 1;
    END IF;
    
    IF v_usuario_id IS NULL THEN
        INSERT INTO persona (Nombre, Apellido, RFC, Telefono, Direccion, FechaNac, Genero)
        VALUES (SUBSTRING_INDEX(p_nombre_completo, ' ', 1), 
                SUBSTRING(p_nombre_completo, LENGTH(SUBSTRING_INDEX(p_nombre_completo, ' ', 1)) + 2), 
                p_rfc, p_telefono, p_direccion, '2000-01-01', 1);
        SET v_persona_id = LAST_INSERT_ID();
        
        INSERT INTO usuario (Correo, id_persona, Activo, id_rol)
        VALUES (p_correo, v_persona_id, 1, 3);
        SET v_usuario_id = LAST_INSERT_ID();
    ELSE
        UPDATE persona SET RFC = IFNULL(NULLIF(p_rfc, ''), RFC), 
            Telefono = IFNULL(NULLIF(p_telefono, ''), Telefono), 
            Direccion = IFNULL(NULLIF(p_direccion, ''), Direccion) 
        WHERE ID_Persona = v_persona_id;
        UPDATE usuario SET Correo = IFNULL(NULLIF(p_correo, ''), Correo) 
        WHERE ID_Usuario = v_usuario_id;
    END IF;
    
    INSERT INTO unidad (Marca, Modelo, Anio, Color, Serie, Placa, Tipo_Combus, id_Usuario)
VALUES (p_marca, p_modelo, p_anio, p_color, p_serie, p_placas, p_tipo_combus, v_usuario_id);
    SET v_unidad_id = LAST_INSERT_ID();
    
    INSERT INTO poliza (Num_Polisa, id_Usuario, id_Compania)
    VALUES (p_poliza, v_usuario_id, p_compania_id);
    SET v_poliza_id = LAST_INSERT_ID();
    
    SET v_anio_actual = YEAR(p_fecha);
    SELECT Folio INTO v_ultimo_folio FROM siniestro 
    WHERE YEAR(Fecha_Hora) = v_anio_actual ORDER BY ID_Siniestro DESC LIMIT 1;
    
    IF v_ultimo_folio IS NULL THEN 
        SET v_nuevo_folio = '0001';
    ELSE 
        SET v_nuevo_folio = LPAD(CAST(v_ultimo_folio AS UNSIGNED) + 1, 4, '0'); 
    END IF;
    
    SET v_nombre_siniestro = CONCAT('SN-', v_anio_actual, '-', v_nuevo_folio);
    
    INSERT INTO siniestro (Nombre, Folio, Ubicacion, Fecha_Hora, id_Poliza, id_Ajustador)
    VALUES (v_nombre_siniestro, v_nuevo_folio, p_ubicacion, p_fecha, v_poliza_id, p_ajustador_id);
    SET v_siniestro_id = LAST_INSERT_ID();
    
    INSERT INTO detalle_siniestro (id_Siniestro, id_Vehiculo, TipoSiniestro, Descripcion, Lesionados, Autoridad_Pres)
    VALUES (v_siniestro_id, v_unidad_id, p_tipo, p_descripcion, p_lesionados, p_autoridades);
    
    IF p_unidades_terceras IS NOT NULL AND p_unidades_terceras != '' AND p_unidades_terceras != '[]' THEN
        SET v_count = JSON_LENGTH(p_unidades_terceras); 
        SET v_index = 0;
        WHILE v_index < v_count DO
    INSERT INTO unidad_tercera (Marca_Modelo, Color, Placa, Danios_Aparentes, id_Seguro)
    VALUES (
        JSON_UNQUOTE(JSON_EXTRACT(p_unidades_terceras, CONCAT('$[', v_index, '].marca_modelo'))), 
        JSON_UNQUOTE(JSON_EXTRACT(p_unidades_terceras, CONCAT('$[', v_index, '].color'))), 
        JSON_UNQUOTE(JSON_EXTRACT(p_unidades_terceras, CONCAT('$[', v_index, '].placas'))), 
        JSON_UNQUOTE(JSON_EXTRACT(p_unidades_terceras, CONCAT('$[', v_index, '].danios'))), 
        JSON_EXTRACT(p_unidades_terceras, CONCAT('$[', v_index, '].id_seguro'))
    );
    -- ACTUALIZAR detalle_siniestro con el ID de la unidad tercera
    UPDATE detalle_siniestro 
    SET id_UnidadTercera = LAST_INSERT_ID()
    WHERE id_Siniestro = v_siniestro_id;
    SET v_index = v_index + 1;
END WHILE;
    END IF;
    
    IF p_archivos IS NOT NULL AND p_archivos != '' AND p_archivos != '[]' THEN
        SET v_count = JSON_LENGTH(p_archivos); 
        SET v_index = 0;
        WHILE v_index < v_count DO
            INSERT INTO archivo_siniestro (id_Siniestro, nombre_original, nombre_sistema, ruta, tipo, mime_type, extencion, tamano)
            VALUES (
                v_siniestro_id, 
                JSON_UNQUOTE(JSON_EXTRACT(p_archivos, CONCAT('$[', v_index, '].nombre_original'))), 
                JSON_UNQUOTE(JSON_EXTRACT(p_archivos, CONCAT('$[', v_index, '].nombre_sistema'))), 
                JSON_UNQUOTE(JSON_EXTRACT(p_archivos, CONCAT('$[', v_index, '].ruta'))), 
                JSON_UNQUOTE(JSON_EXTRACT(p_archivos, CONCAT('$[', v_index, '].tipo'))), 
                JSON_UNQUOTE(JSON_EXTRACT(p_archivos, CONCAT('$[', v_index, '].mime_type'))), 
                JSON_UNQUOTE(JSON_EXTRACT(p_archivos, CONCAT('$[', v_index, '].extension'))), 
                JSON_EXTRACT(p_archivos, CONCAT('$[', v_index, '].tamano'))
            );
            SET v_index = v_index + 1;
        END WHILE;
    END IF;
    
    COMMIT;
    
    SELECT v_siniestro_id AS ID_Siniestro, v_nombre_siniestro AS Nombre, v_nuevo_folio AS Folio, 'Siniestro creado exitosamente' AS Mensaje;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_DeleteRol` (IN `P_IdRol` INT)   BEGIN
IF fn_ExisteRolId(P_IdRol)=1 THEN
	DELETE FROM rol 
    WHERE ID_Rol=P_IdRol;
    SELECT 'Rol Eliminado' AS MESSAGE_TEXT;
ELSE
	SELECT 'Rol Inexistente' AS MESSAGE_TEXT;
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_editar_comentario` (IN `p_id_comentario` INT, IN `p_id_usuario` INT, IN `p_nuevo_comentario` TEXT)   BEGIN
    DECLARE v_autor_id INT;
    DECLARE v_estado BIT;
    
    -- Obtener el autor del comentario
    SELECT id_usuario, estado INTO v_autor_id, v_estado
    FROM comentario 
    WHERE ID_comentario = p_id_comentario;
    
    -- Validar que existe
    IF v_autor_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El comentario no existe.';
    END IF;
    
    -- Validar que esté activo
    IF v_estado = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se puede editar un comentario eliminado.';
    END IF;
    
    -- Validar que sea el autor
    IF v_autor_id != p_id_usuario THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Solo el autor puede editar este comentario.';
    END IF;
    
    -- Validar que no esté vacío
    IF p_nuevo_comentario IS NULL OR TRIM(p_nuevo_comentario) = '' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El comentario no puede estar vacío.';
    END IF;
    
    -- Actualizar comentario
    UPDATE comentario 
    SET comentario = p_nuevo_comentario,
        Fecha_Mod = NOW()
    WHERE ID_comentario = p_id_comentario;
    
    SELECT 'Comentario actualizado exitosamente' AS Mensaje;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_eliminar_comentario` (IN `p_id_comentario` INT, IN `p_id_usuario` INT)   BEGIN
    DECLARE v_autor_id INT;
    DECLARE v_es_admin BOOLEAN;
    
    -- Obtener el autor del comentario
    SELECT id_usuario INTO v_autor_id
    FROM comentario 
    WHERE ID_comentario = p_id_comentario;
    
    -- Validar que existe
    IF v_autor_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El comentario no existe.';
    END IF;
    
    -- Verificar si es administrador/supervisor
    SELECT (r.Nombre IN ('supervisor', 'ajustador')) INTO v_es_admin
    FROM usuario u
    INNER JOIN rol r ON u.id_rol = r.ID_Rol
    WHERE u.ID_Usuario = p_id_usuario;
    
    -- Validar permisos (autor o admin)
    IF v_autor_id != p_id_usuario AND NOT v_es_admin THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No tiene permisos para eliminar este comentario.';
    END IF;
    
    -- Soft delete (cambiar estado a 0)
    UPDATE comentario 
    SET estado = 0,
        Fecha_Mod = NOW()
    WHERE ID_comentario = p_id_comentario;
    
    SELECT 'Comentario eliminado exitosamente' AS Mensaje;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_GestionRol` (IN `P_Proceso` INT, IN `P_IdRol` INT, IN `P_Nombre` VARCHAR(20), IN `P_IdCompania` INT)   BEGIN
	IF P_Proceso = 0 THEN
    	IF P_Nombre IS NOT NULL AND P_Nombre !='' THEN
        	CALL sp_SelectRol(P_Nombre);
        ELSE
        	CALL sp_SelectRoles();
        END IF;
    ELSEIF P_Proceso = 1 THEN
    	CALL sp_InsertRol(P_Nombre,P_IdCompania);
    ELSEIF P_Proceso = 2 THEN
        	CALL sp_UpdateRol(P_IdRol,P_Nombre,P_IdCompania);
    ELSEIF P_Proceso = 3 THEN
            IF P_IdRol IS NOT NULL THEN
            CALL sp_DeleteRol(P_IdRol);
        ELSE
            SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'Falta IdRol para actualizar';
        END IF;
    ELSE
    	SELECT 'Operacion Inexistente 0-Select,1-INSERT,2-UPDATE,3-DELETE' AS MESSAGE_TEXT;
	END IF;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_InsertRol` (IN `P_Nombre` VARCHAR(20), IN `P_IdCompania` INT)   BEGIN
IF fn_ExisteRol(P_Nombre)=0 THEN
	IF P_Nombre IS NOT NULL THEN
        INSERT INTO rol(Nombre,id_Compania)
        VALUES(P_Nombre,P_IdCompania);
        SELECT 'Rol Agregado' AS MESSAGE_TEXT;
    ELSE
    	SELECT 'Ingrese Un Nombre' AS MESSAGE_TEXT;
    END IF;
ELSE
	SELECT 'Rol Ya Existente' AS MESSAGE_TEXT;
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_login_usuario` (IN `p_email` VARCHAR(255), IN `p_tipo` VARCHAR(100))   BEGIN
    SELECT VL.ID_Usuario,VL.Correo,VL.Contra,VL.Nombre,VL.Nombre,
    VL.Apellido,VL.Alias,VL.Genero,VL.Foto,VL.Nombre_Rol
    FROM v_login_usuario VL
    WHERE Correo = p_email
      AND LOWER(VL.Nombre_Rol) = LOWER(p_tipo)
    LIMIT 1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_obtener_comentarios` (IN `p_id_siniestro` INT)   BEGIN
    SELECT 
        c.ID_comentario,
        c.id_siniestro,
        c.id_usuario,
        CONCAT(p.Nombre, ' ', p.Apellido) AS Usuario,
        p.Alias,
        p.Foto,
        c.comentario,
        c.estado,
        CASE WHEN c.estado = 1 THEN 'Activo' ELSE 'Eliminado' END AS Estado_Comentario,
        c.Fecha_Comentario,
        c.Fecha_Mod
    FROM comentario c
    INNER JOIN usuario u ON c.id_usuario = u.ID_Usuario
    INNER JOIN persona p ON u.id_persona = p.ID_Persona
    WHERE c.id_siniestro = p_id_siniestro
    ORDER BY c.Fecha_Comentario DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_obtener_companias` ()   BEGIN
	SELECT CO.ID_Seguro, CO.Nombre_Empresa FROM compania_seguro CO;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_registrar_usuario` (IN `p_nombre` VARCHAR(100), IN `p_apellido` VARCHAR(100), IN `p_fecha_nac` DATE, IN `p_genero` TINYINT, IN `p_alias` VARCHAR(50), IN `p_correo` VARCHAR(255), IN `p_password` VARCHAR(255), IN `p_rol` INT)   BEGIN
    DECLARE v_id_persona INT;

    START TRANSACTION;

    -- Insertar en persona
    INSERT INTO persona (Nombre, Apellido, FechaNac, Genero, Alias)
    VALUES (p_nombre, p_apellido, p_fecha_nac, p_genero, p_alias);

    SET v_id_persona = LAST_INSERT_ID();

    -- Insertar en usuario
    INSERT INTO usuario (Correo, Contra, id_rol, id_persona, Activo)
    VALUES (p_correo, p_password, p_rol, v_id_persona, 1);

    COMMIT;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_SelectRol` (IN `P_NomRol` VARCHAR(20))   BEGIN
IF fn_ExisteRol(P_NomRol)=1 THEN
	SELECT VR.Nombre,
    VR.Empresa
    FROM v_rol VR
    WHERE VR.Nombre = P_NomRol;
ELSE
	SELECT 'No Existe El Rol' AS MESSAGE_TEXT;
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_SelectRoles` ()   BEGIN
	SELECT VR.Nombre,
    VR.Empresa
    FROM v_rol VR;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_UpdateRol` (IN `P_IdRol` INT, IN `P_Nombre` VARCHAR(20), IN `P_Compania` INT)   BEGIN
IF fn_ExisteRolId(P_IdRol)=1 THEN
	
    UPDATE rol R
    SET R.Nombre = P_Nombre,
    R.id_Compania = P_Compania
    WHERE R.ID_Rol = P_IdRol;
    
    SELECT 'Rol Actualizado' AS MESSAGE_TEXT;
ELSE
	SELECT 'Rol Inexistente' AS MESSAGE_TEXT;
END IF;
END$$

--
-- Funciones
--
CREATE DEFINER=`root`@`localhost` FUNCTION `fn_alias_existe` (`p_alias` VARCHAR(255)) RETURNS TINYINT(4) DETERMINISTIC BEGIN
    DECLARE existe INT;

    SELECT COUNT(*) INTO existe
    FROM persona
    WHERE Alias = p_alias;

    RETURN existe > 0;
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `fn_email_existe` (`p_email` VARCHAR(255)) RETURNS TINYINT(4) DETERMINISTIC BEGIN
    DECLARE existe INT;

    SELECT COUNT(*) INTO existe
    FROM usuario
    WHERE Correo = p_email;

    RETURN existe > 0;
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `fn_ExisteRol` (`F_Nombre` VARCHAR(20)) RETURNS INT(11) DETERMINISTIC BEGIN
	IF EXISTS (
        SELECT 1 FROM rol WHERE Nombre = F_Nombre
    ) THEN
        RETURN 1;
    ELSE
        RETURN 0;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `fn_ExisteRolId` (`F_IdRol` INT) RETURNS INT(11) DETERMINISTIC BEGIN
	IF EXISTS(
    	SELECT 1
        FROM rol R
        WHERE R.ID_Rol=F_IdRol
    ) THEN
    	RETURN 1;
    ELSE
    	RETURN 0;
    END IF;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `archivo_siniestro`
--

CREATE TABLE `archivo_siniestro` (
  `ID_Archivo` int(11) NOT NULL,
  `id_Siniestro` int(11) NOT NULL,
  `nombre_original` varchar(255) DEFAULT NULL,
  `nombre_sistema` varchar(255) DEFAULT NULL,
  `ruta` varchar(500) DEFAULT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `extencion` varchar(10) DEFAULT NULL,
  `tamano` int(11) DEFAULT NULL,
  `Fecha_Alta` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `archivo_siniestro`
--

INSERT INTO `archivo_siniestro` (`ID_Archivo`, `id_Siniestro`, `nombre_original`, `nombre_sistema`, `ruta`, `tipo`, `mime_type`, `extencion`, `tamano`, `Fecha_Alta`) VALUES
(1, 21, 'foto.png', 'sin_123.png', '/test.png', 'imagen', 'image/png', 'png', 50000, '2026-05-08 22:53:59'),
(2, 22, 'Captura de pantalla 2024-05-26 203120.png', 'sin_1778281024_0.png', '/BDM_Proyect/Public/assets/uploads/siniestros/sin_1778281024_0.png', 'imagen', 'image/png', 'png', 2124336, '2026-05-08 22:57:04'),
(3, 23, 'Captura de pantalla 2024-06-03 175018.png', 'sin_1778281289_0.png', '/BDM_Proyect/Public/assets/uploads/siniestros/sin_1778281289_0.png', 'imagen', 'image/png', 'png', 587225, '2026-05-08 23:01:29'),
(4, 24, 'Captura de pantalla 2024-06-02 160013.png', 'sin_1778282092_0.png', '/BDM_Proyect/Public/assets/uploads/siniestros/sin_1778282092_0.png', 'imagen', 'image/png', 'png', 498656, '2026-05-08 23:14:52'),
(5, 24, 'Captura de pantalla 2024-06-03 011408.png', 'sin_1778282092_1.png', '/BDM_Proyect/Public/assets/uploads/siniestros/sin_1778282092_1.png', 'imagen', 'image/png', 'png', 41030, '2026-05-08 23:14:52');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentario`
--

CREATE TABLE `comentario` (
  `ID_comentario` int(11) NOT NULL,
  `id_siniestro` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `comentario` text NOT NULL,
  `estado` bit(1) DEFAULT b'1',
  `Fecha_Comentario` timestamp NOT NULL DEFAULT current_timestamp(),
  `Fecha_Mod` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `comentario`
--

INSERT INTO `comentario` (`ID_comentario`, `id_siniestro`, `id_usuario`, `comentario`, `estado`, `Fecha_Comentario`, `Fecha_Mod`) VALUES
(1, 24, 4, 'Hola Soy el Supervisor', b'1', '2026-05-08 23:44:54', '2026-05-08 23:44:54'),
(2, 24, 1, 'Mentira yo soy el Supervisor', b'1', '2026-05-08 23:53:08', '2026-05-08 23:53:08'),
(3, 24, 8, 'Hola', b'1', '2026-05-09 00:20:07', '2026-05-09 00:20:07');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compania_seguro`
--

CREATE TABLE `compania_seguro` (
  `ID_Seguro` int(11) NOT NULL,
  `Nombre_Empresa` varchar(50) NOT NULL,
  `Telefono_Emergencia` varchar(50) NOT NULL,
  `RFC` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `compania_seguro`
--

INSERT INTO `compania_seguro` (`ID_Seguro`, `Nombre_Empresa`, `Telefono_Emergencia`, `RFC`) VALUES
(1, 'BBVA', '+52 1234567890', 'BVVA241NSJ123'),
(2, 'Qualitas', '+52 800 123 4567', 'QUA920101ABC'),
(3, 'GNP Seguros', '+52 800 234 5678', 'GNP920102DEF'),
(4, 'AXA Seguros', '+52 800 345 6789', 'AXA920103GHI'),
(5, 'Mapfre', '+52 800 456 7890', 'MAP920104JKL'),
(6, 'MetLife México', '+52 800 567 8901', 'MET920105MNO'),
(7, 'Seguros Banorte', '+52 800 678 9012', 'BAN920106PQR'),
(8, 'Seguros Inbursa', '+52 800 789 0123', 'INB920107STU'),
(9, 'HSBC Seguros', '+52 800 890 1234', 'HSB920108VWX'),
(10, 'Santander Seguros', '+52 800 901 2345', 'SAN920109YZA'),
(11, 'Seguros Azteca', '+52 800 012 3456', 'AZT920110BCD'),
(12, 'Afirme Seguros', '+52 800 111 2222', 'AFI920111EFG'),
(13, 'Seguros El Potosí', '+52 800 222 3333', 'POT920112HIJ'),
(14, 'Zurich Seguros', '+52 800 333 4444', 'ZUR920113KLM'),
(15, 'Allianz México', '+52 800 444 5555', 'ALL920114NOP'),
(16, 'Wibe Seguros', '+52 800 555 6666', 'WIB920115QRS');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_siniestro`
--

CREATE TABLE `detalle_siniestro` (
  `ID_Detalle` int(11) NOT NULL,
  `id_Siniestro` int(11) NOT NULL,
  `id_Vehiculo` int(11) DEFAULT NULL,
  `TipoSiniestro` enum('Choque','Volcadura','incendio','Robo','Impacto contra objeto fijo','Fenómeno natural','Vandalismo','otro') DEFAULT NULL,
  `Descripcion` text DEFAULT NULL,
  `Lesionados` bit(1) DEFAULT b'0',
  `Autoridad_Pres` bit(1) DEFAULT b'0',
  `id_UnidadTercera` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_siniestro`
--

INSERT INTO `detalle_siniestro` (`ID_Detalle`, `id_Siniestro`, `id_Vehiculo`, `TipoSiniestro`, `Descripcion`, `Lesionados`, `Autoridad_Pres`, `id_UnidadTercera`) VALUES
(4, 4, 5, 'Choque', '**El vehículo circulaba sobre Av. Constitución en dirección poniente cuando otro automóvil cambió de carril sin precaución, impactando el costado delantero izquierdo de la unidad. El choque ocasionó daños en la defensa, salpicadera y faro izquierdo. No se reportaron personas lesionadas, únicamente daños materiales.**\r\n', b'1', b'1', NULL),
(5, 5, 6, 'Choque', '**El vehículo circulaba sobre Av. Constitución en dirección poniente cuando otro automóvil cambió de carril sin precaución, impactando el costado delantero izquierdo de la unidad. El choque ocasionó daños en la defensa, salpicadera y faro izquierdo. No se reportaron personas lesionadas, únicamente daños materiales.**\r\n', b'1', b'1', NULL),
(7, 7, 8, 'Choque', 'Descripcion de prueba', b'0', b'0', NULL),
(8, 8, 9, 'Vandalismo', '**El vehículo se encontraba estacionado sobre la vía pública durante la noche cuando personas desconocidas ocasionaron daños por actos vandálicos. Al momento de la inspección se observaron rayones en ambos costados, cristal lateral quebrado y daños en la defensa delantera. No se identificaron responsables en el lugar de los hechos.**\r\n', b'1', b'1', NULL),
(10, 10, 11, 'Impacto contra objeto fijo', '**El vehículo circulaba sobre la avenida cuando el conductor perdió el control de la unidad debido al pavimento mojado, impactándose contra un objeto fijo (poste de alumbrado público) ubicado en el camellón central. Como resultado del impacto, se presentaron daños en la defensa delantera, cofre, parrilla y faros. No se reportaron personas lesionadas.**\r\n', b'1', b'1', NULL),
(11, 11, 12, 'Impacto contra objeto fijo', 'El vehículo...', b'0', b'0', NULL),
(13, 13, 14, 'Impacto contra objeto fijo', 'El vehículo impactó contra un poste al estacionarse.', b'0', b'0', NULL),
(18, 18, 19, 'Choque', 'Circulaba sobre Av. Universidad cuando un taxi impactó mi costado izquierdo.', b'0', b'1', NULL),
(19, 19, 20, 'Choque', 'Circulaba sobre Av. Universidad cuando un taxi impactó mi costado izquierdo.', b'0', b'1', NULL),
(21, 21, 22, 'Choque', 'Circulaba sobre Av. Universidad cuando un taxi impactó mi costado izquierdo.', b'0', b'1', NULL),
(22, 22, 23, 'Robo', 'Al regresar al estacionamiento de Plaza Centro después de hacer compras, encontré el vehículo con el cristal de la puerta del copiloto roto. Se sustrajeron un estéreo, una laptop y documentos personales que estaban en la guantera. Se realizó el reporte ante las autoridades y se presentó denuncia formal.', b'1', b'1', NULL),
(23, 23, 24, 'Choque', 'Circulaba por Periférico Sur en el carril central a 70 km/h cuando una camioneta Ford Explorer realizó un cambio de carril sin señalizar, impactando el costado trasero izquierdo de mi vehículo. Ambos conductores detuvieron la marcha y se llamó a las aseguradoras. El conductor de la Explorer aceptó su responsabilidad.', b'1', b'1', NULL),
(24, 24, 25, 'Choque', 'Circulaba por Calzada de Tlalpan cuando un Volkswagen Jetta se pasó un semáforo en rojo impactando la parte trasera de mi vehículo. El conductor del Jetta se detuvo y aceptó su responsabilidad. Ambos vehículos presentan daños materiales.', b'1', b'1', 14);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_contrasenas`
--

CREATE TABLE `historial_contrasenas` (
  `ID_Historial` int(11) NOT NULL,
  `id_Usuario` int(11) NOT NULL,
  `Contra_Anterior` varchar(255) NOT NULL,
  `Contra_Nueva` varchar(255) NOT NULL,
  `Fecha_Cambio` datetime NOT NULL DEFAULT current_timestamp(),
  `IP_Origen` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificacion`
--

CREATE TABLE `notificacion` (
  `ID_Notificacion` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `mensaje` varchar(255) NOT NULL,
  `id_referencia` int(11) DEFAULT NULL,
  `leida` bit(1) DEFAULT b'0',
  `Fecha_Creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `notificacion`
--

INSERT INTO `notificacion` (`ID_Notificacion`, `id_usuario`, `tipo`, `mensaje`, `id_referencia`, `leida`, `Fecha_Creacion`) VALUES
(1, 4, 'comentario', 'Nuevo comentario en siniestro #24', 24, b'0', '2026-05-09 00:20:07');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `persona`
--

CREATE TABLE `persona` (
  `ID_Persona` int(11) NOT NULL,
  `Nombre` varchar(50) NOT NULL,
  `Apellido` varchar(50) NOT NULL,
  `FechaNac` date NOT NULL,
  `Foto` varchar(255) DEFAULT NULL,
  `Genero` bit(1) NOT NULL,
  `Alias` varchar(50) DEFAULT NULL,
  `RFC` text DEFAULT NULL,
  `Telefono` text DEFAULT NULL,
  `Direccion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `persona`
--

INSERT INTO `persona` (`ID_Persona`, `Nombre`, `Apellido`, `FechaNac`, `Foto`, `Genero`, `Alias`, `RFC`, `Telefono`, `Direccion`) VALUES
(1, 'Mauricio Eleuterio', 'Ortiz Rodriguez', '2004-12-06', '/BDM_Proyect/Public/assets/uploads/fotos/perfil_1_1778231003.jpg', b'1', 'El Dios de los anillos', 'OIRM041206HNLHSDC09', '51 3562 4856', 'Av. Los Pinos #245, Col. Vista Hermosa, Monterrey, Nuevo León'),
(2, 'Jose Armando', 'Perez Villareal', '2000-03-12', '/BDM_Proyect/Public/assets/uploads/fotos/perfil_2_1778231455.jpg', b'1', 'Dedente', 'RFC123', '555-1234', 'Calle 123'),
(3, 'Rey', 'Castillo Guerrero', '2002-07-23', NULL, b'1', 'ReynaldoCastillo', NULL, NULL, NULL),
(4, 'Erick Fernandez', 'Musambani Faira', '1997-02-23', '/BDM_Proyect/Public/assets/uploads/fotos/perfil_4_1778231537.jpg', b'1', 'El Rey', 'FMFE970223HNLKJAS23', '51 3562 4856', 'C:/xampp/htdocs/BDM_Proyect/Public/assets/uploads/siniestros/'),
(5, 'Jose Armando Perez Villareal', '', '2000-01-01', NULL, b'1', NULL, 'PEVJ000312HNLRRS09', '51 3562 4856', 'Av. Los Pinos #245, Col. Vista Hermosa, Monterrey, Nuevo León'),
(6, 'Jose Armando Perez Villareal', '', '2000-01-01', NULL, b'1', NULL, 'PEVJ000312HNLRRS09', '51 3562 4856', 'Av. Los Pinos #245, Col. Vista Hermosa, Monterrey, Nuevo León'),
(7, 'Erick', 'Fernandez Musambani Faria', '2000-01-01', NULL, b'1', NULL, '', '51 3502 4555', ''),
(8, 'Andres David', 'Hernandez Cortez', '2004-07-09', '/BDM_Proyect/Public/assets/uploads/fotos/perfil_1778277526_1264.jpg', b'1', 'Andres David God', 'HEHA040709ABC', '55 1234 5678', 'Av. Insurgentes Sur #1234, CDMX');

--
-- Disparadores `persona`
--
DELIMITER $$
CREATE TRIGGER `tr_BajaPersona` BEFORE DELETE ON `persona` FOR EACH ROW BEGIN
	UPDATE usuario
    SET Activo = 0
    WHERE id_persona = OLD.ID_Persona;
    
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'No se permite eliminar, se aplicó baka lógica';
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `poliza`
--

CREATE TABLE `poliza` (
  `ID_Poliza` int(11) NOT NULL,
  `Num_Polisa` int(11) DEFAULT NULL,
  `id_Usuario` int(11) NOT NULL,
  `id_Compania` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `poliza`
--

INSERT INTO `poliza` (`ID_Poliza`, `Num_Polisa`, `id_Usuario`, `id_Compania`) VALUES
(4, 2147483647, 5, 1),
(5, 2147483647, 6, 1),
(7, 0, 2, 1),
(8, 2147483647, 1, 1),
(10, 2147483647, 4, 1),
(11, 0, 7, 1),
(13, 2147483647, 8, 1),
(18, 0, 8, 2),
(19, 0, 8, 2),
(21, 0, 8, 2),
(22, 0, 8, 2),
(23, 0, 8, 4),
(24, 0, 8, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `ID_Rol` int(11) NOT NULL,
  `Nombre` enum('supervisor','ajustador','asegurado') NOT NULL,
  `id_Compania` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`ID_Rol`, `Nombre`, `id_Compania`) VALUES
(1, 'ajustador', NULL),
(2, 'supervisor', NULL),
(3, 'asegurado', NULL);

--
-- Disparadores `rol`
--
DELIMITER $$
CREATE TRIGGER `tr_BajaRol` BEFORE DELETE ON `rol` FOR EACH ROW BEGIN
	UPDATE usuario
    SET Activo = 0
    WHERE id_rol = OLD.ID_Rol;
    
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'No se permite eliminar, se aplicó baja lógica a todos los Usuarios con este Rol';
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `tr_evitar_rol_duplicado` BEFORE INSERT ON `rol` FOR EACH ROW BEGIN
    DECLARE rol_existente INT;
    
    SELECT COUNT(*) INTO rol_existente
    FROM rol
    WHERE Nombre = NEW.Nombre;
    
    IF rol_existente > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: El rol ya existe';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `siniestro`
--

CREATE TABLE `siniestro` (
  `ID_Siniestro` int(11) NOT NULL,
  `Folio` varchar(50) NOT NULL,
  `Nombre` varchar(50) NOT NULL,
  `Estado` enum('Rechazado','Aceptado','Aceptado con pago Deducible','Aceptado sin pago Deducible','Aplica pago para reparación','Pérdida Total') DEFAULT NULL,
  `Fecha_Hora` datetime DEFAULT NULL,
  `Ubicacion` varchar(100) DEFAULT NULL,
  `id_Poliza` int(11) NOT NULL,
  `id_Ajustador` int(11) NOT NULL,
  `Fech_Alta` timestamp NOT NULL DEFAULT current_timestamp(),
  `Fecha_Mod` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `siniestro`
--

INSERT INTO `siniestro` (`ID_Siniestro`, `Folio`, `Nombre`, `Estado`, `Fecha_Hora`, `Ubicacion`, `id_Poliza`, `id_Ajustador`, `Fech_Alta`, `Fecha_Mod`) VALUES
(4, '20260508722', 'SN-20260508722', NULL, '2026-05-08 06:18:00', 'Av. Constitución #1830, Col. Centro, Monterrey, Nuevo León. Referencias: frente a OXXO Gas, cerca de', 4, 4, '2026-05-08 12:20:48', '2026-05-08 12:20:48'),
(5, '20260508321', 'SN-20260508321', NULL, '2026-05-08 06:18:00', 'Av. Constitución #1830, Col. Centro, Monterrey, Nuevo León. Referencias: frente a OXXO Gas, cerca de', 5, 4, '2026-05-08 12:22:02', '2026-05-08 12:22:02'),
(7, '2026', 'SN-2026-2026', NULL, '2026-05-08 06:00:00', 'Monterrey', 7, 1, '2026-05-08 12:35:55', '2026-05-08 12:35:55'),
(8, '2027', 'SN-2026-2027', NULL, '2026-05-08 06:41:00', 'Av. Constitución #1830, Col. Centro, Monterrey, Nuevo León. Referencias: frente a OXXO Gas, cerca de', 8, 4, '2026-05-08 12:44:41', '2026-05-08 12:44:41'),
(10, '2028', 'SN-2026-2028', NULL, '2026-05-08 07:13:00', 'Av. Constitución #1830, Col. Centro, Monterrey, Nuevo León. Referencias: frente a OXXO Gas, cerca de', 10, 4, '2026-05-08 13:15:51', '2026-05-08 13:15:51'),
(11, '2029', 'SN-2026-2029', NULL, '2026-05-08 07:15:51', '', 11, 1, '2026-05-08 13:28:16', '2026-05-08 13:28:16'),
(13, '2030', 'SN-2026-2030', NULL, '2026-05-08 16:30:00', 'Av. Revolución #890, Col. San Ángel, CDMX', 13, 1, '2026-05-08 22:28:28', '2026-05-08 22:28:28'),
(18, '2031', 'SN-2026-2031', NULL, '2026-05-08 16:30:00', 'Av. Universidad #1200, Col. Xoco, CDMX', 18, 1, '2026-05-08 22:50:15', '2026-05-08 22:50:15'),
(19, '2032', 'SN-2026-2032', NULL, '2026-05-08 16:30:00', 'Av. Universidad #1200, Col. Xoco, CDMX', 19, 1, '2026-05-08 22:50:42', '2026-05-08 22:50:42'),
(21, '2033', 'SN-2026-2033', NULL, '2026-05-08 16:30:00', 'Av. Universidad #1200, Col. Xoco, CDMX', 21, 1, '2026-05-08 22:53:59', '2026-05-08 22:53:59'),
(22, '2034', 'SN-2026-2034', NULL, '2026-05-08 16:55:00', 'Estacionamiento Plaza Centro, Av. Central #500, CDMX', 22, 4, '2026-05-08 22:57:04', '2026-05-08 22:57:04'),
(23, '2035', 'SN-2026-2035', NULL, '2026-05-08 16:59:00', 'Periférico Sur #2500, Col. San Jerónimo, CDMX', 23, 4, '2026-05-08 23:01:29', '2026-05-08 23:01:29'),
(24, '2036', 'SN-2026-2036', 'Aplica pago para reparación', '2026-05-08 17:13:00', 'Calzada de Tlalpan #3000, Col. Portales, CDMX', 24, 4, '2026-05-08 23:14:52', '2026-05-08 23:53:22');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `unidad`
--

CREATE TABLE `unidad` (
  `ID_Unidad` int(11) NOT NULL,
  `Placa` varchar(50) NOT NULL,
  `Marca` varchar(50) NOT NULL,
  `Modelo` varchar(50) NOT NULL,
  `Color` varchar(50) NOT NULL,
  `Serie` varchar(50) NOT NULL,
  `Anio` int(11) DEFAULT NULL,
  `Tipo_Combus` enum('Gasolina','Diesel','Híbrido','Eléctrico') DEFAULT NULL,
  `id_Usuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `unidad`
--

INSERT INTO `unidad` (`ID_Unidad`, `Placa`, `Marca`, `Modelo`, `Color`, `Serie`, `Anio`, `Tipo_Combus`, `id_Usuario`) VALUES
(1, 'SADF13V13', 'Nissan', 'Versa', 'Gris', 'SAJ12da21JNA', 2012, 'Gasolina', 1),
(5, 'RYK-482-B', 'Nissan', 'Sentra Advance', 'Gris Oxford', '3N1AB8CV5MY214587', 2021, 'Gasolina', 5),
(6, 'RYK-482-B', 'Nissan', 'Sentra Advance', 'Gris Oxford', '3N1AB8CV5MY214587', 2021, 'Gasolina', 6),
(8, 'ABC-123', 'Toyota', 'Corolla', 'Rojo', 'SERIE123', 2024, 'Gasolina', 2),
(9, 'RYK-482-B', 'Nissan', 'Sentra Advance', 'Gris Oxford', '3N1AB8CV5MY214587', 2022, 'Gasolina', 1),
(11, 'RYK-482-B', 'Nissan', 'Versa', 'Gris Oxford', '3N1AB8CV5MY214587', 2010, 'Gasolina', 4),
(12, 'RYK-482-B', 'Nissan', 'Versa', 'Gris', '3N1AB8CV5MY214567', 2010, 'Gasolina', 7),
(14, 'NVS-4821', 'Nissan', 'Versa', 'Gris Plata', '3N1CN7AD0NL123456', 2022, 'Gasolina', 8),
(19, 'HND-5678', 'Honda', 'Civic', 'Azul Marino', '2HGFE2679NH123456', 2023, 'Gasolina', 8),
(20, 'HND-5678', 'Honda', 'Civic', 'Azul Marino', '2HGFE2679NH123456', 2023, 'Gasolina', 8),
(22, 'HND-5678', 'Honda', 'Civic', 'Azul Marino', '2HGFE2679NH123456', 2023, 'Gasolina', 8),
(23, 'HND-5678', 'Honda', 'Civic', 'Azul Marino', '2HGFE2679NH123456', 2023, 'Gasolina', 8),
(24, 'HND-5678', 'Honda', 'Civic', 'Azul Marino', '2HGFE2679NH123456', 2023, 'Gasolina', 8),
(25, 'HND-5678', 'Honda', 'Civic', 'Azul Marino', '2HGFE2679NH123456', 2023, 'Gasolina', 8);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `unidad_tercera`
--

CREATE TABLE `unidad_tercera` (
  `ID_Tercero` int(11) NOT NULL,
  `Placa` varchar(50) DEFAULT NULL,
  `Marca_Modelo` varchar(100) DEFAULT NULL,
  `Color` varchar(50) DEFAULT NULL,
  `Danios_Aparentes` text DEFAULT NULL,
  `id_Seguro` int(11) DEFAULT NULL,
  `id_Unidad` int(11) DEFAULT NULL,
  `Fecha_Alta` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `unidad_tercera`
--

INSERT INTO `unidad_tercera` (`ID_Tercero`, `Placa`, `Marca_Modelo`, `Color`, `Danios_Aparentes`, `id_Seguro`, `id_Unidad`, `Fecha_Alta`) VALUES
(6, NULL, 'Toyota Corolla XLE 2019', 'Azul Metálico', 'Daño en puerta delantera derecha, espejo lateral desprendido, rayones en salpicadera y hundimiento leve en el costado derecho.', 1, NULL, '2026-05-08 13:15:51'),
(7, NULL, 'Chevrolet Aveo', 'Blanco', 'Defensa trasera', 1, NULL, '2026-05-08 13:28:16'),
(12, 'TXM-4567', 'Nissan March', 'Verde', 'Defensa delantera dañada', 2, NULL, '2026-05-08 22:50:42'),
(13, 'FOR-8901', 'Ford Explorer', 'Negro', 'Defensa delantera derecha rayada, faro antiniebla roto y salpicadera dañada', 4, NULL, '2026-05-08 23:01:29'),
(14, 'VWJ-3456', 'Volkswagen Jetta', 'Gris', 'Defensa delantera completamente dañada, parrilla rota, radiador perforado y faros destruidos', 3, NULL, '2026-05-08 23:14:52');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `ID_Usuario` int(11) NOT NULL,
  `Correo` varchar(50) NOT NULL,
  `Contra` varchar(255) NOT NULL,
  `Fecha_Ultimo_Cambio` datetime DEFAULT NULL,
  `Intentos_Cambio` int(11) DEFAULT 0,
  `Activo` bit(1) DEFAULT b'1',
  `id_rol` int(11) DEFAULT NULL,
  `id_persona` int(11) DEFAULT NULL,
  `Fech_Alta` datetime DEFAULT current_timestamp(),
  `Fech_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`ID_Usuario`, `Correo`, `Contra`, `Fecha_Ultimo_Cambio`, `Intentos_Cambio`, `Activo`, `id_rol`, `id_persona`, `Fech_Alta`, `Fech_Mod`) VALUES
(1, 'mau.ortiz@gmail.com', '$2y$10$DNst9/tUvutlvsn8ID8ZrOqYUHzSEvNaX.NvddRuHX7Wnn8L/FzJi', NULL, 0, b'1', 2, 1, '2026-05-01 21:48:23', '2026-05-07 20:39:28'),
(2, 'jose@test.com', '$2y$12$VfuHW2TdDgVZ6Nv6jhN0VeOLYwef0bBRkOMVaFolEfBVEPZGusRmq', NULL, 0, b'1', 3, 2, '2026-05-07 23:32:23', '2026-05-08 06:35:55'),
(3, 'Rey.Castillo@gmail.com', '$2y$12$CxLcbUFZskeDe3IcL9tzA.xr6jU8BFwS/c3blWJBa3W2TKgwjtSX2', NULL, 0, b'1', 1, 3, '2026-05-07 23:39:03', '2026-05-07 23:39:03'),
(4, 'Bani@gmail.com', '$2y$12$jWdWXQ96RrOKORyyTthW8OLyrUNwDKSXb2yJUlN.nCg62mVopjqvu', NULL, 0, b'1', 1, 4, '2026-05-07 23:58:51', '2026-05-07 23:58:51'),
(5, 'Jose@gmail.com', '', NULL, 0, b'1', 3, 5, '2026-05-08 06:20:48', '2026-05-08 06:20:48'),
(6, 'Jose@gmail.com', '', NULL, 0, b'1', 3, 6, '2026-05-08 06:22:02', '2026-05-08 06:22:02'),
(7, 'Bari@gmail.com', '', NULL, 0, b'1', 3, 7, '2026-05-08 07:28:16', '2026-05-08 07:28:16'),
(8, 'andres@test.com', '$2y$12$JTTqPtOve0rChrw07oRm4eX5OqkYgiXP6Ad7ZquE9tJRjRbe8KP4u', NULL, 0, b'1', 3, 8, '2026-05-08 15:58:47', '2026-05-08 16:28:28');

--
-- Disparadores `usuario`
--
DELIMITER $$
CREATE TRIGGER `tr_BajaLogicaUs` BEFORE DELETE ON `usuario` FOR EACH ROW BEGIN
	UPDATE usuario US
    SET US.Activo = 0
    WHERE US.ID_Usuario = OLD.ID_Usuario;
    
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Baja lógica aplicada, no se eliminó el registro';
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_comentarios`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `v_comentarios` (
`ID_comentario` int(11)
,`id_siniestro` int(11)
,`Siniestro` varchar(50)
,`Usuario` varchar(101)
,`Alias` varchar(50)
,`Foto` varchar(255)
,`comentario` text
,`Estado` varchar(9)
,`Rol` enum('supervisor','ajustador','asegurado')
,`Fecha_Comentario` timestamp
,`Fecha_Mod` timestamp
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_companiaseguros`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `v_companiaseguros` (
`Empresa` varchar(50)
,`RFC` varchar(50)
,`TelEmergencia` varchar(50)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_login_usuario`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `v_login_usuario` (
`ID_Usuario` int(11)
,`Correo` varchar(50)
,`Contra` varchar(255)
,`Nombre` varchar(50)
,`Apellido` varchar(50)
,`Alias` varchar(50)
,`Genero` varchar(15)
,`Foto` varchar(255)
,`Nombre_Rol` enum('supervisor','ajustador','asegurado')
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_personas`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `v_personas` (
`NombreCompleto` varchar(101)
,`Alias` varchar(50)
,`RFC` text
,`Telefono` text
,`Direccion` text
,`FechaNac` date
,`Genero` varchar(15)
,`Foto` varchar(255)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_polizas`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `v_polizas` (
`Num_Polisa` int(11)
,`Asegurado` varchar(101)
,`Alias` varchar(50)
,`Correo` varchar(50)
,`FechaNac` date
,`Genero` bit(1)
,`RFC` text
,`Telefono` text
,`Direccion` text
,`CompaniaDeSeguro` varchar(50)
,`Telefono_Emergencia` varchar(50)
,`RFC_Compañia` varchar(50)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_rol`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `v_rol` (
`Nombre` enum('supervisor','ajustador','asegurado')
,`Empresa` varchar(50)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_siniestros`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `v_siniestros` (
`ID_Siniestro` int(11)
,`siniestro` varchar(50)
,`Folio` varchar(50)
,`HoraSiniestro` datetime
,`Ubicacion` varchar(100)
,`Alta` timestamp
,`Modificación` timestamp
,`EstadoDelSiniestro` enum('Rechazado','Aceptado','Aceptado con pago Deducible','Aceptado sin pago Deducible','Aplica pago para reparación','Pérdida Total')
,`NumeroPolisa` int(11)
,`Seguro` varchar(50)
,`Telefono_Emergencia` varchar(50)
,`Asegurado` varchar(101)
,`AliasAsegurado` varchar(50)
,`Telefono` text
,`Correo` varchar(50)
,`Ajustador` varchar(101)
,`AliasAjustador` varchar(50)
,`TelefonoAjustador` text
,`TipoSiniestro` enum('Choque','Volcadura','incendio','Robo','Impacto contra objeto fijo','Fenómeno natural','Vandalismo','otro')
,`Descripcion` text
,`Lesionados` varchar(2)
,`AutoridadesPresentes` varchar(2)
,`UnidadDelAsegurado` varchar(164)
,`PlacaAsegurado` varchar(50)
,`Serie` varchar(50)
,`Tipo_Combus` enum('Gasolina','Diesel','Híbrido','Eléctrico')
,`UnidadesAfectadas` mediumtext
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_unidades`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `v_unidades` (
`Unidad` varchar(164)
,`Placa` varchar(50)
,`Serie` varchar(50)
,`Tipo_Combus` enum('Gasolina','Diesel','Híbrido','Eléctrico')
,`Dueño` varchar(101)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_unidadesterceras`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `v_unidadesterceras` (
`Unidad` varchar(100)
,`Color` varchar(50)
,`Placa` varchar(50)
,`Danios_Aparentes` text
,`Fecha_Alta` timestamp
,`Seguro` varchar(50)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_usuarios`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `v_usuarios` (
`Foto` varchar(255)
,`Nombre` varchar(101)
,`Alias` varchar(50)
,`Genero` varchar(15)
,`Correo` varchar(50)
,`Rol` enum('supervisor','ajustador','asegurado')
,`Seguro` varchar(50)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_usuario_perfil`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `v_usuario_perfil` (
`Foto` varchar(255)
,`Nombre` varchar(101)
,`Alias` varchar(50)
,`FechaNac` date
,`Genero` varchar(15)
,`Correo` varchar(50)
,`Rol` enum('supervisor','ajustador','asegurado')
);

-- --------------------------------------------------------

--
-- Estructura para la vista `v_comentarios`
--
DROP TABLE IF EXISTS `v_comentarios`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_comentarios`  AS SELECT `c`.`ID_comentario` AS `ID_comentario`, `c`.`id_siniestro` AS `id_siniestro`, `sn`.`Nombre` AS `Siniestro`, concat(`p`.`Nombre`,' ',`p`.`Apellido`) AS `Usuario`, `p`.`Alias` AS `Alias`, `p`.`Foto` AS `Foto`, `c`.`comentario` AS `comentario`, CASE WHEN `c`.`estado` = 1 THEN 'Activo' ELSE 'Eliminado' END AS `Estado`, `r`.`Nombre` AS `Rol`, `c`.`Fecha_Comentario` AS `Fecha_Comentario`, `c`.`Fecha_Mod` AS `Fecha_Mod` FROM ((((`comentario` `c` join `usuario` `u` on(`c`.`id_usuario` = `u`.`ID_Usuario`)) join `persona` `p` on(`u`.`id_persona` = `p`.`ID_Persona`)) join `rol` `r` on(`u`.`id_rol` = `r`.`ID_Rol`)) join `siniestro` `sn` on(`c`.`id_siniestro` = `sn`.`ID_Siniestro`)) WHERE `c`.`estado` = 1 ;

-- --------------------------------------------------------

--
-- Estructura para la vista `v_companiaseguros`
--
DROP TABLE IF EXISTS `v_companiaseguros`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_companiaseguros`  AS SELECT `compania_seguro`.`Nombre_Empresa` AS `Empresa`, `compania_seguro`.`RFC` AS `RFC`, `compania_seguro`.`Telefono_Emergencia` AS `TelEmergencia` FROM `compania_seguro` ;

-- --------------------------------------------------------

--
-- Estructura para la vista `v_login_usuario`
--
DROP TABLE IF EXISTS `v_login_usuario`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_login_usuario`  AS SELECT `u`.`ID_Usuario` AS `ID_Usuario`, `u`.`Correo` AS `Correo`, `u`.`Contra` AS `Contra`, `p`.`Nombre` AS `Nombre`, `p`.`Apellido` AS `Apellido`, `p`.`Alias` AS `Alias`, CASE WHEN `p`.`Genero` = 1 THEN 'Masculino' WHEN `p`.`Genero` = 0 THEN 'Femenino' ELSE 'No especificado' END AS `Genero`, `p`.`Foto` AS `Foto`, `r`.`Nombre` AS `Nombre_Rol` FROM ((`usuario` `u` join `rol` `r` on(`u`.`id_rol` = `r`.`ID_Rol`)) join `persona` `p` on(`u`.`id_persona` = `p`.`ID_Persona`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `v_personas`
--
DROP TABLE IF EXISTS `v_personas`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_personas`  AS SELECT concat(`p`.`Nombre`,' ',`p`.`Apellido`) AS `NombreCompleto`, `p`.`Alias` AS `Alias`, `p`.`RFC` AS `RFC`, `p`.`Telefono` AS `Telefono`, `p`.`Direccion` AS `Direccion`, `p`.`FechaNac` AS `FechaNac`, CASE WHEN `p`.`Genero` = 1 THEN 'Masculino' WHEN `p`.`Genero` = 0 THEN 'Femenino' ELSE 'No especificado' END AS `Genero`, `p`.`Foto` AS `Foto` FROM `persona` AS `p` ;

-- --------------------------------------------------------

--
-- Estructura para la vista `v_polizas`
--
DROP TABLE IF EXISTS `v_polizas`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_polizas`  AS SELECT `po`.`Num_Polisa` AS `Num_Polisa`, concat(`pe`.`Nombre`,' ',`pe`.`Apellido`) AS `Asegurado`, `pe`.`Alias` AS `Alias`, `u`.`Correo` AS `Correo`, `pe`.`FechaNac` AS `FechaNac`, `pe`.`Genero` AS `Genero`, `pe`.`RFC` AS `RFC`, `pe`.`Telefono` AS `Telefono`, `pe`.`Direccion` AS `Direccion`, `co`.`Nombre_Empresa` AS `CompaniaDeSeguro`, `co`.`Telefono_Emergencia` AS `Telefono_Emergencia`, `co`.`RFC` AS `RFC_Compañia` FROM (((`poliza` `po` join `compania_seguro` `co` on(`po`.`id_Compania` = `co`.`ID_Seguro`)) join `usuario` `u` on(`po`.`id_Usuario` = `u`.`ID_Usuario`)) join `persona` `pe` on(`u`.`id_persona` = `pe`.`ID_Persona`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `v_rol`
--
DROP TABLE IF EXISTS `v_rol`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_rol`  AS SELECT `r`.`Nombre` AS `Nombre`, `c`.`Nombre_Empresa` AS `Empresa` FROM (`rol` `r` join `compania_seguro` `c` on(`r`.`id_Compania` = `c`.`ID_Seguro`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `v_siniestros`
--
DROP TABLE IF EXISTS `v_siniestros`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_siniestros`  AS SELECT `sn`.`ID_Siniestro` AS `ID_Siniestro`, `sn`.`Nombre` AS `siniestro`, `sn`.`Folio` AS `Folio`, `sn`.`Fecha_Hora` AS `HoraSiniestro`, `sn`.`Ubicacion` AS `Ubicacion`, `sn`.`Fech_Alta` AS `Alta`, `sn`.`Fecha_Mod` AS `Modificación`, `sn`.`Estado` AS `EstadoDelSiniestro`, `p`.`Num_Polisa` AS `NumeroPolisa`, `c`.`Nombre_Empresa` AS `Seguro`, `c`.`Telefono_Emergencia` AS `Telefono_Emergencia`, concat(`pe`.`Nombre`,' ',`pe`.`Apellido`) AS `Asegurado`, `pe`.`Alias` AS `AliasAsegurado`, `pe`.`Telefono` AS `Telefono`, `ao`.`Correo` AS `Correo`, concat(`ps`.`Nombre`,' ',`ps`.`Apellido`) AS `Ajustador`, `ps`.`Alias` AS `AliasAjustador`, `ps`.`Telefono` AS `TelefonoAjustador`, `de`.`TipoSiniestro` AS `TipoSiniestro`, `de`.`Descripcion` AS `Descripcion`, CASE WHEN `de`.`Lesionados` = 1 THEN 'Sí' ELSE 'No' END AS `Lesionados`, CASE WHEN `de`.`Autoridad_Pres` = 1 THEN 'Sí' ELSE 'No' END AS `AutoridadesPresentes`, concat(`un`.`Marca`,' ',`un`.`Modelo`,' ',`un`.`Anio`,' ',`un`.`Color`) AS `UnidadDelAsegurado`, `un`.`Placa` AS `PlacaAsegurado`, `un`.`Serie` AS `Serie`, `un`.`Tipo_Combus` AS `Tipo_Combus`, group_concat(concat(`ut`.`Marca_Modelo`,' ',`ut`.`Color`,' (Placa: ',`ut`.`Placa`,')') separator ' | ') AS `UnidadesAfectadas` FROM (((((((((`siniestro` `sn` join `poliza` `p` on(`sn`.`id_Poliza` = `p`.`ID_Poliza`)) join `usuario` `u` on(`sn`.`id_Ajustador` = `u`.`ID_Usuario`)) join `persona` `ps` on(`u`.`id_persona` = `ps`.`ID_Persona`)) join `compania_seguro` `c` on(`p`.`id_Compania` = `c`.`ID_Seguro`)) join `usuario` `ao` on(`p`.`id_Usuario` = `ao`.`ID_Usuario`)) join `persona` `pe` on(`ao`.`id_persona` = `pe`.`ID_Persona`)) join `detalle_siniestro` `de` on(`de`.`id_Siniestro` = `sn`.`ID_Siniestro`)) left join `unidad` `un` on(`de`.`id_Vehiculo` = `un`.`ID_Unidad`)) left join `unidad_tercera` `ut` on(`de`.`id_UnidadTercera` = `ut`.`ID_Tercero`)) GROUP BY `sn`.`ID_Siniestro` ;

-- --------------------------------------------------------

--
-- Estructura para la vista `v_unidades`
--
DROP TABLE IF EXISTS `v_unidades`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_unidades`  AS SELECT concat(`un`.`Marca`,' ',`un`.`Modelo`,' ',`un`.`Anio`,' ',`un`.`Color`) AS `Unidad`, `un`.`Placa` AS `Placa`, `un`.`Serie` AS `Serie`, `un`.`Tipo_Combus` AS `Tipo_Combus`, concat(`pe`.`Nombre`,' ',`pe`.`Apellido`) AS `Dueño` FROM ((`unidad` `un` join `usuario` `u` on(`un`.`id_Usuario` = `u`.`ID_Usuario`)) join `persona` `pe` on(`u`.`id_persona` = `pe`.`ID_Persona`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `v_unidadesterceras`
--
DROP TABLE IF EXISTS `v_unidadesterceras`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_unidadesterceras`  AS SELECT `t`.`Marca_Modelo` AS `Unidad`, `t`.`Color` AS `Color`, `t`.`Placa` AS `Placa`, `t`.`Danios_Aparentes` AS `Danios_Aparentes`, `t`.`Fecha_Alta` AS `Fecha_Alta`, `co`.`Nombre_Empresa` AS `Seguro` FROM (`unidad_tercera` `t` join `compania_seguro` `co` on(`t`.`id_Seguro` = `co`.`ID_Seguro`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `v_usuarios`
--
DROP TABLE IF EXISTS `v_usuarios`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_usuarios`  AS SELECT `p`.`Foto` AS `Foto`, concat(`p`.`Nombre`,' ',`p`.`Apellido`) AS `Nombre`, `p`.`Alias` AS `Alias`, CASE WHEN `p`.`Genero` = 1 THEN 'Masculino' WHEN `p`.`Genero` = 0 THEN 'Femenino' ELSE 'No especificado' END AS `Genero`, `u`.`Correo` AS `Correo`, `r`.`Nombre` AS `Rol`, `co`.`Nombre_Empresa` AS `Seguro` FROM (((`usuario` `u` join `persona` `p` on(`u`.`id_persona` = `p`.`ID_Persona`)) join `rol` `r` on(`u`.`id_rol` = `r`.`ID_Rol`)) left join `compania_seguro` `co` on(`r`.`id_Compania` = `co`.`ID_Seguro`)) WHERE `u`.`Activo` = 1 ;

-- --------------------------------------------------------

--
-- Estructura para la vista `v_usuario_perfil`
--
DROP TABLE IF EXISTS `v_usuario_perfil`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_usuario_perfil`  AS SELECT `p`.`Foto` AS `Foto`, concat(`p`.`Nombre`,' ',`p`.`Apellido`) AS `Nombre`, `p`.`Alias` AS `Alias`, `p`.`FechaNac` AS `FechaNac`, CASE WHEN `p`.`Genero` = 1 THEN 'Masculino' WHEN `p`.`Genero` = 1 THEN 'Femenino' ELSE 'No Especificado' END AS `Genero`, `u`.`Correo` AS `Correo`, `r`.`Nombre` AS `Rol` FROM ((`usuario` `u` join `persona` `p` on(`u`.`id_persona` = `p`.`ID_Persona`)) join `rol` `r` on(`u`.`id_rol` = `r`.`ID_Rol`)) ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `archivo_siniestro`
--
ALTER TABLE `archivo_siniestro`
  ADD PRIMARY KEY (`ID_Archivo`),
  ADD KEY `id_Siniestro` (`id_Siniestro`);

--
-- Indices de la tabla `comentario`
--
ALTER TABLE `comentario`
  ADD PRIMARY KEY (`ID_comentario`),
  ADD KEY `id_siniestro` (`id_siniestro`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `compania_seguro`
--
ALTER TABLE `compania_seguro`
  ADD PRIMARY KEY (`ID_Seguro`);

--
-- Indices de la tabla `detalle_siniestro`
--
ALTER TABLE `detalle_siniestro`
  ADD PRIMARY KEY (`ID_Detalle`),
  ADD KEY `id_Siniestro` (`id_Siniestro`),
  ADD KEY `id_Vehiculo` (`id_Vehiculo`),
  ADD KEY `fk_detalle_unidad_tercera` (`id_UnidadTercera`);

--
-- Indices de la tabla `historial_contrasenas`
--
ALTER TABLE `historial_contrasenas`
  ADD PRIMARY KEY (`ID_Historial`),
  ADD KEY `id_Usuario` (`id_Usuario`);

--
-- Indices de la tabla `notificacion`
--
ALTER TABLE `notificacion`
  ADD PRIMARY KEY (`ID_Notificacion`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `persona`
--
ALTER TABLE `persona`
  ADD PRIMARY KEY (`ID_Persona`);

--
-- Indices de la tabla `poliza`
--
ALTER TABLE `poliza`
  ADD PRIMARY KEY (`ID_Poliza`),
  ADD KEY `id_Usuario` (`id_Usuario`),
  ADD KEY `id_Compania` (`id_Compania`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`ID_Rol`),
  ADD KEY `id_Compania` (`id_Compania`);

--
-- Indices de la tabla `siniestro`
--
ALTER TABLE `siniestro`
  ADD PRIMARY KEY (`ID_Siniestro`),
  ADD UNIQUE KEY `Nombre` (`Nombre`),
  ADD KEY `id_Ajustador` (`id_Ajustador`),
  ADD KEY `id_Poliza` (`id_Poliza`);

--
-- Indices de la tabla `unidad`
--
ALTER TABLE `unidad`
  ADD PRIMARY KEY (`ID_Unidad`),
  ADD KEY `id_Usuario` (`id_Usuario`);

--
-- Indices de la tabla `unidad_tercera`
--
ALTER TABLE `unidad_tercera`
  ADD PRIMARY KEY (`ID_Tercero`),
  ADD UNIQUE KEY `Placa` (`Placa`),
  ADD KEY `id_Unidad` (`id_Unidad`),
  ADD KEY `id_Seguro` (`id_Seguro`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`ID_Usuario`),
  ADD KEY `id_rol` (`id_rol`),
  ADD KEY `id_persona` (`id_persona`),
  ADD KEY `Correo` (`Correo`,`Contra`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `archivo_siniestro`
--
ALTER TABLE `archivo_siniestro`
  MODIFY `ID_Archivo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `comentario`
--
ALTER TABLE `comentario`
  MODIFY `ID_comentario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `compania_seguro`
--
ALTER TABLE `compania_seguro`
  MODIFY `ID_Seguro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `detalle_siniestro`
--
ALTER TABLE `detalle_siniestro`
  MODIFY `ID_Detalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `historial_contrasenas`
--
ALTER TABLE `historial_contrasenas`
  MODIFY `ID_Historial` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `notificacion`
--
ALTER TABLE `notificacion`
  MODIFY `ID_Notificacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `persona`
--
ALTER TABLE `persona`
  MODIFY `ID_Persona` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `poliza`
--
ALTER TABLE `poliza`
  MODIFY `ID_Poliza` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `ID_Rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `siniestro`
--
ALTER TABLE `siniestro`
  MODIFY `ID_Siniestro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `unidad`
--
ALTER TABLE `unidad`
  MODIFY `ID_Unidad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `unidad_tercera`
--
ALTER TABLE `unidad_tercera`
  MODIFY `ID_Tercero` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `ID_Usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `archivo_siniestro`
--
ALTER TABLE `archivo_siniestro`
  ADD CONSTRAINT `archivo_siniestro_ibfk_1` FOREIGN KEY (`id_Siniestro`) REFERENCES `siniestro` (`ID_Siniestro`);

--
-- Filtros para la tabla `comentario`
--
ALTER TABLE `comentario`
  ADD CONSTRAINT `comentario_ibfk_1` FOREIGN KEY (`id_siniestro`) REFERENCES `siniestro` (`ID_Siniestro`) ON DELETE CASCADE,
  ADD CONSTRAINT `comentario_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`ID_Usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `detalle_siniestro`
--
ALTER TABLE `detalle_siniestro`
  ADD CONSTRAINT `detalle_siniestro_ibfk_1` FOREIGN KEY (`id_Siniestro`) REFERENCES `siniestro` (`ID_Siniestro`),
  ADD CONSTRAINT `detalle_siniestro_ibfk_2` FOREIGN KEY (`id_Vehiculo`) REFERENCES `unidad` (`ID_Unidad`),
  ADD CONSTRAINT `fk_detalle_unidad_tercera` FOREIGN KEY (`id_UnidadTercera`) REFERENCES `unidad_tercera` (`ID_Tercero`);

--
-- Filtros para la tabla `historial_contrasenas`
--
ALTER TABLE `historial_contrasenas`
  ADD CONSTRAINT `historial_contrasenas_ibfk_1` FOREIGN KEY (`id_Usuario`) REFERENCES `usuario` (`ID_Usuario`);

--
-- Filtros para la tabla `notificacion`
--
ALTER TABLE `notificacion`
  ADD CONSTRAINT `notificacion_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`ID_Usuario`);

--
-- Filtros para la tabla `poliza`
--
ALTER TABLE `poliza`
  ADD CONSTRAINT `poliza_ibfk_1` FOREIGN KEY (`id_Usuario`) REFERENCES `usuario` (`ID_Usuario`),
  ADD CONSTRAINT `poliza_ibfk_2` FOREIGN KEY (`id_Compania`) REFERENCES `compania_seguro` (`ID_Seguro`);

--
-- Filtros para la tabla `rol`
--
ALTER TABLE `rol`
  ADD CONSTRAINT `rol_ibfk_1` FOREIGN KEY (`id_Compania`) REFERENCES `compania_seguro` (`ID_Seguro`);

--
-- Filtros para la tabla `siniestro`
--
ALTER TABLE `siniestro`
  ADD CONSTRAINT `siniestro_ibfk_1` FOREIGN KEY (`id_Ajustador`) REFERENCES `usuario` (`ID_Usuario`),
  ADD CONSTRAINT `siniestro_ibfk_2` FOREIGN KEY (`id_Poliza`) REFERENCES `poliza` (`ID_Poliza`);

--
-- Filtros para la tabla `unidad`
--
ALTER TABLE `unidad`
  ADD CONSTRAINT `unidad_ibfk_1` FOREIGN KEY (`id_Usuario`) REFERENCES `usuario` (`ID_Usuario`);

--
-- Filtros para la tabla `unidad_tercera`
--
ALTER TABLE `unidad_tercera`
  ADD CONSTRAINT `unidad_tercera_ibfk_1` FOREIGN KEY (`id_Unidad`) REFERENCES `unidad` (`ID_Unidad`),
  ADD CONSTRAINT `unidad_tercera_ibfk_2` FOREIGN KEY (`id_Seguro`) REFERENCES `compania_seguro` (`ID_Seguro`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`ID_Rol`),
  ADD CONSTRAINT `usuario_ibfk_2` FOREIGN KEY (`id_persona`) REFERENCES `persona` (`ID_Persona`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
