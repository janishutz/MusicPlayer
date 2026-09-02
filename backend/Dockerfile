FROM node:25-alpine3.21 AS build

WORKDIR /usr/src/build
COPY . /usr/src/build

RUN npm i
RUN npm run build


# Prod build with fewer deps
FROM node:25-alpine3.21 AS prod

WORKDIR /usr/src/musicplayer
COPY --from=build /usr/src/build/dist /usr/src/musicplayer/dist
COPY ./index.js /usr/src/musicplayer/index.js

RUN npm i --omit=dev

CMD [ "node", "index.js" ]
