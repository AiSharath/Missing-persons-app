function Navbar() {
  return (
    <nav
      style={{
        width: "100%",
        backgroundColor: "#1a1a1a",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "white",
      }}
    >
      {/* Left side: Project name */}
      <h2 style={{ margin: 0 }}>🕵 Missing Person Finder</h2>

      {/* Right side: Links */}
      <div style={{ display: "flex", gap: "20px" }}>
        <a href="#" style={{ color: "white", textDecoration: "none" }}>Home</a>
        <a href="#" style={{ color: "white", textDecoration: "none" }}>Report Missing</a>
        <a href="#" style={{ color: "white", textDecoration: "none" }}>About</a>
        <a href="#" style={{ color: "white", textDecoration: "none" }}>Contact</a>
      </div>
    </nav>
  );
}

export default Navbar;
