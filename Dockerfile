FROM 'node'

WORKDIR /app

RUN npm install --global pnpm

ADD example/package.json /app/
ADD example/pnpm-lock.yaml /app/
RUN pnpm install --production --frozen-lockfile

ADD example/dist/ /app/dist

EXPOSE 8080

ENTRYPOINT ["node", "dist/ssr.js"]
