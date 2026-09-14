# FASE 18 — RUNTIME E2E

## Status geral
BLOCKED

## Ambiente
- Repositório atual: `/Volumes/SSD KAYQUE/Amazon Wind/SITE/amzwind`
- Branch: `main`
- HEAD atual: `8c0e809`
- Node: `v24.19.0`
- Framework: React + TypeScript + Vite
- Scripts disponíveis: `dev`, `build`, `preview`
- E2E tooling: ausente (`Playwright`, `Cypress`, `Vitest` não instalados)
- Variáveis de ambiente do Supabase no repositório: `.env` presente com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
- `.env.local` / `.env.production` / `.env.development`: ausentes

## Auth
- O app possui fluxo de login real em [src/pages/Login.tsx](../src/pages/Login.tsx), usando `supabase.auth.signInWithPassword({ email, password })`.
- Também há autenticação por `getSession()`, `getUser()` e rotas protegidas em [src/components/ProtectedRoute.tsx](../src/components/ProtectedRoute.tsx).
- No ambiente atual, não há sessão autenticada ativa, nem credenciais de teste disponíveis.
- Status: `AUTH E2E = BLOCKED`

## Supabase
- URL do projeto encontrada no arquivo [.env](../.env): presente.
- Sem expor segredo, a validação técnica mínima foi feita contra o endpoint remoto.
- Evidência executada:
  - `GET https://iteptswfcbidnpewahdk.supabase.co/auth/v1/health`
  - resultado: `HTTP 401`
  - motivo: `No API key found in request`
- Isso confirma que o domínio real do Supabase responde e o projeto está apontando para um backend remoto válido.

## Routes
- As rotas principais estão em [src/App.tsx](../src/App.tsx).
- Há rotas de trips em `/trips`, `/trips/new`, `/trips/:id`, `/trips/:id/edit`.
- A rota protegida foi validada apenas estaticamente; não foi possível provar navegação real em sessão autenticada neste ambiente.

## Trips
- O contrato do service principal de trips está em [src/services/trips.ts](../src/services/trips.ts).
- Os fluxos principais dependem das RPCs:
  - `create_trip`
  - `update_trip`
  - `list_trips`
  - `get_trip`
  - `join_trip`
  - `leave_trip`
  - `invite_to_trip`
  - `respond_trip_invite`
- Foi validado pela auditoria estática que o service ativo é compatível com a migração atual em [supabase/migrations/20260913020000_fix_trip_contract_alignment.sql](../supabase/migrations/20260913020000_fix_trip_contract_alignment.sql).
- Não foi possível provar comportamento real em banco autenticado e navegador real.

## Trip Invite
- O fluxo de convite está implementado em [src/services/trips.ts](../src/services/trips.ts) e [src/pages/TripDetailPage.tsx](../src/pages/TripDetailPage.tsx).
- Não foi executado em ambiente real com dois usuários e sessão autenticada.
- Status: `UNVERIFIABLE`

## Notifications
- O app possui mecanismo de notificação e `NotificationBadge` em [src/components/NotificationBadge.tsx](../src/components/NotificationBadge.tsx).
- Sem sessão real e sem realtime autenticado, o fluxo não pode ser validado.
- Status: `UNVERIFIABLE`

## Chat
- O chat existe com `supabase.auth.getUser()` e serviços dedicados.
- Sem usuários reais em sessão, o fluxo end-to-end não foi validado.
- Status: `UNVERIFIABLE`

## Realtime
- A aplicação usa `Supabase` e autenticação, mas não há ambiente real com sessões autenticadas para validar `postgres_changes` e UI sincronizada.
- Status: `UNVERIFIABLE`

## RLS
- Não foi possível validar políticas RLS em sessão real sem usuários autenticados do projeto.
- Status: `RLS E2E = UNVERIFIABLE`

## False Success
- O projeto tem vários `catch {}` vazios em paths críticos (ex.: feed, trip page, invite) que podem mascarar falhas reais.
- Isso impede a classificação de sucesso por UI apenas.
- Evidência: [src/pages/TripDetailPage.tsx](../src/pages/TripDetailPage.tsx) contém `catch { /* silent */ }` e `catch { /* feed optional */ }` em pontos de ação crítica.

## Deploy
- Não foi identificado um deploy real/preview acessível com credenciais configuradas para autenticação E2E.
- Status: `UNVERIFIABLE`

## Evidências
1. `node -v` -> `v24.19.0`
2. `npm run build` -> verificado anterior e sucesso (`✓ built in 1.96s`)
3. `SUPABASE_URL` presente em [.env](../.env)
4. `GET /auth/v1/health` -> `HTTP 401` com `No API key found in request`
5. ausência de `Playwright` / `Cypress` / `Vitest`
6. ausência de usuário de teste e sessão real ativa

## Problemas reproduzidos
### ID-01
- Severidade: HIGH
- Fluxo: autenticação real / runtime E2E
- Passos para reproduzir:
  1. iniciar app local
  2. tentar autenticar com credenciais disponíveis no ambiente
  3. observar que não há sessão válida e não há usuário de teste
- Resultado esperado: login real e sessão ativa
- Resultado observado: ambiente sem credenciais válidas e sem sessão autenticada
- Evidência: login em [src/pages/Login.tsx](../src/pages/Login.tsx) exige email/senha; shell e arquivos de ambiente não expõem sessão disponível
- Causa provável: ausência de credenciais de teste e de ferramenta E2E instalada
- Correção necessária: configurar usuários de teste reais no Supabase e rodar autenticação E2E em browser real

### ID-02
- Severidade: MEDIUM
- Fluxo: auditoria E2E automatizada
- Passos para reproduzir:
  1. verificar ferramentas no projeto
  2. observar ausência de Playwright/Cypress/Vitest
- Resultado esperado: infra E2E disponível
- Resultado observado: nenhum framework E2E instalado
- Evidência: comando `npm ls --depth=0 @playwright/test vitest cypress --json` retornou ausência
- Causa provável: projeto não inclui infraestrutura de testes end-to-end
- Correção necessária: instalar e configurar ferramenta E2E apenas para auditoria, sem misturar com correções de produto

## Conclusão
O ambiente remoto do Supabase responde, mas a aplicação não pode ser considerada validada em runtime real porque não existe sessão autenticada e não existe ferramenta E2E pronta. O build continua sendo um sinal útil de compilação, mas não é evidência de funcionamento real de produção.

### Status final
BLOCKED

### Maior problema real encontrado
Falta de prova real de autenticação e fluxo end-to-end contra o Supabase configurado.

### Fluxos realmente testados
- build do projeto
- reachability real do domínio do Supabase
- presença/ausência de credenciais e sessão autenticada
- existência de fluxo login e proteção de rotas

### Fluxos não testáveis no ambiente atual
- login E2E real
- criação de trip autenticada
- join/leave de trip real
- convite de trip entre usuários
- notifications e chat reais
- realtime
- RLS em sessão real

## Próxima prioridade real
1. Providenciar usuários de teste reais no Supabase e uma sessão autenticada válida
2. Instalar Playwright ou equivalente
3. Executar E2E real do fluxo login → trips → join/leave → invites → notifications -> chat
4. Só então reavaliar produção pronta com evidência de runtime
