# syntax=docker.io/docker/dockerfile:1.4

# TODO: REMOVING BUILD STAGE FOR NOW
# - build being done outside
# - need to either find a way to include ../../packages in the build, OR
#   use published npm dependencies (deroll)

# # build stage: includes resources necessary for installing dependencies

# # Here the image's platform does not necessarily have to be riscv64.
# # If any needed dependencies rely on native binaries, you must use 
# # a riscv64 image such as cartesi/node:19-jammy for the build stage,
# # to ensure that the appropriate binaries will be generated.
# FROM node:20.2.0-bullseye  as build-stage

# WORKDIR /opt/cartesi/dapp
# COPY . .
# RUN yarn install && yarn build

# runtime stage: produces final image that will be executed

# Here the image's platform MUST be linux/riscv64.
# Give preference to small base images, which lead to better start-up
# performance when loading the Cartesi Machine.
FROM --platform=linux/riscv64 cartesi/node:20.2.0-jammy-slim

LABEL io.sunodo.sdk_version=0.1.0
LABEL io.cartesi.rollups.ram_size=128Mi

RUN <<EOF
apt-get update
apt-get install -y --no-install-recommends busybox-static=1:1.30.1-7ubuntu3
rm -rf /var/lib/apt/lists/*
EOF

COPY --from=sunodo/machine-emulator-tools:0.11.0-ubuntu22.04 / /
ENV PATH="/opt/cartesi/bin:${PATH}"

WORKDIR /opt/cartesi/dapp
# TODO: REMOVING BUILD STAGE FOR NOW
# COPY --from=build-stage /opt/cartesi/dapp/dist .
COPY dist .

ARG NETWORK

ENV ROLLUP_HTTP_SERVER_URL="http://127.0.0.1:5004"
ENV NETWORK=$NETWORK

# TODO: remove hard-coded NETWORK var once ENV NETWORK is supported by Sunodo
ENTRYPOINT ["NETWORK=localhost rollup-init"]
CMD ["node", "index.js"]
