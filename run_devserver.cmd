@echo off
cd /D "%~dp0"
docker run -it --rm -e "NODE_ENV=development" -p "4000:4000" -v "%cd%:/home/node/app" --workdir /home/node/app codecademy-capstone sh -c "rm -rf node_modules; ln -s /app/node_modules node_modules; nodemon -L --watch \"api/*.js\" --watch ./server.js ./server.js"
pause