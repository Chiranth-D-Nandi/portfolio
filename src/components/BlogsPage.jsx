import React, { useState } from 'react';
import { SiLinkedin } from 'react-icons/si';
import { blogsData } from '../data/blogsData';
import DotGrid from './ui/DotGrid.jsx';

export default function BlogsPage({ onBackToPortfolio, isMobileView }) {
  // Initially null so the static image is displayed when no title has been clicked yet
  const [selectedArticleId, setSelectedArticleId] = useState(null);

  const selectedArticle = blogsData.find((b) => b.id === selectedArticleId);

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)',
      fontFamily: 'Montserrat, Arial, Helvetica, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Background DotGrid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}>
        <DotGrid
          dotSize={3}
          gap={23}
          baseColor="#000000"
          activeColor="#a020f0"
          shockStrength={6}
        />
      </div>

      {/* Top Navigation Bar */}
      <nav style={{
        width: '100%',
        boxSizing: 'border-box',
        padding: isMobileView ? '16px 20px' : '18px 48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#070111',
        borderBottom: '2px solid #ffa900',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={onBackToPortfolio}
            style={{
              backgroundColor: '#ffa900',
              color: '#070111',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 700,
              fontSize: '15px',
              border: '2px solid #ffa900',
              borderRadius: '6px',
              padding: '8px 16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#ffa900';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#ffa900';
              e.currentTarget.style.color = '#070111';
            }}
          >
            Back to Portfolio
          </button>
          {!isMobileView && (
            <span style={{ color: 'white', fontWeight: 600, fontSize: '1.1rem' }}>
              Chiranth D Nandi <span style={{ color: '#ffa900' }}>/</span> You're viewing my technical blogs!
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <a
            href="https://www.linkedin.com/in/chiranth-nandi"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            style={{ color: '#ffa900', fontSize: '28px', display: 'flex', alignItems: 'center', transition: 'color 0.2s', padding: '4px' }}
            onMouseOver={(e) => { e.currentTarget.style.color = '#ffffff'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = '#ffa900'; }}
          >
            <SiLinkedin />
          </a>
        </div>
      </nav>

      {/* Main Content Area */}
      <div style={{
        width: '100%',
        flex: 1,
        padding: isMobileView ? '24px 16px' : '40px 0 60px 0',
        position: 'relative',
        boxSizing: 'border-box'
      }}>
        {isMobileView ? (
          /* Mobile Stacked View */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', width: '100%' }}>
            {/* Left Card: Contents Page */}
            <div style={{
              width: '100%',
              background: '#070111',
              borderRadius: 0,
              border: '2px solid #000000',
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              padding: '24px 20px',
              color: 'white',
              boxSizing: 'border-box'
            }}>
              <div style={{ borderBottom: '2px solid #ffa900', paddingBottom: '14px', marginBottom: '18px' }}>
                <h2 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0, color: '#ffa900', letterSpacing: '-0.01em' }}>
                  Table of Contents
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {blogsData.map((blog) => {
                  const isSelected = selectedArticleId === blog.id;
                  return (
                    <div
                      key={blog.id}
                      onClick={() => setSelectedArticleId(blog.id)}
                      style={{
                        padding: '14px 16px',
                        background: isSelected ? 'rgba(255, 169, 0, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                        border: isSelected ? '1.5px solid #ffa900' : '1.5px solid transparent',
                        borderRadius: 0,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ fontSize: '1.05rem', fontWeight: 700, color: isSelected ? '#ffa900' : 'white', marginBottom: '6px' }}>
                        {blog.title}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#888' }}>
                        {blog.date}
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedArticleId && (
                <button
                  onClick={() => setSelectedArticleId(null)}
                  style={{
                    marginTop: '20px',
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: 'transparent',
                    color: '#ffffff',
                    border: '1.5px dashed #ffffff',
                    borderRadius: 0,
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.92rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.color = '#070111';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                >
                  clear the article selection to see me fathoming :)
                </button>
              )}
            </div>

            {/* Right Card: Article Display or Static Image */}
            <div style={{
              width: '100%',
              background: '#ffffff',
              borderRadius: 0,
              border: '2px solid #000000',
              boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
              padding: '24px 20px',
              color: '#111',
              boxSizing: 'border-box'
            }}>
              {!selectedArticle ? (
                /* Static Image display when no title has been clicked yet */
                <div style={{ textAlign: 'center', padding: '40px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <img
                    src="/cuh.png"
                    alt="Static Blog Placeholder"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '380px',
                      objectFit: 'contain',
                      borderRadius: 0
                    }}
                  />
                  <p style={{ marginTop: '16px', color: '#666', fontSize: '1rem', fontStyle: 'italic' }}>
                    Select an article from the contents above to read.
                  </p>
                </div>
              ) : (
                /* Render Selected Article */
                <ArticleRenderer article={selectedArticle} isMobileView={true} onDeselect={() => setSelectedArticleId(null)} />
              )}
            </div>
          </div>
        ) : (
          /* Desktop Layout with Fixed/Locked Left Card, Equal Spacing, and Level Tops */
          <div style={{
            width: '100%',
            position: 'relative',
            padding: '36px 0',
            boxSizing: 'border-box',
            zIndex: 2
          }}>
            {/* Left Card: Contents Page - Locked on screen via position: fixed (28% width, 3.5% left margin) */}
            <div style={{
              position: 'fixed',
              top: '110px',
              left: '3.5%',
              width: '28%',
              maxHeight: 'calc(100vh - 135px)',
              overflowY: 'auto',
              background: '#070111',
              borderRadius: 0,
              border: '2px solid #000000',
              boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
              padding: '36px 26px',
              color: 'white',
              boxSizing: 'border-box',
              zIndex: 20
            }}>
              <div style={{ borderBottom: '2px solid #ffa900', paddingBottom: '16px', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: '#ffa900', letterSpacing: '-0.01em' }}>
                  Table of Contents
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {blogsData.map((blog) => {
                  const isSelected = selectedArticleId === blog.id;
                  return (
                    <div
                      key={blog.id}
                      onClick={() => setSelectedArticleId(blog.id)}
                      style={{
                        padding: '16px 20px',
                        background: isSelected ? 'rgba(255, 169, 0, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                        border: isSelected ? '1.5px solid #ffa900' : '1.5px solid transparent',
                        borderRadius: 0,
                        cursor: 'pointer',
                        transition: 'all 0.25s ease'
                      }}
                      onMouseOver={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.09)';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                        }
                      }}
                    >
                      <div style={{
                        fontSize: '1.15rem',
                        fontWeight: 700,
                        color: isSelected ? '#ffa900' : '#ffffff',
                        lineHeight: 1.4,
                        marginBottom: '8px'
                      }}>
                        {blog.title}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#999', fontWeight: 500 }}>
                        {blog.date}
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedArticleId && (
                <button
                  onClick={() => setSelectedArticleId(null)}
                  style={{
                    marginTop: '28px',
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: 'transparent',
                    color: '#ffffff',
                    border: '1.5px dashed #ffffff',
                    borderRadius: 0,
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.92rem',
                    lineHeight: 1.4,
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.color = '#070111';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                >
                  clear the article selection to see me fathoming :)
                </button>
              )}
            </div>

            {/* Right Card: Article Display or Placeholder (61.5% width, left starts at 35% with 3.5% gap & right margin) */}
            <div style={{
              marginLeft: '35%',
              width: '61.5%',
              minHeight: 'calc(100vh - 150px)',
              background: '#ffffff',
              borderRadius: 0,
              border: '2px solid #000000',
              boxShadow: '0 4px 28px rgba(0,0,0,0.08)',
              padding: '40px 48px',
              color: '#070111',
              boxSizing: 'border-box',
              position: 'relative',
              zIndex: 2,
              marginBottom: '60px'
            }}>
              {!selectedArticle ? (
                /* Static image displayed when no title has been clicked yet */
                <div style={{
                  minHeight: '620px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: '8px 0',
                  width: '100%'
                }}>
                  <img
                    src="/cuh.png"
                    alt="Static Blog Placeholder"
                    style={{
                      width: '95%',
                      maxWidth: '780px',
                      maxHeight: '660px',
                      objectFit: 'contain',
                      borderRadius: 0
                    }}
                  />
                  <p style={{
                    marginTop: '20px',
                    color: '#555',
                    fontSize: '1.2rem',
                    fontStyle: 'italic',
                    fontWeight: 500
                  }}>
                    Select an article from the contents on the left to read.
                  </p>
                </div>
              ) : (
                /* Render the selected article */
                <ArticleRenderer article={selectedArticle} isMobileView={false} onDeselect={() => setSelectedArticleId(null)} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Robust Article Renderer for articles containing text, images, headings, lists, and links.
 */
function ArticleRenderer({ article, isMobileView }) {
  return (
    <article style={{ width: '100%', textAlign: 'left', lineHeight: 1.8 }}>
      {/* Article Header */}
      <div style={{ borderBottom: '2px solid #000000', paddingBottom: '20px', marginBottom: '28px' }}>
        <h1 style={{
          fontSize: isMobileView ? '1.8rem' : '2.4rem',
          fontWeight: 800,
          color: '#070111',
          margin: '0 0 10px 0',
          lineHeight: 1.3
        }}>
          {article.title}
        </h1>
        <div style={{ color: '#666', fontSize: '1rem', fontWeight: 600 }}>
          {article.date}
        </div>
      </div>

      {/* Subtitle / Big Bold Paragraph */}
      {article.subtitle && (
        <div style={{
          fontSize: isMobileView ? '1.3rem' : '1.55rem',
          fontWeight: 800,
          color: '#070111',
          margin: '0 0 24px 0',
          lineHeight: 1.45
        }}>
          {article.subtitle}
        </div>
      )}

      {/* Article Blocks */}
      {article.content && article.content.map((block, idx) => {
        if (block.type === 'paragraph') {
          return (
            <p
              key={idx}
              style={{
                fontSize: isMobileView ? '1.1rem' : '1.18rem',
                color: '#222',
                margin: '0 0 20px 0',
                lineHeight: 1.85
              }}
            >
              {block.text}
            </p>
          );
        }

        if (block.type === 'heading') {
          const isLevel3 = block.level === 3;
          return isLevel3 ? (
            <h3
              key={idx}
              style={{
                fontSize: isMobileView ? '1.2rem' : '1.38rem',
                fontWeight: 800,
                color: '#070111',
                margin: '28px 0 12px 0',
                lineHeight: 1.35
              }}
            >
              {block.text}
            </h3>
          ) : (
            <h2
              key={idx}
              style={{
                fontSize: isMobileView ? '1.35rem' : '1.6rem',
                fontWeight: 800,
                color: '#070111',
                margin: '36px 0 16px 0',
                lineHeight: 1.35
              }}
            >
              {block.text}
            </h2>
          );
        }

        if (block.type === 'callout') {
          return (
            <div
              key={idx}
              style={{
                margin: '22px 0',
                padding: '16px 22px',
                background: '#f4f5f8',
                border: '1px solid #e2e4e9',
                fontFamily: 'Courier New, monospace, sans-serif',
                fontSize: isMobileView ? '1.05rem' : '1.18rem',
                color: '#070111',
                fontWeight: 700,
                letterSpacing: '0.02em',
                lineHeight: 1.6,
                overflowX: 'auto'
              }}
            >
              {block.text}
            </div>
          );
        }

        if (block.type === 'image') {
          return (
            <figure
              key={idx}
              style={{
                margin: '28px 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%'
              }}
            >
              <img
                src={block.src}
                alt={block.alt || 'Blog article image'}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  border: '2px solid #000000',
                  borderRadius: 0,
                  boxShadow: '0 6px 20px rgba(0,0,0,0.1)'
                }}
              />
              {block.caption && (
                <figcaption style={{
                  fontSize: '0.92rem',
                  color: '#666',
                  fontStyle: 'italic',
                  marginTop: '10px',
                  textAlign: 'center'
                }}>
                  {block.caption}
                </figcaption>
              )}
            </figure>
          );
        }

        if (block.type === 'list') {
          return (
            <ul
              key={idx}
              style={{
                listStyleType: 'disc',
                paddingLeft: '28px',
                margin: '16px 0 24px 0',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              {block.items.map((item, itemIdx) => {
                // If item has a colon, bold the prefix before the colon
                const colonIdx = item.indexOf(':');
                if (colonIdx !== -1) {
                  const prefix = item.substring(0, colonIdx + 1);
                  const rest = item.substring(colonIdx + 1);
                  return (
                    <li
                      key={itemIdx}
                      style={{
                        fontSize: isMobileView ? '1.08rem' : '1.15rem',
                        color: '#222',
                        lineHeight: 1.75
                      }}
                    >
                      <strong>{prefix}</strong>{rest}
                    </li>
                  );
                }
                return (
                  <li
                    key={itemIdx}
                    style={{
                      fontSize: isMobileView ? '1.08rem' : '1.15rem',
                      color: '#222',
                      lineHeight: 1.75
                    }}
                  >
                    {item}
                  </li>
                );
              })}
            </ul>
          );
        }

        return null;
      })}
    </article>
  );
}
