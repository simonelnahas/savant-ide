FROM node:10

# Node server
EXPOSE 8080

COPY . /scilla-ide

WORKDIR /scilla-ide

RUN npm install pm2 -g

CMD ["pm2-runtime", "dist/server/app.js"]
