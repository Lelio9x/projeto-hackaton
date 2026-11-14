from pathlib import Path
from db import get_db_connection

def inicializar_banco():
    conn = get_db_connection(include_db=False)
    if not conn:
        print("❌ Não foi possível conectar ao MySQL. Verifique se o MySQL está rodando e confira a senha em backend/db.py.")
        return

    sql_path = Path(__file__).parent / "database.sql"
    if not sql_path.exists():
        print(f"❌ Arquivo não encontrado em: {sql_path}")
        return

    cursor = conn.cursor()
    sql_script = sql_path.read_text(encoding="utf-8")

    for statement in sql_script.split(";"):
        stmt = statement.strip()
        if stmt:
            cursor.execute(stmt)

    conn.commit()
    cursor.close()
    conn.close()
    print("✅ Banco 'capim_dourado_ops', tabelas e 23 setores criados com sucesso no MySQL!")

if __name__ == "__main__":
    inicializar_banco()