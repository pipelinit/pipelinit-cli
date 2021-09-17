FROM debian:11-slim

COPY bin/pipelinit /pipelinit

VOLUME ["/app"]

WORKDIR /app

ENTRYPOINT ["/pipelinit"]