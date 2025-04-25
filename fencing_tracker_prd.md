# Fencing Tracker App - Product Requirements Document

## Project Overview
The Fencing Tracker App is a web application designed for parents of youth fencers to track their children's performance at tournaments. The app allows users to log and analyze pool results, track tournament history, and manage data for multiple child fencers.

## Tech Stack
- **Backend**: Python (Flask/Django)
- **Frontend**: React
- **Authentication**: Google OAuth
- **Database**: MySQL
- **Deployment**: TBD (AWS/Heroku/Vercel)

## Core Features

### 1. User Authentication & Management
- Google OAuth integration for user login/registration
- User profile management
- Support for multiple child fencer profiles under one parent account
- Role-based access (parents, fencers)

### 2. Fencer Profile Management
- Create and manage profiles for multiple child fencers
- Store basic information (name, age, club, weapon specialization, etc.)
- Track ratings/classifications and point standings
- Upload profile pictures

### 3. Tournament Tracking
- Add new tournaments with details (name, date, location, level)
- Record tournament results
- View tournament history
- Filter tournaments by date range, location, weapon, etc.

### 4. Pool Result Tracking
- Record pool bout results (victory/defeat, score)
- Calculate pool statistics (win percentage, indicator, touches scored/received)
- View pool performance over time
- Compare performance across tournaments

### 5. Analytics & Insights
- Visual representation of performance trends
- Statistics on win/loss ratios
- Identify strengths and weaknesses
- Compare performance against personal bests

### 6. Data Export
- Export tournament results as PDF or CSV
- Share results via email or social media

## User Flows

1. **User Registration/Login**
   - Register with Google OAuth
   - Set up parent profile
   - Add child fencer profile(s)

2. **Tournament Entry**
   - Create new tournament entry
   - Enter pool results
   - View calculated statistics

3. **Historical Analysis**
   - View past tournament results
   - Analyze performance trends
   - Compare results across tournaments

## Non-Functional Requirements

### Performance
- Fast loading times for data-heavy pages
- Responsive design for mobile and desktop use

### Security
- Secure user authentication
- Data privacy measures for youth fencers' information
- Compliance with relevant data protection regulations

### Usability
- Intuitive interface for quick data entry during tournaments
- Clear visualization of statistics and results
- Mobile-friendly design for on-the-go use during competitions

## Future Enhancements (v2)
- Direct integration with official tournament results (if APIs available)
- Video storage for bout analysis
- Opponent tracking and analysis
- Training log integration

## Questions to Consider
- Should we implement offline functionality for use in venues with poor connectivity?
- Do we need to support different rule sets for different age categories or competition levels?
- Should we include features for tracking direct elimination rounds in addition to pools?
- Do we need to support different weapons (foil, epee, saber) with weapon-specific metrics?

## Database Schema (MySQL)

### Users Table
- user_id (PK)
- email
- name
- google_id
- created_at
- updated_at

### Fencers Table
- fencer_id (PK)
- user_id (FK) - parent's user ID
- name
- date_of_birth
- gender
- club
- primary_weapon
- secondary_weapon (optional)
- rating
- profile_image_url
- created_at
- updated_at

### Tournaments Table
- tournament_id (PK)
- name
- location
- start_date
- end_date
- level (local, regional, national, international)
- created_at
- updated_at

### Tournament_Entries Table
- entry_id (PK)
- tournament_id (FK)
- fencer_id (FK)
- weapon
- age_category
- initial_seeding
- final_placing
- notes
- created_at
- updated_at

### Pool_Groups Table
- pool_group_id (PK)
- entry_id (FK)
- pool_number
- number_of_fencers
- created_at
- updated_at

### Pool_Bouts Table
- bout_id (PK)
- pool_group_id (FK)
- entry_id (FK) - the fencer's entry
- opponent_name
- score_for
- score_against
- victory (boolean)
- notes
- created_at
- updated_at

### Direct_Elimination_Bouts Table
- de_bout_id (PK)
- entry_id (FK)
- round (e.g., 64, 32, 16, 8, 4, 2, 1)
- opponent_name
- score_for
- score_against
- victory (boolean)
- notes
- created_at
- updated_at

## API Endpoints

### Authentication
- `POST /api/auth/google` - Google OAuth login/registration
- `GET /api/auth/logout` - Logout
- `GET /api/auth/user` - Get current user info

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile

### Fencers
- `GET /api/fencers` - List all fencers for current user
- `POST /api/fencers` - Create a new fencer
- `GET /api/fencers/:id` - Get fencer details
- `PUT /api/fencers/:id` - Update fencer details
- `DELETE /api/fencers/:id` - Delete a fencer

### Tournaments
- `GET /api/tournaments` - List all tournaments
- `POST /api/tournaments` - Create a new tournament
- `GET /api/tournaments/:id` - Get tournament details
- `PUT /api/tournaments/:id` - Update tournament details
- `DELETE /api/tournaments/:id` - Delete a tournament

### Tournament Entries
- `GET /api/fencers/:id/entries` - Get all tournament entries for a fencer
- `POST /api/tournaments/:id/entries` - Create a new tournament entry
- `GET /api/entries/:id` - Get entry details
- `PUT /api/entries/:id` - Update entry details
- `DELETE /api/entries/:id` - Delete an entry

### Pool Results
- `GET /api/entries/:id/pools` - Get all pool groups for an entry
- `POST /api/entries/:id/pools` - Create a new pool group
- `GET /api/pools/:id` - Get pool group details
- `PUT /api/pools/:id` - Update pool group details
- `DELETE /api/pools/:id` - Delete a pool group
- `GET /api/pools/:id/bouts` - Get all bouts in a pool
- `POST /api/pools/:id/bouts` - Add a bout to a pool
- `PUT /api/bouts/:id` - Update bout details
- `DELETE /api/bouts/:id` - Delete a bout

### Direct Elimination Results
- `GET /api/entries/:id/de-bouts` - Get all DE bouts for an entry
- `POST /api/entries/:id/de-bouts` - Add a DE bout
- `PUT /api/de-bouts/:id` - Update DE bout details
- `DELETE /api/de-bouts/:id` - Delete a DE bout

### Analytics
- `GET /api/fencers/:id/stats` - Get overall statistics for a fencer
- `GET /api/fencers/:id/performance` - Get performance trends over time
- `GET /api/entries/:id/summary` - Get summary of results for a tournament entry

## Frontend Architecture

### Technology Stack
- React for UI components
- Redux or Context API for state management
- React Router for navigation
- Material UI or Tailwind CSS for UI components
- Chart.js or D3.js for data visualization
- Formik or React Hook Form for form handling
- Axios for API communication

### Key Pages & Components

#### Authentication
- Login/Registration Page
- OAuth integration component

#### Dashboard
- Parent dashboard with fencer cards
- Quick access to recent tournaments
- Performance summary charts
- Upcoming tournament reminders

#### Fencer Management
- Fencer list view
- Fencer detail page
- Fencer edit form
- Profile image upload

#### Tournament Management
- Tournament list with filters
- Tournament detail page
- Tournament entry form
- Results summary view

#### Pool Management
- Pool creation interface
- Quick-entry bout form (optimized for mobile use during tournaments)
- Pool statistics calculator
- Pool comparison view

#### Direct Elimination Tracking
- DE bracket visualization
- DE bout entry form
- DE results summary

#### Analytics
- Performance trend charts
- Win/loss ratio visualizations
- Weapon-specific statistics
- Tournament comparison tools

### Mobile Considerations
- Responsive design for all components
- Touch-friendly interface for data entry
- Offline data storage for tournament venues with poor connectivity
- Simplified views for quick data entry during active tournaments