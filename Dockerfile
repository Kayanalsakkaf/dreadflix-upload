# Step 1: Use the official Node.js image with the specified version
FROM  --platform=linux/amd64 node:22.12.0

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application files
COPY . .

# Step 6: Expose the port your application runs on (default is 3000 for Express apps)
EXPOSE 3001

# Step 7: Specify the command to run the app (make sure your start script is defined in package.json)
CMD ["npm", "start"]
