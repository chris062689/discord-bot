# Bootstrap dependencies.
FROM node:alpine
WORKDIR /usr/src/app

COPY . .

# Create runtime user.
RUN yarn install && \
    addgroup -S app -g 30000 && \
    adduser -S -g app -u 30000 app

USER app

ENTRYPOINT ["node", "./packages/ffb-discord/index.js"] 