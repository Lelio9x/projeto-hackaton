CREATE DATABASE IF NOT EXISTS capim_dourado_ops
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE capim_dourado_ops;

-- 1. Tabela de Pisos
CREATE TABLE IF NOT EXISTS pisos (
    id VARCHAR(16) PRIMARY KEY,
    name VARCHAR(80) NOT NULL,
    plan LONGTEXT
);

-- 2. Tabela de Áreas / Setores do Shopping (t1..t13 e s1..s10)
CREATE TABLE IF NOT EXISTS areas (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    floorId VARCHAR(16) NOT NULL,
    x DOUBLE NOT NULL DEFAULT 50,
    y DOUBLE NOT NULL DEFAULT 50
);

-- 3. Tabela de Ocorrências / Chamados
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

-- 4. Tabela de Equipamentos (Manutenção Preventiva / Passaportes)
CREATE TABLE IF NOT EXISTS equipamentos (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(160) NOT NULL,
    areaId VARCHAR(32) NOT NULL,
    freq INT NOT NULL DEFAULT 30,
    last_exec BIGINT NOT NULL,
    resp VARCHAR(80),
    log_json JSON
);

-- 5. Tabela de Configurações e Rondas Diárias
CREATE TABLE IF NOT EXISTS sistema_meta (
    chave VARCHAR(64) PRIMARY KEY,
    valor_json JSON NOT NULL
);