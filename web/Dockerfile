FROM node:25-alpine3.21 AS build

# Frontend Build stage
WORKDIR /usr/src/build

COPY . /usr/src/build

RUN npm i
RUN npm run build

# Build final image
FROM nginx AS prod
COPY --from=build /usr/src/build/dist /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
