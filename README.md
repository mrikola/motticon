# MottiCon tournament software

## Requirements

- Docker
- node
- yarn

## Running locally

1. Create a `backend/.env` file based on the adjacent `.env.template` file, or ask for a copy
2. `yarn dev` which sets up the Docker Compose stack
3. Once the stack is up, `yarn db:fixtures` to initialize the database with some test data
4. Create a user for yourself, and give it admin rights through a SQL update
5. If you update dependencies, `yarn reset` to rebuild the stack with the new ones
