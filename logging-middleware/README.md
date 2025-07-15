# Logging Middleware

A reusable logging function for frontend applications. Sends logs to the evaluation-service/logs endpoint as required by the test server.

## Usage

1. Import the log function:

```js
import { log } from '../logging-middleware';
```

2. Call the log function:

```js
await log('frontend', 'info', 'component', 'Short URL created', token);
```

- `stack`: 'frontend' or 'backend'
- `level`: 'debug', 'info', 'warn', 'error', 'fatal'
- `package`: 'api', 'component', 'hook', 'page', 'state', 'style', 'auth', 'config', 'middleware', 'utils'
- `message`: Descriptive string
- `token`: Bearer token for authentication (required)

## Example

```js
await log('frontend', 'error', 'api', 'Failed to fetch short URL', token);
```

## Notes
- Do not use console.log. Use this function for all logging.
- If the log API fails, the function will not throw, but will return an error object. 