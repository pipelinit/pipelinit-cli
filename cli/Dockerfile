FROM debian:11-slim

ARG version
COPY bin/pipelinit-${version}-86_64-unknown-linux-gnu /pipelinit

VOLUME ["/app"]

WORKDIR /app

ENTRYPOINT ["/pipelinit"]
