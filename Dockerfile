FROM node:22-bookworm-slim

ARG SERVICE

WORKDIR /app

COPY . .

RUN npm install

WORKDIR /app/${SERVICE}

RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi \
  && npm run build \
  && npm prune --omit=dev \
  && cd /app \
  && npm prune --omit=dev

CMD ["npm", "start"]
