import { FC, CSSProperties, MouseEvent } from 'react';
import { Edit2 } from 'lucide-react';

interface EditButtonProps {
  onClick?: () => void;
  label?: string;
}

const EditButton: FC<EditButtonProps> = ({ 
  onClick, 
  label = 'Edit' 
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
      <Edit2 size={18} />
      {label}
    </button>
  );
};

export default function ButtonDemo() {
  const handleEdit = () => {
    console.log('Edit diklik');
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
      <EditButton onClick={handleEdit} />
    </div>
  );
}