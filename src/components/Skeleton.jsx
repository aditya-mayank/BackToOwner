import React from 'react';

const Skeleton = ({ width = '100%', height = '20px', borderRadius = '8px', margin = '0' }) => {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        margin,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
      }}
    >
      <div
        className="skeleton-shine"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent)',
          animation: 'shimmer 1.5s infinite',
        }}
      />
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default Skeleton;
