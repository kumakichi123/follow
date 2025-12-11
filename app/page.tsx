'use client';

import React from 'react';
import Image from 'next/image';
import { 
  LineChart, 
  Search, 
  CheckCircle2, 
  ArrowRight, 
  MousePointerClick,
  History,
  MessageCircle,
  HeartHandshake,
  Send,
  Eye,
  Zap
} from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const FORM_URL = "https://forms.gle/biQeiJtD1bSkLrSeA";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const floating: Variants = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const footerLinks = [
  { href: "/legal/terms", label: "利用規約" },
  { href: "/legal/privacy", label: "プライバシーポリシー" },
  { href: "/legal/commercial", label: "特定商取引法に基づく表記" }
] as const;


export default function MitsumoriLP() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-xl tracking-wider text-slate-900">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <LineChart size={18} className="text-white" />
            </div>
            追客プロ
          </div>
          <a 
            href={FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-slate-800 transition shadow-lg shadow-slate-900/20 items-center gap-2"
          >
            <span>無料モニターに応募する</span>
            <ArrowRight size={14} />
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3 -z-10"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {/* バッジ */}
            <motion.div variants={fadeInUp} className="flex justify-center gap-3 mb-6">
              <div className="inline-flex items-center gap-2 border border-amber-200 bg-amber-50/90 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm ring-2 ring-amber-100">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
                <span className="text-xs md:text-sm font-bold text-amber-800 tracking-wide">
                  完全無料モニター受付中
                </span>
              </div>
            </motion.div>

            {/* 見出し (変更点) */}
            <motion.h1 variants={fadeInUp} className="text-3xl md:text-5xl font-extrabold leading-tight mb-6 tracking-tight text-slate-900 drop-shadow-sm">
              見積もり・施工後の追客を<span className="text-emerald-600">自動化</span>し、<br className="md:hidden" />
              <span className="text-emerald-600">成約</span>を増やす。
            </motion.h1>

            {/* サブテキスト (変更点) */}
            <motion.p variants={fadeInUp} className="text-base md:text-lg text-slate-600 mb-10 font-medium max-w-3xl mx-auto leading-relaxed">
              見積後はお客様の閲覧状況を<span className="font-bold text-slate-800">可視化</span>し、それに応じて追客。<br className="hidden md:block" />
              施工後は、点検連絡や保証前のお知らせを<span className="font-bold text-slate-800">自動</span>で送り、リピートと紹介獲得につなげます。
            </motion.p>
            


            {/* CTAボタン (変更点) */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <a 
                href={FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-emerald-600 hover:bg-emerald-500 text-white text-lg font-bold px-10 py-4 rounded-full transition-all shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/40 transform hover:-translate-y-0.5 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  無料モニターに応募する
                  <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] animate-[shimmer_3s_infinite]"></div>
              </a>
              <a 
                href="#features"
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-lg font-bold px-10 py-4 rounded-full transition flex items-center justify-center shadow-sm hover:shadow-md"
              >
                機能を見る
              </a>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            variants={floating}
            animate="animate"
            className="relative max-w-4xl mx-auto"
          >
            <div className="relative bg-slate-900 rounded-2xl p-1.5 shadow-2xl shadow-slate-200/50 ring-1 ring-slate-100">
              <div className="relative bg-white rounded-xl aspect-[16/9] flex items-center justify-center overflow-hidden">
                <Image
                  src="/images/hero-image.jpg"
                  alt="追客プロ 管理画面UI"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="timeline" className="py-24 px-6 bg-slate-50/80 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-center mb-20"
           >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">
              見積もり後の追客から施工後のアフターフォローまで、<br className="md:hidden"/>システムが「顧客」を離さない。
            </h2>
            <p className="text-slate-600 text-lg">
              あなたは「現場」に集中してください。面倒な事務連絡はすべて自動化します。
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-16 left-1/3 -translate-x-1/2 text-slate-300 z-0"><ArrowRight size={32} /></div>
            <div className="hidden md:block absolute top-16 left-2/3 -translate-x-1/2 text-slate-300 z-0"><ArrowRight size={32} /></div>

            {/* Step 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-lg shadow-slate-100 relative z-10 group hover:border-blue-200 transition-colors"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                <Search size={32} />
              </div>
              <div className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-4">STEP 1</div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">読んだか分かる</h3>
              <p className="text-slate-600 leading-relaxed">
                見積書URLがクリックされたら、管理画面に履歴が残ります。「ちゃんと見てくれたかな？」とモヤモヤする必要はもうありません。
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-lg shadow-slate-100 relative z-10 group hover:border-emerald-200 transition-colors"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                <MessageCircle size={32} />
              </div>
              <div className="inline-block bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full mb-4">STEP 2</div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">自動でリマインド</h3>
              <p className="text-slate-600 leading-relaxed">
                反応がないお客様には、システムが自動でLINEを送信。「返事まだですか？」と電話するストレスから解放されます。
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-lg shadow-slate-100 relative z-10 group hover:border-purple-200 transition-colors"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                <HeartHandshake size={32} />
              </div>
              <div className="inline-block bg-purple-50 text-purple-700 text-xs font-bold px-3 py-1 rounded-full mb-4">STEP 3</div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">アフターも全自動</h3>
              <p className="text-slate-600 leading-relaxed">
                1年点検や台風後の案内も自動スケジューリング。あなたが忘れていても、勝手にリピートを掘り起こします。
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <span className="text-emerald-500 font-bold tracking-widest uppercase text-sm">FEATURES</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6 text-slate-900">
              人件費の<span className="text-emerald-500">10分の1以下のコスト</span>で、<br />
              抜け漏れのない追客体制を。
            </h2>
          </motion.div>

          {/* Feature 1 */}
          <div className="grid md:grid-cols-2 gap-16 items-center mb-32 border-b border-slate-100 pb-32">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-2 md:order-1">
              <div className="bg-slate-50 border border-slate-200 rounded-3xl aspect-[4/3] flex items-center justify-center shadow-lg relative overflow-hidden group p-4">
                <Image src="/images/feature-1.png" alt="スマホ専用 Web見積書" fill className="object-contain transition-transform duration-500 group-hover:scale-105" />
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-1 md:order-2">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 mb-6"><MousePointerClick size={24} /></div>
              <h3 className="text-3xl font-bold mb-4 text-slate-900">Web見積書で「差別化」</h3>
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                他社が紙やメールで送っている中、あなたは「スマホで見やすい専用ページ」を送れます。<br/>
                会社情報やLINE相談ボタンも自動でセット。信頼感が違います。
              </p>
              <ul className="space-y-3 text-slate-700 font-medium">
                <li className="flex items-center gap-3"><CheckCircle2 size={20} className="text-emerald-500" /> いつものPDFをアップするだけ</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={20} className="text-emerald-500" /> アプリ不要、URLを送るだけ</li>
              </ul>
            </motion.div>
          </div>

          {/* Feature 2: ログ解析 */}
          <div className="grid md:grid-cols-2 gap-16 items-center mb-32 border-b border-slate-100 pb-32">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-6"><Search size={24} /></div>
              <h3 className="text-3xl font-bold mb-4 text-slate-900">顧客の「本音」が見える</h3>
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                「金額ページを3分も見ている」「事例を何度も見ている」。<br/>
                管理画面を見れば、お客様の行動が丸わかり。興味があるのかないのか、手に取るように分かります。
              </p>
              <ul className="space-y-3 text-slate-700 font-medium">
                <li className="flex items-center gap-3"><CheckCircle2 size={20} className="text-blue-500" /> 開封した日時を記録</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={20} className="text-blue-500" /> どのページを長く見たか解析</li>
              </ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="bg-slate-50 border border-slate-200 rounded-3xl aspect-[4/3] flex items-center justify-center shadow-lg relative overflow-hidden group p-4">
                <Image src="/images/feature-2.png" alt="リアルタイム閲覧解析画面" fill className="object-contain transition-transform duration-500 group-hover:scale-105" />
              </div>
            </motion.div>
          </div>

          {/* Feature 3: 自動追客 */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-2 md:order-1">
              <div className="bg-slate-50 border border-slate-200 rounded-3xl aspect-[4/3] flex items-center justify-center shadow-lg relative overflow-hidden group p-4">
                <Image src="/images/feature-3.png" alt="LINE自動追客画面" fill className="object-contain transition-transform duration-500 group-hover:scale-105" />
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-1 md:order-2">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-6"><History size={24} /></div>
              <h3 className="text-3xl font-bold mb-4 text-slate-900">10年間の「自動フォロー」</h3>
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                契約後もシステムは働き続けます。<br/>
                「1年点検」「台風後のお見舞い」など、面倒なアフターフォロー連絡を自動化。<br/>
                リピート案件を勝手に掘り起こします。
              </p>
              <ul className="space-y-3 text-slate-700 font-medium">
                <li className="flex items-center gap-3"><CheckCircle2 size={20} className="text-purple-500" /> LINE公式アカウントから自動送信</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={20} className="text-purple-500" /> 施工後10年間のスケジュールに対応</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing & CTA */}
      <section className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">先行モニター募集</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              「見積もり情報を入力するだけ」で、あとはシステムにお任せ。<br />
              リリース準備の検証期間として<span className="text-emerald-400 font-bold">「完全無料」</span>モニターを募集しています。
            </p>
          </motion.div>

          {/* Pricing Card */}
          <div className="relative max-w-lg mx-auto">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white px-6 py-2 rounded-full text-sm font-bold tracking-wide shadow-lg ring-4 ring-white z-20">
              期間限定
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white text-slate-900 rounded-3xl p-10 shadow-2xl relative overflow-hidden z-10"
            >
              <div className="absolute top-0 right-0 bg-amber-400 text-amber-900 text-xs font-bold px-10 py-1 rotate-45 translate-x-8 translate-y-4 shadow-sm">
                RECOMMENDED
              </div>

              <div className="text-center border-b border-slate-100 pb-8 mb-8 mt-4">
                <p className="text-slate-400 mb-2 line-through">通常月額 ¥49,800</p>
                <div className="flex items-baseline justify-center gap-2 text-slate-900">
                  <span className="text-2xl font-bold">¥</span>
                  {/* 価格を0に変更 */}
                  <span className="text-6xl font-extrabold text-emerald-500 tracking-tight">0</span>
                  <span className="text-lg font-normal text-slate-500 ml-2">/月</span>
                </div>
                {/* 注釈を変更 */}
                <p className="text-emerald-600 text-sm font-bold mt-4 bg-emerald-50 inline-block px-3 py-1 rounded-full">※ モニター期間中は完全無料でご利用いただけます。</p>
              </div>

              <ul className="space-y-4 mb-10">
                {[
                  "閲覧ログ解析機能",
                  "LINE公式アカウント自動追客",
                  "Web見積書 発行し放題",
                  "施工後10年間の自動アフターフォロー",
                  "導入設定サポート付き"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>



              {/* ボタンテキストを変更 */}
              <a 
                href={FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xl text-center py-5 rounded-xl transition shadow-xl relative overflow-hidden group"
              >
                <span className="relative z-10">無料モニターに応募する</span>
                <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-white/10 skew-x-[-20deg] group-hover:animate-[shimmer_1s_infinite]"></div>
              </a>
              <div className="text-center text-slate-500 text-xs mt-4 space-y-1">
                <p>※ ご利用開始時期は別途メールでご案内します。</p>
                <p>※ 費用は正式リリース後3か月間発生しません。</p>
                <p>※ サービス改善のため、ご感想やご要望のヒアリングにご協力をお願いします。</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 bg-slate-50 text-slate-600">
        <div className="max-w-6xl mx-auto px-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 font-bold text-2xl text-slate-900">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-md shadow-slate-900/20">
              <LineChart size={18} className="text-white" />
            </div>
            追客プロ
          </div>
          <div className="flex flex-wrap gap-4 text-sm font-semibold">
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-emerald-600 hover:text-emerald-500 underline underline-offset-4"
              >
                {link.label}
              </a>
            ))}
          </div>
          <p className="text-xs text-slate-500">&copy; 2025 追客プロ</p>
        </div>
      </footer>
    </div>
  );
}
