// Update the Header component to include the About Me button
import React from 'react';
import { Instagram, Linkedin, Github, Gitlab, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import SocialLink from './SocialLink';

const Header = () => {
  return (
    <header className="container mx-auto px-4 py-8 relative z-50">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-12 sm:mb-16 gap-6">
        <div className="flex items-center gap-4">
          <img 
            src="https://www.instagram.com/p/C8TtV-Cy4Ck/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
            alt="Profile" 
            className="w-12 h-12 rounded-full ring-2 ring-white/10"
          />
          <span className="text-2xl font-light tracking-wide">Muslihudheen</span>
        </div>
        <div className="flex gap-8">
          <SocialLink Icon={Github} href="https://www.github.com/Muslihudheen" />
          <SocialLink Icon={Gitlab} href="https://www.gitlab.com/log2monu" />
          <SocialLink Icon={Linkedin} href="https://www.linkedin.com/in/muslihudheen" />
          <SocialLink Icon={Instagram} href="https://www.instagram.com/_muslihudheen_/" />
          <SocialLink Icon={Facebook} href="https://www.facebook.com/muslihudheen" />
        </div>
      </div>

      <div className="mb-16 animate-fade-in">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light mb-6 leading-tight tracking-wide">
          Designing websites / apps<br className="hidden sm:block" />
          for companies like Airbnb.
        </h1>
        <p className="text-gray-400 text-lg sm:text-xl mb-8 max-w-3xl leading-relaxed">
          If you're looking for a freelance designer to help bring an idea to life and
          you're on a tight timeline—let's jam.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="bg-white text-dark px-8 py-4 rounded-full hover:bg-accent transition-all duration-300 w-full sm:w-auto text-center font-medium">
            log2monu@gmail.com
          </button>
          <button className="text-white border border-white/20 px-8 py-4 rounded-full hover:border-accent hover:text-accent transition-all duration-300 w-full sm:w-auto text-center">
            text +91 (828) 150-8506
          </button>
          <Link
            to="/about"
            className="bg-dark-lighter text-white px-8 py-4 rounded-full hover:bg-accent hover:text-dark transition-all duration-300 w-full sm:w-auto text-center"
          >
            About Me
          </Link>
        </div>
        <div className="mt-8">
          <span className="inline-flex items-center gap-3 text-gray-400 text-base">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
            Available for Freelance / Social Promotion / Speaking Engagements
          </span>
        </div>
      </div>

      <Navigation />
    </header>
  );
};

export default Header;