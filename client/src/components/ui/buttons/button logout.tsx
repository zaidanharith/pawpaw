import { FC, CSSProperties, MouseEvent } from 'react';
import { LogOut } from 'lucide-react';

interface KeluarButtonProps {
  backgroundColor?: '#2E6F4D' | '#58BAAB' | '#F5BB00';
  onClick?: () => void;
  label?: string;
}

const KeluarButton: FC<KeluarButtonProps> = ({ 
  backgroundColor = '#2E6F4D',
  onClick, 
  label = 'Keluar' 
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
    gap: '8px',
    justifyContent: 'center'
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
      <LogOut size={20} />
      {label}
    </button>
  );
};

export default KeluarButton;