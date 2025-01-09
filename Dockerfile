# Dockerfile
FROM node:14  

WORKDIR /app  # 作業ディレクトリを設定

COPY . .  

RUN npm install  # 依存関係をインストール

CMD ["npm", "start"]  # コンテナ起動時に実行するコマンド