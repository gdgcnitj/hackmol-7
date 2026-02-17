
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      
      {/* Links */}
      <div className="nav-links">
        <a href="#schedule">Schedule</a>
        <a href="#">Prizes</a>
        <a href="#">Rules</a>
        <a href="#tracks">Tracks</a>
        <a href="#">FAQ</a>
      </div>

      {/* Register Button */}
      <div>
        <button className="register-btn">
          Register
        </button>
      </div>
    


    </nav>
  );
}
