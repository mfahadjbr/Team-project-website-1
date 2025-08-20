import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaGraduationCap, 
  FaUsers, 
  FaBook, 
  FaRocket, 
  FaChevronLeft, 
  FaChevronRight, 
  FaCode, 
  FaPalette, 
  FaDatabase, 
  FaMobile, 
  FaGlobe,
  FaEye,
  FaProjectDiagram
} from 'react-icons/fa';
import Footer from './Footer';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carousel data
  const carouselSlides = [
    {
      title: "Learn Together, Grow Together",
      subtitle: "Join our community of passionate learners and developers",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
    },
    {
      title: "Showcase Your Skills",
      subtitle: "Build your portfolio with real projects and get feedback",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
    },
    {
      title: "Connect with Experts",
      subtitle: "Network with industry professionals and mentors",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    }
  ];

  // Course categories (image-based to match design)
  const courseCategories = [
    {
      title: "Node.js",
      image:
        "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1470&auto=format&fit=crop"
    },
    {
      title: "React",
      image:
        "https://images.unsplash.com/photo-1555255707-c07966088b7b?q=80&w=1470&auto=format&fit=crop"
    },
    {
      title: "Python",
      image:
        "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1470&auto=format&fit=crop"
    },
    {
      title: "Java",
      image:
        "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1470&auto=format&fit=crop"
    },
    {
      title: "Next.js",
      image:
        "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1470&auto=format&fit=crop"
    },
    {
      title: "C++",
      image:
        "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1470&auto=format&fit=crop"
    }
  ];

  // Sample user profiles for demonstration
  const sampleProfiles = useMemo(() => [
    {
      id: 1,
      name: "Sarah Chen",
      profession: "Full Stack Developer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      skills: ["React", "Node.js", "MongoDB"]
    },
    {
      id: 2,
      name: "Marcus Johnson",
      profession: "UX Designer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      skills: ["Figma", "Adobe XD", "Prototyping"]
    },
    {
      id: 3,
      name: "Elena Rodríguez",
      profession: "Data Scientist",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      skills: ["Python", "Machine Learning", "SQL"]
    },
    {
      id: 4,
      name: "David Kim",
      profession: "Mobile Developer",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      skills: ["React Native", "iOS", "Android"]
    }
  ], []);

  useEffect(() => {
    // Simulate loading profiles from API
    const timer = setTimeout(() => {
      setProfiles(sampleProfiles);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [sampleProfiles]);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [carouselSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="home">
      {/* Hero Section with Carousel */}
      <section className="hero-carousel">
        <div className="carousel-container">
          {carouselSlides.map((slide, index) => (
            <div
              key={index}
              className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="carousel-content">
                <h1 className="carousel-title">{slide.title}</h1>
                <p className="carousel-subtitle">{slide.subtitle}</p>
                {!isAuthenticated ? (
                  <div className="carousel-buttons">
                    <Link to="/register" className="btn btn-primary">
                      Get Started
                    </Link>
                    <Link to="/login" className="btn btn-secondary">
                      Sign In
                    </Link>
                  </div>
                ) : (
                  <div className="carousel-buttons">
                    <Link to="/dashboard" className="btn btn-primary">
                      Go to Dashboard
                    </Link>
                    <Link to="/profile" className="btn btn-secondary">
                      View Profile
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Carousel Navigation */}
          <button className="carousel-nav prev" onClick={prevSlide}>
            <FaChevronLeft />
          </button>
          <button className="carousel-nav next" onClick={nextSlide}>
            <FaChevronRight />
          </button>
          
          {/* Carousel Indicators */}
          <div className="carousel-indicators">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Course Categories Section */}
      <section className="course-categories">
        <div className="container">
          <h2 className="section-title">Explore Courses Categories</h2>
          <p className="section-subtitle">Discover courses across various disciplines and find your passion</p>
          <div className="categories-grid">
            {courseCategories.map((category, index) => (
              <div key={index} className="category-card">
                <div className="category-image">
                  <img src={category.image} alt={category.title} />
                </div>
                <div className="category-content">
                  <h3>{category.title}</h3>
                  <Link to="/courses" className="category-link">Explore Courses →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Members Section */}
      <section className="community-members">
        <div className="container">
          <h2 className="section-title">Meet Our Community</h2>
          <p className="section-subtitle">Connect with talented professionals and learners from around the world</p>
          
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading community members...</p>
            </div>
          ) : (
            <div className="profiles-grid">
              {profiles.map((profile) => (
                <div key={profile.id} className="profile-card">
                  <div className="profile-image" style={{width: "200px", height: "200px"}}>
                    <img src={profile.image} alt={profile.name} />
                  </div>
                  <div className="profile-info">
                    <h3 className="profile-name font-[1.25rem]">{profile.name}</h3>
                    <p className="profile-profession font-[1.25rem]">{profile.profession}</p>
                  </div>
                  <div className="profile-actions" style={{justifyContent: "space-between", padding: "0 1rem"}}>
                    <button className="btn" style={{backgroundColor: "#2E7D32", color: "white"}}> Profile</button>
                    <button className="btn" style={{backgroundColor: "#2E7D32", color: "white" }}> Projects</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="community-cta">
            <p>Want to showcase your skills too?</p>
            {!isAuthenticated ? (
              <Link to="/register" className="btn btn-primary">
                Join Our Community
              </Link>
            ) : (
              <Link to="/profile" className="btn btn-primary">
                Update Your Profile
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose Our Platform?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaGraduationCap />
              </div>
              <h3>Learn Together</h3>
              <p>Join study groups, participate in discussions, and learn from peers in a collaborative environment.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FaUsers />
              </div>
              <h3>Community Support</h3>
              <p>Get help from experienced learners and mentors who share your passion for knowledge.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FaBook />
              </div>
              <h3>Rich Resources</h3>
              <p>Access a vast collection of learning materials, projects, and educational content.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FaRocket />
              </div>
              <h3>Skill Development</h3>
              <p>Build your portfolio, showcase your projects, and advance your career with practical experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Learning Journey?</h2>
            <p>Join thousands of learners who are already growing their skills and building their future.</p>
            {!isAuthenticated ? (
              <Link to="/register" className="bg-primary-dark-green text-white font-bold px-8 py-4 rounded-lg shadow-lg hover:bg-primary-green transition-colors duration-300">
                Create Your Account
              </Link>
            ) : (
              <Link to="/dashboard" className="bg-primary-dark-green text-white font-bold px-8 py-4 rounded-lg shadow-lg hover:bg-primary-green transition-colors duration-300">
                Explore Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
