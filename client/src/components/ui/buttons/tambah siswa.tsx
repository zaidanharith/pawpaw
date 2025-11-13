import { FC, CSSProperties, MouseEvent } from 'react';
import { Plus } from 'lucide-react';

interface TambahSiswaButtonProps {
  backgroundColor?: '#2E6F4D' | '#F5BB00';
  onClick?: () => void;
  label?: string;
}

const TambahSiswaButton: FC<TambahSiswaButtonProps> = ({ 
  backgroundColor = '#2E6F4D',
  onClick, 
  label = 'Tambah Siswa' 
}) => {
  const buttonStyle: CSSProperties = {
    backgroundColor: backgroundColor,
    color: 'white',
    padding: '10px 24px',
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
      <Plus size={20} />
      {label}
    </button>
  );
};

export default function ButtonDemo() {
  const handleTambahSiswa = () => {
    console.log('Tambah Siswa diklik');
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
      <TambahSiswaButton 
        backgroundColor="#2E6F4D"
        onClick={handleTambahSiswa}
      />
      <TambahSiswaButton 
        backgroundColor="#F5BB00"
        onClick={handleTambahSiswa}
      />
    </div>
  );
}