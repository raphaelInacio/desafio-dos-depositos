# Agents Guide

This document is intended for AI Agents (and human developers) to understand the architectural rules, coding standards, and workflows used in the "Desafio dos Depósitos" project.

## 🧠 Architecture Overview

The project follows a **Serverless-First** approach for the frontend, leveraging Firebase directly for most CRUD operations.

### Payment Strategy (MVP)
Payments are handled **externally via Hotmart** (infoproduct platform). A simple **Firebase Cloud Function** receives Hotmart webhooks and updates user premium status. This approach minimizes backend complexity while enabling quick market validation.

### Key Principles
1.  **Frontend-First Data**: The React app talks directly to Firestore. Do not create backend endpoints for simple CRUD.
2.  **Strict Typing**: All TypeScript code must be strictly typed. Avoid `any`.
3.  **Component Modularity**: UI components should be small, focused, and reusable. Use `shadcn/ui` patterns.
4.  **Bypass PowerShell**: Always use `cmd /c` when running shell commands on Windows to avoid execution policy issues.

## 📂 Directory Structure

```
/
├── frontend/               # Main React Application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # Firebase & API service layers
│   │   └── pages/          # Route components
│   └── ...
├── functions/              # Firebase Cloud Functions (Hotmart webhook)
│   ├── src/index.ts        # Webhook handler
│   └── ...
├── backend/                # Spring Boot (legacy/optional)
│   └── ...
├── tasks/                  # Task Management
│   ├── prd-desafio-dos-depositos/
│   │   ├── _prd.md         # Product Requirements
│   │   ├── _techspec.md    # Technical Specification
│   │   ├── _tasks.md       # Master Task List
│   │   └── completed/      # Archived task files
│   └── ...
└── ...
```

## 🤖 Workflows

### Creating New Tasks
1.  Read `_prd.md` and `_techspec.md` to understand the context.
2.  Create a new `N_task.md` file in `tasks/prd-desafio-dos-depositos/`.
3.  Define the implementation plan.
4.  Update `_tasks.md` to include the new task.

### Code Review
- Use the `code-reviewer` persona guidelines.
- Verify against `_prd.md` requirements.
- Ensure strict adherence to linting rules.

## 📝 Rules & Memories

- **Language**: Portuguese (Brazil) is the default language for communication.
- **PowerShell**: Always bypass with `cmd /c`.
- **Styling**: TailwindCSS is the standard. Design should be "Premium" and "Vibrant".

## 🔄 Common Commands

- **Frontend Dev**: `npm run dev` (in `/frontend`)
- **Backend Run**: `mvn spring-boot:run` (in `/backend`)
- **Test**: `npx playwright test` (in root or frontend)
