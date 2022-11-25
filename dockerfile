FROM node

# # Install dependencies
# RUN apt-get update && apt-get install -y curl
# RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
# RUN apt-get install -y nodejs

#Add Client
COPY front-end front-end

#Add Server
COPY server server

#Install client dependencies and build
WORKDIR /front-end/class-critic
RUN npm install -f
RUN npm run build


#Install server dependencies
WORKDIR /server
RUN npm install -f
RUN npm uninstall bcrypt -f
RUN npm install bcrypt -f

# Expose app port to the outside
EXPOSE 3000

# Start the app
CMD ["node","app.js"]

