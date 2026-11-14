CREATE DATABASE IF NOT EXISTS capim_dourado_ops;
  USE capim_dourado_ops;

DROP TABLE IF EXISTS ocorrencias;
DROP TABLE IF EXISTS setores;

CREATE TABLE IF NOT EXISTS pisos (
    id VARCHAR(16) PRIMARY KEY,
    name VARCHAR(80) NOT NULL,
    plan LONGTEXT
);

CREATE TABLE IF NOT EXISTS areas (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    floorId VARCHAR(16) NOT NULL,
    x DOUBLE NOT NULL DEFAULT 50,
    y DOUBLE NOT NULL DEFAULT 50
);

CREATE TABLE IF NOT EXISTS ocorrencias (
    id VARCHAR(32) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    areaId VARCHAR(32) NOT NULL,
    cat VARCHAR(60) NOT NULL,
    prio VARCHAR(30) NOT NULL,
    status VARCHAR(30) NOT NULL,
    resp VARCHAR(80),
    descr TEXT,
    created BIGINT NOT NULL,
    updated BIGINT NOT NULL,
    resolved BIGINT NULL,
    x DOUBLE,
    y DOUBLE,
    log_json JSON
);

CREATE TABLE IF NOT EXISTS equipamentos (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(160) NOT NULL,
    areaId VARCHAR(32) NOT NULL,
    freq INT NOT NULL DEFAULT 30,
    last_exec BIGINT NOT NULL,
    resp VARCHAR(80),
    log_json JSON
);

CREATE TABLE IF NOT EXISTS sistema_meta (
    chave VARCHAR(64) PRIMARY KEY,
    valor_json JSON NOT NULL
);
