# panda

## Running the Application

| Variables                  | Description                                            | Optional |
| -------------------------- | ------------------------------------------------------ | -------- |
| PORT                       | The port the web application is exposed on.            |          |
| SEQ_API_KEY                | The API key for the Seq server.                        | Yes      |
| SEQ_URL                    | The listen URL for the Seq server.                     | Yes      |
| POSTGRES_CONNECTION_STRING | The connection string to the Postgres database.        |          |
| JWT_SECRET                 | The encryption key for securing JSON web tokens (JWT). |          |
| BCRYPT_KEY                 | The bcrypt encryption key used for password hashes.    |          |

```sh
bun dev
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
