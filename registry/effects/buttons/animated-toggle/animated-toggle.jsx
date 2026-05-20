"use client"

export function ChevronBird({
  isActive = false,
  size = 14,
  strokeWidth = 10,
  className = "",
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
      style={{
        transform: isActive ? 'translateY(-25%)' : 'translateY(0%)',
        transition: 'transform 0.32s ease-in-out',
      }}
    >
      <g>
        <path
          d="M10 50H50"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="square"
          style={{
            transformBox: 'view-box',
            transformOrigin: '50px 50px',
            transform: isActive ? 'rotate(-42deg)' : 'rotate(42deg)',
            transition: 'transform 0.32s ease-in-out',
          }}
        />
        <path
          d="M90 50H50"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="square"
          style={{
            transformBox: 'view-box',
            transformOrigin: '50px 50px',
            transform: isActive ? 'rotate(42deg)' : 'rotate(-42deg)',
            transition: 'transform 0.32s ease-in-out',
          }}
        />
      </g>
    </svg>
  );
}

export function Cross({
  isActive = false,
  size = 24,
  className = "",
}) {
  return (
    <div
      className={`flex items-center relative justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <span
        className='absolute block w-full h-0.5 bg-current transition-transform duration-300 ease-in-out'
        style={{ transform: isActive ? 'rotate(45deg)' : 'rotate(0deg)' }}
      />
      <span
        className='absolute block w-full h-0.5 bg-current transition-transform duration-300 ease-in-out'
        style={{ transform: isActive ? 'rotate(-45deg)' : 'rotate(90deg)' }}
      />
    </div>
  );
}

export function Plus({
  isActive = false,
  size = 24,
  className = "",
}) {
  return (
    <div
      className={`flex items-center relative justify-center ${className}`}
      style={{
        width: size,
        height: size,
        transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.3s ease-in-out',
      }}
    >
      <span className='absolute block w-full h-0.5 bg-current transition-transform duration-300 ease-in-out' />
      <span
        className='absolute block w-full h-0.5 bg-current transition-transform duration-300 ease-in-out'
        style={{ transform: isActive ? 'rotate(180deg)' : 'rotate(90deg)' }}
      />
    </div>
  );
}
