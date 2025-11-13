import { FC, MouseEvent, CSSProperties } from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
}

const GreenButton: FC<ButtonProps> = ({ label, onClick }) => {
  const buttonStyle: CSSProperties = {
    backgroundColor: '#2E6F4D',
    color: 'white',
    padding: '10px 24px',
    border: 'none',
    borderRadius: '20px',
    fontWeight: '500',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'opacity 0.3s ease'
  };

  const handleMouseEnter = (e: MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget as HTMLButtonElement;
    target.style.opacity = '0.9';
  };

  const handleMouseLeave = (e: MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget as HTMLButtonElement;
    target.style.opacity = '1';
  };

  return (
    <button
      onClick={onClick}
      style={buttonStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {label}
    </button>
  );
};

const YellowButton: FC<ButtonProps> = ({ label, onClick }) => {
  const buttonStyle: CSSProperties = {
    backgroundColor: '#F5BB00',
    color: 'white',
    padding: '10px 24px',
    border: 'none',
    borderRadius: '20px',
    fontWeight: '500',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'opacity 0.3s ease'
  };

  const handleMouseEnter = (e: MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget as HTMLButtonElement;
    target.style.opacity = '0.9';
  };

  const handleMouseLeave = (e: MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget as HTMLButtonElement;
    target.style.opacity = '1';
  };

  return (
    <button
      onClick={onClick}
      style={buttonStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {label}
    </button>
  );
};

export default function ButtonExample() {
  const handleClick = (buttonName: string): void => {
    console.log(`${buttonName} diklik`);
  };

  return (
    <div style={{ display: 'flex', gap: '16px', padding: '20px', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <GreenButton 
        label="Kelola Live Report" 
        onClick={() => handleClick('Kelola Live Report')}
      />
      <YellowButton 
        label="Kelola Pengumuman" 
        onClick={() => handleClick('Kelola Pengumuman')}
      />
    </div>
  );
}