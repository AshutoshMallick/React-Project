#!/bin/sh
cd Backend/
node_modules/.bin/pm2 kill;
node_modules/.bin/pm2 start src/index.js --watch;
cd ..
npm run parcel
