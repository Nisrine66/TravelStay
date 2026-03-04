export const Logo = ({ size = 'md', showText = false }) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32'
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <img src="/logo.png" alt="MyHousing Logo" className={`${sizeMap[size]} rounded-full object-cover flex-shrink-0`} />
      {showText && (
        <div className="text-center">
          <p className="text-xs font-bold text-accent-primary">MyHousing</p>
        </div>
      )}
    </div>
  )
}

export default Logo
