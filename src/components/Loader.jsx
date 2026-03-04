export const Loader = () => {
  return (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0B0F19 0%, #1a1f2e 100%)',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
        {/* Animated logo placeholder */}
        <div style={{ position: 'relative', width: '64px', height: '64px' }}>
          <div style={{
            position: 'absolute',
            inset: '0',
            borderRadius: '50%',
            background: 'linear-gradient(to right, rgb(99, 102, 241), rgb(139, 92, 246))',
            opacity: '0.2',
            filter: 'blur(48px)',
            animation: 'pulse 2s infinite'
          }}></div>
          <div style={{
            position: 'absolute',
            inset: '8px',
            borderRadius: '50%',
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: 'transparent',
            background: 'linear-gradient(to right, rgb(99, 102, 241), rgb(139, 92, 246))',
            backgroundClip: 'border-box',
            opacity: '0.3'
          }}></div>
          <div style={{
            position: 'absolute',
            inset: '8px',
            borderRadius: '50%',
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: 'rgb(99, 102, 241)',
            animation: 'spin 3s linear infinite'
          }}></div>
        </div>

        {/* Animated dots */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'rgb(99, 102, 241)',
            animation: 'pulse 1.4s infinite',
            animationDelay: '0s'
          }}></div>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'rgb(99, 102, 241)',
            animation: 'pulse 1.4s infinite',
            animationDelay: '0.2s'
          }}></div>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'rgb(99, 102, 241)',
            animation: 'pulse 1.4s infinite',
            animationDelay: '0.4s'
          }}></div>
        </div>

        <p style={{ color: '#9CA3AF', fontSize: '14px', margin: '0', fontWeight: 500 }}>Loading...</p>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}

export default Loader
