# FASE 15 — E2E / PRODUCTION READINESS

## Status

BLOCKED

## Escopo executado

- revisão da coleta inicial de ambiente e git
- auditoria segura de arquivos de ambiente sem expor segredos
- varredura de todas as chamadas `supabase.rpc(...)` no frontend
- comparação com as migrações do banco
- rastreio de chain `DATABASE → RPC/RLS → SERVICE → HOOK/STATE → COMPONENT → ROUTE`
- checagem de false-success / catches silenciosos / UI navegando com erro ignorado
- revisão de RLS/IDOR para IDs sensíveis
- revisão de drift de migrations e de contratos de RPC
- revisão de notifications / realtime / chat
- execução final de `npx tsc --noEmit --pretty false` e `npm run build -- --mode production`

## Ambiente

- `.env`: PRESENTE
- `SUPABASE_URL`: PRESENTE
- `SUPABASE_ANON_KEY`: PRESENTE
- `.env.local`: AUSENTE
- `.env.production`: AUSENTE
- `.env.example`: PRESENTE
- `npm ls playwright @playwright/test cypress vitest --depth=0`: sem ferramentas E2E instaladas no repo
- browser real e sessão autenticada: não disponíveis no ambiente desta auditoria

## Evidência automatizada

- `npx tsc --noEmit --pretty false` executado com sucesso
- `npm run build -- --mode production` executado com sucesso
- `src/services/trips.ts` chama `create_trip` com `p_visibility`, mas a migração atual em `supabase/migrations/20260913000000_security_search_path_hardening.sql` redefine `create_trip` sem esse parâmetro
- `src/services/trips.ts` chama `join_trip_with_group` e `leave_trip_with_group`, mas a função mais recente do contrato é `join_trip` e `leave_trip`, com uma versão histórica separada em `20260912050000_trip_hub.sql`
- a UI usa `catch {}` e `/* silent */` em fluxos de chat, convite, conversa e feed, o que torna `false-success` possível sem feedback real de erro
- a cadeia de RLS existe no SQL e exige `auth.uid()` / pertença à conversa / pertencimento ao trip / ownership da notificação, mas isso foi validado apenas estático, não em sessão real
- o projeto está build-clean, porém a maturidade real do backend e da autenticação não pode ser comprovada sem um Supabase remoto e um browser autenticado

## Matriz E2E

| Fluxo | Static | Runtime | Backend | E2E real | Status |
|---|---|---|---|---|---|
| Auth | PASS | UNVERIFIABLE | UNVERIFIABLE | UNVERIFIABLE | BLOCKED |
| Friends | PASS | UNVERIFIABLE | UNVERIFIABLE | UNVERIFIABLE | BLOCKED |
| Community/feed | PASS | UNVERIFIABLE | UNVERIFIABLE | UNVERIFIABLE | BLOCKED |
| Trips | PASS | PARTIAL | PARTIAL | UNVERIFIABLE | BLOCKED |
| Trip invite | PASS | PARTIAL | PARTIAL | UNVERIFIABLE | BLOCKED |
| Notifications | PASS | PARTIAL | UNVERIFIABLE | UNVERIFIABLE | BLOCKED |
| Chat | PASS | PARTIAL | UNVERIFIABLE | UNVERIFIABLE | BLOCKED |

## Problemas encontrados

### 1) Drift real de contrato de RPC em trip creation

- Frontend: `src/services/trips.ts` -> `create_trip` com `p_visibility`
- Migração atual: `supabase/migrations/20260913000000_security_search_path_hardening.sql` -> `create_trip(p_title, p_description, p_destination, p_start_date, p_end_date, p_max_participants)`
- Evidência: a assinatura mudou; o parâmetro `p_visibility` deixou de existir
- Impacto: a criação de trip pode falhar em runtime em banco migrado do estado final
- Severidade: HIGH

### 2) Drift real de contrato de join/leave trip

- Frontend: `joinTrip()` e `leaveTrip()` chamam `join_trip_with_group` e `leave_trip_with_group`
- Migração atual: `join_trip(p_trip_id)` e `leave_trip(p_trip_id)`
- Evidência: o nome antigo existe em `20260912050000_trip_hub.sql`, mas o contrato atual usa nomes diferentes
- Impacto: fluxo de entrada/saída de trip pode quebrar em uma base recriada a partir da cadeia final de migrations
- Severidade: MEDIUM/HIGH conforme backend efetivo

### 3) False-success e erro silencioso na UI

- Exemplos: `Chat.tsx` `handleSend`, `handleSendMedia`, `handleReact`, `handleDelete` usam `catch {}` sem feedback
- `TripDetailPage.tsx` `openInviteModal` faz `catch {}` e `setLoadingFriends(false)` fora do finally
- `ConversationsList.tsx` `load()` ignora falha de carregamento do chat
- Impacto: pode parecer sucesso ao usuário enquanto backend falha em segundo plano
- Severidade: MEDIUM

### 4) Fallback silencioso de Supabase

- `src/services/supabase.ts` cria cliente com `https://placeholder.supabase.co` e `placeholder-key` quando as vars faltam
- Isso permite build e runtime local sem quebrar cedo
- Impacto: ambiente sem backend real pode produzir “app funcionando” sem funcionalidade real
- Severidade: MEDIUM

## Problema principal

O maior gargalo funcional e de produção continua sendo a ausência de prova de runtime real com Supabase e sessão autenticada, agravada por drift de contrato entre frontend e migrations no fluxo de trips. O código compila, mas a operação real não foi validada em ambiente autenticado.

## Reprodução

### Repro 1: contrato de trip creation

```ts
// src/services/trips.ts
const { data, error } = await supabase.rpc('create_trip', {
  p_title: params.title,
  p_description: params.description ?? null,
  p_destination: params.destination ?? null,
  p_start_date: params.start_date ?? null,
  p_end_date: params.end_date ?? null,
  p_max_participants: params.max_participants ?? null,
  p_visibility: params.visibility ?? 'public',
})
```

```sql
-- supabase/migrations/20260913000000_security_search_path_hardening.sql
CREATE OR REPLACE FUNCTION create_trip(
  p_title TEXT,
  p_description TEXT DEFAULT NULL,
  p_destination TEXT DEFAULT NULL,
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL,
  p_max_participants INT DEFAULT NULL
)
```

Conclusão: `p_visibility` não existe na função final; isso é uma inconsistência de contrato reproduzível por análise estática.

### Repro 2: contrato de join/leave trip

```ts
// src/services/trips.ts
await supabase.rpc('join_trip_with_group', { p_trip_id: tripId })
await supabase.rpc('leave_trip_with_group', { p_trip_id: tripId })
```

```sql
-- supabase/migrations/20260913000000_security_search_path_hardening.sql
CREATE OR REPLACE FUNCTION join_trip(p_trip_id UUID)
CREATE OR REPLACE FUNCTION leave_trip(p_trip_id UUID)
```

Conclusão: o frontend está alinhado com uma versão histórica do contrato e não com a última implementação do banco.

## Correção

Não aplicada nesta fase, porque a regra da auditoria exige reprodução, validação e somente então correção. O problema de contrato foi reproduzido por evidência estática, mas não foi validado em base real autenticada.

## Validação pós-correção

Não executada: não houve correção aplicada e não existe ambiente real de Supabase/browser autenticado para validar o fluxo em produção.

## O que permanece não verificável

- browser real com sessão autenticada
- Supabase remoto em preview/produção
- realtime real em produção
- chat real e notif real em base viva
- autorização por RLS em execução real
- E2E real por usuário autenticado

## Riscos restantes

- fluxo de criação de trip com contrato quebrado em base final
- join/leave trip driftado por versões de migration
- UI false-success em chat e convite
- produção com fallback placeholder sem erro precoce
- impossibilidade de provar prontidão real sem ambiente de autenticação real

## Próxima prioridade

1. remover drift de contrato de `create_trip` / `join_trip` / `leave_trip`
2. padronizar o contrato atual da API do banco e do frontend
3. provisionar Supabase real e sessão autenticada
4. rodar E2E real em browser autenticado para auth, friends, trips, notifications e chat
5. somente então decidir readiness real para produção
