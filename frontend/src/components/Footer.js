import React from 'react';
import { FaLeaf } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="bg-card py-16 mt-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div>
                <FaLeaf className="h-8 w-8 text-primary" />
              </div>
              <span className="text-2xl font-sans font-bold">Programming Community</span>
            </div>
            <p className="text-muted-foreground">
              Empowering learners worldwide through community-driven education and collaborative growth.
            </p>
          </div>
          <div>
            <h3 className="font-sans font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Courses
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Community
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Mentorship
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Projects
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-sans font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-sans font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Discord
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
          <p>
            &copy; 2025 Programming Community. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;