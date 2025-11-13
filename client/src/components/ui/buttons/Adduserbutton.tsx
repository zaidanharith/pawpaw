import { FC, CSSProperties, MouseEvent } from 'react';
import { Plus } from 'lucide-react';

interface TambahUserButtonProps {
  onClick?: () => void;
  label?: string;
}

const TambahUserButton: FC<TambahUserButtonProps> = ({ 
  onClick, 
  label = 'Tambah User' 
}) => {
  const buttonStyle: CSSProperties = {
    backgroundColor: '#2E6F4D',
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
      <Plus size={20} />
      {label}
    </button>
  );
};

export default function ButtonDemo() {
  const handleAddUser = () => {
    console.log('Tambah User diklik');
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
      <TambahUserButton onClick={handleAddUser} />
    </div>
  );
}