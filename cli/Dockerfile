# Based on https://github.com/denoland/deno_docker
FROM denoland/deno:alpine-1.17.1
WORKDIR /app
COPY cli/deps.ts cli/deps.ts
COPY core/ core/
RUN deno cache --unstable cli/deps.ts
COPY cli/ cli/
RUN deno cache --unstable cli/pipelinit.ts

WORKDIR /workdir
RUN chown -R deno:deno /workdir
USER deno

# The ENTRYPOINT is overwritten here to allow passing args to pipelinit itself,
# otherwsise flags and args would be interpreted by deno.
# See:
# https://github.com/denoland/deno_docker/blob/aeb3905/_entry.sh#L4-L7
ENTRYPOINT ["deno", "run", "--unstable", "--allow-read=.,/app/core/templates", "--allow-write=.", "/app/cli/pipelinit.ts"]
CMD ["--"]