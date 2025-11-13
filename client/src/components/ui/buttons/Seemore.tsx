// Button dengan warna hijau gelap (#2E6F4D)
export const LihatSelengkapnyaHijauGelap = ({
  onClick,
}: {
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="text-white px-4 py-2 rounded-md font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
    style={{ backgroundColor: "#2E6F4D" }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#245839")}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2E6F4D")}
  >
    Lihat Selengkapnya
  </button>
);

// Button dengan warna hijau tosca (#58BAAB)
export const LihatSelengkapnyaHijauTosca = ({
  onClick,
}: {
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="text-white px-4 py-2 rounded-md font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
    style={{ backgroundColor: "#58BAAB" }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#42948A")}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#58BAAB")}
  >
    Lihat Selengkapnya
  </button>
);

// Button dengan warna kuning (#F5BB00)
export const LihatSelengkapnyaKuning = ({
  onClick,
}: {
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="text-gray-800 px-4 py-2 rounded-md font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
    style={{ backgroundColor: "#F5BB00" }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#D9A500")}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#F5BB00")}
  >
    Lihat Selengkapnya
  </button>
);

// ATAU jika ingin satu komponen dengan props warna:
export const LihatSelengkapnyaButton = ({
  onClick,
  bgColor,
  hoverColor,
  textColor = "white",
}: {
  onClick?: () => void;
  bgColor: string;
  hoverColor: string;
  textColor?: string;
}) => (
  <button
    onClick={onClick}
    className={`${textColor === "white" ? "text-white" : "text-gray-800"} px-4 py-2 rounded-md font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg`}
    style={{ backgroundColor: bgColor }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverColor)}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = bgColor)}
  >
    Lihat Selengkapnya
  </button>
);
