# TALENTFLOW - A Modern Hiring Platform Simulation 🚀

Welcome to TALENTFLOW! This project is a deep dive into building a modern, feature-rich hiring platform from the ground up. It's designed to feel like a real-world application an HR team would use daily, but with a twist: it runs entirely in your browser without a real backend.

This entire application is a testament to the power of modern frontend tooling, using a mock API layer to handle data and local browser storage to persist it, creating a seamless and complete user experience.

**Live Deployed Link:** [Your Deployed App URL Here]

## What Can It Do? (Features)

TALENTFLOW is split into three core workflows for a hiring team:

* 📝 **Dynamic Job Management:** Go beyond a static list. HR users can create, edit, and archive job postings on the fly through an intuitive modal form. The entire jobs board is interactive, featuring server-like pagination, filtering, and slick drag-and-drop reordering with optimistic updates and error rollback.

* 👥 **Interactive Candidate Pipeline:** Manage candidates visually with a drag-and-drop Kanban board that moves them through hiring stages (`Applied`, `Screen`, `Tech`, etc.). Dive into any candidate's profile to see a detailed (simulated) timeline of their progress and add notes with @mention support.

* ✅ **Custom Assessment Builder:** The most powerful feature! For any job, an HR user can build a custom assessment form. It includes a live preview panel and supports a wide range of question types (text, multiple-choice, numeric, etc.), validation rules, and even conditional logic (e.g., "only show question #3 if question #1 is answered 'Yes'").


## How It Works: A Look Under the Hood

The project is structured to separate concerns, making it scalable and easy to understand. Here's a brief tour of the key files and their roles:

#### `src/api/` - The "Brain" of the Mock Backend

This folder contains the magic that makes our app work without a server.

* `db.js`: Our local database. Using **Dexie.js**, this file defines the database schema (tables for jobs, candidates, etc.) and handles seeding the initial data with **Faker.js**.
* `handlers.js`: This is the heart of our mock REST API. Using **MSW (Mock Service Worker)**, this file intercepts all `fetch` requests from the app. It contains the logic for handling every endpoint (like `GET /jobs` or `POST /candidates/:id/notes`), retrieving or saving data in our Dexie database, and simulating real-world API behavior like latency and random errors.
* `browser.js`: The entry point that starts the MSW service worker in the browser.

#### `src/pages/` - The Main Views of the Application

These components represent the primary "pages" a user can visit.

* `JobsBoard.jsx`: The main hub for managing jobs. This component is responsible for fetching and displaying the paginated list of jobs, handling the state for all filters, managing the create/edit modal, and containing the core drag-and-drop logic for reordering.
* `CandidatesPage.jsx`: Renders the interactive Kanban board. It fetches all candidates, groups them by their hiring stage, and implements the `dnd-kit` logic to handle moving candidate cards between columns.
* `AssessmentBuilderPage.jsx`: The most complex view. This is the two-panel layout for creating assessments. It holds the entire assessment structure in its state, allowing for real-time updates as the HR user adds sections, questions, and conditional rules.
* `AssessmentFormPage.jsx`: The candidate-facing version of an assessment. It dynamically renders a form based on the structure created in the builder, manages the candidate's answers, and performs real-time validation before submission.
* `JobDetailPage.jsx` & `CandidateProfilePage.jsx`: These are the "detail" views that appear when you click on a specific job or candidate, respectively. They use URL parameters to fetch and display data for a single item.

#### `src/features/` - Feature-Specific Components

These are the building blocks for our main pages, grouped by feature.

* `jobs/components/JobCard.jsx`: The individual card for a single job posting on the Jobs Board. It's a "sortable" component for `dnd-kit`.
* `jobs/components/JobForm.jsx`: The reusable form used inside the modal for both creating and editing a job.
* `candidates/components/CandidateCard.jsx`: The card representing a single candidate on the Kanban board. It's a "draggable" component.
* `candidates/components/StageColumn.jsx`: Represents a single column (e.g., "Applied") on the Kanban board. It's a "droppable" area.
* `assessments/components/QuestionEditor.jsx`: A detailed component used in the builder that shows all the editing fields for a single question (e.g., setting the label, type, options, and conditional logic).
* `assessments/components/FormPreview.jsx`: The component for the right-hand panel in the builder, which renders a live, non-interactive preview of the form as it's being built.

#### `src/components/common/` - Truly Reusable UI

These are generic components that could be used anywhere in the application.

* `Modal.jsx`: A flexible modal component that can display any content passed to it.
* `Pagination.jsx`: The simple "Previous" and "Next" page controls used on the Jobs Board.

## Running Locally

To get a local copy up and running, follow these simple steps.

1.  **Clone the repository:**
    ```bash
    git clone [Your GitHub Repository URL Here]
    ```
2.  **Navigate into the directory:**
    ```bash
    cd talentflow-app
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Start the server:**
    ```bash
    npm run dev
    ```

## Known Issues

* **Drag-and-Drop Reordering:** The drag-and-drop feature for the Jobs Board is fully implemented with optimistic updates and rollback on failure. However, during development, a persistent local caching issue with the mock service worker was identified. This can sometimes cause the API to simulate a failure, triggering the "rollback" mechanism. The feature's code is correct, but this demonstrates the robustness of the rollback implementation.