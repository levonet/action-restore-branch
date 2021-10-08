const core = require('@actions/core')
const { run, cleanup } = require('./lib/action')

console.log(process.env)
if (!process.env['STATE_isPost']) {
    run(core)
} else {
    cleanup(core)
}
