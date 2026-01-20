// Use local images from public/hero folder instead of Firebase
export const fetchImages = async () => {
  // Local hero images from public/hero/
  const localImages = [
    {
      url: '/hero/1president.jpg',
      description: 'Smart Village Revolution Leadership'
    },
    {
      url: '/hero/Adarsh_Gram.jpg',
      description: 'Adarsh Gram Initiative'
    },
    {
      url: '/hero/hero11.jpeg',
      description: 'Community Development'
    },
    {
      url: '/hero/hero6.jpg',
      description: 'Village Transformation'
    }
  ];

  // Return a promise to maintain the same async API
  return Promise.resolve(localImages);
};
