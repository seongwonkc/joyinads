# The Power of Joy in Marketing & Advertising

Hugo blog deployed via GitHub Pages.

## Adding a new post

1. Copy `content/posts/sample-post.md`
2. Rename it (e.g. `nike-just-do-it.md`)
3. Fill in the frontmatter (title, date, description, tags)
4. Write your article below the `---`
5. `git add . && git commit -m "new post" && git push`

Done. GitHub Actions builds and deploys automatically.

## Local preview

```bash
hugo server -D
```

Then open http://localhost:1313/joyinads/

## First-time setup note

GitHub Pages must be enabled once manually:
Repo → Settings → Pages → Source → GitHub Actions
