# Todo REST API

A small dependency-light HTTP API for learning REST concepts.

## Endpoints

- `GET /todos` — return the current todo list.
- `POST /todos` — create a todo with a JSON body such as `{ "title": "Write tests" }`.

## Development roadmap

- Add automated API tests.
- Add `PATCH` and `DELETE` endpoints.
- Validate request content types.
- Add structured error responses.
- Add persistence.
- Add CI checks.

The current implementation stores data in memory, so restarting the process clears the list.
