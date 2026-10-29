# アリヘブンズ 公開パック（Cloudflare Pages）

このパックは、アップロードされた最新UIのHTMLを `index.html` として配置し、
ゲームが呼び出す `/api/turn` を Xirsys の一時TURN認証情報につなぐ構成です。
XirsysのSecretはHTMLに埋め込まず、Cloudflare側の環境変数に設定します。

## 公開手順

1. ZIPを展開する。
2. 展開したフォルダーの中身（`index.html` と `functions` フォルダー）をGitHubリポジトリのルートにアップロードする。
3. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git で、そのリポジトリを接続する。
4. Build settings は静的サイトとして設定する。Framework preset: None、Build command: 空欄、Build output directory: `/`（または `.`）。
5. Pagesプロジェクトの Settings → Variables and Secrets で、Production環境に以下の変数を追加する。

   - `XIRSYS_IDENT` : XirsysのDynamic credentialsに表示される ident
   - `XIRSYS_SECRET` : XirsysのDynamic credentialsに表示される secret / API key
   - `XIRSYS_CHANNEL` : Xirsysで選択したチャンネル名（大文字小文字を正確に）

   `XIRSYS_SECRET` は Secret として登録する。値をHTMLやGitHubに書かない。
6. 保存後、再デプロイする。
7. 公開URLをPCとiPhoneの両方で開き、オンライン対戦でホストが部屋を作り、ゲストが接続IDを入力して試す。

## 確認ポイント

- `/api/turn` はXirsysの一時ICEサーバー情報を返します。ゲーム側の既存コードがこの形式を利用します。
- Xirsysの ident / secret / channel は、Xirsys DashboardのConnect → Dynamic credentialsで確認します。
- 公開できても、PeerJSのシグナリングサービスや各ネットワークの制限によって接続成功が保証されるわけではありません。まずPCとiPhoneで同じ部屋コードを使って実際に試してください。
- もしSecretをHTMLや公開リポジトリに貼ってしまった場合は、Xirsys側でキーを更新してください。
