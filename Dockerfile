# pull alpine image and use as base:
FROM alpine

# add metadata:
LABEL maintainer="yury-kozlov"

# run command inside image - apk is a package manager
RUN apk add --update nodejs nodejs-npm

# npm install:
COPY ./package.json nodehello/
COPY ./package-lock.json nodehello/
WORKDIR ./nodehello
RUN npm install

# copy everything from the source layer
COPY . /nodehello

WORKDIR /nodehello

# open port 3001 inside container:
EXPOSE 3001

# default app for container (relative to workdir - /src):
ENTRYPOINT ["node", "src/app.js"]

# command examples:
# 1. build image (mind the dot at the end):
#    docker build -t nodehello:1.0 .

# 2. start container (note that host is environment variable => IP address of container's host):
#    docker run -p 3001:3001 -e PORT=3001 nodehello:1.0
