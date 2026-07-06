# 43 — Static Legal Pages Guide

## Project: Quantum Mentor World / Quantum Mentor Official
## Tech Stack: HTML, CSS, JavaScript, Node.js, Express.js, MySQL

---

## 1. Compliance Mandate & Safety Standards

As an educational directory mapping third-party links, **Quantum Mentor World** enforces a zero-tolerance policy against digital piracy, cracked software, malware, and illegal streaming servers. The legal static pages serve to protect both users and site administrators from legal liability by establishing rules of service.

---

## 2. Overview of Polished Legal Pages

The platform features 4 polished, mobile-responsive pages:

### About Page (`about.html`)
* **Purpose:** Highlights our educational mission statement.
* **Content:** Describes resource verification filters, categories of safe software, public-domain cataloging, and link audits.

### Disclaimer Page (`disclaimer.html`)
* **Purpose:** Sets liability limitation guidelines regarding external links.
* **Key Content:** Explicitly states the platform does not host, index, or distribute nulled, cracked, or illegal copyrighted content. Warns users that third-party websites are out of our control.

### Privacy Policy Page (`privacy.html`)
* **Purpose:** Discloses data gathering metrics to users.
* **Key Content:** Explains that name, email, IP addresses, and user agent parameters are gathered only on contact/report submissions to prevent security spam. Confirms no tracking or marketing cookies are loaded.

### Contact Page (`contact.html`)
* **Purpose:** Exposes public contact form submissions mapped to `POST /api/contact`.
* **Key Content:** Lists contact reasons, DMCA copyright removal request instructions, and links footer references to site disclaimers.

---

## 3. Copyright (DMCA) / Takedown Workflow

To comply with international intellectual property rules, our disclaimer specifies the takedown procedure:
1. Rightsholders discover an unauthorized redirect link or mirror.
2. Rightsholders contact the platform administration using the contact form or submit a resource detail report.
3. The platform administration reviews the request and updates/soft-deletes the links or resources in the admin panel.
4. Actions write audit logs in `admin_activity_logs`.

---

## 4. Crucial Legal Disclaimer

> [!WARNING]
> **Legal Review Notice:**
> The static legal contents provided in this codebase are developer-drafted guidelines tailored for general educational platform development. Site administrators **must** have these terms reviewed and modified by a qualified legal professional prior to live production hosting.
