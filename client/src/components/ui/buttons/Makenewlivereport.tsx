import { FC, CSSProperties, MouseEvent } from 'react';
import { Plus } from 'lucide-react';

interface BuatLaporanButtonProps {
  backgroundColor?: '#2E6F4D' | '#F5BB00';
  onClick?: () => void;
  label?: string;
}

const BuatLaporanButton: FC<BuatLaporanButtonProps> = ({ 
  backgroundColor = '#2E6F4D',
  onClick, 
  label = 'Buat Laporan Baru' 
}) => {
  const buttonStyle: CSSProperties = {
    backgroundColor: backgroundColor,
    color: 'white',
    padding: '14px 32px',
    border: 'none',
    borderRadius: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    maxWidth: '400px',
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
      <Plus size={24} strokeWidth={3} />
      {label}
    </button>
  );
};

export default function ButtonDemo() {
  const handleBuatLaporan = () => {
    console.log('Buat Laporan Baru diklik');
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
      <BuatLaporanButton 
        backgroundColor="#2E6F4D"
        onClick={handleBuatLaporan}
      />
      <BuatLaporanButton 
        backgroundColor="#F5BB00"
        onClick={handleBuatLaporan}
      />
    </div>
  );
}