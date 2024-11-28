# frontend

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
デプロイ：
https://enterprisevue.dev/blog/how-to-deploy-a-vue-application-to-heroku/

git push heroku master

HerokuでVueアプリをデプロイするためにnpm run startを使えるようにするには、package.jsonの"scripts"セクションに"start"スクリプトを追加します。

修正後のpackage.jsonは以下のようになります：

修正後のpackage.json
json
コードをコピーする
{
  "name": "frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint",
    "start": "serve -s dist"
  },
  "dependencies": {
    "axios": "^1.7.7",
    "core-js": "^3.8.3",
    "jwt-decode": "^4.0.0",
    "vue": "^3.2.13",
    "vue-router": "^4.4.5",
    "serve": "^14.0.1"  // serveを追加
  },
  "devDependencies": {
    "@babel/core": "^7.12.16",
    "@babel/eslint-parser": "^7.12.16",
    "@vue/cli-plugin-babel": "~5.0.0",
    "@vue/cli-plugin-eslint": "~5.0.0",
    "@vue/cli-service": "~5.0.0",
    "eslint": "^7.32.0",
    "eslint-plugin-vue": "^8.0.3"
  },
  "eslintConfig": {
    "root": true,
    "env": {
      "node": true
    },
    "extends": [
      "plugin:vue/vue3-essential",
      "eslint:recommended"
    ],
    "parserOptions": {
      "parser": "@babel/eslint-parser"
    },
    "rules": {}
  },
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not dead",
    "not ie 11"
  ]
}
修正ポイント
"start": "serve -s dist" を追加

これにより、Herokuがnpm run startでdistディレクトリを提供できるようになります。
serveパッケージの追加

"dependencies"にserveを追加しました。serveは本番環境向けに静的ファイルを提供するために使用します。
インストールコマンド：
bash
コードをコピーする
npm install serve --save
次の手順
アプリのビルド

bash
コードをコピーする
npm run build
これによりdistディレクトリが生成されます。
Herokuへのデプロイ

コードをHerokuにプッシュします：
bash
コードをコピーする
git add .
git commit -m "Add start script for Heroku"
git push heroku main
動作確認

デプロイ後にHerokuのURLにアクセスして、アプリが正しく動作することを確認します。
問題がある場合は、ログを確認します：
bash
コードをコピーする
heroku logs --tail
これで、HerokuでVueアプリを正常に動作させられるはずです。