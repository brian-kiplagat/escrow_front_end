# syntax=docker/dockerfile:1
# https://docs.docker.com/engine/reference/builder/

FROM python:3.8.12-slim-buster

# Creating folder for everything
RUN mkdir -p /web
COPY . /web
WORKDIR /web/

# Prerequisites
RUN apt-get update
RUN yes | apt-get install python3-dev build-essential
RUN pip install --upgrade pip

# Installs project dependencies
COPY package.json package.json
RUN npm i

# Run start script
COPY . .
# EXPOSE 8000:8000
LABEL maintainer="Abdi Adan <adanabdi036@gmail.com>"
# CMD ./scripts/start.sh
# CMD ["npm", "run", "dev"]