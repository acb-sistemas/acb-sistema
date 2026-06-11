# ACB Sistema — Contexto do Projeto

## Visão Geral
Sistema de gestão para ONG **Associação Cristã de Base (ACB)** — múltiplos programas sociais, múltiplos municípios e estados do Brasil.

**Desenvolvido por:** Falcioni Consultoria  
**Cliente:** Associação Cristã de Base  
**E-mail cliente:** acb.crato@gmail.com  
**URL do app:** https://acb-sistema.netlify.app  
**Tecnologia:** PWA (HTML/CSS/JS single-file) + Firebase Firestore + Firebase Auth

---

## Credenciais e Infraestrutura

### Firebase
**Projeto:** `acb-sistema`  
**Região:** southamerica-east1 (São Paulo)  
**Auth:** Email/Senha  
```js
const firebaseConfig = {
  apiKey: "AIzaSyDRKvWIml2uvhXQ7efxNo5g7b30fKsYhKk",
  authDomain: "acb-sistema.firebaseapp.com",
  projectId: "acb-sistema",
  storageBucket: "acb-sistema.firebasestorage.app",
  messagingSenderId: "491918625402",
  appId: "1:491918625402:web:6c1b06fd40a017877589c3"
};
```

### Netlify
**Site ID:** `21f6eea6-7952-48c3-9244-c349b7d87eda`  
**Token:** gerar novo em app.netlify.com → User settings → Applications → Personal access tokens (validade 7 dias)  
**Deploy via:** PowerShell WebClient (SHA1 → POST /deploys → PUT arquivos)

### GitHub
**Organização:** https://github.com/acb-sistemas  
**Repositório:** https://github.com/acb-sistemas/acb-sistema  
**Conta GitHub ACB:** `acbcrato-sistema` / acb.crato@gmail.com  
**Conta GitHub Falcioni:** `SistemasClaude`  
**Token GitHub (SistemasClaude):** ver memória do projeto

---

## Arquivos do Projeto
```
index.html      → App completo (single-file PWA)
manifest.json   → Configuração PWA
sw.js           → Service Worker (versão atual: acb-v12)
logo-acb.png    → Logo ACB (splash + login + sidebar)
Falcioni.jpg    → Logo Falcioni (rodapé sidebar)
icon-192.png    → Ícone PWA 192px
icon-512.png    → Ícone PWA 512px
CLAUDE.md       → Este arquivo de contexto
```

---

## Coleções Firestore
```
/programas/{id}       → nome, sigla, descricao, financiador, status
/contratos/{id}       → programaId, numero, sub, financiador, objeto, valor, inicio, fim, metaFisica, unidade, status, municipiosStr
/atividades/{id}      → contratoId, nome
/execucoes/{id}       → contratoId, atividadeNome, municipioId, municipioNome, data, qtd, valor, tecnicoId, status, obs
/repasses/{id}        → contratoId, valor, data, desc, criadoEm (parcelas de repasse recebido)
/beneficiarios/{id}   → nome, cpf, telefone, nascimento, estado, municipioId, municipioNome, comunidade, programaId, programaNome, contratoId, status, dataCadastro, obs
/municipios/{id}      → nome, estado, status
/tecnicos/{id}        → nome, cargo, email, telefone, cpf, status
/usuarios/{id}        → email, nome, perfil (admin/coordenador/financeiro/tecnico), ativo
```

---

## Módulos do Sistema
| Módulo | Descrição |
|--------|-----------|
| Login | Firebase Auth (email/senha) |
| Dashboard | 4 KPIs + gráfico execução por município + programas ativos + últimos beneficiários |
| Programas | CRUD completo |
| Contratos | CRUD com meta física, financiador, período |
| Beneficiários | CRUD com % Física e % Financeira por programa na tabela |
| Municípios | CRUD com filtro por estado |
| Execução Físico-Financeira | 5 KPIs por contrato: Orçamento / Repasse Recebido / A Receber / Gastos / Saldo + tabela por atividade |
| Repasses | Sistema de parcelas por contrato (modal com histórico) |
| Relatórios | 4 relatórios PDF |
| Técnicos | CRUD |
| Usuários | CRUD com criação via Firebase Auth |

---

## Regras de Negócio Importantes

### Beneficiários — % Física e % Financeira
- **% Física** = beneficiários cadastrados no programa ÷ soma de `metaFisica` dos contratos do programa
- **% Financeira** = soma de gastos (execuções) dos contratos do programa ÷ soma do orçamento (valor) dos contratos do programa
- Calculado automaticamente na tabela — sem campo extra no Firestore
- Cores: verde (≥100%), amarelo (≥50%), vermelho (<50%)

### Execução — 5 KPIs
- **Orçamento Total** = valor do contrato
- **Repasse Recebido** = soma das parcelas (`repasses`) — clica em "➕ Parcela" para registrar
- **A Receber** = Orçamento − Repasse Recebido (quanto o financiador ainda deve enviar)
- **Gastos** = soma das execuções registradas
- **Saldo Disponível** = Repasse Recebido − Gastos

### Perfis de Acesso
- `admin` / `coordenador` → veem menu Administração (Técnicos + Usuários)
- `financeiro` / `tecnico` → não veem Administração
- Primeiro usuário logado sem cadastro no Firestore → recebe perfil admin automaticamente

---

## Deploy (PowerShell)
```powershell
# 1. Sempre incrementar versão no sw.js antes de deploy (acb-v12, v13, v14...)
# 2. Rodar o script de deploy PowerShell com WebClient
# 3. Gerar novo token Netlify se der erro 401 (expira em 7 dias)
```

---

## Histórico de Alterações Relevantes
- Logo ACB e Falcioni substituídas
- Atividade virou campo texto livre (sem dropdown)
- Repasse Recebido: sistema de parcelas em vez de valor único
- Dashboard: execução por município corrigida (usa execuções, não beneficiários)
- Beneficiários: colunas % Física e % Financeira adicionadas (jun/2026)
- Execução: KPI "A Receber" adicionado (jun/2026)
