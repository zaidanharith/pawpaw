import { FC, useState, CSSProperties, MouseEvent } from 'react';

interface RadioButtonProps {
  onStatusChange?: (status: string) => void;
}

const RadioButton: FC<RadioButtonProps> = ({ onStatusChange }) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('Hadir');

  const statuses = ['Hadir', 'Izin', 'Sakit', 'Alfa'];

  const containerStyle: CSSProperties = {
    display: 'flex',
    gap: '12px',
    padding: '20px',
    flexWrap: 'wrap',
    alignItems: 'center'
  };

  const getButtonStyle = (statusName: string): CSSProperties => {
    const isSelected = selectedStatus === statusName;
    return {
      backgroundColor: isSelected ? '#F5BB00' : 'white',
      color: isSelected ? 'white' : '#333',
      padding: '10px 20px',
      border: isSelected ? '2px solid #F5BB00' : '2px solid #ddd',
      borderRadius: '20px',
      fontWeight: '500',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    };
  };

  const getRadioCircleStyle = (statusName: string): CSSProperties => {
    const isSelected = selectedStatus === statusName;
    return {
      width: '16px',
      height: '16px',
      borderRadius: '50%',
      border: isSelected ? 'none' : '2px solid #bbb',
      backgroundColor: isSelected ? 'white' : 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease'
    };
  };

  const getDotStyle = (statusName: string): CSSProperties => {
    const isSelected = selectedStatus === statusName;
    return {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: '#F5BB00',
      display: isSelected ? 'block' : 'none'
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

  const handleStatusClick = (statusName: string): void => {
    setSelectedStatus(statusName);
    if (onStatusChange) {
      onStatusChange(statusName);
    }
    console.log(`${statusName} dipilih`);
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Pilih Status Kehadiran</h2>
      
      <div style={containerStyle}>
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => handleStatusClick(status)}
            style={getButtonStyle(status)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div style={getRadioCircleStyle(status)}>
              <div style={getDotStyle(status)} />
            </div>
            {status}
          </button>
        ))}
      </div>

      {/* Display Selected Status */}
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: 'white', borderRadius: '8px', maxWidth: '300px' }}>
        <p style={{ color: '#666', fontSize: '14px' }}>Status Kehadiran yang Dipilih:</p>
        <p style={{ fontSize: '18px', fontWeight: '600', color: '#F5BB00' }}>
          {selectedStatus}
        </p>
      </div>
    </div>
  );
};

export default RadioButton;