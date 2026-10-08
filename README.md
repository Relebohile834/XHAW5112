# XHAW5112
# Adventure Escape SA - Website (Task 2, Phase 3: HTML only)
Pages: index, about, fees, contact, guided-hiking / mountain-adventure / outdoor-experience (individual pages).
Structure only: no CSS or JavaScript yet (these will be added in Task 3).
Photographs are stock imagery used for illustration only.
# Adventure Escape SA

A mobile application and website for **Adventure Escape SA**, a Western Cape (South Africa) company offering professionally guided outdoor experiences: hiking, mountain adventures and half-day outdoor experiences for families, tourists, schools, corporate groups and individuals.

**Module:** XHAW5112 (HMAW0501), Rosebank International
**Project:** Task 2 group project (Phase 1 wireframes, Phase 2 mobile app, Phase 3 website HTML)
**Brand:** Explore • Discover • Experience

---

## Team

| Member | Student number | GitHub |
|---|---|---|
| Relebohile Thato Phalatsi (team leader) | ST10508029 | Relebohile834 |
| Naledi Mzumala | ST10320989 | LisanAl-Gaib7 |
| Kgothatso Serekwane | ST10493438 | KTS-06 |

## Project links

| Deliverable | Link |
|---|---|
| Figma high-fidelity wireframes (24 screens) | https://www.figma.com/design/PhWOlXfvjx0qxlKxaynZ2H/Adventure-Escape-SA---High-Fidelity?node-id=35-2&t=Su6C8wrM6Rw3DROa-1 |
| Group video demonstration (YouTube, unlisted) | https://youtu.be/1XnlWSnYKCs |

---

## Mobile application

Built with **React Native** using **Expo** and **TypeScript**. The whole app is in `App.tsx`, with in-app navigation (no extra navigation library).

### Screens (12)

1. Splash (green to sky-blue gradient with the logo)
2. Home
3. About us
4. Activities (with filter chips)
5. Activity details (one reusable screen for Guided Hiking, Mountain Adventure and Outdoor Experience)
6. Packages and specials
7. Calculate fees
8. Quotation summary
9. Booking request (with success state)
10. Contact us

Bottom tabs: **Home, Activities, Fees, Contact**.

### Features

- Browse and filter activities, and view full details and what to bring.
- Fee calculator with participants, add-ons and a live total.
- Quotation summary built from the calculator result.
- Booking request form with validation (name, valid email, phone, preferred date) and a confirmation with a booking reference.
- Contact screen with tap-to-call, tap-to-email and a validated message form.

### Run the app

Requirements: [Node.js](https://nodejs.org/) (LTS) and the **Expo Go** app on your phone (optional, a browser also works).

```bash
cd AdventureEscapeSA
npm start
```

Scan the QR code with Expo Go, or press `w` to open it in the browser.

### Packages used

These are installed through Expo and are listed in `package.json`:

- `expo`, `react`, `react-native` (project template: `blank-typescript`)
- `@expo/vector-icons` (tab and button icons)
- `expo-linear-gradient` (splash screen gradient)
- `react-dom`, `react-native-web`, `@expo/metro-runtime` (only needed to run in the browser)

If a package is missing, install it with `npx expo install <package-name>`.

---

## Website

The website for Task 2 is **HTML only**: the page structure, content, images, links, forms and tables. CSS and JavaScript are added in Task 3.

### Pages

| Page | File |
|---|---|
| Home | `index.html` |
| About us | `about.html` |
| Contact us | `contact.html` |
| Calculate fees | `fees.html` |
| Individual activity pages | `guided-hiking.html`, `mountain-adventure.html`, `outdoor-experience.html` |

Images are in `website/images/`. Keep the folder next to the HTML files or the photos will not load.

### View the website

Open `website/index.html` in any browser. No build step or server is needed.

---

## Activities and fee rules

| Activity | Price | Duration | Level |
|---|---|---|---|
| Guided Hiking | R450 per person | 4–5 hrs | Beginner friendly |
| Mountain Adventure | R850 per person | Full day | Intermediate |
| Outdoor Experience | R550 per person | Half day | All levels |

**Add-ons:** Photography pack R250 (flat), Picnic lunch R180 per person, Transport R300 (flat).

**Multi-activity discount** (applied to the full subtotal, including add-ons):

| Activities booked | Discount |
|---|---|
| 1 | 0% |
| 2 | 5% |
| 3 | 10% |
| 4 or more | 15% |

Example: Guided Hiking + Outdoor Experience for 2 people with all three add-ons has a subtotal of R2,910.00, a 5% discount of R145.50 and a total of **R2,764.50**.

---

## Design

- **Colours:** Forest Green `#2E7D32`, Sky Blue `#4FC3F7`, White `#FFFFFF`, Dark `#212121`, Light Grey `#F5F7F6`
- **Fonts:** Poppins (headings), Inter (body)
- **Design tool:** Figma (12 mobile + 12 website high-fidelity screens)

---

## Team workflow (GitHub)

- Branches: `main` (stable), `develop` (integration) and `feature/<name>` for each piece of work.
- Each member works on their own feature branch and opens a **pull request**; another member reviews it before it is merged.
- Commit messages use short prefixes: `feat:`, `fix:`, `style:`, `docs:`, `test:`.
- `node_modules` is never committed (it is listed in `.gitignore`).

---

# References

Figma, 2026. Figma. [online] Available at: <https://www.figma.com/design/PhWOlXfvjx0qxlKxaynZ2H/Adventure-Escape-SA---High-Fidelity?node-id=35-2&t=hnpGOdJmR7liOae5-1> [Accessed 03 October 2026]. 
Figma, 2026. Figma. [online] Available at: <https://www.figma.com/> [Accessed 03 October 2026]. 
GitHub, 2026. GitHub. [online] Available at: <https://github.com/Relebohile834/XHAW5112> [Accessed 03 October 2026]. 
GitHub, 2026. GitHub. [online] Available at: <https://github.com/> [Accessed 03 October 2026]. 
YouTube, 2026. YouTube. [online] Available at: <https://youtu.be/1XnlWSnYKCs> [Accessed 03 October 2026]. 
YouTube, 2026. YouTube. [online] Available at: <https://www.youtube.com/> [Accessed 03 October 2026]. 
