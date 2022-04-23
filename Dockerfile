FROM buildkite/puppeteer

# Create Directory for the Container
WORKDIR /usr/src/app

# Only copy the package.json and yarn.lock to work directory
COPY package.json .

# Install all Packages
RUN yarn

# Copy all other source code to work directory
ADD . /usr/src/app

CMD [ "yarn", "start" ]