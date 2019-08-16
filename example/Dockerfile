FROM 'node'

WORKDIR /app

RUN npm install --global pnpm

ADD package.json /app/
ADD pnpm-lock.yaml /app/
RUN pnpm install --production --frozen-lockfile

ADD dist/ /app/dist

ENTRYPOINT ["node", "dist/ssr.js"]
