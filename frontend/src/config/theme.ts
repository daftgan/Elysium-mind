// Configuration des paramètres de look et thème
export const themeConfig = {
  // Palette Chocolate Velvet
  colors: {
    primary: '#010332',    // Bleu nuit profond
    secondary: '#100328',  // Violet sombre
    tertiary: '#29011C',   // Brun rouge
    quaternary: '#43000D', // Rouge foncé
    accent: '#530005',     // Rouge profond
  },

  // Configuration du fond multi-layers
  background: {
    noise: {
      opacity: 0.02,
      frequency: 0.65,
      octaves: 3,
    },
    gradients: [
      {
        type: 'radial',
        shape: 'circle',
        position: '20% 30%',
        color: '#010332',
        size: '40%',
      },
      {
        type: 'radial',
        shape: 'ellipse',
        position: '80% 40%',
        color: '#100328',
        size: '45%',
      },
      {
        type: 'radial',
        shape: 'circle',
        position: '40% 70%',
        color: '#29011C',
        size: '50%',
      },
      {
        type: 'radial',
        shape: 'ellipse',
        position: '75% 80%',
        color: '#43000D',
        size: '35%',
      },
      {
        type: 'radial',
        shape: 'circle',
        position: '60% 20%',
        color: '#530005',
        size: '30%',
      },
    ],
    blendMode: 'overlay, screen, normal',
  },

  // Configuration des nodes
  nodes: {
    colors: {
      background: '#232323',
      border: '#gray.600',
      text: '#gray.100',
      textCompleted: '#gray.500',
    },
    shadow: '0 2px 6px 0 #111',
    borderRadius: 'xl',
    fontSize: '15.5px',
  },

  // Configuration des edges (liens)
  edges: {
    color: '#00e6ff',
    strokeWidth: 2,
    type: 'smoothstep',
  },

  // Configuration des checkboxes
  checkbox: {
    color: 'white',
    borderWidth: '1px',
    borderRadius: 'lg',
    size: 'lg',
  },
};

// Fonction utilitaire pour générer le CSS du fond
export const generateBackgroundCSS = () => {
  const gradients = themeConfig.background.gradients
    .map(grad => `${grad.type}-gradient(${grad.shape} at ${grad.position}, ${grad.color} 0%, transparent ${grad.size})`)
    .join(',\n            ');

  return `
    /* Noise overlay (${themeConfig.background.noise.opacity * 100}% opacity) */
    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${themeConfig.background.noise.frequency}' numOctaves='${themeConfig.background.noise.octaves}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='${themeConfig.background.noise.opacity}'/%3E%3C/svg%3E"),
    /* Fond organique multi-radial */
    ${gradients}
  `;
}; 