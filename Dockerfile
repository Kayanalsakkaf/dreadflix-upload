FROM public.ecr.aws/docker/library/node:22.12.0
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install
COPY . .
EXPOSE 3002
CMD ["npm", "start"]
