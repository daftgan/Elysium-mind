// Configuration des paramètres de layout dagre
export const layoutConfig = {
  // Espacement entre les éléments
  spacing: {
    nodeSeparation: 20,    // Espacement horizontal entre nodes
    rankSeparation: 20,   // Espacement vertical entre rangs
    nodePadding: 50,     // Espace autour de chaque node
  },

  // Direction du layout
  direction: "LR" as "TB" | "LR", // Left-to-Right ou Top-to-Bottom

  // Algorithme de rangement
  algorithm: {
    ranker: "tight-tree", // Algorithme de rangement des nodes
  },

  // Paramètres de performance
  performance: {
    // Peut être étendu avec d'autres paramètres si nécessaire
  },
};

// Fonction utilitaire pour créer la configuration dagre
export const createDagreConfig = () => ({
  rankdir: layoutConfig.direction,
  nodesep: layoutConfig.spacing.nodeSeparation,
  ranksep: layoutConfig.spacing.rankSeparation,
  ranker: layoutConfig.algorithm.ranker,
});

// Fonction pour obtenir les dimensions réelles d'un node avec padding
export const getNodeRealDimensions = (nodeElement: HTMLElement | null) => {
  if (!nodeElement) {
    // Fallback vers des dimensions par défaut si l'élément n'est pas encore rendu
    return { 
      width: 180 + layoutConfig.spacing.nodePadding * 2, 
      height: 50 + layoutConfig.spacing.nodePadding * 2 
    };
  }
  
  const rect = nodeElement.getBoundingClientRect();
  return {
    width: rect.width + layoutConfig.spacing.nodePadding * 2,
    height: rect.height + layoutConfig.spacing.nodePadding * 2,
  };
};

// Fonction utilitaire pour ajuster la position finale avec les vraies dimensions
export const adjustNodePosition = (node: any, dagreNode: any, realDimensions?: { width: number; height: number }) => {
  const dimensions = realDimensions || { 
    width: 180 + layoutConfig.spacing.nodePadding * 2, 
    height: 50 + layoutConfig.spacing.nodePadding * 2 
  };
  return {
    x: dagreNode.x - dimensions.width / 2,
    y: dagreNode.y - dimensions.height / 2,
  };
}; 