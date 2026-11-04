# Submission write-up: Zakwan Mustafa

Edit this into your own voice before you submit.

## Title

**Zakwan Mustafa: a portfolio that follows the sun**

## Short description

A portfolio on AWS Amplify that opens on a live globe. The daylight on it is the real daylight right now, and lights mark the five countries where my teams have shipped work. If you're a visitor in a major city, a line runs from your city to mine in Islamabad.

## Creative feature

I've delivered for clients in the UK, USA, Egypt, India and Pakistan, often while they were asleep. So instead of an OS theme or a mini-game, my portfolio opens on the planet where the work happened.

- **Live daylight.** The globe calculates where the sun is overhead from the current date and UTC time, then lights each of its ~6,000 land points accordingly. Whenever someone opens the site, the day/night line matches the real world.
- **Where the work landed.** Each glowing country is clickable. The globe turns to it and shows what I delivered there, for example the SEO work that took Married to the Mop to #1 in Wigan.
- **Five clocks.** The local time and day/night state for each client country.
- **You're on the map.** The browser's timezone gives an approximate city, and a line is drawn from there to Islamabad. It runs entirely client-side and no data leaves the browser.
- **Connected to the content.** Every project card has "Show on globe", so the feature works as a second way to navigate. The normal menu always works on its own.

The globe is my own Canvas 2D renderer with no 3D library. I generated the land points once from Natural Earth data, so the live site has no runtime dependencies.

## AWS services used

| Service | How |
| --- | --- |
| **AWS Amplify Hosting** | Hosts the site from my GitHub repo, with HTTPS and automatic redeploy on every push |
| **AWS Lambda, AWS SAM, Amazon CloudWatch** *(featured project)* | CloudPulse, my serverless health-check API, shown in the Work section |
| **GitHub Actions** *(featured project)* | CloudPulse CI: tests, `sam validate`, `sam build` |

## Screenshots to include

1. Desktop hero: globe, name, clocks
2. A selected country (e.g. United Kingdom) with its card
3. Mobile hero
4. Skills and Work sections
5. Amplify console showing the app **Deployed**
6. GitHub repo

## What I learned

- How Amplify Hosting turns a GitHub repo into a global HTTPS site that redeploys on every push.
- The maths behind an orthographic globe and a day/night terminator: the subsolar point, rotation, and back-face culling.
- How to keep a big creative idea from blocking navigation or mobile usability.
- Writing about my experience honestly, without inflated claims.

## Challenges

- Getting about 6,000 animated points and arcs to run smoothly on phones. I grouped draw calls by colour and paused rendering when the globe is off-screen.
- Building land data without shipping a heavy map library. I generated it offline and saved it to a 52 KB file.
- Making the feature personal rather than decorative. Every light on the map stands for real work.

## Links

- Live site: `https://REPLACE.amplifyapp.com`
- GitHub: `https://github.com/zakwan05/zakwan-amplify-portfolio`
- LinkedIn: https://www.linkedin.com/in/zakwan-mustafa-94b421373/
