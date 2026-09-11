import Footer from "@/components/layout/public/Footer";
import Header from "@/components/layout/public/Header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-text-h">CHL</h1>
          <p className="mt-2 text-text">内容管理系统</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
