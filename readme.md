
## Route Management and Authentication
- Access is restricted to `/login` and `/register` routes for unauthenticated users.
- Authenticated users are automatically redirected to `/projects`, even when trying to access `/login` or `/register`.
- Authentication token is stored in cookies on login, and removed on logout.
- Direct access to protected routes (projects and tasks) via URL is denied and redirected if not authenticated.

---

## User Registration
- No email confirmation is required (as per mockup).
- Username must be unique. Password must be confirmed (entered twice).
- Passwords are hashed and securely stored in the database.
- After registration, users are redirected to the login page. After login, users are redirected to the project list page.

---

## Project List
- Displays both:
  - Projects created by the user
  - **Projects the user is involved in as a participant**

---

## Creating a New Project
- Only the **title** is required; the **description** is optional (as per mockup).
- A unique alphanumeric code is generated automatically.
- The project owner is automatically set based on the authenticated user.
- No users (not even the creator) are considered "involved" in the project upon creation. Involvement happens later via project editing.

---

## Editing a Project
- Editable fields:
  - Title
  - Description
  - Involved users
- User search via search input (displays all registered users).
- **Only the project creator can edit the project.**
- The role of each user (owner/participant) is displayed.
- Projects can be deleted with confirmation. UI updates in real time. Related tasks are deleted automatically via Prisma's cascade delete.

---

## Joining an Existing Project
- Users can join a project using its unique code.
- Even project owners can manually "join" their own projects.
- Participants have full task management rights (create, edit, assign, delete, change status).

---

## Task Management
- Tasks can be created even if no users are currently involved in the project.
- Only the **title** is required.
  - Default values: `status = TODO`, `assignee = none`
- All fields are editable:
  - Title
  - Description
  - Assignee
  - Status
- **Tasks can only be assigned to users involved in the project.**
- Tasks can be deleted with confirmation. UI updates in real time.
- Participants can edit all task fields, including assignment.

