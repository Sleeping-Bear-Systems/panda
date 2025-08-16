# panda

## Running the Application

### Environment variables

The Panda application is configured through the following environment variables.

| Variables                  | Description                                            | Optional | Notes               |
| -------------------------- | ------------------------------------------------------ | -------- | ------------------- |
| PORT                       | The port the web application is exposed on.            |          |                     |
| SEQ_API_KEY                | The API key for the Seq server.                        | Yes      |                     |
| SEQ_URL                    | The listen URL for the Seq server.                     | Yes      |                     |
| POSTGRES_CONNECTION_STRING | The connection string to the Postgres database.        |          | Use the URL format. |
| JWT_SECRET                 | The encryption key for securing JSON web tokens (JWT). |          |                     |
| BCRYPT_KEY                 | The bcrypt encryption key used for password hashes.    |          |                     |

### Setting up a development database

Use following scripts to create or drop a development database. The scripts use the connection
string specified in the `POSTGRES_CONNECTION_STRING` environment variable.

#### Creating a database

These two scripts create the development database with two standard users. Use the recreate script
to force the recreation of the database if it already exists.

```sh
bun databaseCli:create
```

```sh
bun databaseCli:recreate
```

#### Dropping a database

This script drops the development database. To force the drop, use the `--force` parameter.

```sh
bun databaseCli:drop
```

### Running the application

```sh
bun dev
```

### Debugging the application

```sh
bun debug
```

## Testing

```sh
bun test
```

## Prettier

```sh
bun format
```

```sh
bun format:fix
```

## Linting

```sh
bun lint
```

```sh
bun lint:fix
```
