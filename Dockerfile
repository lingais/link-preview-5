# Step 1: build
FROM node:16.14-alpine as build-target

ENV NODE_ENV=production

ENV PATH $PATH:/usr/src/app/node_modules/.bin

WORKDIR /usr/src/app

COPY package*.json ./

# Use build tools, installed as development packages, to produce a release build.
RUN yarn

# Copy all other source code to work directory
ADD . /usr/src/app

RUN yarn build

# Step 2: run
FROM buildkite/puppeteer

ENV NODE_ENV=production

ENV PATH $PATH:/usr/src/app/node_modules/.bin

WORKDIR /usr/src/app

# Include only the release build and production packages.
COPY --from=build-target /usr/src/app/node_modules node_modules
COPY --from=build-target /usr/src/app/.next .next

ENV PORT 8088
EXPOSE 8088

CMD ["next", "start"]
