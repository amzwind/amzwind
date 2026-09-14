import test from 'node:test'
import assert from 'node:assert/strict'

import { isMissingRpcError } from './rpcDiagnostics.ts'

const isMissingTripRpcError = isMissingRpcError

test('detecta erro de função RPC ausente em feed e trips', () => {
  assert.equal(
    isMissingRpcError({ message: 'Could not find the function public.get_friends_feed(p_limit, p_offset) in the schema cache' }),
    true,
  )

  assert.equal(
    isMissingTripRpcError({ message: 'Could not find the function public.list_trips(p_limit, p_offset) in the schema cache' }),
    true,
  )

  assert.equal(isMissingRpcError({ message: 'permission denied for table posts' }), false)
})
