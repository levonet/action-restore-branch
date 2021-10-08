const core = require('@actions/core')
const { run, cleanup, isPost, setPost } = require('./lib/action')

console.log(process.env)
if (!isPost(core)) {
    setPost(core)
    run(core)
} else {
    cleanup(core)
}
