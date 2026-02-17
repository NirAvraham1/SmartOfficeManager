**Smart Office Management System - Microservices Project**

**Overview**
This project is a distributed system for managing office assets. It demonstrates a microservices architecture using .NET 9, React with TypeScript, and polyglot persistence (SQL + NoSQL).

**Key Features**
    **Identity Service:** Handles Auth via PostgreSQL and ASP.NET Identity.
    **Resource Service:** Manages office assets using MongoDB.
    **Security:** Cross-service JWT validation and Role-Based Access Control (RBAC).
    **Frontend:** Professional Enterprise Dashboard built with MUI 5, Tailwind CSS, and MobX.

1. **Run Guide**
**Prerequisites**
    Docker Desktop installed.
    Ports 5173 (Frontend), 5197 (Auth), and 5259 (Resource) must be available.

**Execution**
1. Open a terminal in the project root directory.
2. Run the following command:
    docker-compose up --build

**Once all containers are healthy:**
    UI Access: http://localhost:5173
    Auth API Swagger: http://localhost:5197/swagger
    Resource API Swagger: http://localhost:5259/swagger

**Testing the Flow**
1. **Register:** Create a new user (Admin or Member) via the UI or the provided .http files.
2. **Login:** Authenticate to receive a JWT.
3. **Dashboard:**
    Admins can view, add (free text categories), and manage assets.
    Members can only view assets (the "Add" functionality is hidden and server-side protected).

2. **Reflections & Technical Difficulties**

**Database Integration & Identity**
Issue: Initially, the Identity service failed to connect to the database within the Docker environment due to missing dependencies and incorrect ApplicationUser mapping.
Solution: Refactored the ApplicationUser class to extend IdentityUser and ensured all necessary NuGet packages were explicitly included in the .csproj for the Docker build.

**Hybrid Styling Integration (MUI + Tailwind)**
Issue: Integrating a modern "SaaS-style" layout (Tailwind) with functional MUI 5 components caused layout constraints, resulting in "dead space" on the screen and restricted widths.
Solution: Refactored the global CSS and App.tsx to remove boilerplate max-width limitations. Successfully merged MUI’s functional components (like TextField and Button) with Tailwind’s utility classes to create a full-width, responsive UI.

**Polyglot Persistence (SQL vs NoSQL)**
Issue: Ensuring data isolation while maintaining a unified UI experience.
Solution: Implemented two distinct services where the Auth service owns the PostgreSQL instance and the Resource service owns the MongoDB instance, demonstrating true microservices independence.

3. **Tooling Disclosure**
**Architectural & Debugging Assistance:** Developed with the assistance of Gemini (Google AI) for system architecture design, Docker configuration, and backend-frontend integration.
**UI/UX Prototyping:** Used Stitch for modern UI/UX design concepts, which were then manually adapted into React components.
**UI Frameworks:** Material UI (MUI) 5 and Tailwind CSS.

**External Resources:**
1. MUI Documentation
2. Microsoft Identity Documentation
3. MobX State Management