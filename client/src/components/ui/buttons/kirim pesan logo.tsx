import { FC, CSSProperties, MouseEvent } from 'react';
import { Send } from 'lucide-react';

interface KirimPesanCircleProps {
  backgroundColor?: '#58BAAB' | '#F5BB00';
  onClick?: () => void;
  label?: string;
}

const KirimPesanCircle: FC<KirimPesanCircleProps> = ({ 
  backgroundColor = '#58BAAB',
  onClick, 
  label = 'Kirim Pesan'
}) => {
  const buttonStyle: CSSProperties = {
    backgroundColor: backgroundColor,
    color: 'white',
    width: '60px',
    height: '60px',
    border: 'none',
    borderRadius: '50%',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
  };

  const handleMouseEnter = (e: MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget as HTMLButtonElement;
    target.style.opacity = '0.9';
    target.style.transform = 'scale(1.1)';
  };

  const handleMouseLeave = (e: MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget as HTMLButtonElement;
    target.style.opacity = '1';
    target.style.transform = 'scale(1)';
  };

  return (
    <button
      onClick={onClick}
      style={buttonStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      title={label}
    >
      <Send size={28} />
    </button>
  );
};

export default KirimPesanCircle;