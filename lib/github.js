const github = require('@actions/github')

const PAGE_LIMIT = 100

async function restoreBranch(token, branch, sha) {
    const octokit = github.getOctokit(token)

    const restore = await isBranchRemoved(octokit, branch)
    if (!restore) {
        return false
    }

    await octokit.rest.git.createRef({
        owner: github.context.payload.repository.owner.login,
        repo: github.context.payload.repository.name,
        ref: `refs/heads/${branch}`,
        sha: sha
    })

    return true
}

async function removeBranch(token, branch) {
    const octokit = github.getOctokit(token)

    await octokit.rest.git.deleteRef({
        owner: github.context.payload.repository.owner.login,
        repo: github.context.payload.repository.name,
        ref: branch
    })
}

async function isBranchRemoved(octokit, branch) {
    let page = 0
    while (page < PAGE_LIMIT) {
        const { data: events } = await octokit.rest.activity.listRepoEvents({
            owner: github.context.payload.repository.owner.login,
            repo: github.context.payload.repository.name,
            page: page++
        })

        if (!events.length) {
            throw new Error(`The branch "${branch}" is missing from Github Events`)
        }

        for (const event of events) {
            if (event.type === 'CreateEvent' && event.payload.ref === branch) {
                return false
            }
            if (event.type === 'PushEvent' && event.payload.ref === `refs/heads/${branch}`) {
                return false
            }
            if (event.type === 'DeleteEvent' && event.payload.ref === branch) {
                return true
            }
        }
    }
}

module.exports = {
    isBranchRemoved,
    restoreBranch,
    removeBranch
}
