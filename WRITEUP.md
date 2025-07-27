# Project Write-Up: AI Component Generator

---
## 1. Architecture Diagram

<img width="1593" height="650" alt="image" src="https://github.com/user-attachments/assets/c899436d-7aa5-4e97-9395-0195d6aef84b" />


1.  **User's Browser (Frontend)**
    * **Tech:** React, Next.js on Vercel
    * **Description:** The user interacts with the UI, sends prompts, and views the generated component.

2.  **Backend API (Server)**
    * **Tech:** NestJS on Render
    * **Description:** Handles user authentication, manages sessions, and communicates with the AI service.

3.  **Database**
    * **Tech:** MongoDB Atlas
    * **Description:** Persists user data, chat history, and generated code for each session.

4.  **AI Service**
    * **Tech:** Google Gemini API
    * **Description:** Receives prompts from the backend and returns generated code.

**Example Flow:**
`User -> Frontend -> Backend -> AI Service` (for generation)
`User -> Frontend -> Backend -> Database` (for saving/loading sessions)

---
## 2. Key Decisions & Trade-offs

This section is for you to explain *why* you made certain technical choices.

### Backend Framework: NestJS
* **Decision:** I chose NestJS over a more minimal framework like Express.
* **Reasoning:** NestJS's opinionated structure with modules, controllers, and services provides a scalable and organized architecture, which was beneficial for a project with distinct features like authentication and AI integration. The built-in support for TypeScript and dependency injection also helped maintain clean code.

### Frontend State Management: Zustand
* **Decision:** I used Zustand for global state management instead of alternatives like Redux or React Context.
* **Reasoning:** Zustand offers a simple, hook-based API that is much less boilerplate-heavy than Redux. For this application, which needed to share a few key pieces of state (token, active session), Zustand provided the necessary power without the complexity of a larger library.

### Component Preview: `<iframe>` Sandbox
* **Decision:** I chose to render the user-generated components inside an `<iframe>` with the `srcDoc` attribute.
* **Trade-off:** This approach provides maximum security and style isolation, preventing the generated component's CSS or scripts from affecting the main application. The trade-off was the increased complexity of communicating between the `iframe` and the parent app, which required using `window.postMessage` for the bonus features.

### Authentication: JWT
* **Decision:** I implemented authentication using JSON Web Tokens (JWTs).
* **Reasoning:** JWTs are a stateless and standard way to handle authentication in modern web applications. They are easy to use with both the NestJS backend (via Passport.js) and the React frontend, allowing for secure, token-based protection of API routes.
