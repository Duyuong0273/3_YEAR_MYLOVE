import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import HeartParticles from "./HeartParticles";
import "./HomePage.css";
import coupleImage from "../assets/images/Couple.png";
import anhImage from "../assets/images/Anh.png";
import emImage from "../assets/images/Em.png";
import image1 from "../assets/images/1.png";
import image2 from "../assets/images/2.png";
import image3 from "../assets/images/3.png";
import image4 from "../assets/images/4.png";
import image5 from "../assets/images/5.png";
import anhImageNew from "../assets/images/Anh.png";
import emImageNew from "../assets/images/Em.png";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("trangchu");
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showHeartParticles, setShowHeartParticles] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const contentRef = useRef(null);
  const heartRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    
    const timer = setTimeout(() => {
      gsap.from(".sidebar-item", {
        x: -50,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: "power2.out",
        clearProps: "all"
      });

      gsap.from(".main-title", {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
        clearProps: "all"
      });

      gsap.from(".couple-card", {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: "elastic.out(1, 0.5)",
        clearProps: "all"
      });

      gsap.from(".stats-card", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: 0.5,
        ease: "power2.out",
        clearProps: "all"
      });

      if (heartRef.current) {
        gsap.to(heartRef.current, {
          y: -10,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut"
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (contentRef.current && mounted) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [activeTab, mounted]);

  const handleTabClick = (tab) => {
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        opacity: 0,
        x: -20,
        duration: 0.2,
        onComplete: () => setActiveTab(tab)
      });
    }
  };

  return (
    <div className="homepage">

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="heart-icon">❤️</span>
            <span className="logo-text">Lovely</span>
          </div>
          <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          <div
            className={`sidebar-item ${activeTab === "trangchu" ? "active" : ""}`}
            onClick={() => handleTabClick("trangchu")}
          >
            <span className="close-icon">🏠</span>
            <span>Trang chủ</span>
          </div>
          <div
            className={`sidebar-item ${activeTab === "anh" ? "active" : ""}`}
            onClick={() => handleTabClick("anh")}
          >
            <span className="icon">📷</span>
            <span>Ảnh</span>
          </div>
          <div
            className={`sidebar-item ${activeTab === "thu" ? "active" : ""}`}
            onClick={() => handleTabClick("thu")}
          >
            <span className="icon">✉️</span>
            <span>Thư</span>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content" ref={contentRef} style={{ maxHeight: '100vh', overflowY: 'auto' }}>
        {/* Toggle button khi sidebar đóng */}
        {!sidebarOpen && (
          <button className="open-sidebar" onClick={() => setSidebarOpen(true)}>
            ☰
          </button>
        )}
        
        {/* Nội dung trang chủ */}
        {activeTab === "trangchu" && (
          <>
        <h1 className="main-title">Ngày ta bên nhau</h1>

        <div className="couple-card">
              <img 
                src={coupleImage} 
                alt="couple" 
                className="couple-image"
              />
        </div>

        <div className="stats-card">
          <div className="stat-item">
            <div className="avatar-circle">
                  <img 
                    src={anhImage} 
                    alt="anh" 
                    className="avatar-img"
                  />
            </div>
            <p className="stat-label">Anh</p>
          </div>

          <div className="stat-center">
            <div className="heart-container" ref={heartRef}>
              <span className="big-heart">❤️</span>
            </div>
            <p className="days-count">3</p>
            <p className="days-label">NĂM</p>
          </div>

          <div className="stat-item">
            <div className="avatar-circle">
                  <img 
                    src={emImage} 
                    alt="em" 
                    className="avatar-img"
                  />
            </div>
            <p className="stat-label">Em</p>
          </div>
        </div>
          </>
        )}

        {/* Nội dung khác cho từng tab */}
        {activeTab === "anh" && (
          <div className="tab-content">
            <h2>Thư viện ảnh</h2>
            <p style={{ marginBottom: '30px', color: '#f48fb1', fontSize: '18px' }}>
              Những khoảnh khắc đẹp của chúng ta...
            </p>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              maxWidth: '1000px',
              margin: '0 auto'
            }}>
              {/* Ảnh 1 */}
              <div style={{
                background: 'white',
                borderRadius: '15px',
                padding: '15px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              onClick={() => setSelectedImage(image1)}
              >
                <img 
                  src={image1} 
                  alt="Khoảnh khắc 1" 
                  style={{
                    width: '100%',
                    height: '300px',
                    objectFit: 'cover',
                    borderRadius: '10px'
                  }}
                />
              </div>

              {/* Ảnh 2 */}
              <div style={{
                background: 'white',
                borderRadius: '15px',
                padding: '15px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              onClick={() => setSelectedImage(image2)}
              >
                <img 
                  src={image2} 
                  alt="Khoảnh khắc 2" 
                  style={{
                    width: '100%',
                    height: '300px',
                    objectFit: 'cover',
                    borderRadius: '10px'
                  }}
                />
              </div>

              {/* Ảnh 3 */}
              <div style={{
                background: 'white',
                borderRadius: '15px',
                padding: '15px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              onClick={() => setSelectedImage(image3)}
              >
                <img 
                  src={image3} 
                  alt="Khoảnh khắc 3" 
                  style={{
                    width: '100%',
                    height: '300px',
                    objectFit: 'cover',
                    borderRadius: '10px'
                  }}
                />
              </div>

              {/* Ảnh 4 */}
              <div style={{
                background: 'white',
                borderRadius: '15px',
                padding: '15px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              onClick={() => setSelectedImage(image4)}
              >
                <img 
                  src={image4} 
                  alt="Khoảnh khắc 4" 
                  style={{
                    width: '100%',
                    height: '300px',
                    objectFit: 'cover',
                    borderRadius: '10px'
                  }}
                />
              </div>

              {/* Ảnh 5 */}
              <div style={{
                background: 'white',
                borderRadius: '15px',
                padding: '15px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              onClick={() => setSelectedImage(coupleImage)}
              >
                <img 
                  src={coupleImage} 
                  alt="Khoảnh khắc 5" 
                  style={{
                    width: '100%',
                    height: '300px',
                    objectFit: 'cover',
                    borderRadius: '10px'
                  }}
                />
              </div>

              {/* Ảnh 6 */}
              <div style={{
                background: 'white',
                borderRadius: '15px',
                padding: '15px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              onClick={() => setSelectedImage(anhImage)}
              >
                <img 
                  src={anhImage} 
                  alt="Khoảnh khắc 6" 
                  style={{
                    width: '100%',
                    height: '300px',
                    objectFit: 'cover',
                    borderRadius: '10px'
                  }}
                />
              </div>

              {/* Ảnh 7 */}
              <div style={{
                background: 'white',
                borderRadius: '15px',
                padding: '15px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              onClick={() => setSelectedImage(image5)}
              >
                <img 
                  src={image5} 
                  alt="Khoảnh khắc 7" 
                  style={{
                    width: '100%',
                    height: '300px',
                    objectFit: 'cover',
                    borderRadius: '10px'
                  }}
                />
              </div>

             

              {/* Ảnh 8*/}
              <div style={{
                background: 'white',
                borderRadius: '15px',
                padding: '15px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              onClick={() => setSelectedImage(emImageNew)}
              >
                <img 
                  src={emImageNew} 
                  alt="Khoảnh khắc 9" 
                  style={{
                    width: '100%',
                    height: '300px',
                    objectFit: 'cover',
                    borderRadius: '10px'
                  }}
                />
              </div>
          </div>
          </div>
        )}
        {activeTab === "thu" && (
          <div style={{ 
            background: 'linear-gradient(135deg, #ffeef7, #fff0f5)', 
            padding: '50px 40px', 
            borderRadius: '25px', 
            boxShadow: '0 15px 40px rgba(233, 30, 99, 0.15)',
            maxWidth: '700px',
            margin: '0 auto',
            textAlign: 'center',
            border: '2px solid #ffb3d1',
            position: 'relative'
          }}>
            <h2 style={{ 
              textAlign: 'center', 
              color: '#e91e63', 
              fontSize: '28px', 
              marginBottom: '40px',
              fontWeight: 'bold'
            }}>
              Thư tình
            </h2>
              {/* Decorative hearts */}
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                fontSize: '20px',
                color: '#ff6b9d'
              }}>💕</div>
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                fontSize: '20px',
                color: '#ff6b9d'
              }}>💕</div>
              <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                fontSize: '20px',
                color: '#ff6b9d'
              }}>💕</div>
              <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                fontSize: '20px',
                color: '#ff6b9d'
              }}>💕</div>

              <p style={{ 
                fontSize: '20px', 
                lineHeight: '2', 
                color: '#8e44ad',
                marginBottom: '40px',
                fontFamily: 'Georgia, serif',
                fontWeight: '500'
              }}>
                Em à,<br/>
                Cảm ơn em vì đã xuất hiện trong thế giới này như một cơn gió nhẹ, dịu dàng, nhưng đủ khiến lòng người xao xuyến.<br/>
                Mong rằng mỗi ngày trôi qua với em đều là một ngày thật ý nghĩa, nhẹ nhàng và ngập tràn niềm vui.<br/>
                Hãy luôn mỉm cười, vì nụ cười của em có thể khiến cả ngày của ai đó bừng sáng trong đó có anh.
              </p>
              
              <p style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#e91e63',
                marginBottom: '50px',
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
              }}>
                Anh yêu em ❤️
              </p>
              
              <div 
                style={{
                  width: '100px',
                  height: '100px',
                  background: 'linear-gradient(135deg, #ff6b9d, #e91e63, #c44569)',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  cursor: 'pointer',
                  boxShadow: '0 15px 35px rgba(255, 107, 157, 0.5)',
                  transition: 'all 0.4s ease',
                  fontSize: '50px',
                  border: '3px solid #fff',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onClick={() => setShowHeartParticles(true)}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.15) rotate(5deg)';
                  e.target.style.boxShadow = '0 20px 45px rgba(255, 107, 157, 0.7)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1) rotate(0deg)';
                  e.target.style.boxShadow = '0 15px 35px rgba(255, 107, 157, 0.5)';
                }}
              >
                🎁
              </div>
              
              <p style={{
                marginTop: '20px',
                fontSize: '16px',
                color: '#c44569',
                fontStyle: 'italic'
              }}>
                Nhấn vào hộp quà để xem điều bất ngờ 💝
              </p>
          </div>
        )}
      </div>

      {/* HeartParticles Modal */}
      {showHeartParticles && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          background: 'rgba(0,0,0,0.8)'
        }}>
          <button 
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              fontSize: '24px',
              cursor: 'pointer',
              zIndex: 10000,
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}
            onClick={() => setShowHeartParticles(false)}
          >
            ✕
          </button>
          <HeartParticles />
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          cursor: 'pointer'
        }}
        onClick={() => setSelectedImage(null)}
        >
          <button 
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              fontSize: '24px',
              cursor: 'pointer',
              zIndex: 10001,
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            ✕
          </button>
          <img 
            src={selectedImage} 
            alt="Phóng to" 
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: '10px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}