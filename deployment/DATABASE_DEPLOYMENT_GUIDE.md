# Database Deployment Guide — Quantum Mentor World

This document covers database setups, schema imports, and optimization indexes configuration.

---

## 1. Production MySQL Host Boundaries

> [!WARNING]
> XAMPP and local phpMyAdmin are designed for local development only. Do not use local XAMPP databases in production.
> Select a hosted relational database service (such as AWS RDS, DigitalOcean Managed Databases, or a dedicated MySQL/MariaDB server instance).

---

## 2. Relational Import Sequence

Log into your production database client (e.g. phpMyAdmin, DBeaver, or via mysql CLI) and run imports in this order:

### Phase 1: Database Structure Schema
Import [quantum_mentor_world.sql](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/database/quantum_mentor_world.sql) to create the 15 relational tables and foreign keys.
```bash
mysql -h production-host -u admin-user -p quantum_mentor_world < database/quantum_mentor_world.sql
```

### Phase 2: Production Seeding (Optional)
Import [seed_data.sql](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/database/seed_data.sql) only if you require template categories, tags, or settings. Review contents before seeding.
```bash
mysql -h production-host -u admin-user -p quantum_mentor_world < database/seed_data.sql
```

### Phase 3: Query Optimization Indexes
Import [optimization_indexes.sql](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/database/optimization_indexes.sql) to apply performance-enhancing query indexes.
```bash
mysql -h production-host -u admin-user -p quantum_mentor_world < database/optimization_indexes.sql
```

---

## 3. Administrative Credentials Hardening

If you imported `seed_data.sql`, a default administrator account is registered:
* **Default Username:** `admin@quantummentor.local`
* **Default Password:** `Admin@12345`

> [!CAUTION]
> You MUST change this password immediately before launching, or delete the user after creating a secure administrative account.
> Use the create admin helper to seed secure credentials:
> `ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=StrongPasswordHere npm run create:production-admin`

---

## 4. Database Integrity Audits

Run the database health auditor to verify active tables and count details:
```bash
cd backend
npm run check:db
```
This tests connectivity pools, counts tables, and confirms that all required entities exist.
