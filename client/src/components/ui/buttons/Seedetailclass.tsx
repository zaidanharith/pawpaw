import { FC, useState, CSSProperties, MouseEvent } from 'react';

interface TabButtonProps {
  onTabChange?: (tab: string) => void;
}

const TabButton: FC<TabButtonProps> = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState<string>('Info Kelas');

  const tabs = ['Info Kelas', 'Daftar Siswa', 'Kehadiran Siswa'];

  const tabContainerStyle: CSSProperties = {
    display: 'flex',
    gap: '0',
    borderBottom: '1px solid #ccc',
    paddingBottom: '0'
  };

  const getTabStyle = (tabName: string): CSSProperties => {
    const isActive = activeTab === tabName;
    return {
      backgroundColor: 'transparent',
      color: isActive ? '#F5BB00' : 'black',
      padding: '12px 24px',
      border: 'none',
      borderBottom: isActive ? '3px solid #F5BB00' : 'none',
      fontWeight: isActive ? '600' : '500',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'all 0.3s ease'
    };
  };

  const handleMouseEnter = (e: MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget as HTMLButtonElement;
    if (target.style.color !== '#F5BB00') {
      target.style.opacity = '0.7';
    }
  };

  const handleMouseLeave = (e: MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget as HTMLButtonElement;
    target.style.opacity = '1';
  };

  const handleTabClick = (tabName: string): void => {
    setActiveTab(tabName);
    if (onTabChange) {
      onTabChange(tabName);
    }
    console.log(`${tabName} dipilih`);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={tabContainerStyle}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            style={getTabStyle(tab)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div style={{ padding: '20px', backgroundColor: 'white', marginTop: '20px', borderRadius: '8px' }}>
        {activeTab === 'Info Kelas' && (
          <div>
            <h2>Info Kelas</h2>
            <p>Konten Info Kelas</p>
          </div>
        )}
        {activeTab === 'Daftar Siswa' && (
          <div>
            <h2>Daftar Siswa</h2>
            <p>Konten Daftar Siswa</p>
          </div>
        )}
        {activeTab === 'Kehadiran Siswa' && (
          <div>
            <h2>Kehadiran Siswa</h2>
            <p>Konten Kehadiran Siswa</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabButton;