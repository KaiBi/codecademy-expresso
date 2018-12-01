FROM node:alpine
LABEL maintainer="Kai Bizik"
ENV PORT=4001
ENV NODE_ENV='production'
EXPOSE 4001

WORKDIR /app
COPY . /app/
RUN apk add --virtual .node-gyp-deps --no-cache make g++ python \
	&& npm install -g --no-save nodemon \
	&& npm install --build-from-source \
	&& apk del .node-gyp-deps

CMD node server.js