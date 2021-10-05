const github = require('@actions/github')

async function restoreBranch(token) {
    const octokit = github.getOctokit(token)

    const { data: events } = await octokit.rest.activity.listRepoEvents({
        owner: github.context.payload.repository.owner.login,
        repo: github.context.payload.repository.name
    })

    console.log(events)
}

module.exports = {
    restoreBranch,
}
