# make sure context is the root of the whole repo!
FROM electronuserland/builder:wine AS build
WORKDIR /app
COPY ./package-lock.json /app
COPY ./package.json /app
COPY ./decorate-angular-cli.js /app
RUN ["npm","install","--unsafe-perm"]
COPY . /app
RUN ["npx","nx","build","core","--prod"]
RUN ["npx","nx","build","electron-app","--prod"]
RUN ["npx","nx","run","electron-app:make","--platform","windows","--arch","x64","--publishPolicy","never"]