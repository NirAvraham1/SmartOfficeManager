# 🏢 Smart Office Management System

## **Overview**
A distributed, **Enterprise-grade** microservices system designed for managing office assets. This project demonstrates a robust full-stack architecture focusing on high security, system resilience, and polyglot persistence. Developed as part of a B.Sc. in Computer Science at Afeka College.

---

## 🛠 **Technical Stack**

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18 (TypeScript), MobX, MUI 5, Tailwind CSS |
| **Identity Service** | .NET 9 Web API, PostgreSQL, Entity Framework Core |
| **Resource Service** | .NET 9 Web API, MongoDB, Repository Pattern |
| **Infrastructure** | Docker, Docker Compose, Nginx |

---

## 🚀 **Quick Start Guide**

### **Prerequisites**
* **Docker Desktop** installed and running.
* Available Ports: `5173` (UI), `5197` (Auth), `5259` (Resources).

### **Execution**
1.  Open a terminal in the project root directory.
2.  Run the following command:
    docker-compose up --build
    
3.  **Access Points:**
    * **Frontend UI:** [http://localhost:5173](http://localhost:5173)
    * **Auth API (Swagger):** [http://localhost:5197/swagger](http://localhost:5197/swagger)
    * **Resource API (Swagger):** [http://localhost:5259/swagger](http://localhost:5259/swagger)

---

## 🛡 **Security & Architecture Highlights**

* **HttpOnly Cookies:** Transitioned from LocalStorage to HttpOnly Cookies for JWT storage, providing high-level protection against XSS attacks.
* **Repository Pattern:** Implemented a clean separation between API Controllers and data access layers to ensure testability and decouple business logic from DB providers.
* **System Resilience:** Integrated **Exponential Backoff** logic in service startup to handle database readiness within the Docker network.
* **RBAC (Role-Based Access Control):** Granular permission management where **Admins** can manage assets while **Members** are restricted to read-only access, enforced at both UI and API levels.

---

## 🧠 **Reflections & Technical Challenges**

### **1. The Security Pivot (JWT vs. Cookies)**
**Issue:** Initial implementation used LocalStorage, exposing the system to potential script-based token theft.
**Solution:** Refactored the authentication flow to utilize **HttpOnly Cookies**. This involved complex CORS configuration (`AllowCredentials`) and updating Axios to support credentialed requests (`withCredentials: true`).

### **2. Type Safety & Model Syncing**
**Issue:** Encountered `401 Unauthorized` and build errors (CS0029) due to mismatched user models (`User` vs `ApplicationUser`).
**Solution:** Unified the domain models and used `[JsonPropertyName]` attributes to sync field naming between React (camelCase) and C# (PascalCase), ensuring perfect JSON serialization.

### **3. Database Race Conditions**
**Issue:** Microservices failed to start if the Backend reached out to databases before they were "Ready" in the Docker container.
**Solution:** Developed a retry policy using **Exponential Backoff** (2s, 4s, 8s...) to ensure services wait gracefully for the infrastructure to stabilize.

---

## 🧪 **Tooling & Resources**
* **AI Collaboration:** Developed with architectural and debugging assistance from **Gemini (Google AI)**.
* **UI/UX Concept:** Prototyped using **Stitch** for a modern SaaS dashboard feel.
* **Documentation:** MUI Docs, Microsoft Identity Best Practices.