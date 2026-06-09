# eCommerce Microservices

Docker Compose runs the project services together with MongoDB and RabbitMQ.

## Services

| Service | Port | Description |
| --- | --- | --- |
| `user` | `3000` | User API |
| `product` | `3001` | Product API |
| `order` | `3002` | Order API |
| `cart` | `3003` | Cart API |
| `mongo` | `27017` | MongoDB database |
| `rabbitmq` | `5672`, `15672` | RabbitMQ broker and management UI |

## Environment Files

Create the service environment files before starting the stack:

- `user/.env`
- `product/.env`
- `order/.env`
- `cart/.env`

The Docker Compose file also provides container defaults such as `PORT`, `MONGO_URI`, `RABBITMQ_URL`, and service-to-service URLs.

## Start the Project

Build the images and start all services:

```sh
docker compose up --build
```

Start the stack in the background:

```sh
docker compose up -d --build
```

Start a single service and its dependencies:

```sh
docker compose up -d product
```

Check running containers:

```sh
docker compose ps
```

## Stop the Project

Stop running containers without removing them:

```sh
docker compose stop
```

Stop and remove containers and the default network:

```sh
docker compose down
```

Stop and remove containers, networks, and the MongoDB volume:

```sh
docker compose down -v
```

Use `down -v` only when you want to remove persisted local MongoDB data.

## Logs and Debugging

Follow logs for every service:

```sh
docker compose logs -f
```

Follow logs for one service:

```sh
docker compose logs -f user
```

Show the last 100 log lines for a service:

```sh
docker compose logs --tail=100 product
```

Check service health and status:

```sh
docker compose ps
```

Open a shell inside a running service container:

```sh
docker compose exec user sh
```

Restart a service after configuration changes:

```sh
docker compose restart order
```

Rebuild one service when dependencies or Docker build output look stale:

```sh
docker compose build --no-cache product
docker compose up -d product
```

## Cleanup Commands

Remove stopped containers and the project network:

```sh
docker compose down
```

Remove containers, the project network, and named volumes:

```sh
docker compose down -v
```

Remove images built by this Compose project:

```sh
docker compose down --rmi local
```

Remove containers, local images, and volumes for a clean rebuild:

```sh
docker compose down --rmi local -v
docker compose up -d --build
```

Remove unused Docker images, containers, networks, and build cache:

```sh
docker system prune
```

Remove unused Docker images, containers, networks, build cache, and volumes:

```sh
docker system prune -a --volumes
```

`docker system prune -a --volumes` can remove Docker resources from other projects on the same machine. Run it only when you intentionally want a broader Docker cleanup.
