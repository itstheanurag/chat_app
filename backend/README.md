# Chat App Backend

This project is the backend for a chat application, built with Node.js, Express, TypeScript, MongoDB, and Redis.

## Overview

- **Entry Point**: `src/index.ts`
- **Description**: Handles user authentication, chat messaging, and email notifications in a single service.

## Technologies Used

- **Node.js**: JavaScript runtime for building the backend.
- **Express**: Web framework for handling HTTP requests.
- **MongoDB**: NoSQL database for data storage.
- **Redis**: In-memory data structure store for caching and session management.
- **TypeScript**: Superset of JavaScript for type safety.

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Setup Instructions

1. Clone the repository:

   ```sh
   git clone <repository-url>
   cd chat_app/backend
   ```

2. Build and start the service using Docker Compose:

   ```sh
   docker-compose up --build
   ```

3. Access the backend service at:  
   `http://localhost:3000`

### Stopping the Service

To stop the service, run:

```sh
docker compose down
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
