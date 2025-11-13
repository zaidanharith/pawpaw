import { FC, useState, CSSProperties, MouseEvent } from 'react';

interface StatusOption {
  label: string;
  activeColor: string;
}

interface ToggleStatusButtonProps {
  options: StatusOption[];
  onStatusChange?: (status: string, color: string) => void;
}

const ToggleStatusButton: FC<ToggleStatusButtonProps> = ({ 
  options, 
  onStatusChange 
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>(options[0]?.label || '');
  const [selectedColor, setSelectedColor] = useState<string>(options[0]?.activeColor || '');

  const containerStyle: CSSProperties = {
    display: 'flex',
    gap: '12px',
    padding: '20px',
    flexWrap: 'wrap',
    alignItems: 'center'
  };

  const getButtonStyle = (option: StatusOption): CSSProperties => {
    const isSelected = selectedStatus === option.label;
    return {
      backgroundColor: isSelected ? option.activeColor : 'white',
      color: isSelected ? 'white' : 'black',
      padding: '10px 24px',
      border: isSelected ? `2px solid ${option.activeColor}` : '2px solid #ddd',
      borderRadius: '20px',
      fontWeight: '500',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'all 0.3s ease'
    };
  };

  const handleMouseEnter = (e: MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget as HTMLButtonElement;
    target.style.transform = 'translateY(-2px)';
  };

  const handleMouseLeave = (e: MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget as HTMLButtonElement;
    target.style.transform = 'translateY(0)';
  };

  const handleStatusClick = (option: StatusOption): void => {
    setSelectedStatus(option.label);
    setSelectedColor(option.activeColor);
    if (onStatusChange) {
      onStatusChange(option.label, option.activeColor);
    }
    console.log(`${option.label} dipilih`);
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Pilih Status</h2>
      
      <div style={containerStyle}>
        {options.map((option) => (
          <button
            key={option.label}
            onClick={() => handleStatusClick(option)}
            style={getButtonStyle(option)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Display Selected Status */}
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: 'white', borderRadius: '8px', maxWidth: '300px' }}>
        <p style={{ color: '#666', fontSize: '14px' }}>Status yang Dipilih:</p>
        <p style={{ fontSize: '18px', fontWeight: '600', color: selectedColor }}>
          {selectedStatus}
        </p>
        <p style={{ fontSize: '12px', color: '#999' }}>Warna: {selectedColor}</p>
      </div>
    </div>
  );
};

export default function ButtonDemo() {
  const statusOptions1 = [
    { label: 'Semua', activeColor: '#58BAAB' },
    { label: 'Belum dibaca', activeColor: '#58BAAB' }
  ];

  const statusOptions2 = [
    { label: 'Semua', activeColor: '#F5BB00' },
    { label: 'Belum dibaca', activeColor: '#F5BB00' }
  ];

  const handleStatusChange = (status: string, color: string) => {
    console.log('Status:', status, 'Color:', color);
  };

  return (
    <div>
      <div style={{ borderBottom: '2px solid #eee', paddingBottom: '20px' }}>
        <h3 style={{ padding: '20px', color: '#333' }}>Dengan Warna #58BAAB</h3>
        <ToggleStatusButton 
          options={statusOptions1}
          onStatusChange={handleStatusChange}
        />
      </div>

      <div>
        <h3 style={{ padding: '20px', color: '#333' }}>Dengan Warna #F5BB00</h3>
        <ToggleStatusButton 
          options={statusOptions2}
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
}