# Administrative Handover Guide — Quantum Mentor World

This guide is compiled for the administrators of the **Quantum Mentor World** platform to explain content management, media management, user feedback, and safety audits.

---

## 1. Initial Dashboard Login
1. Navigate to the login screen:
   `https://quantummentor.world/admin/login.html`
2. Authenticate using your administrator credentials.
3. Once logged in, click your profile on the sidebar to access configuration settings.

> [!IMPORTANT]
> If using the default credentials (`admin@quantummentor.local` / `Admin@12345`), update your password immediately inside the database to protect administrator accounts.

---

## 2. Resource Management

### Creating a Resource
1. Navigate to **Resources** in the admin sidebar menu and click **Add Resource**.
2. Fill in the **Title**, **Short Description**, **Category**, and **Tags**.
3. Choose the **Access Type** (e.g. Free, Open-Source) and **Source Type** (e.g. Official, Creator-Approved).
4. Enter the primary source URL (e.g. GitHub URL or official download page).
5. Input specification parameters (e.g. author, license version).

### Legal and Safety Review Compliance
Before you can publish a resource:
- The resource's **Legal Review** status must be set to `approved`.
- The resource's **Safety Review** status must be set to `safe` or `warning`.
* **Important:** If either status is set to `pending` or `rejected`, the resource remains as a Draft and cannot be published publicly.

---

## 3. Storage and Media Management

* To upload image banners or screenshots, select **Media Library** on the sidebar.
* Drag and drop files or choose images using the file picker.
* **Limitations:** Only image file types (`.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`) are accepted. The maximum upload size per file is **5MB**. Executables or scripts are rejected.
* Click **Copy URL** on uploaded media cards to copy the path link, which can then be pasted into resource thumbnail fields.

---

## 4. Reviewing Feedback and Link Issue Reports

### Contact Messages
Check the **Contact Inbox** on the sidebar to review inquiries submitted by users. You can mark messages as **Read** or **Unread**, or soft-delete resolved items.

### Link Issue Reports
Users can report unsafe links or 404 pages. Check the **Resource Reports** inbox to investigate reports. Click the resource link to view the page, inspect the link, and mark the report as **Resolved** once fixed.

---

## 5. Maintenance Backups Procedures

Keep daily/weekly backups of your site:
```bash
# 1. Run database SQL backups
npm run backup:db

# 2. Run media uploads backup copies
npm run backup:uploads
```
Ensure generated backups are stored securely outside the server.
