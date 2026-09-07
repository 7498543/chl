import Footer from "./components/Footer";
import Header from "./components/Header";
import Main from "./components/Main";

export default function DefaultLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Main></Main>
      <Footer />
    </div>
  );
}
