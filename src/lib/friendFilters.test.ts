import test from 'node:test'
import assert from 'node:assert/strict'

import { filterPeopleByQuery, sortPeopleByName } from './friendFilters.ts'

test('filterPeopleByQuery finds matching names ignoring case and spaces', () => {
  const people = [
    { id: '1', full_name: 'Ana Costa' },
    { id: '2', full_name: 'Bruno Silva' },
    { id: '3', full_name: 'Carla Maia' },
  ]

  assert.deepEqual(filterPeopleByQuery(people, '  costa  '), [{ id: '1', full_name: 'Ana Costa' }])
  assert.deepEqual(filterPeopleByQuery(people, 'bruno'), [{ id: '2', full_name: 'Bruno Silva' }])
  assert.deepEqual(filterPeopleByQuery(people, 'maia'), [{ id: '3', full_name: 'Carla Maia' }])
  assert.deepEqual(filterPeopleByQuery(people, 'nada'), [])
})

test('sortPeopleByName keeps friends in alphabetical order and ignores blank names', () => {
  const people = [
    { id: '2', full_name: 'Zoe Lima' },
    { id: '1', full_name: 'Ana Costa' },
    { id: '3', full_name: null },
    { id: '4', full_name: 'Bruno Silva' },
  ]

  assert.deepEqual(sortPeopleByName(people).map((person) => person.id), ['1', '4', '2', '3'])
})
