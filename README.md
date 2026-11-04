# Zakwan Mustafa — Portfolio

Personal portfolio of **Zakwan Mustafa**, software engineer and AWS Student Builder Group leader at UET Taxila. Hosted on **AWS Amplify Hosting**.

## The idea

Zakwan's teams have shipped for clients in five countries. The site's hero shows that as a live, interactive globe:

- **Real daylight.** Each land point is lit by the sun's actual position at the moment the page loads (subsolar point from the date and UTC time), and it refreshes while you watch.
- **Where the work landed.** Pakistan, the UK, the US, Egypt and India glow, with arcs carrying work back to Islamabad. Clicking a light, or one of the local-time clocks under it, turns the globe there and shows what was delivered.
- **You're on it too.** If the visitor's browser timezone is in a list of about 50 major cities, a line is drawn from the visitor's approximate city to Islamabad. This runs entirely in the browser and nothing is sent anywhere.
- **Every project links back to the map.** Each Work card has a "Show on globe" action.

Normal navigation (About, Skills, Work, Contact) never depends on the globe.

## Sections

- About
- Skills
- Work: projects and achievements
- Contact

## Tech

- Static HTML, CSS and JavaScript. No framework and no runtime dependencies.
- The globe is a hand-written Canvas 2D orthographic renderer (`app.js`).
- `assets/land-dots.js` holds about 6,000 land sample points, generated once from Natural Earth 110m data (world-atlas).
- `amplify.yml` handles AWS Amplify Hosting.

## Local preview

```powershell
cd "C:\Users\Dell 5520\Desktop\zakwan-amplify-portfolio"
npx --yes serve -l 5173
```

Open the URL it prints.

## Deploy

See [docs/AMPLIFY_DEPLOY.md](docs/AMPLIFY_DEPLOY.md). Submission write-up: [docs/SUBMISSION.md](docs/SUBMISSION.md).

## Links

- LinkedIn: https://www.linkedin.com/in/zakwan-mustafa-94b421373/
- GitHub: https://github.com/zakwan05
- Email: zakwanureed@gmail.com

Map data: Natural Earth (public domain) via world-atlas.
