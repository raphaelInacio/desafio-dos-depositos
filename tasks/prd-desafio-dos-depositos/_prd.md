# Product Requirements Document (PRD): Desafio dos Depósitos

## Overview

"Desafio dos Depósitos" is a web-based application (optimized for mobile) that digitizes the popular physical savings challenges (e.g., "100 Deposits Challenge"). It serves as a gamified financial tracker where users can define savings goals, generate a challenge grid, and mark off progress as they save money physically or in their own bank accounts. The product aims to leverage viral social feedback loops and a low-ticket "Premium" unlock model to drive growth and revenue.

## Goals

### User Goals
-   **Structure Savings**: Organized way to track progress towards a financial goal.
-   **Motivation**: Gamified experience (marking "X"s, progress bars) motivates continued saving.
-   **Documentation**: Build a "history of discipline" by keeping proofs/notes of every deposit.
-   **Social Validation**: Ability to share progress and achievements with friends.

### Business Goals
-   **Growth**: Achieve viral growth through built-in social sharing features.
-   **Revenue**: Generate revenue via a one-time "Premium" unlock payment (R$ 4,99).
-   **Engagement**: High daily/weekly retention rate as users return to update their progress.

## User Stories

| ID | As a... | I want to... | So that... |
| :--- | :--- | :--- | :--- |
| **US1** | User | Sign up and log in using my email/password | My progress is saved to the cloud and accessible across devices. |
| **US2** | User | Create a customized savings challenge (Value, Number of Deposits) | I can adapt the challenge to my realistic financial capacity. |
| **US3** | User | View a grid of numbers representing deposit amounts | I can visualize what I need to save. |
| **US4** | User | Click a number to mark it as "Saved" | I can track my progress. |
| **US5** | User | See a "Celebration" modal after marking a deposit | I feel rewarded for my effort. |
| **US6** | User | Share an image of my progress on Instagram/WhatsApp | I can show off my discipline and challenge friends. |
| **US7** | Free User | Be prompted to upgrade to Premium | I can understand the value of removing limits/customizing themes. |
| **US8** | Premium User | Customize the color theme of my tracker | It looks more personal and aesthetically pleasing. |
| **US9** | New User | Enjoy a 3-day free trial of Premium features | I can experience the full value before deciding to pay. |
| **US10** | User | Upload a photo/screenshot (receipt) for a deposit | I can prove to myself (and others) that I actually saved the money. |
| **US11** | User | View a "Gallery" of all my receipts | I can visualize my journey and feel proud of the "pile" of savings. |

## Core Features


### 1. Authentication & Cloud Sync
-   **Functionality**: Email/Password Sign Up, Login, and Password Recovery.
-   **Requirement**: Data must strictly persist in the database (Firestore/SQL) to ensure no data loss if the user clears browser cache.
-   **Session**: Persistent login session.

### 2. Challenge Creator (Engine)
-   **Inputs**:
    -   Target Amount (e.g., R$ 5,000.00).
    -   Duration/Frequency (e.g., 100 deposits).
-   **Logic**: Automatically divides the Target Amount into deposit values.
    -   *Mode A (Classic)*: Random/varied values to sum up to the total.
    -   *Mode B (Fixed)*: Equal payments (e.g., 50x R$ 100).
-   **Limitation**: Free users can only create 1 active challenge.

### 3. The Tracker (The Grid)
-   **Interface**: A responsive grid layout displaying numbers.
-   **Interaction**:
    -   Tap/Click card -> Toggles status (Pending -> Paid).
    -   "Paid" state changes visual style (e.g., turns green, checks off).
-   **Stats Header**:
    -   Total Goal (e.g., R$ 5,000).
    -   Saved So Far (e.g., R$ 1,250).
    -   Progress Bar (%).

### 4. The Savings Journal (Album)
-   **Functionality**: When marking a deposit, user can attach a photo (Receipt/Cash/Object) and a short text note (e.g., "Skipped pizza today").
-   **The Gallery**: A dedicated view showing the grid of uploaded images.
-   **Psychology**: Transforms abstract numbers into tangible memories ("The Diary of Discipline").

### 5. Viral / Social Engine
-   **Shareable Moments**:
    -   Trigger: Upon marking a deposit as paid.
    -   Action: "Share Progress" button generates a dynamic image.
    -   **Social Proof**: Option to include the uploaded receipt photo in the shared image ("Pics or it didn't happen"). 
    -   Channels: Native share sheet (WhatsApp, Instagram Stories, Download Image).
-   **Referral**: "Challenge a Friend" button with a deep link to the homepage.

### 6. Monetization (Low-Ticket Premium)
-   **Price Point**: R$ 4,99 (One-time payment).
-   **Trial Period**: New users receive a **3-day free trial** of all Premium features upon signup. After 3 days, they are downgraded to the Free Tier unless they pay.
-   **Free Tier Restrictions**:
    -   Max 1 active challenge.
    -   Standard theme only (no customization).
    -   Ads (Optional future consideration).
-   **Premium Benefits**:
    -   Unlimited active challenges.
    -   Unlock all color themes (Dark Mode, Pastel, Neon).
    -   Detailed history/analytics chart.

## User Experience

-   **Design Style**: "Premium", modern, colorful. Vibrant aesthetics that stand out on social media. Avoid generic "bootstrappy" looks. Uses high-quality fonts and smooth animations (confetti on save).
-   **Platform**: Web App (PWA capable) - accessible via browser but feels like an app.

## High-Level Technical Constraints

-   **Frontend**: React (or standard Web Stack) with focus on mobile responsiveness.
-   **Backend**: Firebase (Auth, Firestore) or standard SQL backend for user data.
-   **Payments**: Asaas or Stripe integration for the R$ 4,99 payment processing (One-off).
-   **Image Gen**: Client-side canvas generation (e.g., `html2canvas`) for sharing images to lower server costs.

## Non-Goals (Out of Scope)

-   **Banking**: The app WILL NOT hold money or generate Pix codes for saving. It is a manual tracker.
-   **Automatic Sync**: No Open Finance integration to detect bank transactions.
-   **Native Mobile Apps**: Initial release is Web-only (PWA).

## Phased Rollout Plan

### MVP (Launch)
-   Auth.
-   Single Challenge creation (Customizable).
-   Manual Tracker Grid.
-   Basic Social Share (Static image).
-   Payment Gateway integration for R$ 4,99 upgrade.

### Phase 2 (Enhancement)
-   Multiple Challenge Types (e.g., "52 Weeks Challenge").
-   Advanced Analytics.
-   Leaderboards (if community features are added).

## Success Metrics

-   **Conversion Rate**: % of Free users upgrading to Premium (Target > 2%).
-   **Viral Coefficient**: Average number of new users referred by each active user (Target > 1.1).
-   **Retention**: % of users returning to mark a deposit within 7 days.

## Risks and Mitigations

-   **Risk**: Users abandoning the app because it's "manual work".
    *   *Mitigation*: Heavy push on gamification (confetti, sounds, satisfying UI interactions) to make the manual action feel rewarding.
    *   *Mitigation*: The "Savings Journal/Album" transforms the manual "chore" into a valuable "collection" habit. The effort of uploading the photo creates a sense of ownership and history ("I built this").
-   **Risk**: Low perceived value for R$ 4,99.
    -   *Mitigation*: Ensure the visual quality is extremely high ("Premium feel") and the "Unlimited" promise is clear.
