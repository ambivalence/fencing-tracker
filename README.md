# Fencing Tracker App

A web application for parents of youth fencers to track tournament results and performance.

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