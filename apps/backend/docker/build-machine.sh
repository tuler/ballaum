#!/bin/bash
set -e

MACHINE_DIR=$1
ROLLUP_HTTP_SERVER_PORT=5004

cartesi-machine \
    --assert-rolling-template \
    --ram-length=128Mi \
    --rollup \
    --flash-drive=label:dapp,filename:dapp.ext2 \
    --flash-drive=label:root,filename:rootfs-v0.15.0.ext2 \
    --ram-image=linux-5.15.63-ctsi-1.bin \
    --rom-image=rom-v0.13.0.bin \
    --store=$MACHINE_DIR \
    -- "cd /mnt/dapp; \
        ROLLUP_HTTP_SERVER_URL=\"http://127.0.0.1:$ROLLUP_HTTP_SERVER_PORT\" \
        ./entrypoint.sh"
