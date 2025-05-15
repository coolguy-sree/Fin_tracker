# Finance Tracker

This is a personal finance tracking web application built with React and TypeScript. It allows users to manage their budgets, expenses, and income categories. The app supports multiple users with individual data saved separately.

## Features

- User login with username (no password for simplicity).
- Each user has their own saved data (transactions, budgets, categories) stored in localStorage.
- Data is reset to zero for new users.
- Manage transactions (add, update, delete).
- Manage budgets and categories.
- Dashboard, Expenses, Budgets, Reports, and Settings pages.
- Responsive and clean UI with Tailwind CSS.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd project
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to [http://localhost:5174](http://localhost:5174).

## Usage

- On first load, you will be prompted to enter a username to log in.
- Each username has its own saved data.
- You can add, update, and delete transactions, budgets, and categories.
- Switch users by logging out (feature to be added) or by clearing localStorage.

## Project Structure

- `src/context/` - React context providers for user and expense data.
- `src/components/` - Reusable UI components including Login.
- `src/pages/` - Main pages of the app.
- `src/App.tsx` - Main app component with routing and context providers.

## Future Improvements

- Add user logout and user switching functionality.
- Add password authentication or integrate with real auth providers.
- Improve UI/UX and add more detailed reports.
- Persist data on a backend server or cloud storage.

## License

This project is open source and available under the MIT License.
