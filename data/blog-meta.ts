export type BlogMetaNote = {
  slug: string
  title: string
  summary: string
  audience: string
  keywords: string[]
  heroImageIdea: string
  inlineImageIdea: string
}

export const BLOG_META: Record<string, BlogMetaNote> = {
  '01-estimate-10min': {
    slug: '01-estimate-10min',
    title: '塗装の見積もり作成を10分で終わらせる方法【時短テクニック5選】',
    summary: 'テンプレ化と自動化で、現場帰りに10分で見積書を仕上げるためのワークフローを細かく解説します。',
    audience: '見積もり1件に2時間以上かかっている塗装業者',
    keywords: ['見積もり', '時短', '自動化'],
    heroImageIdea: '現場写真とノートPC／タブレットを並べ、短時間で見積もりを作成している様子のイメージ',
    inlineImageIdea: 'テンプレート化された見積フォーマットのUIモックやチェックリスト図',
  },
  '02-followup-timing': {
    slug: '02-followup-timing',
    title: '塗装業の追客で失注を50%減らす3つのタイミング',
    summary: '失注しやすい3つのタイミングに合わせた追客シナリオとメッセージ例を整理しています。',
    audience: '見積送付後のフォローがバラついている営業担当',
    keywords: ['追客', 'フォローアップ', 'リマインダー'],
    heroImageIdea: 'カレンダーとスマホ通知の重ね合わせで「リマインダー管理」感のあるビジュアル',
    inlineImageIdea: '3つのタイミングを図示したタイムラインやフローチャート',
  },
  '03-conversion-page': {
    slug: '03-conversion-page',
    title: '塗装の成約率を30%上げた見積もりページの作り方',
    summary: 'PDFからWebページに切り替えて成約率を伸ばした実験結果とレイアウトのコツを紹介します。',
    audience: '紙・PDFの見積書を送っている営業担当',
    keywords: ['成約率', '提案ページ', 'UI'],
    heroImageIdea: '顧客専用のWeb見積ページを開いたスマホ・PCのモックアップ',
    inlineImageIdea: '松竹梅比較ブロックやFAQレイアウトのワイヤーフレーム',
  },
  '04-checklist': {
    slug: '04-checklist',
    title: '塗装業の見積もりミスを90%減らす5つのチェックリスト',
    summary: '積算ミスを潰すためのチェックポイントをテンプレート化し、どこに組み込むかを解説します。',
    audience: '見積もりミスで赤字になった経験がある経営者',
    keywords: ['チェックリスト', '積算', '原価管理'],
    heroImageIdea: 'チェックリストを背景に、赤ペンでチェックしているイメージ',
    inlineImageIdea: '5つのチェック項目をサマリしたカードや表',
  },
  '05-after-follow': {
    slug: '05-after-follow',
    title: '塗装のアフターフォローを自動化してリピート率を2倍にした方法',
    summary: '施工後のフォローを自動化した事例と、接触シナリオのテンプレを公開します。',
    audience: 'アフター連絡を忘れがちな工務店／塗装店',
    keywords: ['アフターフォロー', 'リピート', '自動化'],
    heroImageIdea: 'LINEやSMSでフォロー連絡が自動送信されているイメージ',
    inlineImageIdea: 'フォロータイムラインやシナリオ図',
  },
  '06-excel-to-crm': {
    slug: '06-excel-to-crm',
    title: '塗装業で顧客管理エクセルを卒業すべき3つの理由',
    summary: 'Excel管理の限界とクラウドCRMへ移行したときのメリットを具体的に比較します。',
    audience: '顧客台帳をExcelで管理し続ける経営者',
    keywords: ['顧客管理', 'CRM', 'エクセル卒業'],
    heroImageIdea: '散らかったExcelシートとクラウドCRM画面の対比',
    inlineImageIdea: 'Excelの問題点 vs CRMのメリットを比較した図表',
  },
  '07-tool-comparison': {
    slug: '07-tool-comparison',
    title: '塗装業向け見積もりツール5選を徹底比較【2025年最新】',
    summary: '主要な見積もりツールの料金・特徴・向いている会社を表形式で比較します。',
    audience: '導入するツールを検討中の意思決定者',
    keywords: ['ツール比較', 'SaaS', '見積ソフト'],
    heroImageIdea: '複数ツールのロゴやUIを並べた比較系ビジュアル',
    inlineImageIdea: '比較表やレーダーチャートのモック',
  },
  '08-dx-steps': {
    slug: '08-dx-steps',
    title: '塗装業のDX化、何から始めるべき?【優先順位つき5ステップ】',
    summary: '塗装業のDXを「現場が困っている順」に5ステップで整理したロードマップ。',
    audience: '何からデジタル化すべきか迷う経営者',
    keywords: ['DX', 'ロードマップ', '業務改善'],
    heroImageIdea: 'ステップ状に並んだロードマップのイラスト',
    inlineImageIdea: '5ステップのフロー図やアイコンセット',
  },
  '09-case-study': {
    slug: '09-case-study',
    title: '個人塗装業者が見積もり自動化で月商2倍にした話【実例インタビュー】',
    summary: '一人親方がツール導入で売上を伸ばした具体的なプロセスと数値を紹介します。',
    audience: '個人事業主の塗装職人',
    keywords: ['事例', 'インタビュー', '売上アップ'],
    heroImageIdea: '職人さんが現場でスマホを操作している写真',
    inlineImageIdea: 'Before/Afterのグラフやインタビューメモの写真',
  },
  '10-view-tracking': {
    slug: '10-view-tracking',
    title: '塗装の見積もり、お客さんが見てるか分かったら営業変わった話',
    summary: '閲覧ログをもとに追客の優先順位が変わったエピソードと活用方法を述べています。',
    audience: '見積もり送付後の反応が読めず不安な営業担当',
    keywords: ['閲覧解析', '営業改善', 'データ活用'],
    heroImageIdea: 'アクセスログやヒートマップを監視しているダッシュボードのイメージ',
    inlineImageIdea: '閲覧ステータス別のアクションマップ',
  },
}
