const core = require('@actions/core')
const { run, cleanup, isPost, setPost } = require('./lib/action')

if (!isPost(core)) {
    setPost(core)
    run(core)
} else {
    cleanup(core)
}
