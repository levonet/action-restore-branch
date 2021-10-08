# GitHub Action: Restore Branch

If the branch has been removed, the action will restore the branch.
This Github Action is used with the workflow trigger when a pull request has been `closed`.

Temporarily restoring a branch can be useful when you are about to trigger workflow runs (`workflow_dispatch`)
after closing Pull Request.
For example, to initiate the removal of deployed infrastructure or services.

```yml
on:
  pull_request:
    types:
    - closed
jobs:
  cleaner:
    runs-on: ubuntu-latest
    steps:
    - name: Restore branch
      uses: levonet/action-restore-branch@master
      with:
        get_back: true
    # ... Do something ...
```

## Inputs

### `github_token`

Personal access token (PAT) used to fetch the repository. The PAT is configured
with the local git config, which enables your scripts to run authenticated git
commands. The post-job step removes the PAT.

Default: `${{ github.token }}`

### `branch`

Source branch of the pull request in a workflow run.

Default: `${{ github.head_ref }}`

### `sha`

The commit SHA that triggered the workflow run.

Default: `${{ github.event.pull_request.head.sha }}`

### `get_back`

Return the branch after the end of job to the state in which it was before.
That is, if the branch was removed before the start of the action,
then after the end of the job it will be removed again.

Default: `false`

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
