# Hackathon submission kit — Zakwan Mustafa

Use this when filling **“your project”** on the challenge site. Replace screenshot placeholders with your real captures after Amplify is live.

## One-liner

> My portfolio is a production-shaped personal site on AWS Amplify Hosting whose creative feature is a CodeDeploy-style **Canary Traffic Shift** — visitors weight traffic between Stable and Canary UI environments without ever losing navigation.

## Creative feature (copy/paste)

**Name:** Canary Traffic Shift  

**What it is:** A persistent control bar that shifts “traffic” from a Stable production skin to a Canary experimental skin (threshold at 50%), inspired by AWS weighted traffic shifting / CodeDeploy canaries.

**Why it’s memorable:** Most student portfolios add arcade games or theme toggles. This one teaches an AWS release concept *by using it*. Judges feel DevOps literacy immediately.

**Doesn’t block navigation:** Primary nav + section anchors always work; the slider is additive. First-visit CloudFormation deploy theater is skippable.

**Extra polish:** Local “CloudTrail” drawer logs visitor navigation events (client-side only — no PII sent to a server).

## AWS services used

| Service | How used |
| --- | --- |
| **AWS Amplify Hosting** | Hosts the static portfolio from GitHub; CI/CD on push |
| *(Related learning, linked as a project)* **AWS Lambda + SAM + CloudWatch** | CloudPulse health API — separate repo, cited under Projects |

## Screenshots to capture

1. Hero with **ZAKWAN** brand dominant (`docs/screenshots/01-hero.png`)
2. Traffic Shift at **0%** Stable skin (`docs/screenshots/02-stable.png`)
3. Traffic Shift at **100%** Canary skin (`docs/screenshots/03-canary.png`)
4. About + Skills on mobile width (`docs/screenshots/04-mobile.png`)
5. AWS Amplify console showing the app **Deployed** (`docs/screenshots/05-amplify-console.png`)
6. Optional: stack deploy overlay (`docs/screenshots/06-stack-boot.png`)

## What I learned (draft — edit in your voice)

- How Amplify connects a GitHub repo to a public HTTPS URL with almost no server management.
- Why separating **Stable vs Canary** experiences mirrors real release safety.
- How to keep a flashy creative idea from breaking core UX (nav always available).
- How to document AWS usage clearly for reviewers who were not in my editor.

## Challenges I hit (draft — edit in your voice)

- Designing a creative feature that feels AWS-native instead of a generic theme switcher.
- Keeping the first viewport brand-first while still explaining the canary idea.
- Making Stable/Canary contrast obvious without harming readability.
- Balancing portfolio completeness (About / Skills / Projects) with a single sharp creative hook.

## Required links

- **Live Amplify URL:** `https://REPLACE.amplifyapp.com`
- **GitHub repo:** `https://github.com/zakwan05/zakwan-amplify-portfolio` (update if renamed)
- **LinkedIn:** https://www.linkedin.com/in/zakwan-mustafa-94b421373/
- **Related build:** https://github.com/zakwan05/CloudPulse

## Rubric self-check

| Criterion | Weight | How this entry addresses it |
| --- | --- | --- |
| Creativity & memorability | 30% | Canary traffic shift + deploy theater + CloudTrail — unique AWS metaphor |
| Working AWS implementation | 25% | Amplify live URL + console screenshot + service table |
| Communication quality | 25% | This write-up + README + clear feature naming |
| Completeness & usability | 20% | About, Skills, Projects, responsive layout, nav always works |
