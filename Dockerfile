FROM node:12.16.1

WORKDIR /usr/src/smart-brain-api

RUN npm install -g nodemon

COPY package.json /usr/src/smart-brain-api/package.json
RUN npm install && npm ls
RUN mv /usr/src/smart-brain-api/node_modules /node_modules

COPY . /usr/src/smart-brain-api

CMD ["/bin/bash"]