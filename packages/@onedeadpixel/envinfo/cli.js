#!/usr/bin/env node

const clipboardy = require('clipboardy')
const envinfo = require('envinfo')
const presets = require('./presets')

const preset = presets[process.argv[2]]

if (!preset) {
  throw new Error(`${process.argv[2]} is not a valid preset`)
}

envinfo.run(preset, { yaml: true }).then(info => {
  console.log(info)
  clipboardy.writeSync('```' + info + '```')
  console.log('Copied info to your clipboard.')
})
