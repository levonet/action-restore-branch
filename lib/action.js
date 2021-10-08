const { restoreBranch, removeBranch } = require('./github')

function isPost(core) {
    const branch = core.getInput('branch', {required: true})
    return !!core.getState(getStateKey(branch) + '-isPost')
}

function setPost(core) {
    const branch = core.getInput('branch', {required: true})
    return core.saveState(getStateKey(branch) + '-isPost', true)
}

async function run(core) {
    const token = core.getInput('github_token', {required: true})
    const branch = core.getInput('branch', {required: true})
    const sha = core.getInput('sha', {required: true})

    core.info(`Check branch: ${branch} with sha ${sha}.`)

    try {
        const restore = await restoreBranch(token, branch, sha)
        core.saveState(getStateKey(branch), restore)
        if (restore) {
            core.info(`🧟‍♂️ ${branch} rose from the dead.`)
        }
    } catch (error) {
        core.setFailed(error.message)
    }
}

async function cleanup(core) {
    const token = core.getInput('github_token', {required: true})
    const branch = core.getInput('branch', {required: true})

    const get_back = core.getBooleanInput('get_back', {required: true})
    if (!get_back) {
        return
    }

    const restore = core.getState(getStateKey(branch)) === 'true'
console.log(restore, core.getState(getStateKey(branch))
    if (!restore) {
        return
    }

    try {
        await removeBranch(token, branch)
    } catch (error) {
        core.setFailed(error.message)
    }

    core.info(`💀 ${branch} rest in peace.`)
}

function getStateKey(branch) {
    return `restore-branch-${branch.replace(/\W/g, '_')}`
}

module.exports = {
    run,
    cleanup,
    isPost,
    setPost
}
