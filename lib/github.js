const github = require('@actions/github')

const PER_PAGE_LIMIT = 50

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
        ref: `heads/${branch}`
    })
}

// TODO: Remove
function isNotLimit(num, limit) {
    if (limit === 0) {
        return true
    }

    return num <= limit
}

async function isBranchRemoved(octokit, branch) {
    let page = 1
    while (true) { /*eslint no-constant-condition: off*/
        const { data: branches } = await octokit.rest.repos.listBranches({
            owner: github.context.payload.repository.owner.login,
            repo: github.context.payload.repository.name,
            per_page: PER_PAGE_LIMIT,
            page: page
        })

        if (!branches.length) {
            throw new Error(`The branch "${branch}" is missing in Github. ${page} pages viewed.`)
        }

        for (const item of branches) {
            if (item.name === branch) {
                return false
            }
        }

        if (branches.length !== PER_PAGE_LIMIT) {
            return true
        }

        page++
    }
}

module.exports = {
    isNotLimit,
    isBranchRemoved,
    restoreBranch,
    removeBranch
}
