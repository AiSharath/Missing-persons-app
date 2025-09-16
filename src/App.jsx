import Navbar from "./components/navbar";

function App() {
  return (
    <>
      <Navbar />
      <main style={{ padding: "20px" }}>
        <h1>Welcome to Missing Person Finder</h1>
        <p>Use this platform to report or search for missing persons.</p>
      </main>
    </>
  );
}

export default App;
