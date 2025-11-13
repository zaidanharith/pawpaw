import { FC, CSSProperties, MouseEvent } from 'react';
import { Eye } from 'lucide-react';

interface LihatDetailKelasButtonProps {
  onClick?: () => void;
  label?: string;
}

const LihatDetailKelasButton: FC<LihatDetailKelasButtonProps> = ({ 
  onClick, 
  label = 'Lihat Detail Kelas' 
}) => {
  const buttonStyle: CSSProperties = {
    backgroundColor: '#F5BB00',
    color: 'black',
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
      <Eye size={20} />
      {label}
    </button>
  );
};

export default function ButtonDemo() {
  const handleLihatDetail = () => {
    console.log('Lihat Detail Kelas diklik');
  };

  return (
    <div style={{ 
      display: 'flex', 
      gap: '16px', 
      padding: '20px', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <LihatDetailKelasButton onClick={handleLihatDetail} />
    </div>
  );
}