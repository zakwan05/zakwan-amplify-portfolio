# Baby steps — put this portfolio live on AWS Amplify

Do these in order. Deadline context: keep the Amplify URL up through judging.

---

## Step 1 — Open PowerShell in the portfolio folder

```powershell
cd "C:\Users\Dell 5520\Desktop\zakwan-amplify-portfolio"
```

---

## Step 2 — Make sure GitHub CLI is logged in

```powershell
gh auth status
```

If it says you are not logged in:

```powershell
gh auth login
```

(Choose GitHub.com → HTTPS → Login with browser.)

---

## Step 3 — Create the GitHub repo and upload

```powershell
git init
git add .
git commit -m "Initial Zakwan Amplify portfolio with canary traffic shift"
git branch -M main
gh repo create zakwan-amplify-portfolio --public --source=. --remote=origin --push
```

Copy the repo URL it prints (example: `https://github.com/zakwan05/zakwan-amplify-portfolio`).

---

## Step 4 — Open AWS Amplify in the console

1. Go to https://console.aws.amazon.com/amplify/
2. Region: any Amplify-supported region is fine (many people use `us-east-1`).
3. Click **Create new app** (or **Host web app**).

---

## Step 5 — Connect GitHub

1. Choose **GitHub** as the source.
2. Authorize AWS Amplify if asked.
3. Select repository: **zakwan-amplify-portfolio**
4. Select branch: **main**
5. Continue.

---

## Step 6 — Build settings

1. Amplify should auto-detect `amplify.yml`.
2. App name: `zakwan-portfolio` (or keep default).
3. Save and deploy.

Wait until the status is **Deployed** (green). First deploy can take a few minutes.

---

## Step 7 — Copy your live URL

On the Amplify app overview you will see something like:

`https://main.xxxxx.amplifyapp.com`

Open it in a browser. Check:

- [ ] Hero shows **ZAKWAN**
- [ ] About / Skills / Projects sections work
- [ ] Traffic Shift slider changes Stable → Canary
- [ ] GitHub link works
- [ ] Looks OK on your phone

---

## Step 8 — Screenshots for the hackathon form

Save into `docs/screenshots/`:

1. Hero (Stable)
2. Same page with Canary at 100%
3. Amplify console showing Deployed
4. Phone screenshot of About or Skills

Then paste write-up text from `docs/SUBMISSION.md` into the challenge submission.

---

## If deploy fails

| Problem | Fix |
| --- | --- |
| GitHub not listed | Re-authorize Amplify GitHub app; grant repo access |
| Build fails | Open Amplify build log; confirm `amplify.yml` is at repo root |
| Old site after fix | Push a new commit; Amplify redeploys automatically |
| Wrong account | Confirm `aws sts get-caller-identity` matches the console account |

---

## After you win attention — keep cost low

When the judging window ends, you can keep the site (usually cheap/free tier) or delete the Amplify app in the console.
