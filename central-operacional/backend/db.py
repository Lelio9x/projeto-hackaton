import os
import mysql.connector
from mysql.connector import Error

# Configure o usuário e a senha do seu MySQL apenas aqui:
DB_CONFIG = {
    "host": os.environ.get("DB_HOST", "localhost"),
    "user": os.environ.get("DB_USER", "root"),
    "password": os.environ.get("DB_PASSWORD", "Leliofilho23@"),  # Coloque a senha do seu MySQL aqui
    "database": os.environ.get("DB_NAME", "capim_dourado_ops"),
    "port": int(os.environ.get("DB_PORT", 3306)),
}


def get_db_connection(include_db: bool = True):
    """Retorna conexão ativa com o MySQL ou None se estiver offline."""
    config = DB_CONFIG.copy()
    if not include_db:
        config.pop("database", None)
    try:
        conn = mysql.connector.connect(**config)
        if conn.is_connected():
            return conn
    except Error:
        return None
    return None


# Dados de contingência caso o MySQL esteja fechado
FALLBACK_SETORES = [
    {"id": "estacionamento", "nome": "Estacionamento", "pavimento": "1º Pavimento — Térreo", "mitigacao_simulada": False},
    {"id": "estacionamento-frontal", "nome": "Estacionamento Frontal", "pavimento": "1º Pavimento — Térreo", "mitigacao_simulada": False},
    {"id": "acesso-principal", "nome": "Acesso Principal", "pavimento": "1º Pavimento — Térreo", "mitigacao_simulada": False},
    {"id": "praca-eventos", "nome": "Praça de Eventos", "pavimento": "1º Pavimento — Térreo", "mitigacao_simulada": False},
    {"id": "circulacao-central", "nome": "Circulação Central", "pavimento": "1º Pavimento — Térreo", "mitigacao_simulada": False},
    {"id": "cea", "nome": "C&A", "pavimento": "1º Pavimento — Térreo", "mitigacao_simulada": False},
    {"id": "renner", "nome": "Renner", "pavimento": "1º Pavimento — Térreo", "mitigacao_simulada": False},
    {"id": "corredor-oeste", "nome": "Corredor Oeste", "pavimento": "1º Pavimento — Térreo", "mitigacao_simulada": False},
    {"id": "corredor-leste", "nome": "Corredor Leste", "pavimento": "1º Pavimento — Térreo", "mitigacao_simulada": False},
    {"id": "cinemark", "nome": "Cinemark", "pavimento": "1º Pavimento — Térreo", "mitigacao_simulada": False},
    {"id": "lojas-ancora", "nome": "Lojas Âncora", "pavimento": "1º Pavimento — Térreo", "mitigacao_simulada": False},
    {"id": "morofit-wow-park", "nome": "Morofit / Wow Park", "pavimento": "1º Pavimento — Térreo", "mitigacao_simulada": False},
    {"id": "doca-servico", "nome": "Doca e Serviço", "pavimento": "1º Pavimento — Térreo", "mitigacao_simulada": False},
    {"id": "praca-alimentacao", "nome": "Praça de Alimentação", "pavimento": "2º Pavimento — Praça de Alimentação", "mitigacao_simulada": False},
    {"id": "alimentacao-norte", "nome": "Lojas de Alimentação Norte", "pavimento": "2º Pavimento — Praça de Alimentação", "mitigacao_simulada": False},
    {"id": "alimentacao-sul", "nome": "Lojas de Alimentação Sul", "pavimento": "2º Pavimento — Praça de Alimentação", "mitigacao_simulada": False},
    {"id": "mundo-imersivo", "nome": "Mundo Imersivo", "pavimento": "2º Pavimento — Praça de Alimentação", "mitigacao_simulada": False},
    {"id": "evento-imerso-mar", "nome": "Evento Imerso Mar", "pavimento": "2º Pavimento — Praça de Alimentação", "mitigacao_simulada": False},
    {"id": "escadas-rolantes", "nome": "Escadas Rolantes", "pavimento": "2º Pavimento — Circulação Vertical", "mitigacao_simulada": False},
    {"id": "banheiros-masculinos", "nome": "Banheiros Masculinos", "pavimento": "2º Pavimento — Sanitários", "mitigacao_simulada": False},
    {"id": "banheiros-femininos", "nome": "Banheiros Femininos", "pavimento": "2º Pavimento — Sanitários", "mitigacao_simulada": False},
    {"id": "casa-maquinas-ac", "nome": "Casa de Máquinas A.C", "pavimento": "2º Pavimento — Bastidores Técnicos", "mitigacao_simulada": False},
    {"id": "administracao", "nome": "Administração", "pavimento": "2º Pavimento — Bastidores Técnicos", "mitigacao_simulada": False},
]

FALLBACK_OCORRENCIAS = [
    {"id": 1, "setor_id": "casa-maquinas-ac", "titulo": "Vibração alta no Chiller 02", "descricao": "Pressão acima do nominal na linha de água gelada.", "severidade": "Crítica", "area_responsavel": "Climatização", "status": "Aberta"},
    {"id": 2, "setor_id": "escadas-rolantes", "titulo": "Sensor de degrau em alerta na Escada Leste", "descricao": "Inspeção preventiva necessária.", "severidade": "Alta", "area_responsavel": "Manutenção", "status": "Aberta"},
    {"id": 3, "setor_id": "praca-alimentacao", "titulo": "Fila de higienização de bandejas", "descricao": "Alto fluxo próximo à claraboia central.", "severidade": "Média", "area_responsavel": "Limpeza", "status": "Aberta"},
    {"id": 4, "setor_id": "estacionamento", "titulo": "Cancela 03 com leitura lenta de tag", "descricao": "Retenção leve no acesso norte.", "severidade": "Média", "area_responsavel": "Segurança", "status": "Aberta"},
]