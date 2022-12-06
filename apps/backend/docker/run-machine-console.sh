#!/bin/bash
# note: to run as root, call this script with argument `--run-as-root'`

unset CM_OPTS
while [ $# -gt 0 ]; do
    arg="$1"
    shift 1

    case "$arg" in
        --run-as-root)
            CM_OPTS+=--append-rom-bootargs='single=yes'
            ;;
        *)
            echo invalid option "$arg"
            ;;
    esac
done

cartesi-machine \
    --ram-length=128Mi \
    --rollup \
    --flash-drive=label:dapp,filename:dapp.ext2 \
    --flash-drive=label:root,filename:rootfs-v0.15.0.ext2 \
    --ram-image=linux-5.15.63-ctsi-1.bin \
    --rom-image=rom-v0.13.0.bin \
    -i $CM_OPTS \
    -- "/bin/sh"
