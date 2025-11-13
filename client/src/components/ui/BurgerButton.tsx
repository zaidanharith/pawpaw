import React from 'react';

interface BurgerButtonProps {
    onClick?: () => void;
    isOpen?: boolean;
}

const BurgerButton: React.FC<BurgerButtonProps> = ({ onClick, isOpen = false }) => {
    return (
        <button
            type="button"
            aria-label="Toggle menu"
            onClick={onClick}
            className="focus:outline-none cursor-pointer">
            <div className="flex flex-col justify-center items-center w-6 h-6">
                <span
                    className={`block w-5 h-0.5 bg-gray-800 mb-1 rounded transition-all ${
                        isOpen ? 'rotate-45 translate-y-1.5' : ''
                    }`}
                ></span>
                <span
                    className={`block w-5 h-0.5 bg-gray-800 mb-1 rounded transition-all ${
                        isOpen ? 'opacity-0' : ''
                    }`}
                ></span>
                <span
                    className={`block w-5 h-0.5 bg-gray-800 rounded transition-all ${
                        isOpen ? '-rotate-45 -translate-y-1.5' : ''
                    }`}
                ></span>
            </div>
        </button>
    );
};

export default BurgerButton;