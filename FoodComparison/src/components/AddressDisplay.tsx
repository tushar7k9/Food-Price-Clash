import React from 'react';

interface AddressDisplayProps {
  address: string;
  maxLength?: number;
  className?: string;
}

const AddressDisplay: React.FC<AddressDisplayProps> = ({
  address,
  maxLength = 30,
  className = ''
}) => {


  if (!address) return null;

  const shouldTruncate = address.length > maxLength;
  const displayAddress = shouldTruncate
    ? `${address.substring(0, maxLength)}...`
    : address;

  return (
    <div className={`relative group ${className}`}>
      <span className={`${shouldTruncate ? 'cursor-pointer' : ''}`}>
        {displayAddress}
      </span>

      {shouldTruncate && (
        <div className="invisible group-hover:visible absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md whitespace-nowrap">
          {address}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
};

export default AddressDisplay;