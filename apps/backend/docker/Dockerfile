# syntax=docker.io/docker/dockerfile:1.4
# layers for caching and versioning
FROM cartesi/toolchain:0.12.0 as toolchain
FROM cartesi/rootfs:0.15.0 as rootfs
FROM cartesi/server-manager:0.5.0 as server-manager

# download standard machine drives
FROM busybox as machine-core

WORKDIR /opt/cartesi/share

# download dependencies
COPY dependencies .
COPY shasumfile .
RUN cat dependencies | xargs wget
RUN sha1sum -c shasumfile


# stage to build the dapp ext2 filesystem
FROM toolchain as dapp-fs-build

# install jq
RUN <<EOF
apt-get update
DEBIAN_FRONTEND="noninteractive" apt-get install -y jq
rm -rf /var/lib/apt/lists/*
EOF

WORKDIR /opt/cartesi/dapp
COPY --from=dapp-build /opt/cartesi/dapp .
COPY build-dapp-fs.sh /usr/local/bin
COPY default.json /opt/cartesi/

RUN build-dapp-fs.sh /opt/cartesi/default.json dapp.json dapp.ext2


# stage to build the initial cartesi machine
FROM server-manager as machine-server
ARG CHAIN_ID=31337

WORKDIR /opt/cartesi/dapp

# copy dapp ext2 from dapp stage
COPY --from=dapp-fs-build /opt/cartesi/dapp/dapp.ext2 .

# copy rootfs, linux, rom
COPY --from=machine-core /opt/cartesi/share/* .

# build machine
COPY build-machine.sh /usr/local/bin
RUN build-machine.sh /opt/cartesi/share/dapp-bin $CHAIN_ID

# switch back to server-manager workdir
WORKDIR /opt/cartesi/bin


# stage to run machine shell
FROM server-manager as machine-console

WORKDIR /opt/cartesi/dapp

# copy dapp ext2 from stage 1
COPY --from=dapp-fs-build /opt/cartesi/dapp/dapp.ext2 .

# copy rootfs, kernel, rom
COPY --from=machine-core /opt/cartesi/share/* .

COPY run-machine-console.sh /usr/local/bin
CMD ["run-machine-console.sh"]


# stage to copy the stored machine
FROM busybox as machine-standalone

WORKDIR /opt/cartesi/share/dapp-bin
COPY --from=machine-server /opt/cartesi/share/dapp-bin .

CMD ["xxd", "-c", "256", "-p", "hash"]
