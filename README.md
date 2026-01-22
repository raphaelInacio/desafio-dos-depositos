# Desafio dos Depósitos

**Desafio dos Depósitos** is a gamified financial tracker that helps users save money through interactive challenges. Inspired by the popular "100 Deposits" challenge, it transforms the saving habit into a rewarding experience with social sharing, progress tracking, and premium customization options.

## 🚀 Features

### Core Features (Free)
- **Challenge Creator**: Create personalized savings challenges (Classic Mode or Fixed Mode).
- **Interactive Grid**: Visual tracker where you mark off deposits as you save.
- **Progress Tracking**: Real-time stats on your savings goals.
- **Social Sharing**: Share your milestones with friends using dynamic generated images.
- **Cloud Sync**: Your progress is safely stored in the cloud (Firebase) and accessible across devices.
- **Ad-Supported**: Free users can access all core features supported by ads.

### Premium Features (Paid - R$ 4,99 one-time)
- **Ad-Free Experience**: Remove all banners and interstitial ads.
- **Exclusive Themes**: Customize your tracker with premium themes (Dark Mode, Neon, Pastel, etc.).
- **Multiple Challenges**: Create and manage multiple active challenges simultaneously.
- **Unlimited Access**: No restrictions on challenge creation.

### Referral System
- **Invite Friends**: Share your unique referral link.
- **Earn Rewards**: Get a free challenge (or trial extension) when your friends sign up and start utilizing the app.

## 🛠 Tech Stack

**Frontend**
- **React**: UI Library
- **TypeScript**: Type safety
- **TailwindCSS**: Styling
- **Vite**: Build tool
- **Firebase SDK**: Client-side integration for Auth, Firestore, and Storage

**Backend & Services**
- **Firebase Authentication**: User identity management
- **Firebase Firestore**: NoSQL database for real-time data syncing
- **Spring Boot (Backend Service)**: Dedicated service for payment processing
- **Asaas API**: Payment gateway integration for Pix/Credit Card transactions
- **Google AdSense**: Ad monetization integration

## 📂 Project Structure

- `frontend/`: React application source code.
- `backend/`: Spring Boot application for payments.
- `tasks/`: Project Requirements Documents (PRD), Technical Specs, and task tracking.
- `.github/`: CI/CD workflows (GitHub Actions).

## 🚦 Getting Started

### Prerequisites
- Node.js (v18+)
- Java JDK 17+ (for backend)
- Maven (for backend)
- Firebase Account

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Configure environment variables (Asaas API Key, Firebase Service Account).
3. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```

## 🧪 Testing

- **Unit Tests**: Run `npm test` in the frontend directory.
- **E2E Tests**: Playwright tests are available for end-to-end verification. Run `npx playwright test`.

## 📄 Documentation

- [Product Requirements (PRD)](tasks/prd-desafio-dos-depositos/_prd.md)
- [Technical Specification](tasks/prd-desafio-dos-depositos/_techspec.md)
- [Agents Guide](Agents.md)
