import React from 'react';

interface WhatsAppIconProps {
  className?: string;
  size?: number | string;
}

/**
 * Official Brand WhatsApp Icon with Green Speech Bubble and White Handset
 * Pixel-perfect SVG matching official WhatsApp brand guidelines.
 */
export const WhatsAppIcon: React.FC<WhatsAppIconProps> = ({
  className = "w-5 h-5",
}) => (
  <svg
    className={className}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* WhatsApp Green Speech Bubble with Tail */}
    <path
      d="M24 4C12.95 4 4 12.95 4 24C4 27.52 4.92 30.82 6.53 33.68L4.1 43.9L14.6 41.52C17.38 43.08 20.59 44 24 44C35.05 44 44 35.05 44 24C44 12.95 35.05 4 24 4Z"
      fill="#25D366"
    />
    {/* WhatsApp White Phone Handset */}
    <path
      d="M35.22 29.83C34.73 29.58 32.32 28.39 31.87 28.23C31.42 28.06 31.1 27.98 30.77 28.47C30.44 28.97 29.52 30.05 29.23 30.38C28.95 30.71 28.66 30.75 28.17 30.5C27.68 30.25 26.09 29.73 24.2 28.04C22.73 26.73 21.73 25.11 21.44 24.62C21.16 24.13 21.41 23.86 21.66 23.61C21.88 23.39 22.15 23.03 22.4 22.74C22.64 22.45 22.73 22.25 22.89 21.92C23.05 21.59 22.97 21.31 22.85 21.06C22.73 20.81 21.75 18.4 21.34 17.41C20.94 16.45 20.54 16.58 20.24 16.56H19.29C18.97 16.56 18.44 16.68 17.99 17.18C17.54 17.67 16.27 18.86 16.27 21.28C16.27 23.7 18.03 26.01 18.28 26.34C18.52 26.67 21.74 31.64 26.65 33.76C27.82 34.26 28.74 34.56 29.45 34.79C30.63 35.16 31.7 35.11 32.55 34.98C33.5 34.84 35.47 33.79 35.88 32.63C36.29 31.47 36.29 30.49 36.17 30.28C36.05 30.08 35.72 29.95 35.22 29.83Z"
      fill="#FFFFFF"
    />
  </svg>
);

export default WhatsAppIcon;
