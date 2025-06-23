import fs from 'node:fs'

const CWD = new URL('../', import.meta.url)

// list of all inputs/outputs, with replacements
const SOURCE_FILES = [
  {
    source: './index.js',
    types: './types/index.d.ts',
    replacements: [
      [/const\s+([^=]+)=\s*require\(([^)]+)\)/g, (_, spec, moduleName) => {
        return `import ${spec.trim().replace(/:\s*/g, ' as ')} from ${moduleName.trim()}`
      }],
      [/module\.exports\s*=\s*({[^}]+})/, 'export $1'],
    ]
  }
]

// Build script
for (const { source, types, replacements } of SOURCE_FILES) {
  // replace
  let output = fs.readFileSync(new URL(source, CWD), 'utf8')
  for (const [search, replaceValue] of replacements) {
    output = output.replace(search, replaceValue)
  }

  // verify
  if (output.includes('require(')) {
    throw new Error('Could not convert all require() statements')
  }
  if (output.includes('module.exports')) {
    throw new Error('Could not convert module.exports statement')
  }

  // write source
  fs.writeFileSync(new URL(source.replace(/\.js$/, '.mjs'), CWD), output)

  // write types
  fs.copyFileSync(new URL(types, CWD), new URL(types.replace(/\.d\.ts$/, '.d.mts'), CWD))
}
