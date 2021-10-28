const github = require('@actions/github')

const PER_PAGE_LIMIT = 50

async function restoreBranch(token, branch, sha, eventPageLimit) {
    const octokit = github.getOctokit(token)

    const restore = await isBranchRemoved(octokit, branch, eventPageLimit)
    if (!restore) {
        return false
    }

    // await octokit.rest.git.createRef({
    //     owner: github.context.payload.repository.owner.login,
    //     repo: github.context.payload.repository.name,
    //     ref: `refs/heads/${branch}`,
    //     sha: sha
    // })

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

function isNotLimit(num, limit) {
    if (limit === 0) {
        return true
    }

    return num <= limit
}

async function isBranchRemoved(octokit, branch, pageLimit) {
    let page = 1
console.log(branch)
    while (true/*isNotLimit(page, pageLimit)*/) {
const ret = await octokit.rest.repos.listBranches({
        // const { data: events } = await octokit.rest.activity.listRepoEvents({
            owner: github.context.payload.repository.owner.login,
            repo: github.context.payload.repository.name,
            per_page: PER_PAGE_LIMIT,
            page: page
        })
const events = ret.data

console.log(ret)
console.log(page, events.length)

        if (!events.length) {
            throw new Error(`The branch "${branch}" is missing from Github Events. ${page} pages viewed.`)
        }

        // for (const event of events) {
// console.log(event.event, event.issue)
// - closed
// - merged
// - referenced
// console.log(event.type, event.payload.ref)
//             if (event.type === 'CreateEvent' && event.payload.ref === branch) {
//                 return false
//             }
//             if (event.type === 'PushEvent' && event.payload.ref === `refs/heads/${branch}`) {
//                 return false
//             }
//             if (event.type === 'DeleteEvent' && event.payload.ref === branch) {
//                 return true
//             }
        // }
        for (const item of events) {
            if (item.name === branch) {
                return false
            }
        }

        if (events.length !== PER_PAGE_LIMIT) {
            return true
            // throw new Error(`The branch "${branch}" is not found in Github. ${page} pages viewed.\nTry to increase event_page_limit.`)
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
