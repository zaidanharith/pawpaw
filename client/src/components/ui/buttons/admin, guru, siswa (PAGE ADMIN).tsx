import { FC, useState, CSSProperties } from 'react';

const ToggleButtonGroup: FC = () => {
  const [activeButton, setActiveButton] = useState<string>('Guru');

  const buttons = ['Admin', 'Guru', 'Orang Tua'];

  const getButtonStyle = (buttonName: string): CSSProperties => {
    const isActive = activeButton === buttonName;
    return {
      backgroundColor: isActive ? 'white' : '#2E6F4D',
      color: isActive ? 'black' : 'white',
      padding: '10px 24px',
      border: 'none',
      borderRadius: '20px',
      fontWeight: '500',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      boxShadow: isActive ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none'
    };
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget as HTMLButtonElement;
    target.style.transform = 'translateY(-2px)';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget as HTMLButtonElement;
    target.style.transform = 'translateY(0)';
  };

  return (
    <div style={{ 
      display: 'flex', 
      gap: '12px', 
      padding: '20px', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      flexWrap: 'wrap'
    }}>
      {buttons.map((button) => (
        <button
          key={button}
          onClick={() => setActiveButton(button)}
          style={getButtonStyle(button)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {button}
        </button>
      ))}
    </div>
  );
};

export default ToggleButtonGroup;