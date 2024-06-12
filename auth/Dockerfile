FROM node:22.2.0-bullseye-slim

WORKDIR /app

COPY package*.json /app

RUN npm install

COPY . /app

# Compile TypeScript to JavaScript
RUN npm run build

# Set the command to run the compiled JavaScript code
CMD [ "node","--require","./dist/opentelemetry-tracing.js","dist/index.js" ]

