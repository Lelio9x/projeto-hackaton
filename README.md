# Capim Dourado Smart Operations

Sistema web de gestão operacional e monitoramento em tempo real desenvolvido para o Capim Dourado Shopping. A plataforma centraliza o acompanhamento de ocorrências, o controle de prazos de atendimento (SLA), a manutenção preventiva de equipamentos e a visualização dos pavimentos em plantas 2D e maquete interativa 3D.

## Funcionalidades

- **Gestão de Ocorrências e SLA:** Registro e acompanhamento de chamados técnicos por setor, nível de criticidade e equipe responsável, com controle de prazo em tempo real.
- **Mapeamento 2D e Maquete 3D:** Visualização espacial do Térreo e da Praça de Alimentação com alertas luminosos que indicam a gravidade dos problemas em cada área.
- **Modo Futuro e Simulador de Crises:** Projeção de riscos operacionais em um período de até 24 horas e realização de testes de impacto para cenários de emergência.
- **Manutenção Preventiva e Rondas Diárias:** Controle de vencimento das revisões de equipamentos via QR Code e checklist diário de inspeção dos setores.

## Tecnologias Utilizadas

- **Front-end:** HTML5, CSS3, JavaScript e Three.js.
- **Back-end:** Python, FastAPI e Uvicorn.
- **Banco de Dados:** MySQL.

## Estrutura de Pastas

- `frontend/`: Arquivos de interface, estilos, imagens e scripts do painel e da maquete 3D.
- `backend/`: API em FastAPI, configuração de conexão com o MySQL e scripts do banco de dados (`database.sql`).

## Como Executar o Projeto

1. **Banco de Dados:** Execute o arquivo `backend/database.sql` no MySQL Workbench e informe a senha do seu MySQL local no arquivo `backend/db.py`.
2. **Back-end:** No terminal, acesse a pasta `backend`, instale as dependências e inicie a API:
   ```bash
   cd backend
   py -m pip install -r requirements.txt
   py -m uvicorn main:app --reload --port 8000