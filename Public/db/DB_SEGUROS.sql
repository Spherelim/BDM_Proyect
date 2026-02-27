CREATE DATABASE seguros_db;

USE seguros_db;

-- ================================================== --
--                      USUARIO                       --
-- ================================================== --
CREATE TABLE Persona(
    id_per INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) not null,
    apellidos VARCHAR(50) not null,
    fech_nac DATE not null,
    foto BLOB not null,
    genero BIT not null,
    alias VARCHAR(50) not null
);

CREATE TABLE Usuario(
    id_us INT AUTO_INCREMENT PRIMARY KEY,
    correo NVARCHAR(50) not null UNIQUE,
    Contra NVARCHAR(50) not null,

    Activo BIT DEFAULT 1,

    rol INT not null,
    persona INT not null,

    FOREIGN KEY (rol) REFERENCES Rol(id_rol),
    FOREIGN KEY (persona) REFERENCES Persona(id_per)

);

CREATE TABLE Rol(
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(50) not null UNIQUE
);

-- ================================================== --
--                      SINIESTRO                     --
-- ================================================== --

CREATE TABLE Siniestro(
    id_siniestro INT AUTO_INCREMENT PRIMARY KEY,

    -- aqui quiero ponerle el nombre como "Siniestro # dia+mes+{id del siniestro}" --
    -- pero quiero que empieze... no sé como: 26020001 --
    Folio INT not null,
    Nombre VARCHAR(50) not null UNIQUE,
    Descripcion VARCHAR(255) not null,
    Fecha_Hora DATETIME,
    Ubicacion VARCHAR(100),
    Direccion VARCHAR(255),

    id_Poliza INT not null, -- con la Poliza ya tengo quien es el Asegurado --
    id_Ajustador INT not null,

    Estatus ENUM('Reportado','En Camino','Evaluando','Finalizado'),

    FOREIGN KEY (id_Ajustador) REFERENCES Usuario(id_us),
    FOREIGN KEY (id_Poliza) REFERENCES Poliza(id_poliza)
);

CREATE TABLE Unidad(
    id_Unidad INT AUTO_INCREMENT PRIMARY KEY,
    Placa VARCHAR(50) not null UNIQUE,
    Marca VARCHAR(50) not null,
    Modelo VARCHAR(50) not null,
    Color VARCHAR(50),
    serie VARCHAR(50) -- Este es el número de serie del motor
);

CREATE TABLE Poliza(
    id_poliza INT AUTO_INCREMENT PRIMARY KEY,
    Num_Poliza INT,
    id_Usuario INT not null,-- Dueño de la Poliza --
    id_Compania INT not null,

    fecha_inicio DATE,
    fecha_fin DATE,

    FOREIGN KEY (id_Usuario) REFERENCES Usuario(id_us),
    FOREIGN KEY (id_Compania) REFERENCES Compania_Seguro(id_Seguro)
);

CREATE TABLE Compania_Seguro(
    id_Seguro INT AUTO_INCREMENT PRIMARY KEY,
    Nombre_Empresa VARCHAR(50) not null ,
    Telefono_Emergencia VARCHAR(50),
    RFC VARCHAR(50)
);

CREATE TABLE Detalle_Siniestro(
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    Es_Responsable BIT DEFAULT 0,
    danios_Observados TEXT,

    id_Siniestro INT not null,
    id_Vehiculo INT not null,

    FOREIGN KEY (id_Siniestro) REFERENCES Siniestro(id_siniestro),
    FOREIGN KEY (id_Vehiculo) REFERENCES Unidad(id_Unidad)
);