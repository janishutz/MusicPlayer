# Build image
FROM alpine AS build

# TODO: Build


# Production image
FROM alpine AS prod
WORKDIR /app

COPY --from=build /usr/src/build/musicplayer /app/musicplayer
# TODO: Config? Env?

CMD ["/app/musicplayer"]
