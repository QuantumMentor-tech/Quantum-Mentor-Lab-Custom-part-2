# 40 — Upload Security Rules
## Quantum Mentor World | Quantum Mentor Official

---

## 1. Why Upload Security Matters
Allowing users or administrators to upload files to a server introduces significant security vulnerabilities:
* **Remote Code Execution (RCE):** A user uploads a script file (e.g. `.php`, `.jsp`, `.js`, `.py`) and executes it by hitting the upload URL path.
* **Cross-Site Scripting (XSS):** A user uploads a file containing JavaScript (e.g. un-sanitized SVG vector files, `.html` files) which executes in the context of other users' sessions when viewed.
* **Denial of Service (DoS):** Uploading extremely large files to saturate disk space or exhaust memory buffers.
* **Path Traversal:** Uploading a file with a relative path sequence (e.g. `../../filename`) to overwrite system configuration files outside the upload directory.

---

## 2. Hardened Upload Filters & Guards

Our application implements **Whitelisting Validation** rules on the backend:

### Whitelists
1. **Allowed Extensions:** Only `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif` are allowed.
2. **Allowed MIME Types:** Only `image/jpeg`, `image/jpg`, `image/png`, `image/webp`, `image/gif` are accepted.

### Blocked Formats (Blacklist Guard)
1. **Executables / Scripts:** `.exe`, `.bat`, `.cmd`, `.sh`, `.php`, `.js`, `.html`, `.htm`.
2. **Vectors (XSS risk):** `.svg` is strictly blocked (unless parsed and sanitized by a dedicated XML tree purifier).
3. **Archives / Libraries:** `.zip`, `.rar`, `.7z`, `.tar`, `.dll`, `.msi`, `.jar`.

### Limits
1. **Max File Size:** Enforced strictly at **5MB** on the backend using Multer size limits.
2. **Single Upload Field:** Restricts target input to the field key `image` only.

---

## 3. Storage and Execution Protections

### Unique Safe Filenames
We never write the original filename directly to the disk. Original names may contain path traversal sequences or special shell command chars.
* Filenames are re-generated automatically: `qmw_<timestamp>_<random_number>.<extension>`.
* Original file extensions are checked against the whitelisted extension list and normalized to lowercase.

### Quarantined Static Storage Paths
* Files are stored only under the folder `backend/uploads/images/`.
* Express serves static assets safely only under the `/api/uploads/images` mapping. It does **not** expose root folders, `.env` files, or backend source files.
* Execution permissions on the server uploads folder should be disabled on production web servers (e.g. in Apache using `RemoveHandler` or Nginx by denying php execution in the location block).

---

## 4. Production Best Practices Recommendation

For maximum production security, consider implementing:
1. **Cloud Object Storage (e.g. AWS S3, Google Cloud Storage):** Move uploaded files off the local backend server disk entirely. Serves files independently, completely mitigating RCE concerns.
2. **Content Delivery Network (CDN):** Route static media files through CDNs (e.g. Cloudflare) to optimize delivery and protect backend servers from DDoS attacks.
3. **Virus and Malware Scanning:** Stream uploaded binaries through a scanning utility (e.g. ClamAV daemon) inside middleware before writing to storage.
4. **Image Re-encoding:** Read image byte buffers and write them back using image processors (e.g. `sharp` module) to strip out EXIF metadata, headers, or polyglot scripting payloads.
