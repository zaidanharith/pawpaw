import { FC, CSSProperties, MouseEvent } from 'react';
import { Eye } from 'lucide-react';

interface LihatDetailButtonProps {
  backgroundColor?: '#2E6F4D' | '#58BAAB' | '#F5BB00';
  onClick?: () => void;
  label?: string;
}

const LihatDetailButton: FC<LihatDetailButtonProps> = ({ 
  backgroundColor = '#2E6F4D',
  onClick, 
  label = 'Lihat Detail' 
}) => {
  const buttonStyle: CSSProperties = {
    backgroundColor: backgroundColor,
    color: 'white',
    padding: '10px 24px',
    border: 'none',
    borderRadius: '20px',
    fontWeight: '500',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const handleMouseEnter = (e: MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget as HTMLButtonElement;
    target.style.opacity = '0.9';
    target.style.transform = 'translateY(-2px)';
  };

  const handleMouseLeave = (e: MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget as HTMLButtonElement;
    target.style.opacity = '1';
    target.style.transform = 'translateY(0)';
  };

  return (
    <button
      onClick={onClick}
      style={buttonStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Eye size={18} />
      {label}
    </button>
  );
};

export default function ButtonDemo() {
  const handleLihatDetail = () => {
    console.log('Lihat Detail diklik');
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      gap: '20px', 
      padding: '40px', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <LihatDetailButton 
        backgroundColor="#2E6F4D"
        onClick={handleLihatDetail}
      />
      <LihatDetailButton 
        backgroundColor="#58BAAB"
        onClick={handleLihatDetail}
      />
      <LihatDetailButton 
        backgroundColor="#F5BB00"
        onClick={handleLihatDetail}
      />
    </div>
  );
}