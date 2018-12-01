@echo off
cd /D "%~dp0"
docker run -it -v %cd%:/home/node/app --workdir /home/node/app codecademy-capstone sh -c "rm -rf node_modules; ln -s /app/node_modules node_modules; npm test"
pause