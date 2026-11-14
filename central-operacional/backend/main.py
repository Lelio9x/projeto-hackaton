import json
from typing import Any, Dict, List, Optional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from db import get_db_connection

app = FastAPI(title="Capim Dourado Smart Operations API", version="5.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MEM_STATE: Dict[str, Any] = {}


class FullStatePayload(BaseModel):
    v: Optional[int] = 3
    floors: List[Dict[str, Any]]
    areas: List[Dict[str, Any]]
    team: List[str]
    items: List[str]
    occ: List[Dict[str, Any]]
    equip: List[Dict[str, Any]]
    rounds: Dict[str, Any]


@app.get("/api/state")
def carregar_estado():
    conn = get_db_connection()
    if not conn:
        if not MEM_STATE:
            return {"empty": True, "db_mode": "local"}
        return {**MEM_STATE, "db_mode": "local"}

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, name, plan FROM pisos")
    floors = cursor.fetchall()

    cursor.execute("SELECT id, name, floorId, x, y FROM areas")
    areas = cursor.fetchall()

    if not areas:
        cursor.close()
        conn.close()
        return {"empty": True, "db_mode": "mysql"}

    cursor.execute("SELECT * FROM ocorrencias ORDER BY created DESC")
    occ_rows = cursor.fetchall()
    occ = []
    for r in occ_rows:
        occ.append({
            "id": r["id"],
            "title": r["title"],
            "areaId": r["areaId"],
            "cat": r["cat"],
            "prio": r["prio"],
            "status": r["status"],
            "resp": r["resp"] or "",
            "desc": r["descr"] or "",
            "created": r["created"],
            "updated": r["updated"],
            "resolved": r["resolved"],
            "x": r["x"],
            "y": r["y"],
            "log": json.loads(r["log_json"]) if r.get("log_json") else [],
        })

    cursor.execute("SELECT * FROM equipamentos")
    eq_rows = cursor.fetchall()
    equip = []
    for e in eq_rows:
        equip.append({
            "id": e["id"],
            "name": e["name"],
            "areaId": e["areaId"],
            "freq": e["freq"],
            "last": e["last_exec"],
            "resp": e["resp"] or "",
            "log": json.loads(e["log_json"]) if e.get("log_json") else [],
        })

    cursor.execute("SELECT chave, valor_json FROM sistema_meta")
    meta = {row["chave"]: json.loads(row["valor_json"]) for row in cursor.fetchall()}

    cursor.close()
    conn.close()

    return {
        "v": 3,
        "db_mode": "mysql",
        "floors": floors,
        "areas": areas,
        "occ": occ,
        "equip": equip,
        "team": meta.get("team", ["Manutenção Predial", "Limpeza", "Segurança", "Climatização", "TI", "Operações"]),
        "items": meta.get("items", ["Limpeza", "Iluminação", "Climatização", "Sinalização", "Segurança"]),
        "rounds": meta.get("rounds", {}),
    }


@app.put("/api/state")
def salvar_estado(payload: FullStatePayload):
    data = payload.dict()
    MEM_STATE.clear()
    MEM_STATE.update(data)

    conn = get_db_connection()
    if not conn:
        return {"ok": True, "db_mode": "local"}

    cursor = conn.cursor()

    # 1. Sincroniza pisos
    cursor.execute("DELETE FROM pisos")
    for f in data["floors"]:
        cursor.execute(
            "INSERT INTO pisos (id, name, plan) VALUES (%s, %s, %s)",
            (f["id"], f["name"], f.get("plan")),
        )

    # 2. Sincroniza áreas
    cursor.execute("DELETE FROM areas")
    for a in data["areas"]:
        cursor.execute(
            "INSERT INTO areas (id, name, floorId, x, y) VALUES (%s, %s, %s, %s, %s)",
            (a["id"], a["name"], a["floorId"], float(a.get("x", 50)), float(a.get("y", 50))),
        )

    # 3. Sincroniza ocorrências
    cursor.execute("DELETE FROM ocorrencias")
    for o in data["occ"]:
        cursor.execute(
            """
            INSERT INTO ocorrencias
            (id, title, areaId, cat, prio, status, resp, descr, created, updated, resolved, x, y, log_json)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                o["id"],
                o["title"],
                o["areaId"],
                o["cat"],
                o["prio"],
                o["status"],
                o.get("resp", ""),
                o.get("desc", ""),
                int(o["created"]),
                int(o.get("updated", o["created"])),
                int(o["resolved"]) if o.get("resolved") else None,
                float(o["x"]) if o.get("x") is not None else None,
                float(o["y"]) if o.get("y") is not None else None,
                json.dumps(o.get("log", []), ensure_ascii=False),
            ),
        )

    # 4. Sincroniza equipamentos
    cursor.execute("DELETE FROM equipamentos")
    for e in data["equip"]:
        cursor.execute(
            """
            INSERT INTO equipamentos (id, name, areaId, freq, last_exec, resp, log_json)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (
                e["id"],
                e["name"],
                e["areaId"],
                int(e.get("freq", 30)),
                int(e["last"]),
                e.get("resp", ""),
                json.dumps(e.get("log", []), ensure_ascii=False),
            ),
        )

    # 5. Sincroniza rondas e equipes
    for chave in ("team", "items", "rounds"):
        valor = json.dumps(data.get(chave), ensure_ascii=False)
        cursor.execute(
            """
            INSERT INTO sistema_meta (chave, valor_json) VALUES (%s, %s)
            ON DUPLICATE KEY UPDATE valor_json = VALUES(valor_json)
            """,
            (chave, valor),
        )

    conn.commit()
    cursor.close()
    conn.close()
    return {"ok": True, "db_mode": "mysql"}