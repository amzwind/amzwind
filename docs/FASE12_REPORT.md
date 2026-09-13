# FASE 12 — Production Readiness Audit

## STATUS

PASS WITH FIXES

## EXECUTIVE SUMMARY

O repositório atual está funcional e já reúne uma base real de produto: autenticação, perfil, amigos, chat, comunidade, trips, notificações, admin, storage, realtime e navegação. O cenário mais importante da auditoria foi confirmar se aquelas funcionalidades realmente coexistem de forma coerente na cadeia completa de banco → RPC → service → state → UI → rota → navegação → realtime.

A auditoria real mostrou que o produto não está quebrado por falta de estrutura, mas por inconsistências de integração em pontos sensíveis do social graph. O problema principal identificado foi no backend: as funções de feed e convite de trip ainda fazem referência a `friendships.status`, apesar do schema real da tabela não possuir essa coluna.

## PRODUCT MAP

### AUTH
- Login: implemented in [src/pages/Login.tsx](src/pages/Login.tsx)
- Logout/session: handled by Supabase auth and [src/components/ProtectedRoute.tsx](src/components/ProtectedRoute.tsx)
- Route protection: functional via protected routes in [src/App.tsx](src/App.tsx)

### PROFILE
- User profile: [src/pages/UserProfile.tsx](src/pages/UserProfile.tsx)
- Avatar: supported by profiles table and UI
- Friends/trips/community: surfaced through profile and nav

### FRIENDS
- Search and request flow: [src/pages/FriendsPage.tsx](src/pages/FriendsPage.tsx)
- Social table: [supabase/migrations/20260912010000_create_social_platform.sql](supabase/migrations/20260912010000_create_social_platform.sql)
- RPCs: `send_friend_request`, `respond_friend_request`, `remove_friend`, `search_users`

### CHAT
- Conversations/messages: [src/pages/Chat.tsx](src/pages/Chat.tsx) and [src/services/chat.ts](src/services/chat.ts)
- Realtime: via Supabase channels and message subscriptions

### COMMUNITY
- Feed and feed filtering: [src/components/feed/Feed.tsx](src/components/feed/Feed.tsx)
- RPCs: `get_posts_feed`, `get_friends_feed`, `toggle_post_like`, etc.

### TRIPS
- Trips flow: [src/pages/TripsPage.tsx](src/pages/TripsPage.tsx), [src/pages/TripDetailPage.tsx](src/pages/TripDetailPage.tsx)
- RPCs: `list_trips`, `get_trip`, `join_trip_with_group`, `invite_to_trip`, `respond_trip_invite`

### NOTIFICATIONS
- Notifications page: [src/pages/NotificationsPage.tsx](src/pages/NotificationsPage.tsx)
- Hook: [src/hooks/useNotifications.ts](src/hooks/useNotifications.ts)

### ADMIN
- Admin dashboard: [src/pages/AdminDashboard.tsx](src/pages/AdminDashboard.tsx)
- Protected admin router: [src/App.tsx](src/App.tsx)

## AUDIT FINDINGS

### Confirmed real issue
- The friendships table does not contain a `status` column.
- The RPCs for friends feed and trip-invite friend list still used `fr.status = 'accepted'`.
- This created a broken backend contract between the social schema and the RPC layer.

### Additional observations
- The repository is product-rich and mostly coherent.
- Most flows are implemented in app code and database.
- The main remaining risk is not absence of features but wrong integration of social graph behavior at the backend layer.
- Notifications and deep links exist, but the social graph remains the most sensitive chain because it affects discovery, friend visibility and feed access.

## PRIORITY RANKING

| Prioridade | Problema | Módulo | Impacto | Severidade | Evidência |
|---|---|---|---:|---:|---|
| 1 | RPC de feed de amigos e lista de amigos convidáveis usa `friendships.status` inexistente | Social graph / DB | Alto | High | [supabase/migrations/20260913000000_security_search_path_hardening.sql](supabase/migrations/20260913000000_security_search_path_hardening.sql) |
| 2 | Fluxo de convite de trip depende de UI menos explícita para aceitação/declínio | Trips + Notifications | Médio | Medium | [src/pages/TripDetailPage.tsx](src/pages/TripDetailPage.tsx) |
| 3 | Notificações ainda dependem de CTA implícita e deep-link contextual | Notifications | Médio | Medium | [src/pages/NotificationsPage.tsx](src/pages/NotificationsPage.tsx) |

## PRIMARY GARGALO

O problema principal foi a inconsistência no schema social com a camada RPC. O feed de amigos e a lista de amigos convidáveis não deveriam consultar uma coluna inexistente; a relação de amizade é representada por linhas em `friendships`, não por um campo `status`.

## ROOT CAUSE

O root cause foi a persistência de um padrão errado em funções SQL do feed e do trip invite. O código usava:

```sql
WHERE fr.status = 'accepted'
```

mas a tabela real não contém esse campo. A correlação correta é baseada em `user_id` e `friend_id`.

## IMPLEMENTATION

### Arquivos alterados
- [supabase/migrations/20260913010000_fix_friendship_feed_rpcs.sql](supabase/migrations/20260913010000_fix_friendship_feed_rpcs.sql)

A correção foi aplicada na camada de banco/RPC, preservando o restante da arquitetura.

## DATABASE

- Tabela real: `friendships`
- Estrutura: `id`, `user_id`, `friend_id`, `created_at`
- Correção: remover dependência de `status` em funções SQL e usar a relação real entre usuários

## SECURITY

- Nenhuma vulnerabilidade crítica foi descoberta além da inconsistência de contrato do schema social.
- A correção não abriu permissões novas e manteve a abordagem atual de RLS/RPC.

## REALTIME

- O realtime não foi o problema principal nesta fase.
- O problema foi backend/social contract, que impacta a renderização correta dos dados que o realtime envia.

## ERROR HANDLING

- Alguns fluxos silenciam erros em `catch { /* silent */ }`, o que não é ideal para produção.
- Isso é relevante, mas não é o principal gargalo atual.

## MOBILE

- Sem bloqueio crítico de mobile identificado nesta fase.

## ACCESSIBILITY

- Sem bloqueio crítico de a11y identificado nesta fase.

## PERFORMANCE

- O impacto principal aqui não foi de performance, mas de integração de dados e consistência de feed.
- O problema tratava a lógica do produto como se o schema estivesse correto quando ele não estava.

## QA

Executado com sucesso:

```bash
npx tsc --noEmit
npm run build
```

Resultados: OK.

## REMAINING ISSUES

### MEDIUM
- convite de trip ainda exige que o usuário descubra o fluxo de aceite pela página da trip, em vez de uma resposta mais direta na notificação
- alguns erros ainda são silenciados pela UI e não mostram feedback claro

### LOW
- alguns módulos continuam mais robustos em backend do que em UX imediata

## NEXT RECOMMENDATIONS

1. Melhorar a UX de aceite/recusa de convite de trip diretamente a partir da notificação
2. Garantir feedback explícito em ações de amizade e convite sem “catch silencioso”
3. Validar social graph real em ambiente de staging com usuários reais, incluindo feed de amigos, conversas e trip invites
