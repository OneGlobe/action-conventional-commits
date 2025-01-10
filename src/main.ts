const { context } = require("@actions/github");
const core = require("@actions/core");

import isValidCommitMessage from "./isValidCommitMesage";
import extractCommits from "./extractCommits";

export async function run() {
  try {
    const allowMergeCommits = core.getBooleanInput("allow-merge-commits");
    const allowReapplyCommits = core.getBooleanInput("allow-reapply-commits");
    const allowRevertCommits = core.getBooleanInput("allow-revert-commits");
    const allowedCommitTypes = core.getInput("allowed-commit-types").split(",");
    const includeCommits = core.getBooleanInput("include-commits");
    const includePullRequestTitle = core.getBooleanInput("include-pull-request-title");

    if (includePullRequestTitle) {
      core.info("🔎 Analyzing pull request title:");
      const pullRequestTitle = context.payload.pull_request.title;
      if (
        isValidCommitMessage(
          pullRequestTitle,
          allowedCommitTypes,
          allowMergeCommits,
          allowRevertCommits,
          allowReapplyCommits
        )
      ) {
        core.info(`✅ ${pullRequestTitle}`);
      } else {
        core.setFailed(
          `❌ ${pullRequestTitle} cannot be parsed as a valid conventional commit message.`
        );
      }
    }

    if (includeCommits) {
      const extractedCommits = await extractCommits(context, core);
      core.info(`🔎 Analyzing ${extractedCommits.length} commits:`);
      for (let i = 0; i < extractedCommits.length; i++) {
        let commit = extractedCommits[i];
        if (
          isValidCommitMessage(
            commit.message,
            allowedCommitTypes,
            allowMergeCommits,
            allowRevertCommits,
            allowReapplyCommits
          )
        ) {
          core.info(`✅ ${commit.message}`);
        } else {
          core.setFailed(
            `❌ ${commit.message} cannot be parsed as a valid conventional commit message.`
          );
        }
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
