# FASE 16 — Correção do contrato de trips

## Status
PASS COM CORREÇÃO

## Problema encontrado
Havia um drift real entre o contrato do frontend e o contrato final do banco:

- o frontend e a UI de criação/edição de trip exigiam `visibility`
- a função `create_trip` final redefinida em `20260913000000_security_search_path_hardening.sql` não recebia `p_visibility`
- `list_trips` e `get_trip` também não expunham `visibility`
- a camada de serviço ainda chamava `join_trip_with_group` e `leave_trip_with_group`, enquanto o contrato esperado no banco era `join_trip` e `leave_trip`

## Correção aplicada
Foi criada a migração `supabase/migrations/20260913020000_fix_trip_contract_alignment.sql` para reinstaurar um contrato consistente com a experiência real do produto:

- `create_trip` aceita `p_visibility` e salva `visibility`
- `update_trip` também aceita `p_visibility`
- `list_trips` e `get_trip` retornam `visibility`
- `join_trip` e `leave_trip` permanecem como contratos canonicos
- a camada de serviço foi ajustada para chamar os nomes canonicos e manter a estrutura de tipos alinhada

## Arquivos alterados
- `src/services/trips.ts`
- `src/services/supabase.ts`
- `supabase/migrations/20260913020000_fix_trip_contract_alignment.sql`

## Validação
A validação executada foi a compilação do projeto:

- comando: `npm run build`
- resultado: sucesso, com saída final `✓ built in 1.96s`

## Observação final
A correção do drift do contrato foi validada no nível de build e compilação. O runtime real do Supabase ainda precisa ser testado em um ambiente autenticado do navegador para confirmar o fluxo end-to-end completo, mas o problema real detectado foi corrigido no código e no contrato do banco.
