import { FC, CSSProperties, MouseEvent } from 'react';
import { Trash2 } from 'lucide-react';

interface HapusButtonProps {
  onClick?: () => void;
  label?: string;
}

const HapusButton: FC<HapusButtonProps> = ({ 
  onClick, 
  label = 'Hapus' 
}) => {
  const buttonStyle: CSSProperties = {
    backgroundColor: '#FF0000',
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
      <Trash2 size={18} />
      {label}
    </button>
  );
};

export default function ButtonDemo() {
  const handleHapus = () => {
    console.log('Hapus diklik');
  };

  return (
    <div style={{ 
      display: 'flex', 
      gap: '16px', 
      padding: '20px', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh'
    }}>
      <HapusButton onClick={handleHapus} />
    </div>
  );
}