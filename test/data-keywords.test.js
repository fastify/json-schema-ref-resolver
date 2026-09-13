'use strict'

const assert = require('node:assert/strict')
const { test } = require('node:test')
const { RefResolver } = require('../index.js')

// a $ref inside default, const, enum or examples is a property of the instance, not a reference,
// and was collected as one: the dependencies could not be resolved and the deref walked into data
test('does not read a $ref inside a data keyword as a reference', () => {
  const refResolver = new RefResolver()
  const schema = {
    $id: 'schemaId',
    type: 'object',
    properties: {
      a: { type: 'object', default: { $ref: 'nowhere#/x', $id: 'nowhere' } },
      b: { const: { $ref: 'nowhere' } },
      c: { enum: [{ $ref: 'nowhere' }] },
      d: { type: 'string', examples: [{ $ref: 'nowhere' }] }
    }
  }
  refResolver.addSchema(schema)

  assert.deepStrictEqual(refResolver.getSchemaRefs('schemaId'), [])
  assert.deepStrictEqual(refResolver.getSchemaDependencies('schemaId'), {})
  assert.deepStrictEqual(refResolver.getDerefSchema('schemaId'), schema)
  assert.equal(refResolver.hasSchema('nowhere'), false)
})
