const core = require('@actions/core')
const { run, cleanup } = require('./lib/action')

if (!process.env['STATE_isPost']) {
    run(core)
} else {
    cleanup(core)
}
