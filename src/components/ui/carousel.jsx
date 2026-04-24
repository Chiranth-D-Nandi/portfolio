import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart, ExternalLink } from 'lucide-react';

// Carousel Component
const Carousel = ({ images, showGithub = false, githubUrl = '', projectId = 'default' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    // Fetch current like count
    // initialize liked state from localStorage so heart persists per-user
    try {
      const stored = localStorage.getItem(`liked-${projectId}`);
      if (stored === 'true') setLiked(true);
    } catch (e) {
      // ignore localStorage errors in strict environments
    }
    fetchLikes();
  }, [projectId]);

  const fetchLikes = async () => {
    try {
      const response = await fetch(`${API_URL}/api/likes/${projectId}`);
      const data = await response.json();
      setLikes(data.likes || 0);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching likes:', error);
      setLoading(false);
    }
  };

  const handleLike = async () => {
    const newLikedState = !liked;
    // optimistic UI change for immediate feedback
    setLiked(newLikedState);

    try {
      if (newLikedState) {
        // Add like
        const response = await fetch(`${API_URL}/api/likes/${projectId}`, { method: 'POST' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        // prefer server value; fallback to optimistic increment
        setLikes(typeof data.likes === 'number' ? data.likes : (likes + 1));
        // persist per-project like in localStorage so heart stays red for this user
        try { localStorage.setItem(`liked-${projectId}`, 'true'); } catch (e) {}
        setLiked(true);
        console.log(`Like successful for ${projectId}:`, data);
      } else {
        // Remove like
        const response = await fetch(`${API_URL}/api/likes/${projectId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setLikes(typeof data.likes === 'number' ? data.likes : Math.max(0, likes - 1));
        try { localStorage.removeItem(`liked-${projectId}`); } catch (e) {}
        setLiked(false);
        console.log(`Unlike successful for ${projectId}:`, data);
      }
    } catch (error) {
      console.error('Error updating likes:', error);
      // revert optimistic UI change on error
      setLiked(!newLikedState);
    }
  };

  const next = () => setCurrentIndex((currentIndex + 1) % images.length);
  const prev = () => setCurrentIndex((currentIndex - 1 + images.length) % images.length);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: '500px',
      aspectRatio: '4/3',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Montserrat, Arial, Helvetica, sans-serif'
    }}>
      {/* Image Display */}
      {images && images.length > 0 && (
        <img 
          src={images[currentIndex]?.src || images[currentIndex]} 
          alt={images[currentIndex]?.alt || `Slide ${currentIndex + 1}`}
          style={{
            width: '100%',
            height: '100%',
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            display: 'block',
            margin: '0 auto',
            background: '#fff'
          }}
          onError={(e) => {
            console.error('Image failed to load:', e.target.src);
            e.target.style.display = 'none';
          }}
        />
      )}

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            style={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.9)',
              border: 'none',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'white'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
          >
            <ChevronLeft size={28} color="#070111" />
          </button>

          <button
            onClick={next}
            style={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.9)',
              border: 'none',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'white'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
          >
            <ChevronRight size={28} color="#070111" />
          </button>

          {/* Dots Indicator */}
          <div style={{
            position: 'absolute',
            top: 16,
            right: 16,
            display: 'flex',
            gap: '8px'
          }}>
            {images.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: idx === currentIndex ? 'white' : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              />
            ))}
          </div>
        </>
      )}

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        position: 'absolute',
        left: 24,
        bottom: 24
      }}>
        <button
          onClick={handleLike}
          style={{
            background: 'white',
            border: 'none',
            borderRadius: '24px',
            width: 'auto',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            cursor: 'pointer',
            transition: 'all 0.2s',
            outline: liked ? '2px solid #ff5a5f' : 'none',
            padding: '0 18px',
            fontWeight: 600,
            fontSize: '1.1rem',
            color: '#222',
            gap: '10px'
          }}
        >
          <Heart size={28} color={liked ? '#ff5a5f' : '#bbb'} fill={liked ? '#ff5a5f' : 'none'} />
          <span style={{marginLeft: 6}}>{loading ? '-' : likes}</span>
        </button>
        {/* Restore View on GitHub button */}
        {showGithub && githubUrl && (
          <GithubButton githubUrl={githubUrl} />
        )}
      </div>
    </div>
  );
};

// View on GitHub button with hover effect
function GithubButton({ githubUrl }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        textDecoration: 'none',
        border: '2px solid #070111',
        borderRadius: '24px',
        background: hover ? 'transparent' : '#070111',
        color: hover ? '#070111' : 'white',
        fontFamily: 'Montserrat, Arial, Helvetica, sans-serif',
        fontWeight: 600,
        fontSize: '1.1rem',
        padding: '0 18px',
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label="View on GitHub"
    >
      <ExternalLink size={24} style={{ marginRight: 8 }} />
      View on GitHub
    </a>
  );
}

export default Carousel;