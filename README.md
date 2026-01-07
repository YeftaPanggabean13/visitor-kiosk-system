## Visitor Kiosk System

Visitor Kiosk System is a full-stack web application built to manage visitor check-ins in a professional and auditable way. The system is designed for use at a front desk or kiosk, with separate dashboards for administrators and security staff.

This project was built as a technical assessment to demonstrate real-world full-stack development, system design decisions, and production-oriented thinking.

## What I Built and Why

- Backend: Laravel API for rapid development, built-in auth, queues, mail, and storage. Chosen for developer productivity and ecosystem.
- Frontend: React + Vite for a fast, modular kiosk UI and easy integration with client-side libraries (e.g., face handling).
- Core models a. Visitor, b. Host, c. Visit; to keep data normalized and auditable.

## Challenges & Solutions
- Handling photo uploads reliably:Visitor photos are critical for identification, but file handling can easily become inconsistent.
Solution:
I centralized photo validation and storage using Laravel Storage and ensured consistent file paths and size limits. Photos are linked to visits for auditability.

- Authentication flow across refreshes: After a page refresh, the app initially lost authentication state.
Solution:
I persisted auth data in localStorage and restored it inside a global AuthContext so protected routes remain accessible after reloads.

- Keeping the frontend responsive while using heavier client-side features: Some planned features (such as camera access and future face recognition) can increase bundle size.
Solution:
I structured the frontend so that heavy features can be lazy-loaded only when needed, keeping the initial kiosk load fast.

- Blocking check-in flow due to notifications: Initially, host notification emails were sent synchronously after a visitor checked in. When the mail service responded slowly, the kiosk screen would freeze for a moment, creating a poor user experience.
Solution:
I identified notifications as a blocking operation and designed the system so they can be moved into queued jobs. This allows the API to return immediately while notifications are processed asynchronously.

## What I Learned
- Asynchronous processing (queues) is critical for maintaining a smooth user experience.
- Clean API responses and explicit data mapping make frontend integration much simpler.
- Structuring authentication and protected routes early prevents large refactors later.
- Building with realistic constraints leads to better architectural decisions than focusing only on features.

## What I'd Do Differently / Future Work
- Add end-to-end tests for the full kiosk flow, including camera capture and checkout.
- Implement real-time dashboard updates using WebSockets instead of polling.
- Improve audit logging for admin and security actions.
- Add role-based permissions at a more granular level.
- Add CI tooling for linting, tests, and automated checks.

## Resources and References
- Laravel official documentation
- React and Vite documentation
- Articles and examples on Laravel queues and file storage

## Tech Stack
- Laravel 12
- Laravel Sanctum
- MySQL
- React
- Vite
- Axios

## Quick Start (local)
- Start Backend 
$ cd backend
$ copy .env.example make to .env
$ composer install
$ php artisan key:generate
$ php artisan migrate
$ php artisan serve

- Start Frontend
$ cd frontend
$ npm install
$ npm run dev

