FROM ubuntu:18.04

WORKDIR /usr/src/app

COPY package*.json ./
# https://gist.github.com/AkimaLunar/ed81602e50b249786e9bc7f94dccee22
RUN apt-get update
RUN apt-get -qq update
RUN apt-get install -y build-essential
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash
RUN apt-get install -y nodejs
RUN npm install

COPY . .
COPY .env.docker .env
EXPOSE 3000
CMD [ "npm", "start" ]
