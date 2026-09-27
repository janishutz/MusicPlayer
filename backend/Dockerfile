# Build image
FROM alpine AS build

WORKDIR /usr/src/build

COPY . /usrc/src/build

RUN apk add go
RUN go build -o musicplayer


# Production image
FROM alpine AS prod
WORKDIR /app

ENV GIN_MODE=release

COPY --from=build /usr/src/build/musicplayer /app/musicplayer

CMD ["/app/musicplayer"]
