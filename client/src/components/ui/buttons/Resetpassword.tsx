import { FC, CSSProperties, MouseEvent } from 'react';

interface ResetPasswordButtonProps {
  onClick?: () => void;
  label?: string;
}

const ResetPasswordButton: FC<ResetPasswordButtonProps> = ({ 
  onClick, 
  label = 'Reset Password' 
}) => {
  const buttonStyle: CSSProperties = {
    backgroundColor: '#2E6F4D',
    color: 'white',
    padding: '12px 32px',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.3s ease'
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
      {label}
    </button>
  );
};

export default function ButtonDemo() {
  const handleResetPassword = () => {
    console.log('Reset Password diklik');
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
      <ResetPasswordButton onClick={handleResetPassword} />
    </div>
  );
}