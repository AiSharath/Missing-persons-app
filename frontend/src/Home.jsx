import Navbar from "./components/navbar";
import { Link } from "react-router-dom";
import "./Home.css"
function Home(){
    return(
    <>
        <Navbar/>
        <div>
            <div className="hero-section">
                <h2>Find Hope. Bring Them Home.</h2>
                <p>Every missing person is someone’s family, someone’s story, someone’s world.<br/>
                Our Missing Person Finder App is built to bring people together using technology, community, and compassion to help locate and reunite missing individuals.<br/>
                Join us in the mission to make every search count and every reunion possible.</p>
            </div>
            <div className="app-motto">
                <h2>Why This App Matters</h2>
                <p>Every day, people go missing due to accidents, displacement, illness, or unforeseen situations.<br/>
                Traditional search methods can be slow and limited. Our platform helps by creating a digital bridge between families, volunteers, and authorities.<br/>
                With real-time updates, verified information, and a growing network of users, we make it easier to act quickly and locate missing persons before it’s too late.</p>
            </div>
            <div className="working">
                <p>
                    <h2>🔎How It Works</h2>
                    <ol>
                        <li>
                           📝 Report a Missing Person
                            Submit key details and upload a photo our system makes the information instantly accessible. 
                        </li>
                        <li>
                            🌐 Search & Match
                            Browse or search through the database to identify people who match known descriptions.
                        </li>
                        <li>
                            📢 Share Publicly
                            Spread awareness with one click across social media and local networks.
                        </li>
                        <li>
                            🤝 Connect & Reunite
                            Verified sightings and reports help bring people back home safely and swiftly.
                        </li>
                    </ol>
                </p>
            </div>
            <div className="feature">
                <h2>🧭 Features</h2>
                <ol>
                    <li>Image based recognition</li>
                    <li>Easy reporting of missing person</li>
                    <li>Searching option for missing and found person</li>
                </ol>
            </div>

            <div className="action-buttons" style={{ 
                display: "flex", 
                justifyContent: "center", 
                gap: "20px", 
                margin: "40px 0",
                flexWrap: "wrap"
            }}>
                <Link to="/report" style={{
                    padding: "15px 30px",
                    backgroundColor: "#667eea",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "8px",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                    display: "inline-block"
                }}
                onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.6)";
                }}
                onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)";
                }}
                >
                    📝 Report Missing Person
                </Link>
                <Link to="/found-missing" style={{
                    padding: "15px 30px",
                    backgroundColor: "#764ba2",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "8px",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 15px rgba(118, 75, 162, 0.4)",
                    display: "inline-block"
                }}
                onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 6px 20px rgba(118, 75, 162, 0.6)";
                }}
                onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 4px 15px rgba(118, 75, 162, 0.4)";
                }}
                >
                    🔍 Browse Found & Missing
                </Link>
                <Link to="/face-match" style={{
                    padding: "15px 30px",
                    backgroundColor: "#f093fb",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "8px",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 15px rgba(240, 147, 251, 0.4)",
                    display: "inline-block"
                }}
                onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 6px 20px rgba(240, 147, 251, 0.6)";
                }}
                onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 4px 15px rgba(240, 147, 251, 0.4)";
                }}
                >
                    🤖 Face Recognition Search
                </Link>
            </div>

            <div className="about" id="about">
                <h2>About Us</h2>
                <p>We are a team of dedicated volunteers, tech enthusiasts, and concerned citizens committed to making a difference. 
                    Our mission is simple: leverage technology to reconnect families and communities with their missing loved ones. 
                    Every report counts, every user helps, and every reunion matters.
                </p>
            </div>

            <div className="contact" id="contact">
                <h2>Contact Us</h2>
                <p>Email: support@missingpersonapp.com</p>
                <p>Phone: +91 98765 43210</p>
                <p>Follow us on:</p>
                <ul>
                    <li><a href="https://twitter.com/yourapp" target="_blank">Twitter</a></li>
                    <li><a href="https://facebook.com/yourapp" target="_blank">Facebook</a></li>
                    <li><a href="https://instagram.com/yourapp" target="_blank">Instagram</a></li>
                </ul>
            </div>
        </div>
    </>
    );
}

export default Home;