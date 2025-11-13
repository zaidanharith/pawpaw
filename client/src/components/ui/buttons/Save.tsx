import { FC, CSSProperties, MouseEvent } from 'react';
import { Save } from 'lucide-react';

interface SimpanButtonProps {
  backgroundColor?: '#2E6F4D' | '#F5BB00';
  onClick?: () => void;
  label?: string;
}

const SimpanButton: FC<SimpanButtonProps> = ({ 
  backgroundColor = '#2E6F4D',
  onClick, 
  label = 'Simpan' 
}) => {
  const buttonStyle: CSSProperties = {
    backgroundColor: backgroundColor,
    color: 'white',
    padding: '12px 32px',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '600',
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
      <Save size={20} />
      {label}
    </button>
  );
};

export default function ButtonDemo() {
  const handleSimpan = () => {
    console.log('Simpan diklik');
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
      <SimpanButton 
        backgroundColor="#2E6F4D"
        onClick={handleSimpan}
      />
      <SimpanButton 
        backgroundColor="#F5BB00"
        onClick={handleSimpan}
      />
    </div>
  );
}