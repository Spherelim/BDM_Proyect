-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 25-04-2026 a las 00:25:58
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
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_DeletePersona` (IN `P_IdPersona` INT)   BEGIN
	IF fn_ExistePersona(P_IdPersona)=1 THEN
    	DELETE FROM persona
        WHERE ID_Persona=P_IdPersona;
        SELECT 'Usuario Eliminado' AS MESSAGE_TEXT;
    ELSE
    	SELECT 'Uusario Inexistente' AS MESSAGE_TEXT;
    END IF ;
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_DeleteUnidad` (IN `P_IdUnidad` INT)   BEGIN
	IF fn_ExisteUnidadId(P_IdUnidad)=1 THEN
    	DELETE FROM unidad
        WHERE ID_Unidad = P_IdUnidad;
        SELECT 'Unidad Eliminada' AS Mesnaje;
    ELSE
    	SELECT 'Unidad Inexistente' AS Mesnaje;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_DeleteUsuario` (IN `P_IdUs` INT)   BEGIN
IF fn_ExisteUsuarioId(P_IdUs)=1 THEN
	DELETE FROM usuario
	WHERE ID_Usuario = P_IdUs;
    SELECT 'Usuario Eliminado' AS MESSAGE_TEXT;
ELSE
	SELECT 'Usuario Inexistente' AS MESSAGE_TEXT;
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_GestionPersona` (IN `P_Proceso` INT, IN `P_IdPersona` INT, IN `P_Nombre` VARCHAR(50), IN `P_Apellido` VARCHAR(50), IN `P_Alias` VARCHAR(50), IN `P_FechaNac` DATE, IN `P_Foto` BLOB, IN `P_Genero` BIT)   BEGIN
	IF P_Proceso = 0 THEN
    	IF P_Nombre IS NOT NULL AND P_Apellido IS NOT NULL THEN
        	CALL sp_SelectPersonaNombre(P_Nombre,P_Apellido);
        ELSE
        	CALL sp_SelectPersonas();
        END IF;
    ELSEIF P_Proceso = 1 THEN
    	CALL sp_InsertPersona(P_Nombre,P_Apellido,P_Alias,P_FechaNac,P_Foto,P_Genero);
SELECT LAST_INSERT_ID() AS IdPersona;
        ELSEIF P_Proceso = 2 THEN
        	CALL sp_UpdatePersona(P_IdPersona,P_Nombre,P_Apellido,P_Alias,P_FechaNac,P_Foto,P_Genero);
            ELSEIF P_Proceso = 3 THEN
            CALL sp_DeletePersona(P_IdPersona);
            ELSE
            SELECT 'Operacion Inexistente 0-Select,1-INSERT,2-UPDATE,3-DELETE' AS MESSAGE_TEXT;
            END IF;
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_GestionUnidad` (IN `P_Proceso` INT, IN `P_IdUnidad` INT, IN `P_Marca` VARCHAR(50), IN `P_Modelo` VARCHAR(50), IN `P_Color` VARCHAR(50), IN `P_Placa` VARCHAR(50), IN `P_Serie` VARCHAR(50))   BEGIN
	IF P_Proceso = 0 THEN
    	IF P_Placa IS NULL AND P_Serie IS NULL THEN
        	CALL sp_SelectUnidades();
        ELSEIF P_Placa IS NULL THEN
        	CALL sp_SelectUnidadSerie(P_Serie);
        ELSEIF P_Serie IS NULL THEN
        	CALL sp_SelectUnidadPlaca(P_Placa);
        END IF;
    ELSEIF P_Proceso = 1 THEN
    	CALL sp_InsertUnidad(P_Marca,P_Serie,P_Modelo,P_Placa,P_Color);
    ELSEIF P_Proceso = 2 THEN
    	CALL sp_UpdateUnidad(P_IdUnidad,P_Marca,P_Modelo,P_Color,P_Placa,P_Serie);
    ELSEIF P_Proceso = 3 THEN
    	CALL sp_DeleteUnidad(P_IdUnidad);
    ELSE
    	SELECT 'Operacion Inexistente 0-Select,1-INSERT,2-UPDATE,3-DELETE' AS Mensaje;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_GestionUsuario` (IN `P_Proceso` INT, IN `P_IdUs` INT, IN `P_Correo` VARCHAR(50), IN `P_Contra` VARCHAR(50), IN `P_IdRol` INT, IN `P_IdPers` INT)   BEGIN

IF P_Proceso = 0 THEN
	IF P_Correo IS NOT NULL THEN
    	CALL sp_SelectUsuario(P_Correo);
    ELSE
    	CALL sp_SelectUsuarios();
    END IF;
ELSEIF P_Proceso = 1 THEN
	IF P_IdRol IS NOT NULL AND P_IdPers IS NOT NULL THEN
		CALL sp_InsertUsuario(P_Correo,P_Contra,P_IdRol,P_IdPers);
    ELSE
    	SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'Falta IdRol y/o IdPers';
    END IF;
ELSEIF P_Proceso = 2 THEN
	CALL sp_UpdateUsuario(P_IdUs,P_Correo,P_Contra,P_IdRol,P_IdPers);
ELSEIF P_Proceso = 3 THEN
	CALL sp_DeleteUsuario(P_IdUs);
ELSE
	SELECT 'Operacion Inexistente 0-Select,1-INSERT,2-UPDATE,3-DELETE' AS MESSAGE_TEXT;
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_InsertPersona` (IN `P_Nombre` VARCHAR(50), IN `P_Apellido` VARCHAR(50), IN `P_Alias` VARCHAR(50), IN `P_FechaNac` DATE, IN `P_Foto` BLOB, IN `P_Genero` BIT)   BEGIN
    IF fn_BuscarPersona(P_Nombre, P_Apellido, P_FechaNac, P_Genero) = 0 THEN
        
        INSERT INTO persona(
            Nombre,
            Apellido,
            Genero,
            Alias,
            FechaNac,
            Foto
        )
        VALUES(
            P_Nombre,
            P_Apellido,
            P_Genero,
            P_Alias,
            P_FechaNac,
            P_Foto
        );

        SELECT 'Usuario Agregado' AS MESSAGE_TEXT;
        
    ELSE
        SELECT 'Persona Ya Registrada' AS MESSAGE_TEXT;
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_InsertUnidad` (IN `P_Marca` VARCHAR(50), IN `P_Serie` VARCHAR(50), IN `P_Modelo` VARCHAR(50), IN `P_Placa` VARCHAR(50), IN `P_Color` VARCHAR(50))   BEGIN
	IF fn_ExisteUnidadPlaca(P_Placa)=0 THEN
        INSERT INTO unidad(Marca,Serie,Modelo,Placa,Color)
        VALUES(P_Marca,P_Serie,P_Modelo,P_Placa,P_Color);
        SELECT 'Unidad Agregada' AS Mensaje;
    ELSE
    	SELECT 'Unidad Ya Existente, No Agregado' AS Mensaje;
 	END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_InsertUsuario` (IN `P_Correo` VARCHAR(50), IN `P_Contra` VARCHAR(50), IN `P_IdRol` INT, IN `P_IdPers` INT)   BEGIN
IF fn_ExisteUsuario(P_Correo)=0 THEN
	INSERT INTO usuario(Correo,Contra,id_persona,id_rol)
    VALUES (P_Correo,P_Contra,P_IdPers,P_IdRol);
ELSE
	SELECT 'Usuario Con Correo Existente, Favor de agregar otro Correo' AS MESSAGE_TEXT;
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_SelectPersonaNomAp` (IN `P_Nombre` VARCHAR(50), IN `P_Apellido` VARCHAR(50))   BEGIN
	DECLARE NomCom VARCHAR(100);
    SET NomCom = CONCAT(P_Nombre,' ',P_Apellido);

	SELECT VP.NombreCompleto,
    VP.FechaDeNacimiento,
    VP.Genero,
    VP.Alias,
    VP.Foto
    FROM v_persona VP
    WHERE VP.NombreCompleto = NomCom;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_SelectPersonas` ()   BEGIN
	SELECT VP.NombreCompleto,
    VP.FechaDeNacimiento,
    VP.Genero,
    VP.Alias,
    VP.Foto
    FROM v_persona VP;
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_SelectUnidades` ()   BEGIN
	SELECT VU.Unidad,
    VU.Placa,
    VU.Color,
    VU.Serie
    FROM v_unidad VU;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_SelectUnidadPlaca` (IN `P_Placa` VARCHAR(50))   BEGIN
	IF fn_ExisteUnidadPlaca(P_Placa)=1 THEN
        SELECT VU.Unidad,
        VU.Placa,
        VU.Color,
        VU.Serie
        FROM v_unidad VU
        WHERE VU.Placa = P_Placa;
    ELSE
    	SELECT 'Unidad Inexistente' AS Mensaje;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_SelectUnidadSerie` (IN `P_Serie` VARCHAR(50))   BEGIN
	SELECT VU.Unidad,
    VU.Placa,
    VU.Color,
    VU.Serie
    FROM v_unidad VU
    WHERE VU.Serie = P_Serie;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_SelectUsuario` (IN `P_Correo` VARCHAR(50))   BEGIN
IF fn_ExisteUsuario(P_Correo)=1 THEN
	SELECT VU.NombreCompleto,
    VU.Correo,
    VU.Rol,
    VU.Genero,
    VU.Alias,
    VU.FechaNac
    FROM v_usuario VU
    WHERE VU.Correo = P_Correo;
ELSE
	SELECT 'Usuario Inexistente' AS MESSAGE_TEXT;
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_SelectUsuarios` ()   BEGIN

	SELECT VU.NombreCompleto,
    VU.Correo,
    VU.Rol,
    VU.Genero,
    VU.Alias,
    VU.FechaNac
    FROM v_usuario VU;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_UpdatePersona` (IN `P_IdPersona` INT, IN `P_Nombre` VARCHAR(50), IN `P_Apellido` VARCHAR(50), IN `P_Alias` VARCHAR(50), IN `P_FechaNac` DATE, IN `P_Foto` BLOB, IN `P_Genero` BIT)   BEGIN
	IF fn_ExistePersona(P_IdPersona)=1 THEN
		UPDATE persona PE
		SET PE.Nombre=P_Nombre,
            PE.Apellido=P_Apellido,
            PE.Alias=P_Alias,
            PE.FechaNac=P_FechaNac,
            PE.Foto=P_Foto,
            PE.Genero=P_Genero
        WHERE PE.ID_Persona=P_IdPersona;
    	SELECT 'Usuario Modificado' AS MESSAGE_TEXT;
    ELSE
		SELECT 'Usuario Inexistente' AS MESSAGE_TEXT;
	END IF;
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_UpdateUnidad` (IN `P_IdUnidad` INT, IN `P_Marca` VARCHAR(50), IN `P_Modelo` VARCHAR(50), IN `P_Color` VARCHAR(50), IN `P_Placa` VARCHAR(50), IN `P_Serie` VARCHAR(50))   BEGIN
	IF fn_ExisteUnidadId(P_IdUnidad)=1 THEN
    	UPDATE unidad U
        SET U.Color = P_Color,
        U.Marca = P_Marca,
        U.Modelo = P_Modelo,
        U.Placa = P_Placa,
        U.Serie = P_Serie
        WHERE U.ID_Unidad = P_IdUnidad;
    ELSE
    	SELECT 'Unidad Inexistente' AS Mesnaje;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_UpdateUsuario` (IN `P_IdUs` INT, IN `P_Correo` VARCHAR(50), IN `P_Contra` VARCHAR(50), IN `P_IdRol` INT, IN `P_IdPers` INT)   BEGIN
IF fn_ExisteUsuario(P_Correo)=1 THEN
	UPDATE usuario US
    SET US.Correo = P_Correo,
	US.Contra = P_Contra,
    US.id_rol = P_IdRol,
    US.id_persona = P_IdPers
	WHERE US.ID_Usuario = P_IdUs;
    SELECT 'Usuario Modificado' AS MESSAGE_TEXT;
ELSE
	SELECT 'Usuario Inexistente' AS MESSAGE_TEXT;
END IF;
END$$

--
-- Funciones
--
CREATE DEFINER=`root`@`localhost` FUNCTION `fn_BuscarPersona` (`F_Nombre` VARCHAR(50), `F_Apellido` VARCHAR(50), `F_FechaNac` DATE, `F_Genero` BIT) RETURNS INT(11) DETERMINISTIC BEGIN
	IF EXISTS(
        SELECT 1
        FROM persona P
        WHERE P.Nombre = F_Nombre
        AND P.Apellido = F_Apellido
        AND P.FechaNac = F_FechaNac
        AND P.Genero = F_Genero
    )THEN
    	RETURN 1;
    ELSE
    	RETURN 0;
END IF;
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `fn_ExistePersona` (`F_IdPersona` INT) RETURNS INT(11) DETERMINISTIC BEGIN

	DECLARE Existe INT;
	SELECT COUNT(*) INTO Existe FROM persona
    WHERE ID_Persona = F_IdPersona;
    RETURN Existe;

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

CREATE DEFINER=`root`@`localhost` FUNCTION `fn_ExisteUnidadId` (`F_IdUnidad` INT) RETURNS INT(11) DETERMINISTIC BEGIN
	IF EXISTS(
        SELECT 1
        FROM unidad U
        WHERE U.ID_Unidad = F_IdUnidad
    )THEN
    	RETURN 1;
    ELSE
    	RETURN 0;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `fn_ExisteUnidadPlaca` (`P_Placa` VARCHAR(50)) RETURNS INT(11) DETERMINISTIC BEGIN
	IF EXISTS(
        SELECT 1
        FROM unidad U
        WHERE U.Placa = P_Placa        
    )THEN
    	RETURN 1;
    ELSE
    	RETURN 0;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `fn_ExisteUnidadSerie` (`P_Serie` VARCHAR(50)) RETURNS INT(11) DETERMINISTIC BEGIN
	IF EXISTS(
        SELECT 1
        FROM unidad U
        WHERE U.Serie = P_Serie        
    )THEN
    	RETURN 1;
    ELSE
    	RETURN 0;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `fn_ExisteUsuario` (`P_Correo` VARCHAR(50)) RETURNS INT(11) DETERMINISTIC BEGIN
	IF EXISTS(
    	SELECT 1
        FROM usuario US
        WHERE US.Correo=P_Correo
    )THEN
    	RETURN 1;
    ELSE
    	RETURN 0;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `fn_ExisteUsuarioId` (`F_IdUs` INT) RETURNS INT(11) DETERMINISTIC BEGIN
	IF EXISTS(
    	SELECT 1
        FROM usuario US
        WHERE US.ID_Usuario=F_IdUs
    )THEN
    	RETURN 1;
    ELSE
    	RETURN 0;
    END IF;
END$$

DELIMITER ;

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
(1, 'BBVA', '+52 1234567890', 'BVVA241NSJ123');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_siniestro`
--

CREATE TABLE `detalle_siniestro` (
  `ID_Detalle` int(11) NOT NULL,
  `Es_Responsable` bit(1) DEFAULT b'0',
  `Danios_Observados` text DEFAULT NULL,
  `id_Siniestro` int(11) NOT NULL,
  `id_Vehiculo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `persona`
--

CREATE TABLE `persona` (
  `ID_Persona` int(11) NOT NULL,
  `Nombre` varchar(50) NOT NULL,
  `Apellido` varchar(50) NOT NULL,
  `FechaNac` date NOT NULL,
  `Foto` blob DEFAULT NULL,
  `Genero` bit(1) NOT NULL,
  `Alias` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `persona`
--

INSERT INTO `persona` (`ID_Persona`, `Nombre`, `Apellido`, `FechaNac`, `Foto`, `Genero`, `Alias`) VALUES
(1, 'Jose Alejandro', 'Hernandez Hernandez', '2004-06-06', NULL, b'1', 'Joselito');

--
-- Disparadores `persona`
--
DELIMITER $$
CREATE TRIGGER `tr_BajaPersona` BEFORE DELETE ON `persona` FOR EACH ROW BEGIN
	UPDATE usuario
    SET Activo = 0
    WHERE id_persona = OLD.ID_Persona;
    
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'No se permite eliminar, se aplicó baja lógica';
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
  `Fecha_In` date NOT NULL,
  `Fecha_Fin` date NOT NULL,
  `id_Usuario` int(11) NOT NULL,
  `id_Compania` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `poliza`
--

INSERT INTO `poliza` (`ID_Poliza`, `Num_Polisa`, `Fecha_In`, `Fecha_Fin`, `id_Usuario`, `id_Compania`) VALUES
(1, 2147483647, '2020-01-01', '2027-01-01', 1, 1);

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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `siniestro`
--

CREATE TABLE `siniestro` (
  `ID_Siniestro` int(11) NOT NULL,
  `Folio` int(11) NOT NULL,
  `Nombre` varchar(50) NOT NULL,
  `Descripcion` varchar(255) NOT NULL,
  `Fecha_Hora` datetime DEFAULT NULL,
  `Ubicacion` varchar(100) DEFAULT NULL,
  `Direccion` varchar(255) DEFAULT NULL,
  `id_Poliza` int(11) NOT NULL,
  `id_Ajustador` int(11) NOT NULL,
  `Estatus` enum('Reportado','En Camino','Evaluando','Finalizado') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `Serie` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `unidad`
--

INSERT INTO `unidad` (`ID_Unidad`, `Placa`, `Marca`, `Modelo`, `Color`, `Serie`) VALUES
(1, 'SADF13V13', 'Nissan', 'Versa 2012', 'Gris', 'SAJ12da21JNA');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `ID_Usuario` int(11) NOT NULL,
  `Correo` varchar(50) NOT NULL,
  `Contra` varchar(255) NOT NULL,
  `Activo` bit(1) DEFAULT b'1',
  `id_rol` int(11) DEFAULT NULL,
  `id_persona` int(11) DEFAULT NULL,
  `Fech_Alta` datetime DEFAULT current_timestamp(),
  `Fech_Mod` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`ID_Usuario`, `Correo`, `Contra`, `Activo`, `id_rol`, `id_persona`, `Fech_Alta`, `Fech_Mod`) VALUES
(1, 'Jose@gmail.com', 'Hola_SOY1.', b'1', 1, 1, '2026-04-23 21:36:26', '2026-04-23 21:36:26');

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
-- Estructura Stand-in para la vista `v_det_siniestro`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `v_det_siniestro` (
`Daños` text
,`EsResponsable` varchar(2)
,`Siniestro` varchar(50)
,`Unidad` double
,`Color` varchar(50)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_persona`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `v_persona` (
`NombreCompleto` double
,`Genero` bit(1)
,`Alias` varchar(50)
,`FechaDeNacimiento` date
,`Foto` blob
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_poliza`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `v_poliza` (
`NumeroDePoliza` int(11)
,`PO.Fecha_In + ' - ' + PO.Fecha_Fin` double
,`NombreUsuario` double
,`CorreoUsuario` varchar(50)
,`Compania` varchar(50)
,`RFC_Compania` varchar(50)
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
-- Estructura Stand-in para la vista `v_siniestro`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `v_siniestro` (
`Nombre_Seguro` varchar(50)
,`Folio` int(11)
,`Ubicacion` varchar(100)
,`Direccion` varchar(255)
,`FechaYHora` datetime
,`Descripcion` varchar(255)
,`Estatus` enum('Reportado','En Camino','Evaluando','Finalizado')
,`Ajustador` double
,`Alias` varchar(50)
,`NumPoliza` int(11)
,`FechaPoliza` double
,`CompaniaDeSeguro` varchar(50)
,`RFC_Seguro` varchar(50)
,`Asegurado` double
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_unidad`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `v_unidad` (
`Unidad` double
,`Placa` varchar(50)
,`Color` varchar(50)
,`Serie` varchar(50)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_usuario`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `v_usuario` (
`Correo` varchar(50)
,`Contra` varchar(255)
,`Rol` enum('supervisor','ajustador','asegurado')
,`NombreCompleto` double
,`Foto` blob
,`Genero` bit(1)
,`Alias` varchar(50)
,`FechaNac` date
);

-- --------------------------------------------------------

--
-- Estructura para la vista `v_companiaseguros`
--
DROP TABLE IF EXISTS `v_companiaseguros`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_companiaseguros`  AS SELECT `compania_seguro`.`Nombre_Empresa` AS `Empresa`, `compania_seguro`.`RFC` AS `RFC`, `compania_seguro`.`Telefono_Emergencia` AS `TelEmergencia` FROM `compania_seguro` ;

-- --------------------------------------------------------

--
-- Estructura para la vista `v_det_siniestro`
--
DROP TABLE IF EXISTS `v_det_siniestro`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_det_siniestro`  AS SELECT `d`.`Danios_Observados` AS `Daños`, CASE WHEN `d`.`Es_Responsable` = 1 THEN 'Sí' ELSE 'No' END AS `EsResponsable`, `s`.`Nombre` AS `Siniestro`, `u`.`Marca`+ ', ' + `u`.`Modelo` AS `Unidad`, `u`.`Color` AS `Color` FROM ((`detalle_siniestro` `d` join `siniestro` `s` on(`d`.`id_Siniestro` = `s`.`ID_Siniestro`)) join `unidad` `u` on(`d`.`id_Vehiculo` = `u`.`ID_Unidad`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `v_persona`
--
DROP TABLE IF EXISTS `v_persona`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_persona`  AS SELECT `p`.`Nombre`+ ' ' + `p`.`Apellido` AS `NombreCompleto`, `p`.`Genero` AS `Genero`, `p`.`Alias` AS `Alias`, `p`.`FechaNac` AS `FechaDeNacimiento`, `p`.`Foto` AS `Foto` FROM `persona` AS `p` ;

-- --------------------------------------------------------

--
-- Estructura para la vista `v_poliza`
--
DROP TABLE IF EXISTS `v_poliza`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_poliza`  AS SELECT `po`.`Num_Polisa` AS `NumeroDePoliza`, `po`.`Fecha_In`+ ' - ' + `po`.`Fecha_Fin` AS `PO.Fecha_In + ' - ' + PO.Fecha_Fin`, `p`.`Nombre`+ ' ' + `p`.`Apellido` AS `NombreUsuario`, `u`.`Correo` AS `CorreoUsuario`, `c`.`Nombre_Empresa` AS `Compania`, `c`.`RFC` AS `RFC_Compania` FROM (((`poliza` `po` join `usuario` `u` on(`po`.`id_Usuario` = `u`.`ID_Usuario`)) join `compania_seguro` `c` on(`po`.`id_Compania` = `c`.`ID_Seguro`)) join `persona` `p` on(`u`.`id_persona` = `p`.`ID_Persona`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `v_rol`
--
DROP TABLE IF EXISTS `v_rol`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_rol`  AS SELECT `r`.`Nombre` AS `Nombre`, `c`.`Nombre_Empresa` AS `Empresa` FROM (`rol` `r` join `compania_seguro` `c` on(`r`.`id_Compania` = `c`.`ID_Seguro`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `v_siniestro`
--
DROP TABLE IF EXISTS `v_siniestro`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_siniestro`  AS SELECT `s`.`Nombre` AS `Nombre_Seguro`, `s`.`Folio` AS `Folio`, `s`.`Ubicacion` AS `Ubicacion`, `s`.`Direccion` AS `Direccion`, `s`.`Fecha_Hora` AS `FechaYHora`, `s`.`Descripcion` AS `Descripcion`, `s`.`Estatus` AS `Estatus`, `p`.`Nombre`+ ' ' + `p`.`Apellido` AS `Ajustador`, `p`.`Alias` AS `Alias`, `po`.`Num_Polisa` AS `NumPoliza`, `po`.`Fecha_In`+ ' - ' + `po`.`Fecha_Fin` AS `FechaPoliza`, `c`.`Nombre_Empresa` AS `CompaniaDeSeguro`, `c`.`RFC` AS `RFC_Seguro`, `us`.`Nombre`+ ' ' + `us`.`Apellido` AS `Asegurado` FROM ((((`siniestro` `s` join `persona` `p` on(`s`.`id_Ajustador` = `p`.`ID_Persona`)) join `poliza` `po` on(`s`.`id_Poliza` = `po`.`ID_Poliza`)) join `compania_seguro` `c` on(`po`.`id_Compania` = `c`.`ID_Seguro`)) join `persona` `us` on(`po`.`id_Usuario` = `us`.`ID_Persona`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `v_unidad`
--
DROP TABLE IF EXISTS `v_unidad`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_unidad`  AS SELECT `u`.`Marca`+ ', ' + `u`.`Modelo` AS `Unidad`, `u`.`Placa` AS `Placa`, `u`.`Color` AS `Color`, `u`.`Serie` AS `Serie` FROM `unidad` AS `u` ;

-- --------------------------------------------------------

--
-- Estructura para la vista `v_usuario`
--
DROP TABLE IF EXISTS `v_usuario`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_usuario`  AS SELECT `us`.`Correo` AS `Correo`, `us`.`Contra` AS `Contra`, `r`.`Nombre` AS `Rol`, `p`.`Nombre`+ ' ' + `p`.`Apellido` AS `NombreCompleto`, `p`.`Foto` AS `Foto`, `p`.`Genero` AS `Genero`, `p`.`Alias` AS `Alias`, `p`.`FechaNac` AS `FechaNac` FROM ((`usuario` `us` join `rol` `r` on(`us`.`id_rol` = `r`.`ID_Rol`)) join `persona` `p` on(`us`.`id_persona` = `p`.`ID_Persona`)) ;

--
-- Índices para tablas volcadas
--

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
  ADD KEY `id_Vehiculo` (`id_Vehiculo`);

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
  ADD PRIMARY KEY (`ID_Unidad`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`ID_Usuario`),
  ADD KEY `id_rol` (`id_rol`),
  ADD KEY `id_persona` (`id_persona`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `compania_seguro`
--
ALTER TABLE `compania_seguro`
  MODIFY `ID_Seguro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `detalle_siniestro`
--
ALTER TABLE `detalle_siniestro`
  MODIFY `ID_Detalle` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `persona`
--
ALTER TABLE `persona`
  MODIFY `ID_Persona` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `poliza`
--
ALTER TABLE `poliza`
  MODIFY `ID_Poliza` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `ID_Rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `siniestro`
--
ALTER TABLE `siniestro`
  MODIFY `ID_Siniestro` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `unidad`
--
ALTER TABLE `unidad`
  MODIFY `ID_Unidad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `ID_Usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalle_siniestro`
--
ALTER TABLE `detalle_siniestro`
  ADD CONSTRAINT `detalle_siniestro_ibfk_1` FOREIGN KEY (`id_Siniestro`) REFERENCES `siniestro` (`ID_Siniestro`),
  ADD CONSTRAINT `detalle_siniestro_ibfk_2` FOREIGN KEY (`id_Vehiculo`) REFERENCES `unidad` (`ID_Unidad`);

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
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`ID_Rol`),
  ADD CONSTRAINT `usuario_ibfk_2` FOREIGN KEY (`id_persona`) REFERENCES `persona` (`ID_Persona`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
