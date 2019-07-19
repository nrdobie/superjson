const envinfo = require('envinfo')

envinfo.run(
  {
    System: ['OS'],
    Binaries: ['Node', 'Yarn', 'npm'],
    Browsers: ['Chrome', 'Safari', 'Firefox', 'Edge'],
    npmPackages: ['isobject']
  },
  { yaml: true }
).then(console.log)
