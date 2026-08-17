#!/bin/sh

rsync -avz --delete site/ cl@cutl.de:/home/cl/www/zukunftshaus.cutl.de/

echo " "
echo "https://zukunftshaus.cutl.de/"
echo " "
