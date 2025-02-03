import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          EventHub
        </Link>

        <div 
          className={`menu-icon ${isMenuOpen ? 'open' : ''}`} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <a onClick={() => scrollToSection('events')} className="nav-link">
            Events
          </a>
          <a onClick={() => scrollToSection('about')} className="nav-link">
            About
          </a>
          <a onClick={() => scrollToSection('testimonials')} className="nav-link">
            Testimonials
          </a>
          <a onClick={() => scrollToSection('contact')} className="nav-link">
            Contact
          </a>
        </div>
        
        <div className="auth-buttons">
          <Link to="/login" className="btn btn-login">Login</Link>
          <Link to="/register" className="btn btn-register">Get Started</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;