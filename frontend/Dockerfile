# Use an official Node.js runtime as a parent image
FROM node:18

# Set working directory in the container
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the current directory contents into the container
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run the command to start the app
CMD ["npm", "start"]
