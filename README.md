# express-taskscape (ITI Graduation Project)
Taskscape is a backend application built with Express.js that facilitates organization management, project creation, and task tracking. 
It provides an admin dashboard for organization owners to create and manage their teams, projects, and tasks.

Admin dashboard: https://taskscape-admin.vercel.app/
frontend application: https://taskscape.vercel.app/

## Features

- Organization creation and management
- User registration by admin and authentication
- Project creation and assignment of organization members to projects
- Create sprints inside project to organize team work
- Task tracking within projects, including start date, deadline, and status
- Email notifications for newly created member accounts

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/taskscape-backend.git

2. Install dependencies:
    cd express-taskscape
    npm install

3. Set up your environment variables
4. Start the application:
    - npm i nodemon
    - npm run start:dev
  
## Usage
1. Access taskcape app to create your organization and register admin account ( https://taskscape.vercel.app/ ).

2. Access admin dashboard to create organization members & scrum masters ( https://taskscape-admin.vercel.app/ ). 

3. Create projects within the admin dashboard and assign one scrum master & organization members to these projects.

4. Newly registered employees will receive an email with their username and password.

5. Members and scrum masters can log in to the application and view their projects, sprints, and tasks with status.

6. Scrum master can create sprints and assign tasks to project's members

7. Member can see it's tasks and change status, and scrum master will recieve notifications about that

## API Documentation
  https://documenter.getpostman.com/view/19178013/2s9YRB3XUs
