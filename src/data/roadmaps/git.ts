import { SkillRoadmap } from './types';

export const gitRoadmap: SkillRoadmap = {
    skillId: 'git',
    skillName: 'Git & GitHub Version Control',
    category: 'FOUNDATIONS',
    tagline: 'Interactive rebasing, reflog disaster recovery, worktrees, bisect debugging, and CI/CD automation.',
    accentColor: '#f97316',
    officialDocs: [
        {
            title: 'Pro Git Official Book (Free by Scott Chacon)',
            url: 'https://git-scm.com/book/en/v2',
            description: 'The canonical, definitive book covering Git internals, branching mechanics, and team collaboration workflows.',
            badge: 'Official Book'
        },
        {
            title: 'Learn Git Branching (Interactive Sandbox)',
            url: 'https://learngitbranching.js.org/',
            description: 'Interactive visual simulator for practicing rebasing, cherry-picking, and branch manipulation in real-time.',
            badge: 'Interactive Sandbox'
        },
        {
            title: 'GitHub Documentation: Pull Requests & Actions',
            url: 'https://docs.github.com/en/get-started',
            description: 'Authoritative guide for GitHub branching, code review workflows, protected branches, and automation.',
            badge: 'GitHub Canonical Docs'
        }
    ],
    checkpoints: [
        {
            id: 'git-1',
            title: 'Interactive Rebase (git rebase -i) & History Hygiene',
            estMinutes: 5,
            concept: {
                summary: 'During feature development, developers create noisy commits ("wip", "fix typo", "test 2"). Interactive rebasing (`git rebase -i HEAD~N`) allows developers to rewrite, reorder, squash, and reword commits into clean, semantic atomic units before opening a Pull Request.',
                analogy: 'Polishing a book manuscript: author draft scribbles and scrap notes are combined and edited into polished, cohesive chapters before publishing to readers.',
                seniorInsight: 'Never rebase public, shared branches (like main or staging) that other developers have pulled. Rebasing rewrites SHA-1 hashes, creating divergent history that causes merge nightmares.'
            },
            trap: {
                title: 'Merging 15 noisy WIP commits directly into main with messages like "fix", "asdf"',
                juniorCode: `// ❌ JUNIOR: Pollutes team history with noisy, uninformative micro-commits
commit 9a41b2: fix typo
commit 8b12c4: test fix
commit 7c01d9: oops forgot file
commit 6d99a1: wip
commit 5e44f8: start feature`,
                seniorCode: `// ✅ SENIOR: Squash and reword into a clean, semantic atomic commit
# Run interactive rebase over the last 5 commits:
git rebase -i HEAD~5

# In the rebase editor:
pick 5e44f8 feat(auth): implement JWT token rotation
squash 6d99a1 wip
fixup 7c01d9 oops forgot file
fixup 8b12c4 test fix
fixup 9a41b2 fix typo

# Results in 1 clean semantic commit with full testable changes!`,
                explanation: 'Using squash and fixup combines experimental commits into a single logical feature unit, preserving a readable git log that makes future code archaeology fast.'
            },
            drill: {
                question: 'What is the exact difference between "squash" (s) and "fixup" (f) in an interactive rebase todo list?',
                hint: 'How do they treat the commit message of the squashed commit?',
                solution: `Both combine the commit into the previous commit.
- "squash" prompts you to edit and combine the commit message with the previous commit message.
- "fixup" completely discards the commit message, keeping only the previous commit message.`,
                explanation: 'fixup is ideal for quick typo fixes and lint adjustments where keeping the commit message is redundant.'
            },
            docLink: {
                title: 'Git Documentation: git-rebase',
                url: 'https://git-scm.com/docs/git-rebase',
                description: 'Reapplying commits on top of another base tip with interactive options.'
            }
        },
        {
            id: 'git-2',
            title: 'The Three Trees: Working Directory, Staging Area & Repository',
            estMinutes: 5,
            concept: {
                summary: 'Git manages code across three distinct structural trees: 1) Working Directory (your local files on disk), 2) Staging Area / Index (`git add`, the preview manifest of your next commit), and 3) Repository / Commit Graph (the permanent cryptographic history of commits referenced by HEAD).',
                analogy: 'Preparing a delivery shipment: the working directory is the factory floor; the staging area is packing items into the cardboard box; the commit is sealing the box and slapping the tracking barcode on it.',
                seniorInsight: 'Use `git add -p` (patch mode) to interactively review and stage specific hunks of code. This ensures unrelated experimental edits are never accidentally bundled into production commits.'
            },
            trap: {
                title: 'Blindly running "git add ." and committing debug logs, secrets, or temporary files',
                juniorCode: `// ❌ JUNIOR: Stages all changes blindly, committing console.logs and local .env files
git add .
git commit -m "update code"`,
                seniorCode: `// ✅ SENIOR: Patch staging and verified status inspection
# 1. Review and selectively stage code hunks line-by-line:
git add -p src/auth/jwt.ts

# 2. Inspect exact differences in staged index vs last commit:
git diff --staged

# 3. Commit with semantic convention:
git commit -m "feat(auth): add refresh token validation"`,
                explanation: 'Staging with git add -p allows engineers to craft atomic commits with precision, catching stray console.log statements before they enter the repository.'
            },
            drill: {
                question: 'What command removes a file from the Staging Area without deleting your changes from the Working Directory?',
                hint: 'Think about restoring or resetting the staged state.',
                solution: `Run "git restore --staged <file>" (or "git reset HEAD <file>" in older Git versions).
This un-stages the file from the index while keeping your local code changes completely intact on disk.`,
                explanation: 'git restore --staged targets only the index tree, leaving the working tree unmodified.'
            },
            docLink: {
                title: 'Pro Git: The Three Trees',
                url: 'https://git-scm.com/book/en/v2/Git-Tools-Reset-Demystified',
                description: 'Deep architectural dive into the Working Directory, Index, and HEAD.'
            }
        },
        {
            id: 'git-3',
            title: 'Git Reflog & Disaster Recovery (Detached HEAD & Lost Commits)',
            estMinutes: 5,
            concept: {
                summary: 'Every time HEAD moves in your local repository (via commit, checkout, rebase, reset, or pull), Git records the previous pointer in the Reference Log (`git reflog`). Because Git retains unreachable commits for up to 30 days before garbage collection (`git gc`), almost nothing in Git is truly lost.',
                analogy: 'A security camera recording every step you take in a building: even if you drop a key down a dark hallway and forget where you were, reviewing the security tape shows the exact minute and location.',
                seniorInsight: 'If you accidentally run `git reset --hard HEAD~1` and delete unpushed work, do not panic. Run `git reflog`, identify the commit SHA right before the reset (e.g. `HEAD@{1}`), and run `git reset --hard HEAD@{1}` to restore everything instantly.'
            },
            trap: {
                title: 'Believing code is permanently lost after a catastrophic git reset --hard',
                juniorCode: `// ❌ JUNIOR: Accidentally runs hard reset and assumes hours of work are gone forever
git reset --hard origin/main
// "I lost all my unpushed commits! I have to rewrite everything from scratch!"`,
                seniorCode: `// ✅ SENIOR: Uses reflog to pinpoint the lost commit hash and restore the branch
# 1. Inspect recent HEAD pointer movements:
git reflog
# Output:
# 3b2a1f0 HEAD@{0}: reset: moving to origin/main
# 8f9c1e2 HEAD@{1}: commit: feat(billing): complete Stripe webhook handler

# 2. Instantly resurrect the branch at that exact commit:
git reset --hard HEAD@{1}
# OR create a new branch from it:
git branch recovered-feature 8f9c1e2`,
                explanation: 'Git reflog tracks pointer history locally. As long as a commit was created at least once, its snapshot remains recoverable via reflog.'
            },
            drill: {
                question: 'What does a "Detached HEAD" state mean in Git, and what happens to new commits made while in this state if you checkout another branch without naming it?',
                hint: 'Where is HEAD pointing when detached: a branch pointer or a raw commit hash?',
                solution: `Detached HEAD means HEAD is pointing directly to a specific commit SHA rather than to a named branch reference.
If you make commits in detached HEAD and switch to another branch (git checkout main), those new commits become "orphaned" (unreachable by any branch). They will eventually be deleted by git gc unless you create a branch pointing to them (git branch <name>).`,
                explanation: 'Creating a branch before leaving detached HEAD saves the commits from garbage collection.'
            },
            docLink: {
                title: 'Git Documentation: git-reflog',
                url: 'https://git-scm.com/docs/git-reflog',
                description: 'Managing reference logs and recovering orphaned commits.'
            }
        },
        {
            id: 'git-4',
            title: 'Resolving Merge Conflicts & 3-Way Merge Strategies',
            estMinutes: 5,
            concept: {
                summary: 'Merge conflicts occur when two branches alter the exact same line of code or one branch deletes a file that another modified. Git performs a 3-Way Merge comparing: 1) The Common Ancestor (Base), 2) Your Current Branch (Ours/HEAD), and 3) The Incoming Branch (Theirs/MERGE_HEAD). Configuring `diff3` or `zdiff3` reveals the ancestor version directly in conflict markers.',
                analogy: 'Two editors editing the same paragraph of a book: looking only at the two conflicting versions is confusing, but looking at the original unedited paragraph (Common Ancestor) makes the intention of both edits instantly obvious.',
                seniorInsight: 'Enable `git config --global merge.conflictstyle zdiff3`. This shows the common ancestor code block between `||||||| base` markers, making complex conflicts 10x faster to understand.'
            },
            trap: {
                title: 'Guessing conflict resolutions without seeing what the common ancestor code originally was',
                juniorCode: `// ❌ JUNIOR: Standard 2-way conflict markers provide zero context on original code
<<<<<<< HEAD
const timeout = 5000;
=======
const timeout = 10000;
>>>>>>> feature-network`,
                seniorCode: `// ✅ SENIOR: Enable zdiff3 to display original common ancestor context
# Terminal configuration:
git config --global merge.conflictstyle zdiff3

# Now conflict markers show:
<<<<<<< HEAD
const timeout = 5000;
||||||| 4f9b1c2 (common ancestor)
const timeout = 3000;
=======
const timeout = 10000;
>>>>>>> feature-network

# Analysis is instant: Base was 3000. HEAD updated to 5000; feature-network updated to 10000.
# Resolution: Choose 10000 or negotiate based on context!`,
                explanation: 'zdiff3 exposes what the code looked like before either developer touched it, transforming conflict resolution from guesswork into clear intent comparison.'
            },
            drill: {
                question: 'During an in-progress merge conflict, what command aborts the merge and restores your branch to its exact pre-merge state?',
                hint: 'What flag accompanies git merge to cancel the operation?',
                solution: `Run "git merge --abort".
Git immediately terminates the merge process, cleans up conflict markers, and restores your working directory and HEAD to the state before git merge was invoked.`,
                explanation: 'git merge --abort safely rolls back conflict resolution attempts without data loss.'
            },
            docLink: {
                title: 'Git Documentation: Advanced Merging',
                url: 'https://git-scm.com/book/en/v2/Git-Tools-Advanced-Merging',
                description: 'Mastering 3-way merges, conflict styles, and rerere (reuse recorded resolution).'
            }
        },
        {
            id: 'git-5',
            title: 'Automated Regression Hunting with git bisect',
            estMinutes: 5,
            concept: {
                summary: 'When a regression bug is discovered in production, finding which of the last 500 commits introduced it manually takes hours. `git bisect` uses a binary search algorithm through commit history. By marking a known `bad` commit and an older `good` commit, Git checks out the midpoint commit, narrowing down 1,000 commits to the exact offending commit in just 10 steps.',
                analogy: 'Searching for a word in a dictionary: rather than reading every page sequentially from page 1, you open to the exact middle, check if your word is earlier or later, and repeat until you pinpoint the page.',
                seniorInsight: 'Automate bisect with a test script using `git bisect run ./test-script.sh`. Git will automatically execute your test suite on each commit, locate the regression, and print the commit author and diff in seconds.'
            },
            trap: {
                title: 'Manually checking out 50 random commits one-by-one to locate a regression bug',
                juniorCode: `// ❌ JUNIOR: Manual guess-and-check through git log
git checkout HEAD~10
npm test # fails
git checkout HEAD~40
npm test # passes
git checkout HEAD~25 # Lost track of which commits have been tested!`,
                seniorCode: `// ✅ SENIOR: Automated binary search with git bisect run
# 1. Start bisect session:
git bisect start

# 2. Current HEAD has the bug:
git bisect bad

# 3. Commit v1.4.0 was verified working:
git bisect good v1.4.0

# 4. Let Git run automated test script on each bisect step:
git bisect run npm run test:e2e

# Output:
# 8f9b1c2a is the first bad commit
# Author: Alex <alex@company.com>
# Date:   Wed Oct 12 14:20:10 2026
# Commit: fix(cache): remove redis fallback key

# 5. Reset back to original branch:
git bisect reset`,
                explanation: 'git bisect uses logarithmic O(log N) search. 1,024 commits take a maximum of 10 checks to locate the exact defect.'
            },
            drill: {
                question: 'If you are bisecting 256 commits, what is the maximum number of test checks git bisect will perform to find the breaking commit?',
                hint: 'What is log2(256)?',
                solution: `A maximum of 8 checks (log2(256) = 8).
Binary search cuts the remaining commit range in half with each iteration: 256 -> 128 -> 64 -> 32 -> 16 -> 8 -> 4 -> 2 -> 1.`,
                explanation: 'Binary search efficiency guarantees rapid root-cause isolation even in large monorepos.'
            },
            docLink: {
                title: 'Git Documentation: git-bisect',
                url: 'https://git-scm.com/docs/git-bisect',
                description: 'Using binary search to find the commit that introduced a bug.'
            }
        },
        {
            id: 'git-6',
            title: 'Git Worktrees for Multi-Branch Parallel Development',
            estMinutes: 5,
            concept: {
                summary: 'When working on a complex feature branch and an urgent production hotfix arrives, running `git stash` and switching branches disrupts your local dev servers, uncommitted work, and build caches. `git worktree` allows you to check out multiple branches of the same repository into separate folders simultaneously, sharing the exact same `.git` database.',
                analogy: 'Having two separate computer monitors displaying two different desks in the same office, rather than clearing off your entire physical desk every time an urgent phone call arrives.',
                seniorInsight: 'Use `git worktree add ../hotfix-login hotfix/login` to fix and deploy an emergency patch in an isolated directory while your primary feature branch continues compiling and running unaffected.'
            },
            trap: {
                title: 'Stashing uncommitted work and switching branches, breaking local node_modules & dev servers',
                juniorCode: `// ❌ JUNIOR: Stashing causes lost context and forces full re-builds
git stash
git checkout main
npm install # node_modules changed, dev server crashed!
git checkout -b hotfix/payment
# Now you have to remember what was stashed: git stash pop (conflict!)`,
                seniorCode: `// ✅ SENIOR: Add a dedicated worktree in a separate directory; zero disruption!
# 1. Spawn a separate working directory for the hotfix:
git worktree add ../portfolio-hotfix -b hotfix/payment origin/main

# 2. Change into hotfix folder, fix bug, commit, push PR:
cd ../portfolio-hotfix
git commit -am "fix(payment): patch stripe webhook validation"
git push origin hotfix/payment

# 3. Return to primary workspace immediately without ever touching stashes:
cd ../portfolio-2.0

# 4. Remove worktree when done:
git worktree remove ../portfolio-hotfix`,
                explanation: 'Worktrees share the same local object database without duplicate repository clones, enabling instant context switching across branches.'
            },
            drill: {
                question: 'Can two different git worktrees have the exact same branch checked out at the same time?',
                hint: 'What happens to branch HEAD pointers if two working directories mutate the same ref?',
                solution: `No. Git strictly forbids checking out the same branch in multiple active worktrees simultaneously.
Allowing two worktrees on the same branch would create conflicting HEAD pointer mutations. You must check out a different branch or create a new branch pointer.`,
                explanation: 'This constraint prevents accidental race conditions on local branch refs.'
            },
            docLink: {
                title: 'Git Documentation: git-worktree',
                url: 'https://git-scm.com/docs/git-worktree',
                description: 'Managing multiple working trees attached to the same repository.'
            }
        },
        {
            id: 'git-7',
            title: 'Cherry-Picking & Backporting (git cherry-pick -x)',
            estMinutes: 5,
            concept: {
                summary: '`git cherry-pick <commit-hash>` applies the changes from an existing commit on one branch directly onto your current branch as a brand new commit. It is primarily used for backporting bug fixes into stable release branches (e.g. cherry-picking a security patch from `main` into `v2.4-stable`).',
                analogy: 'Selecting one specific song from an album to add to your personal road trip playlist, rather than copying over the entire 14-track album.',
                seniorInsight: 'Always append the `-x` flag when cherry-picking (`git cherry-pick -x <hash>`). This automatically appends a metadata line: `(cherry picked from commit <hash>)` to the commit message, preserving provenance and audit trails.'
            },
            trap: {
                title: 'Manually copy-pasting code diffs between branches to port a bug fix',
                juniorCode: `// ❌ JUNIOR: Manually copy-pasting changes introduces human error and loses authorship
# Developer manually edits 4 files on release branch to match main
git commit -m "copy fix from main"`,
                seniorCode: `// ✅ SENIOR: Automated cherry-pick with provenance metadata (-x)
# 1. Switch to the release branch:
git checkout release/v2.1

# 2. Apply the exact security fix commit from main with traceability:
git cherry-pick -x 4f8b2a1

# Commit log on release/v2.1 now reads:
# fix(auth): sanitize session cookies against XSS
# (cherry picked from commit 4f8b2a19e8b7c6d5e4f3a2b1)`,
                explanation: 'Cherry-pick -x ensures cryptographic traceability, making it immediately clear which upstream commit was ported and who the original author was.'
            },
            drill: {
                question: 'What happens if a cherry-picked commit encounters a conflict with your current branch?',
                hint: 'Does Git abort immediately, or does it pause like an interactive rebase?',
                solution: `Git pauses the cherry-pick and inserts standard conflict markers into the conflicting files.
You resolve the conflicts, run "git add <files>", and continue with "git cherry-pick --continue".
Alternatively, you can abort the operation cleanly with "git cherry-pick --abort".`,
                explanation: 'Cherry-pick follows the same interactive conflict resolution flow as rebase.'
            },
            docLink: {
                title: 'Git Documentation: git-cherry-pick',
                url: 'https://git-scm.com/docs/git-cherry-pick',
                description: 'Applying changes introduced by existing commits to current HEAD.'
            }
        },
        {
            id: 'git-8',
            title: 'Branching Models: GitHub Flow vs Trunk-Based Development',
            estMinutes: 5,
            concept: {
                summary: 'Branching strategies dictate how teams collaborate and deploy software. GitHub Flow uses short-lived feature branches merged into `main` via reviewed Pull Requests. Trunk-Based Development requires developers to merge small, frequent commits directly into `main` (trunk) multiple times a day, relying on Feature Flags to decouple code deployment from feature release.',
                analogy: 'GitHub Flow is individual train tracks merging at a switchyard with full safety checks; Trunk-Based Development is a continuous bullet train where all passengers board the same express line continuously.',
                seniorInsight: 'Avoid long-lived branches (branches living longer than 48 hours). The probability of painful merge conflicts increases exponentially with every day a branch diverges from `main`.'
            },
            trap: {
                title: 'Maintaining long-lived feature branches for months, leading to integration hell',
                juniorCode: `// ❌ JUNIOR: Feature branch created 3 months ago with 300 commits
# Trying to merge back into main:
git merge main
# Result: 85 merge conflicts across 120 files! Takes 3 days to fix and breaks production.`,
                seniorCode: `// ✅ SENIOR: Trunk-based development with Feature Flags
// 1. Code is merged to main daily behind a feature flag:
if (featureFlags.isEnabled('NEW_CHECKOUT_FLOW', user)) {
    return <NewCheckoutFlow />;
}
return <LegacyCheckoutFlow />;

// 2. Main is always deployable to production; feature is toggled remotely in LaunchDarkly/PostHog.`,
                explanation: 'Feature flags decouple deployment from release, allowing continuous trunk-based integration without exposing unfinished features to end users.'
            },
            drill: {
                question: 'Why has Trunk-Based Development become the gold standard in high-velocity DevOps teams over classic GitFlow?',
                hint: 'Consider release cycle speed and merge conflict overhead.',
                solution: `Classic GitFlow involves multiple long-lived branches (develop, release, hotfix, master) that cause massive merge conflict bottlenecks and delay deployments.
Trunk-Based Development eliminates branch drift, reduces merge conflicts to near zero, and enables continuous automated deployment (CI/CD) multiple times per day.`,
                explanation: 'Continuous integration requires integrating code into trunk continuously, not once every two weeks.'
            },
            docLink: {
                title: 'Trunk Based Development Guide',
                url: 'https://trunkbaseddevelopment.com/',
                description: 'The definitive architectural guide to high-velocity trunk-based workflows.'
            }
        },
        {
            id: 'git-9',
            title: 'Git Hooks & Automated Code Quality (Husky & lint-staged)',
            estMinutes: 5,
            concept: {
                summary: 'Git hooks are event-driven scripts that run automatically during Git lifecycle events (`pre-commit`, `commit-msg`, `pre-push`). Modern teams use `husky` and `lint-staged` to run linters, formatters (Prettier), and TypeScript checks only on the files currently staged for commit, preventing broken code from ever reaching GitHub.',
                analogy: 'A quality-assurance gate on an automotive factory line: before a car chassis moves to the next station, automated lasers verify that all bolts are torqued to specification.',
                seniorInsight: 'Only run linters and formatters on staged files using `lint-staged`. Running tests or linters over the entire repository on every commit slows down developer workflow, tempting engineers to bypass hooks with `--no-verify`.'
            },
            trap: {
                title: 'Running full project test suites on every pre-commit hook, causing 2-minute commit delays',
                juniorCode: `// ❌ JUNIOR: Full repo test on every local commit; devs end up using --no-verify!
// .husky/pre-commit
npm test # Takes 120 seconds!
# Developers get frustrated and run: git commit -m "wip" --no-verify`,
                seniorCode: `// ✅ SENIOR: Fast sub-second pre-commit check on staged files only
// package.json
{
    "lint-staged": {
        "*.{ts,tsx}": [
            "eslint --fix",
            "prettier --write"
        ]
    }
}

// .husky/pre-commit
npx lint-staged

// Runs in 300ms, auto-formats staged files, and keeps CI green!`,
                explanation: 'lint-staged targets only files touched in the current commit, delivering instantaneous developer feedback without annoying delays.'
            },
            drill: {
                question: 'Which Git hook is used to enforce conventional commit messages (e.g. feat:, fix:, chore:) before a commit is created?',
                hint: 'Look for the hook that inspects the commit message file.',
                solution: `The "commit-msg" hook.
Husky pairs the commit-msg hook with tools like "@commitlint/cli" to validate that commit messages follow Conventional Commits (e.g. "feat(auth): add google oauth") before finalizing the commit.`,
                explanation: 'commit-msg validates the temporary commit message file ($1).'
            },
            docLink: {
                title: 'Husky Official Documentation',
                url: 'https://typicode.github.io/husky/',
                description: 'Modern native git hooks made easy for automated linting and formatting.'
            }
        },
        {
            id: 'git-10',
            title: 'Submodules & Monorepos (git submodule vs Turborepo)',
            estMinutes: 5,
            concept: {
                summary: 'When sharing code across multiple applications, teams either use Git Submodules (embedding one Git repository inside another at a pinned commit SHA) or Monorepos (storing all applications and shared packages in a single Git repository managed by tools like Turborepo or Nx).',
                analogy: 'Submodules are like attaching an external hard drive with a sticky note specifying the folder date; a Monorepo is having all files organized in labeled drawers within the same desk cabinet.',
                seniorInsight: 'Git submodules often cause headaches because cloning a repo does not automatically clone submodules unless `--recurse-submodules` is specified. In modern web engineering, monorepos with pnpm workspaces and Turborepo are preferred for shared codebases.'
            },
            trap: {
                title: 'Updating a submodule locally and forgetting to commit the pointer change in parent repo',
                juniorCode: `// ❌ JUNIOR: Teammates pull parent repo and get broken, out-of-sync submodules
cd shared-components
git commit -am "update button"
git push
cd ..
# Forgot to commit the new SHA in parent repo! CI fails with missing components.`,
                seniorCode: `// ✅ SENIOR: Proper submodule workflow or modern Turborepo workspace
# Submodule update:
cd shared-components && git pull origin main
cd ..
git add shared-components # Stages the new commit pointer
git commit -m "chore: update shared-components submodule pointer"
git push

# Preferred Modern Alternative: Turborepo monorepo with pnpm workspaces
// apps/web/package.json
"dependencies": {
    "@acme/ui": "workspace:*" // Single atomic commit updates both app and UI package!
}`,
                explanation: 'Turborepo with pnpm workspaces eliminates submodule synchronization friction, allowing cross-package refactors in a single atomic Git commit.'
            },
            drill: {
                question: 'What flag must you pass to git clone to automatically clone and initialize all nested submodules in a repository?',
                hint: 'Think about recursively fetching child repositories.',
                solution: `Run "git clone --recurse-submodules <repository-url>".
If already cloned, run "git submodule update --init --recursive".`,
                explanation: 'Without this flag, submodule directories remain empty directories in the newly cloned working tree.'
            },
            docLink: {
                title: 'Git Documentation: Git Submodules',
                url: 'https://git-scm.com/book/en/v2/Git-Tools-Submodules',
                description: 'Managing external repositories within a parent project.'
            }
        },
        {
            id: 'git-11',
            title: 'Cryptographic Commit Signing (SSH & GPG Keys)',
            estMinutes: 5,
            concept: {
                summary: 'By default, Git allows anyone to set `git config user.name` and `user.email` to any identity (e.g. Linus Torvalds), spoofing commit authorship. Cryptographically signing commits with an SSH or GPG private key proves mathematically that the commit originated from the verified keyholder, earning the "Verified" badge on GitHub.',
                analogy: 'A wax seal embossed with a royal signet ring: anyone can write a letter claiming to be the king, but only the genuine ring leaves the tamper-evident wax seal.',
                seniorInsight: 'Modern Git (2.34+) supports signing commits directly with your existing SSH authentication key (`gpg.format = ssh`). You no longer need to manage complex GPG keyrings just to get verified commit badges.'
            },
            trap: {
                title: 'Pushing unsigned commits in enterprise environments requiring strict supply chain security',
                juniorCode: `// ❌ JUNIOR: Unsigned commits can be spoofed by any actor with push access
git commit -m "feat: release new billing handler"
// GitHub displays: Unverified (No guarantee who actually authored this code)`,
                seniorCode: `// ✅ SENIOR: Native SSH commit signing configuration
# 1. Configure Git to use SSH for signing:
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub

# 2. Enable automatic signing on every commit:
git config --global commit.gpgsign true

# 3. Add the public key to GitHub as a "Signing Key"
# Now every commit displays the green "Verified" badge on GitHub!`,
                explanation: 'SSH signing leverages standard Ed25519 keys, securing the software supply chain against author spoofing without extra cryptographic software.'
            },
            drill: {
                question: 'Why is commit signing critical for compliance in enterprise SOC 2 and supply chain security frameworks?',
                hint: 'What does commit signing prevent regarding code provenance and non-repudiation?',
                solution: `Commit signing provides non-repudiation and code provenance.
It mathematically guarantees that the code was authored by an authorized developer whose identity is verified, preventing impersonation attacks and unauthorized code injection.`,
                explanation: 'Signed commits are required by many financial and regulated compliance standards.'
            },
            docLink: {
                title: 'GitHub Docs: Signing Commits with SSH',
                url: 'https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification',
                description: 'Setting up verified commit signing using modern SSH keys.'
            }
        },
        {
            id: 'git-12',
            title: 'GitHub Actions CI/CD & Automated PR Guardrails',
            estMinutes: 5,
            concept: {
                summary: 'GitHub Actions automates continuous integration and deployment directly within the GitHub ecosystem. Workflows triggered on `pull_request` run linting, type-checking, automated test matrices across Node versions, and preview environment deployments, protecting `main` through branch protection rules.',
                analogy: 'An automated border control passport scanner: travelers cannot board the departure aircraft until automated biometric scanners verify their ticket, passport, and customs clearance.',
                seniorInsight: 'Always add `concurrency: { group: ${{ github.workflow }}-${{ github.ref }}, cancel-in-progress: true }` to your PR workflows. When a developer pushes 3 commits in rapid succession, this immediately cancels redundant outdated CI runs, saving compute minutes.'
            },
            trap: {
                title: 'Letting duplicate CI jobs run concurrently on every rapid push to a PR',
                juniorCode: `// ❌ JUNIOR: Missing concurrency group; wastes CI minutes on obsolete commit jobs
name: CI
on:
  pull_request:
    branches: [main]
# If developer pushes 4 commits in 2 minutes, all 4 runs execute simultaneously to completion!`,
                seniorCode: `// ✅ SENIOR: Automated cancellation of outdated runs with parallel matrix testing
name: CI Pipeline

on:
  pull_request:
    branches: [main]

# Auto-cancels obsolete running workflows when a new commit is pushed to the same PR:
concurrency:
  group: \${{ github.workflow }}-\${{ github.ref }}
  cancel-in-progress: true

jobs:
  validate:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [20.x, 22.x]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node-version }}
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test`,
                explanation: 'cancel-in-progress terminates stale CI jobs instantly when new code is pushed, and matrix testing verifies compatibility across multiple runtime environments.'
            },
            drill: {
                question: 'Why should you always use "npm ci" instead of "npm install" inside automated GitHub Actions workflows?',
                hint: 'How do they treat package-lock.json and existing node_modules?',
                solution: `"npm ci" (Clean Install) strictly requires an exact package-lock.json and deletes existing node_modules before installing.
Unlike "npm install", it never updates package-lock.json or installs ambiguous semver ranges, ensuring 100% reproducible, deterministic builds and running significantly faster in CI.`,
                explanation: 'npm ci guarantees that CI builds test the exact dependency tree committed in version control.'
            },
            docLink: {
                title: 'GitHub Documentation: Workflow Syntax for GitHub Actions',
                url: 'https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions',
                description: 'Configuring triggers, matrix strategies, concurrency, and secrets in GitHub Actions.'
            }
        }
    ]
};
