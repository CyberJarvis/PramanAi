# 🛡️ Praman AI: Security Architecture Audit

Praman AI is built with a **Security-First** mindset, ensuring that sensitive humanitarian and climate data is protected through multi-layered defense mechanisms.

---

## 🔒 1. Zero-Trust Access Control (RBAC)
The system implements a sophisticated **Role-Based Access Control** hierarchy, ensuring that users only see the data they are authorized to access.

*   **5-Tier Hierarchy**: From `Viewer` (Read-only) to `Admin` (System Control).
*   **Granular Permissions**: Every action (viewing maps, creating scenarios, deleting users) is mapped to specific permission keys.
*   **Hierarchy levels**:
    *   **Admin (L5)**: Full system sovereignty.
    *   **Policy Designer (L4)**: Scenario & Intervention management.
    *   **Analyst (L3)**: Deep data analysis and reporting.
    *   **User (L2)**: Standard operational access.
    *   **Viewer (L1)**: Strictly read-only auditing.

---

## 🗝️ 2. Military-Grade Encryption & Auth
We use industry-standard protocols to ensure that identity and credentials are never compromised.

*   **BCRYPT Hashing**: Passwords are never stored in plain text. We use `BcryptJS` with a cost factor of **12**, making them highly resistant to brute-force and rainbow table attacks.
*   **JWT Stateless Tokens**: Authentication is handled via signed JSON Web Tokens.
*   **JOSE Implementation**: We use the high-performance `jose` library for server-side token verification, ensuring sub-millisecond security checks at the edge.

---

## 🚧 3. Middleware-Level Enforcement
Security is enforced **before** the page or API even loads.

*   **Next.js Middleware**: A centralized guard verifies every request to `/dashboard` or `/admin`. 
*   **Access Denied Redirects**: If a user attempts to "URL-hack" into a page above their level (e.g., a `Viewer` trying to access `/admin`), the Middleware instantly intercepts and redirects them to a secure access-denied page.
*   **Server-Side Verification**: Since verification happens on the server, it cannot be bypassed by client-side browser manipulation.

---

## 📝 4. Audit & Integrity
*   **Database Integrity**: MongoDB schema validation via Mongoose ensures data consistency and prevents injection.
*   **Environment Isolation**: Sensitive keys (JWT Secrets, DB URIs) are managed through strict environment variables, never hardcoded in the logic.
*   **Audit Potential**: The system architecture supports an `/admin/activity` log (Audit Trail) to track who made what changes to the causal model.

---

## 📈 Security Comparison

| Feature | Standard Apps | **Praman AI** |
| :--- | :--- | :--- |
| **Auth Strategy** | Session-based | **Stateless signed JWT** |
| **Storage** | Plain / MD5 | **Bcrypt (Cost 12)** |
| **Access Control** | Simple IsAdmin? | **Granular 5-Level RBAC** |
| **Gatekeeper** | Client-side routes | **Edge-Level Middleware** |

---

### 💡 The Verdict
By combining **Stateless Identity**, **High-Entropy Hashing**, and **Middleware Guardrails**, Praman AI provides a secure environment suitable for government and inter-governmental agencies dealing with high-stakes population displacement data.
