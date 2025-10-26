function Navbar() {
  return (
    <div style={{border:"2px solid white"}}>
    <nav
      style={{
        width: "100%",
        backgroundColor: "#1a1a1a",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "white",
        borderRadius:"5px",
        fontSize:"17px"
      }}
    >
      
      <h2 style={{ margin: 0 }}>🕵 Missing Person Finder</h2>

      
      <div style={{ display: "flex", gap: "20px" }}>
        <a href="/register" style={{ color: "white", textDecoration: "none" }}>Register</a>
        <a href="/login" style={{ color: "white", textDecoration: "none" }}>Login</a>
        <a href="/report" style={{ color: "white", textDecoration: "none" }}>Report Missing</a>
        <a href="#about" style={{ color: "white", textDecoration: "none" }}>About</a>
        <a href="#contact" style={{ color: "white", textDecoration: "none" }}>Contact</a>
      </div>
    </nav>
    </div>
  );
}

export default Navbar;
