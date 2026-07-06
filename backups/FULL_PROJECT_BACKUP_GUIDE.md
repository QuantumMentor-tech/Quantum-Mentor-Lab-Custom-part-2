# Full Project Archiving & Handover Guide — Quantum Mentor World

This document maps out cleanup, archiving, and restoration steps to compile a full project handover ZIP package.

---

## 1. Preparing the Codebase for Archiving

Before zipping the directory, you must exclude heavy dependency folders and private environment files:

* **Files and Directories to EXCLUDE:**
  * `backend/node_modules/` (heavy library directory)
  * `backend/.env` (private database passwords)
  * `backend/uploads/temp/` (temporary uploads files)
  * `backups/generated/` (local SQL/media dumps)
  * Any generated log files (e.g. `*.log`)

---

## 2. Generating the ZIP Package

Follow these steps to create a clean archive:

### Using Git Archive (Recommended)
If you track development using git, run:
```bash
git archive --format=zip HEAD -o quantum_mentor_world_handover.zip
```
This automatically packages files tracked in git and ignores paths defined in your `.gitignore` file.

### Manual Packaging
If generating manually, use compression utilities (like WinZIP, WinRAR, or 7-Zip) and configure exclusions for `node_modules/`, `.env`, and `backups/generated/`.

---

## 3. Handing Over to AI Agents

If another developer agent is continuing this codebase, provide:
1. The zipped codebase.
2. The generated continuation file: [PROJECT_SUMMARY_FOR_AI_AGENT.md](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/backups/generated/PROJECT_SUMMARY_FOR_AI_AGENT.md).
3. The database schema SQL creations: `database/quantum_mentor_world.sql`.

---

## 4. Restoration Sequence

To restore the archived project later:
1. Unzip the package.
2. Install Node packages:
   ```bash
   cd backend
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in DB parameters.
4. Import relational schemas (`database/quantum_mentor_world.sql`), seed content (`database/seed_data.sql`), and indexes (`database/optimization_indexes.sql`) to your MySQL instance.
5. Launch local server:
   ```bash
   npm run dev
   ```
