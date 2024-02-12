# Description

Backend implementation to automatically interpret pathology report data that arrives in the HL7/ORU format as part of the take-home task.

## Installation

```bash
npm install
```

## Running the app

1. Copy values from `.env.example` into a `.env` file
2. Note that the repository already contains the SQLite database with imported data in the `data/` folder.
3. **_(Optional)_** In case you want to start fresh, use the following commands:

```bash
# remove existing database
$ rm -rf ./data/dev.db

# generate new DB and apply migrations
$ npx prisma migrate dev

# import CSV data into the DB
$ npx ts-node ./prisma/seedFromCsv.ts
```

4. Use one of the following commands to run the backend app:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

5. The server will be accessible on [http://localhost:3000](http://localhost:3000) URL by default

## Linting

```bash
# run linter
$ npm run lint

# format files with Prettier
$ npm run format
```
