import * as core from "@actions/core";
import * as github from "@actions/github";

async function run() {
    const token = core.getInput("github-token", { required: true });
    const octokit = github.getOctokit(token);

    const labelNames = await getPullRequestLabelNames(octokit);

    const labels = getInputLabels();
    const result = labels.every((label) => labelNames.includes(label));

    if (result) {
        core.warning("required labels didn't find");
    }


    core.setOutput("result", result);
    core.setOutput("labels", labelNames);
}

async function getPullRequestLabelNames(
    octokit
): Promise<string[]> {
    const owner = github.context.repo.owner;
    const repo = github.context.repo.repo;
    const pull_number = core.getInput("pull-number", { required: true });

    const { data } = await octokit.rest.pulls.get({
        owner,
        repo,
        pull_number,
    });

    return data.labels.length > 0 ? data.labels.map((label) => label.name) : [];
}

function getInputLabels(): string[] {
    const raw = core.getInput("labels", { required: true });
    const json = JSON.parse(raw);

    return Array.isArray(json) ? json : [];
}

run().catch((err) => {
    core.setFailed(err.message);
});
