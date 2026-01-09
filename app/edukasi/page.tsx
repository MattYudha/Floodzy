import Link from 'next/link';

export const metadata = {
    title: 'Pusat Edukasi Banjir & Hidrologi | Floodzy',
    description: 'Artikel dan panduan lengkap tentang mitigasi bencana banjir, hidrologi, dan cara membaca data sensor cuaca.',
};

export default function EducationHubPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
            <div className="container mx-auto px-4">
                <header className="mb-12 text-center max-w-3xl mx-auto">
                    <div className="text-cyan-500 font-mono tracking-widest text-sm mb-4">KNOWLEDGE BASE</div>
                    <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">Edu-Center</h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Memahami sains di balik bencana untuk meningkatkan kesiapsiagaan kita.
                        Data tanpa pemahaman hanyalah angka.
                    </p>
                </header>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Article Card 1 */}
                    <Link href="/edukasi/kenapa-jakarta-banjir" className="group">
                        <article className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition border border-slate-200 dark:border-slate-800 h-full flex flex-col">
                            <div className="h-48 bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                    <span className="text-white font-mono text-xs bg-cyan-600 px-2 py-1 rounded">ANALISIS</span>
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold mb-3 group-hover:text-cyan-500 transition">Kenapa Jakarta Sering Banjir?</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 flex-1">
                                    Bedah tuntas faktor topografi, penurunan muka tanah, dan cuaca ekstrem yang membuat ibu kota rentan.
                                </p>
                                <div className="flex items-center text-xs text-slate-500 font-mono mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <span>RAHMAT YUDI</span>
                                    <span className="mx-2">•</span>
                                    <span>5 MIN READ</span>
                                </div>
                            </div>
                        </article>
                    </Link>

                    {/* Placeholder for future articles */}
                    <article className="bg-slate-100 dark:bg-slate-900/50 rounded-xl p-8 flex flex-col justify-center items-center text-center border-2 border-dashed border-slate-300 dark:border-slate-800 opacity-70">
                        <div className="text-4xl mb-4">🚧</div>
                        <h3 className="font-bold text-lg mb-2">Panduan Membaca Sensor</h3>
                        <p className="text-sm text-slate-500">Coming Soon</p>
                    </article>

                    <article className="bg-slate-100 dark:bg-slate-900/50 rounded-xl p-8 flex flex-col justify-center items-center text-center border-2 border-dashed border-slate-300 dark:border-slate-800 opacity-70">
                        <div className="text-4xl mb-4">⚡</div>
                        <h3 className="font-bold text-lg mb-2">Evakuasi Mandiri</h3>
                        <p className="text-sm text-slate-500">Coming Soon</p>
                    </article>
                </div>
            </div>
        </div>
    );
}
