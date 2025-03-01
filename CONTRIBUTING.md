## Quick start guide

* Set up a dev environment. Follow the [README](README.md). Report any problems that you face while setting up the environment.
* Explore the issues, choose one to work on, and leave a comment. Work on only one issue at a time.
* Open a Pull Request. Small change sets are preferred; the fewer lines changed per PR, the easier it is to think about, provide feedback on, and review. Make sure only changes related to the main issure are included; unrelated changes can be made in a separate PR. Include before/after screenshots or videos, if applicable. If you have many commits, consider squashing them into one or a few commits with well-written commit messages.
* If you are stuck, ask on Slack.

## Pull request process

### Before opening a PR
- Create a git branch for the issue you are working on, rather than working directly on `main`.
- Rebase your work onto the latest version from main and fix any merge conflicts.
- Check that only files relevant to the issue are being changed. There should be no unintended changes or other "git noise".
- If you have a messy git history, squash your commits to clean it up.
- If you have added any external libraries via a package manager, ensure that you have updated the proper dependency list (`package.json` etc.) and corresponding lock file.

### PR format
- Title your pull request to indicate its purpose. (This will likely be similar to the title of the issue it addresses.)
- Include a reference to the issue(s).
- Include before-and-after screenshots (or videos) for user interface changes.

### After opening a PR
- Check the continuous integration build once it completes. If any tests fail you can find details in the build log.
- If the build failed:
  - Fix whatever caused it to fail if you can.
  - Ask for help if you cannot fix it.
- If you don't get reviewer feedback within a day or two, or you're waiting for followup, ping someone.