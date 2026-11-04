# ZAKWAN — AWS Amplify Portfolio

Personal portfolio for **Zakwan Mustafa**, hosted on **AWS Amplify Hosting**.

## Creative feature (judges: read this)

**Canary Traffic Shift** — a bottom control modeled on **AWS CodeDeploy / weighted traffic shifting**.

- Drag the slider to move traffic from **Stable** → **Canary**
- At **≥ 50% canary**, the entire UI promotes into the experimental skin (acid signal / night-ops)
- Below 50%, you stay on the production (aviation orange) skin
- **Navigation never breaks** — the feature sits beside the content, not on top of it
- Bonus: first-visit **CloudFormation-style stack deploy** theater (skippable) + local **CloudTrail** event stream of visitor actions

This is intentional DevOps storytelling: the portfolio *behaves* like a release, not a brochure.

## Core sections

1. **About Me**
2. **Skills / Tech Superpowers**
3. **Projects / Achievements** (CloudPulse, Vision AR FYP, Mad Tech Heads, SEO wins, AWS SBG, Intellijen)

## Stack

| Piece | Choice |
| --- | --- |
| Hosting | AWS Amplify Hosting |
| App | Static HTML / CSS / JS (no build toolchain required) |
| Config | `amplify.yml` |
| Repo | Push this folder to GitHub, connect Amplify |

## Local preview

From this folder in PowerShell:

```powershell
cd "C:\Users\Dell 5520\Desktop\zakwan-amplify-portfolio"
npx --yes serve -p 5173
```

Open `http://localhost:5173`.

Or simply open `index.html` in a browser (some browsers restrict modules differently; `serve` is cleaner).

## Deploy to AWS Amplify (baby steps)

### 1) Push this project to GitHub

```powershell
cd "C:\Users\Dell 5520\Desktop\zakwan-amplify-portfolio"
git init
git add .
git commit -m "Initial Zakwan Amplify portfolio with canary traffic shift"
gh repo create zakwan-amplify-portfolio --public --source=. --remote=origin --push
```

### 2) Create Amplify app in AWS Console

1. Sign in to AWS (use your IAM user, not root).
2. Open **AWS Amplify**.
3. **Create new app** → **Host web app**.
4. Connect **GitHub** → authorize → select `zakwan-amplify-portfolio`.
5. Branch: `main` or `master`.
6. Amplify should detect `amplify.yml`.
7. Deploy and wait for a green status.
8. Copy the Amplify URL (`https://….amplifyapp.com`).

### 3) Verify checklist

- [ ] Live URL loads
- [ ] About / Skills / Projects / Contact work on phone + desktop
- [ ] Traffic Shift slider changes the skin
- [ ] GitHub link works
- [ ] Take screenshots for the hackathon submission (see `docs/SUBMISSION.md`)

## Cost note

Amplify Hosting free tier is usually enough for a student portfolio. Delete the app if you no longer need it.

## Author

**Zakwan Mustafa** · [LinkedIn](https://www.linkedin.com/in/zakwan-mustafa-94b421373/) · [GitHub](https://github.com/zakwan05) · zakwanureed@gmail.com
