#!/bin/sh

node scripts/build-aktuelles.mjs || exit 1

rsync -avz --delete site/ cl@cutl.de:/home/cl/www/zukunftshaus.cutl.de/

echo " "
echo "https://zukunftshaus.cutl.de/"
echo " "
