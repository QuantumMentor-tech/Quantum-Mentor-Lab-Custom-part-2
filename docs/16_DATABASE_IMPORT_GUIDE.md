# 16 — Database Import Guide
## Quantum Mentor World | Quantum Mentor Official

---

## Prerequisites
Before importing the database, ensure you have:
1. Installed **XAMPP** on your local machine.
2. Verified that **Apache** and **MySQL** are running in the XAMPP Control Panel.
3. Created or confirmed the database `quantum_mentor_world`.

---

## Step-by-Step Import Instructions

### 1. Launch XAMPP Control Panel
* Open the **XAMPP Control Panel**.
* Click **Start** for **Apache** and **Start** for **MySQL**.
* Verify both services show a green background and status.

### 2. Access phpMyAdmin
* Open your web browser.
* Navigate to:
  ```text
  http://localhost/phpmyadmin
  ```

### 3. Open the Target Database
* In the left-hand navigation pane, search for the database:
  ```text
  quantum_mentor_world
  ```
* If the database does not exist:
  1. Click **New** in the top left.
  2. Input Database Name: `quantum_mentor_world`.
  3. Collation Select: `utf8mb4_general_ci`.
  4. Click **Create**.
* Click on `quantum_mentor_world` to open it.

### 4. Import the SQL File
* Click on the **Import** tab in the top menu bar.
* In the **File to import** section, click **Browse...** (or **Choose File**).
* Navigate to the project root and select the SQL file:
  ```text
  database/quantum_mentor_world.sql
  ```
* Ensure the Format dropdown is set to **SQL**.
* Scroll to the bottom of the page and click **Import** (or **Go**).
* Wait for a green success message confirming that the import finished successfully.

### 5. Confirm Table Generation
* Confirm that all 15 tables are visible in the left sidebar:
  * `users`
  * `categories`
  * `tags`
  * `media`
  * `resources`
  * `resource_details`
  * `resource_categories`
  * `resource_tags`
  * `resource_links`
  * `watch_episodes`
  * `watch_servers`
  * `contact_messages`
  * `site_settings`
  * `admin_activity_logs`
  * `resource_reports`

---

## Troubleshooting Common Errors

### 1. Error: "Cannot add foreign key constraint"
* **Cause:** Happens if referenced tables are created after referencing tables, or if column data types do not match exactly.
* **Resolution:** 
  1. Ensure the schema creation order starts with independent tables (like `users`, `categories`, `tags`) and places dependent tables later.
  2. Double-check that referenced and referencing columns are both defined as `BIGINT UNSIGNED`.
  3. Keep `SET FOREIGN_KEY_CHECKS = 0;` at the beginning of the schema definition, and `SET FOREIGN_KEY_CHECKS = 1;` at the end.

### 2. Error: "Unknown database"
* **Cause:** phpMyAdmin was unable to find `quantum_mentor_world` during the import because the database does not exist or was not selected.
* **Resolution:** Make sure that the database is created first. Our SQL file contains:
  ```sql
  CREATE DATABASE IF NOT EXISTS quantum_mentor_world;
  USE quantum_mentor_world;
  ```
  Ensure you are logged into phpMyAdmin as a root user with permissions to create databases.

### 3. Error: "Table already exists"
* **Cause:** Old tables are blocking table creation.
* **Resolution:** 
  For local development, use the drop order provided at the top of `quantum_mentor_world.sql` to clean up the workspace before recreating tables. If you need to keep previous data, backup tables using phpMyAdmin's **Export** tab before importing a new version.

### 4. Error: "MySQL server has gone away"
* **Cause:** The MySQL daemon stopped, restarted, or hit a maximum packet/time limit.
* **Resolution:** 
  1. Restart MySQL in the XAMPP Control Panel.
  2. If the file size is very large (usually not an issue for schema-only scripts), split the queries or increase `max_allowed_packet` and `wait_timeout` parameters in `my.ini`.
