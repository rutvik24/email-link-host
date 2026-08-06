# syntax=docker/dockerfile:1

# Pure Go replica — single static binary, no Next.js output in the image.
FROM --platform=$BUILDPLATFORM golang:1.26.5-alpine AS build
ARG TARGETOS
ARG TARGETARCH
ARG VERSION=dev
WORKDIR /src
COPY go.mod ./
COPY cmd ./cmd
COPY internal ./internal
RUN CGO_ENABLED=0 GOOS=${TARGETOS:-linux} GOARCH=${TARGETARCH} \
    go build -trimpath \
    -ldflags="-s -w -X email-link-host/internal/version.Version=${VERSION}" \
    -o /server ./cmd/server

FROM scratch
ARG VERSION=dev
LABEL org.opencontainers.image.version="${VERSION}"
COPY --from=build /server /server
ENV ADDR=:8080
EXPOSE 8080
ENTRYPOINT ["/server"]
