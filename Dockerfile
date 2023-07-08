# Use the official Ubuntu base image
FROM ubuntu:latest

# Install Python 3.8 and pip
RUN apt-get update && \
    apt-get install -y python3.10 python3-pip

RUN pip install diagrams

# Install  Graphviz
RUN apt-get install -y curl graphviz 

# Add 3.10 to the available alternatives
RUN update-alternatives --install /usr/bin/python python /usr/bin/python3 1

# Set python3.10 as the default python
RUN update-alternatives --set python /usr/bin/python3


# Install Node.js and npm
RUN apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_14.x | bash - && \
    apt-get install -y nodejs

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the desired port (if applicable)
EXPOSE 3000

# Run the Node.js application
CMD [ "node", "app.js" ]
