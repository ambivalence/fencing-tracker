# Fencing Tracker App

A web application for parents of youth fencers to track tournament results and performance.

## Live Demo

The application is deployed and publicly accessible at:

**[https://ambivalence.github.io/fencing-tracker/](https://ambivalence.github.io/fencing-tracker/)**

## Features

- Track multiple child fencers
- Record tournament results including pool bouts and direct elimination
- View performance analytics and trends
- Mobile-friendly design for use during tournaments

## Tech Stack

- Frontend: React with Material UI
- State Management: React Context API
- Data Storage: Browser Local Storage (V1)
- Authentication: Simple login (V1)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/fencing-tracker.git
cd fencing-tracker/app
```

2. Install dependencies
```
npm install
```

3. Start the development server
```
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Log in (any email/password will work in the demo)
2. Add your fencers
3. Add tournaments and record results
4. View analytics to track performance over time

## Deployment

The application is deployed using GitHub Pages:

### How to Deploy

1. Make sure your changes are committed to the repository
2. Navigate to the app directory:
   ```
   cd app
   ```
3. Run the deploy command:
   ```
   npm run deploy
   ```
4. The app will be built and deployed to the `gh-pages` branch
5. Your changes will be live at [https://ambivalence.github.io/fencing-tracker/](https://ambivalence.github.io/fencing-tracker/)

### First-time Setup (Already Completed)

If you're setting up a new project for GitHub Pages deployment:

1. Install the gh-pages package:
   ```
   npm install --save-dev gh-pages
   ```
2. Add homepage to package.json:
   ```json
   "homepage": "https://yourusername.github.io/repo-name"
   ```
3. Add deploy scripts to package.json:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build",
     ...
   }
   ```
4. For React Router, use HashRouter instead of BrowserRouter for compatibility with GitHub Pages

## Project Structure

```
app/
├── public/              # Static files
├── src/
│   ├── components/      # Reusable UI components
│   ├── context/         # React Context for state management
│   ├── pages/           # Page components
│   ├── utils/           # Helper functions
│   ├── App.js           # Main application component
│   └── index.js         # Application entry point
└── package.json         # Project dependencies and scripts
```

## Future Enhancements (Planned for V2)

- Backend API with database storage
- User authentication with Google OAuth
- Offline support for tournament venues with poor connectivity
- Direct elimination bracket visualization
- Export results as PDF or CSV
- Integration with official tournament results (if APIs available)

## License

This project is licensed under the MIT License - see the LICENSE file for details.