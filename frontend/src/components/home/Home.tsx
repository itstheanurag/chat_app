import HomeContent from "./HomeContent";
import Footer from "./Footer";

const Home = () => {
  return (
    <>
      {/* Add top padding so sticky navbar doesn't cover content */}
      <main className="max-w-full mx-auto px-4 pt-20">
        <HomeContent />
      </main>
      <Footer />
    </>
  );
};

export default Home;
