import { FC, CSSProperties, MouseEvent } from 'react';

interface OutlineButtonProps {
  label: string;
  borderColor?: '#2E6F4D' | '#F5BB00';
  onClick?: () => void;
}

const OutlineButton: FC<OutlineButtonProps> = ({ 
  label, 
  borderColor = '#2E6F4D',
  onClick 
}) => {
  const buttonStyle: CSSProperties = {
    backgroundColor: 'white',
    color: 'black',
    padding: '12px 32px',
    border: `2px solid ${borderColor}`,
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.3s ease'
  };

  const handleMouseEnter = (e: MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget as HTMLButtonElement;
    target.style.backgroundColor = borderColor;
    target.style.color = 'white';
    target.style.transform = 'translateY(-2px)';
  };

  const handleMouseLeave = (e: MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget as HTMLButtonElement;
    target.style.backgroundColor = 'white';
    target.style.color = 'black';
    target.style.transform = 'translateY(0)';
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

export default function ButtonDemo() {
  return (
    <div style={{ 
      display: 'flex', 
      gap: '20px', 
      padding: '40px', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh'
    }}>
      <OutlineButton 
        label="Batal" 
        borderColor="#2E6F4D"
        onClick={() => console.log('Batal diklik')}
      />
      <OutlineButton 
        label="Batal" 
        borderColor="#F5BB00"
        onClick={() => console.log('Batal diklik')}
      />
    </div>
  );
}