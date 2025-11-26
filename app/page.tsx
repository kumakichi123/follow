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
            見積追客くん
          </div>
          <a 
            href={FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-slate-800 transition shadow-lg shadow-slate-900/20 items-center gap-2"
          >
            <span>モニターに応募する</span>
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
                  先着30社・完全無料モニター募集中
                </span>
              </div>
            </motion.div>

            {/* 見出し */}
            <motion.h1 variants={fadeInUp} className="text-3xl md:text-5xl font-extrabold leading-tight mb-8 tracking-tight text-slate-900 drop-shadow-sm">
              見積もりは<span className="text-emerald-600">見える化</span>、<br className="hidden md:block" />
              施工後は追客を<span className="text-emerald-600">自動化</span>。
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-base md:text-lg text-slate-600 mb-10 font-medium max-w-3xl mx-auto leading-relaxed">
              見積もり後は、お客様の閲覧状況を可視化して<span className="font-bold text-slate-800">「本気度」</span>がわかるように。<br className="hidden md:block" />
              施工後は、点検連絡や保証前のお知らせを自動で送り、<span className="font-bold text-slate-800">リピートと紹介獲得</span>につなげます。
            </motion.p>
            {/* ステップ図 */}
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-sm md:text-lg font-bold text-slate-700 mb-12 bg-white/80 backdrop-blur-md py-4 px-8 rounded-full border border-slate-200 inline-flex shadow-md">
              <div className="flex items-center gap-2">
                <Send size={20} className="text-slate-400" />
                <span>URLを送る</span>
              </div>
              <ArrowRight size={20} className="text-slate-300" />
              <div className="flex items-center gap-2">
                <Eye size={20} className="text-blue-500" />
                <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded">既読が分かる</span>
              </div>
              <ArrowRight size={20} className="text-slate-300" />
              <div className="flex items-center gap-2">
                <Zap size={20} className="text-emerald-500" />
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">勝手に追客</span>
              </div>
            </motion.div>

            <motion.p variants={fadeInUp} className="text-sm md:text-base text-slate-500 mb-10 font-medium">
              <span className="bg-slate-100 px-3 py-1 rounded text-slate-600">対象</span> <strong>外壁塗装・屋根工事</strong>で、営業が苦手・忙しくて手が回らない会社向け
            </motion.p>

            {/* CTAボタン */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <a 
                href={FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-emerald-600 hover:bg-emerald-500 text-white text-lg font-bold px-10 py-4 rounded-full transition-all shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/40 transform hover:-translate-y-0.5 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  モニターに応募する
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
                  alt="見積追客くん 管理画面UI"
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
              契約前から10年後まで、<br className="md:hidden"/>システムが「顧客」を離さない。
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
              「URLを送るだけ」で、あとはシステムにお任せ。<br />
              リリース記念、先着30社様限定で<span className="text-emerald-400 font-bold">「完全無料」</span>モニターを募集しています。
            </p>
          </motion.div>

          {/* Pricing Card */}
          <div className="relative max-w-lg mx-auto">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white px-6 py-2 rounded-full text-sm font-bold tracking-wide shadow-lg ring-4 ring-white z-20">
              先着30社限定
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

              <p className="text-xs text-center text-slate-500 mb-4">
                対象：外壁塗装・屋根工事の中小で、事務・営業を楽にしたい方
              </p>

              <a 
                href={FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xl text-center py-5 rounded-xl transition shadow-xl relative overflow-hidden group"
              >
                <span className="relative z-10">モニター枠を押さえる</span>
                <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-white/10 skew-x-[-20deg] group-hover:animate-[shimmer_1s_infinite]"></div>
              </a>
              <div className="text-center text-slate-500 text-xs mt-4 space-y-1">
                <p>※ 1月上旬のリリース時にご案内をお送りします。</p>
                <p>※ 費用は導入するまで発生しません。</p>
                <p>※ LINE自動送信には別途LINE公式アカウント（無料プラン〜）が必要です。</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 text-center text-slate-500 text-sm bg-white">
        <div className="flex items-center justify-center gap-2 mb-4 font-bold text-lg text-slate-800">
          <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center">
            <LineChart size={14} className="text-white" />
          </div>
          見積追客くん
        </div>
        <p>&copy; 2025 見積追客くん All rights reserved.</p>
      </footer>
    </div>
  );
}