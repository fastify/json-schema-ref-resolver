import { RefResolver } from '.'
import { expect } from 'tstyche'

const resolver = new RefResolver({
  allowEqualDuplicates: true
})

expect(resolver.addSchema({})).type.toBe<void>()
expect(resolver.addSchema({}, 'schemaId')).type.toBe<void>()

expect(resolver.getSchema('schemaId')).type.toBe<any>()
expect(resolver.getSchema('schemaId', 'jsonPointer')).type.toBe<any>()

expect(resolver.hasSchema('schemaId')).type.toBe<boolean>()

expect(resolver.getSchemaRefs('schemaId')).type.toBe<{ schemaId: string; jsonPointer: string }[]>()

expect(resolver.getSchemaDependencies('schemaId')).type.toBe<{ [key: string]: any }>()

expect(resolver.derefSchema('schemaId')).type.toBe<void>()

expect(resolver.getDerefSchema('schemaId')).type.toBe<any>()
expect(resolver.getDerefSchema('schemaId', 'jsonPointer')).type.toBe<any>()
