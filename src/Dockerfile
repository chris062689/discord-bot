# Bootstrap dependencies.
FROM node:latest
WORKDIR /usr/src/app

COPY . .

# Create runtime user.
RUN yarn install && \
    groupadd --gid 30000 app && \
    useradd -m -u 30000 -g 30000 app

USER app

RUN mkdir /persist && chown app:app /persist/ && \
    mkdir /persist/logs/ && chown app:app /persist/logs/

ENTRYPOINT ["node", "./packages/ffb-discord/index.js"] 