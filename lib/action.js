const { restoreBranch } = require('./github')

async function run(core) {
    const token = core.getInput('github_token', {required: true})
    const ref = core.getInput('ref', {required: true})
    const sha = core.getInput('sha', {required: true})
    const get_back = core.getInput('get_back', {required: true}) === 'true'

    console.log(`<${ref}>`)
    console.log(`<${sha}>`)
    console.log(`<${get_back}>`)

    try {
        restoreBranch(token)
    } catch (error) {
        core.setFailed(error.message)
    }
}

module.exports = {
    run
}
