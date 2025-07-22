# dashboard-buddy

An AI dashboard companion to boost your productivity

## TODO

### Must haves
- Allow updating and deleting calendar events
    - Add API endpoints for update and delete event
    - Create endpoint to summarize calendar event data
    - Adjust UI interface to allow for updating, deleting, and summary

- Create user authentication and user sessions
    - Create table to store user data
    - Create CRUD endpoints to manage user data
    - Create login page and supporting UI interface
    - Create login and embed session tokens with user data

- Create notes section
    - Create table to store note data
    - Create CRUD endpoints to manage note data
        - Create endpoint to summarize note data with AI
    - Create UI interface to manage notes

- Add more robust logging

### Nice to have
- Add prettier to normalize style patterns
- Update eslint
    - Force semi-colons after statements
    - Force consistent spacing (i.e. double-space vs. tab)
    - Force consistent spacing around brackets
- Allow importing events from popular calendar applications with OAuth (ex. Google Calendar)
