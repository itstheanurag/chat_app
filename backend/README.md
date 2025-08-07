# Chat App Backend

This project is a microservices-based chat application backend, consisting of three main services: User, Chat, and Mail. Each service is designed to handle specific functionalities and can be deployed independently. The application also utilizes MongoDB for data storage and Redis for caching.

## Services Overview

### User Microservice
- **Path**: `user/`
- **Description**: Manages user authentication, registration, and profile management.
- **Entry Point**: `user/src/index.ts`

### Chat Microservice
- **Path**: `chat/`
- **Description**: Handles real-time chat functionalities, including message sending and receiving.
- **Entry Point**: `chat/src/index.ts`

### Mail Microservice
- **Path**: `mail/`
- **Description**: Manages email notifications and communications.
- **Entry Point**: `mail/src/index.ts`

## Technologies Used
- **Node.js**: JavaScript runtime for building the services.
- **Express**: Web framework for Node.js to handle HTTP requests.
- **MongoDB**: NoSQL database for data storage.
- **Redis**: In-memory data structure store for caching.
- **TypeScript**: Superset of JavaScript for type safety.

## Getting Started

### Prerequisites
- Docker
- Docker Compose

### Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   cd chat_app-backend
   ```

2. Build and start the services using Docker Compose:
   ```
   docker-compose up --build
   ```

3. Access the services:
   - User Service: `http://localhost:3000`
   - Chat Service: `http://localhost:3001`
   - Mail Service: `http://localhost:3002`

### Stopping the Services
To stop the services, run:
```
docker-compose down
```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License.