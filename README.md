# Check PR Labels

This action check if given labels have be applied to the PR.

## Inputs

### `github-token`

**Required** The repository token, i.e. `secrets.GITHUB_TOKEN`

### `pull-number`

**Required** Pull request number, i.e. `github.event.pull_request.head.sha`

### `labels`

**Required** The array of label name, e.g. `'["tested", "partial"]'`

## Outputs

### `result`

The result if given labels have be applied to the PR

## Example Usage

```
uses: paul1k/check-pr-labels@v1.0.0
with:
  github-token: ${{ secrets.GITHUB_TOKEN }}
  pull-number: ${{ github.event.pull_request.number }}
  labels: '["tested", "partial"]'
```

### Example Workflow
e.g. [.github/workflows/main.yml](https://github.com/paul1k/check-pr-labels/blob/master/.github/workflows/main.yml)
```
on:
  pull_request:
    types:
      - opened

jobs:
  check_pr_labels_job:
    runs-on: ubuntu-latest
    name: A job to check the PR labels contain given labels
    steps:
    - name: Check PR Labels
      uses: paul1k/check-pr-labels@v1.0.0
      with:
        github-token: ${{ secrets.GITHUB_TOKEN }}
        pull-number: ${{ github.event.pull_request.number }}
        labels: '["enhancement"]'
    - name: See result
      run: echo "${{ steps.check_pr_labels.outputs.result }}"
```