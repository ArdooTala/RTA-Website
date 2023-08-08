#!/bin/bash

set -e

echo "Checking for dhparams.pem"
if [ ! -f "/vol/proxy/ssl-dhparams.pem" ]; then
  echo "dhparams.pem does not exist - creating it"
  openssl dhparam -out /vol/proxy/ssl-dhparams.pem 2048
fi

echo "Checking for fullchain.pem"
if [ ! -f "/etc/letsencrypt/live/reconwood.xyz/fullchain.pem" ]; then
  echo "No SSL cert, enabling HTTP only..."
  cp /etc/nginx/default.conf /etc/nginx/conf.d/default.conf
else
  echo "SSL cert exists, enabling HTTPS..."
  cp /etc/nginx/default-https.conf /etc/nginx/conf.d/default.conf
fi

nginx -g 'daemon off;'