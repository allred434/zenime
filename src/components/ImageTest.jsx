import React, { useState } from 'react';
import { getImageUrl, handleImageError } from '../utils/imageProxy';

const ImageTest = ({ imageUrl }) => {
  const [showDebug, setShowDebug] = useState(false);
  
  // Test URLs
  const testUrl = imageUrl || 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx101922-PEn1CTc93blC.jpg';
  
  // Different image loading strategies
  const directUrl = testUrl;
  const wsrvUrl = `https://wsrv.nl/?url=${testUrl}`;
  const utilityUrl = getImageUrl(testUrl);
  
  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-white">Image Loading Test</h2>
      
      <button 
        onClick={() => setShowDebug(!showDebug)} 
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
      </button>
      
      {showDebug && (
        <div className="mb-4 p-4 bg-gray-700 rounded text-white text-sm">
          <p><strong>Environment:</strong> {window.location.hostname === 'localhost' ? 'Development' : 'Production'}</p>
          <p><strong>Original URL:</strong> {testUrl}</p>
          <p><strong>wsrv.nl URL:</strong> {wsrvUrl}</p>
          <p><strong>Utility URL:</strong> {utilityUrl}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-700 rounded">
          <h3 className="text-lg font-semibold mb-2 text-white">Direct URL</h3>
          <img 
            src={directUrl} 
            alt="Direct URL" 
            className="w-full h-64 object-cover rounded"
            onError={(e) => handleImageError(e)} 
          />
        </div>
        
        <div className="p-4 bg-gray-700 rounded">
          <h3 className="text-lg font-semibold mb-2 text-white">wsrv.nl Proxy</h3>
          <img 
            src={wsrvUrl} 
            alt="wsrv.nl Proxy" 
            className="w-full h-64 object-cover rounded"
            onError={(e) => handleImageError(e)} 
          />
        </div>
        
        <div className="p-4 bg-gray-700 rounded">
          <h3 className="text-lg font-semibold mb-2 text-white">Our Utility</h3>
          <img 
            src={utilityUrl} 
            alt="Our Utility" 
            className="w-full h-64 object-cover rounded"
            onError={(e) => handleImageError(e)} 
          />
        </div>
      </div>
    </div>
  );
};

export default ImageTest; 