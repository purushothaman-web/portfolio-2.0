import { SkillRoadmap } from './types';
export const gitRoadmap: SkillRoadmap = {
        skillId: 'git',
        skillName: 'Git & GitHub Workflows',
        category: 'FOUNDATIONS',
        tagline: 'Branching strategies, interactive rebasing, clean commit history, and conflict resolution.',
        accentColor: '#f97316',
        officialDocs: [
            {
                title: 'Pro Git Official Book (Free by Scott Chacon)',
                url: 'https://git-scm.com/book/en/v2',
                description: 'The canonical complete book on Git internals, branching, and team collaboration.',
                badge: 'Official Book'
            },
            {
                title: 'Learn Git Branching (Interactive Sandbox)',
                url: 'https://learngitbranching.js.org/',
                description: 'Interactive visual simulator for practicing rebasing, cherry-picking, and merges.',
                badge: 'Interactive Sandbox'
            }
        ],
        checkpoints: [
            {
                id: 'git-1',
                title: 'Interactive Rebase (git rebase -i) vs Messy Commit History',
                estMinutes: 5,
                concept: {
                    summary: 'Interactive rebasing allows you to squash noisy WIP commits ("fix typo", "test 2", "wip") into clean, descriptive atomic commits before opening a pull request.',
                    analogy: 'Editing your rough draft notes into polished book chapters before publishing the book for others to read.',
                    seniorInsight: 'Senior developers keep git history clean with interactive rebasing so that commands like `git bisect` (binary search to find bug-introducing commits) work effortlessly.'
                },
                trap: {
                    title: 'Merging 15 micro-commits with messages like "fix", "asdf" directly into main',
                    juniorCode: `// âŒ JUNIOR GIT LOG:
commit 9a: fix
commit 8b: test
commit 7c: oops another fix
commit 6d: wip`,
                    seniorCode: `// âœ… SENIOR: Squash into a single semantic commit before merging
git rebase -i HEAD~4
// Result: 1 clean commit: "feat(auth): implement JWT refresh token rotation with redis"`,
                    explanation: 'Polluting git history with trivial micro-commits makes code reviews painful and destroys the ability to revert individual features cleanly.'
                },
                drill: {
                    question: 'What command allows you to selectively take a specific commit from another branch and apply it to your current branch?',
                    hint: 'Named after picking fruit.',
                    solution: `git cherry-pick <commit-hash>`,
                    explanation: 'Cherry-picking applies the exact diff of a specific commit onto your active branch without having to merge the entire branch.'
                },
                docLink: {
                    title: 'Git Documentation: Rewriting History',
                    url: 'https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History',
                    description: 'Mastering interactive rebasing, squashing, and amending commits.'
                }
            }
        ]
};
