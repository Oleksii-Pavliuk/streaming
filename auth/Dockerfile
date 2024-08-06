FROM node:22.2.0-bullseye-slim

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Set the command to run the compiled JavaScript code
CMD [ "npm","start" ]

