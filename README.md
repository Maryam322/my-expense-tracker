# Expense Tracker

A comprehensive web application to help you manage your personal finances with ease. Track your income and expenses, set budgets, and manage recurring bills all in one place.

## Features

- **Dashboard Overview**: View your total balance, income, and expenses at a glance.
- **Visual Charts**: Interactive doughnut charts powered by Chart.js to visualize your income and expense distribution.
- **Transaction Management**: 
  - Add, edit, and delete income and expense transactions.
  - Categorize transactions for better organization.
- **Budgeting**: 
  - Set budgets for different categories (Food, Rent, Utilities, etc.).
  - Visual progress bars to track spending against your limits.
  - Warning indicators when budget limits are approached or exceeded.
- **Recurring Bills**: 
  - Track recurring bills with due dates.
  - "Pay" bills to automatically add them as expenses.
- **Data Persistence**: All data is saved to your browser's LocalStorage, so your data remains available even after refreshing the page.

## Technologies Used

- **HTML5**: Semantic structure of the application.
- **CSS3**: Custom styling with variables for easy theme management and responsive design.
- **JavaScript (Vanilla)**: Core logic for state management, DOM manipulation, and data persistence.
- **Chart.js**: For rendering income and expense charts.
- **FontAwesome**: For icons.
- **Google Fonts**: Uses the 'Outfit' font family.

## Getting Started

To run this project locally:

1. Clone or download the repository.
2. Open `index.html` in your web browser.

No build step or server is required as this is a static web application.

## Usage

1. **Add Transaction**: Use the form at the center to add new Income or Expense items.
2. **Set Budget**: Click the "+" icon in the "Budget Overview" card to set a spending limit for a category.
3. **Add Bill**: Click the "+" icon in the "Recurring Bills" card to add a bill.
4. **Manage**: Click the edit or delete icons next to transactions to modify them.

## Deployment

This project is ready for deployment on static hosting services like:
- [Netlify](https://www.netlify.com/)
- [GitHub Pages](https://pages.github.com/)
- [Vercel](https://vercel.com/)

Simply upload the files or connect your GitHub repository to deploy.
