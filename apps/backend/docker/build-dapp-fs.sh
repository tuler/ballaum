#!/bin/bash
set -e

CONFIG_DEFAULT=$1
CONFIG_DAPP=$2
EXT2=$3
FS_DIR=$(mktemp -d)
TAR=$(mktemp)
FILES=$(mktemp)

# copy filesystem files to tmp dir
jq -rs '.[0] * .[1] | .fs.files[]?' $CONFIG_DEFAULT $CONFIG_DAPP > $FILES
rsync -r --files-from=$FILES . $FS_DIR

# create tar as the dapp user
tar --sort=name --mtime="2022-01-01" --owner=1000 --group=1000 --numeric-owner -cf $TAR --directory=$FS_DIR .

# generate ext2 filesystem
FS_SIZE=$(jq -rs '.[0] * .[1] | .fs.size // 4096' $CONFIG_DEFAULT $CONFIG_DAPP)
genext2fs -f -i 512 -b $FS_SIZE -a $TAR $EXT2

# truncate to multiple of 4k
truncate -s %4096 $EXT2
