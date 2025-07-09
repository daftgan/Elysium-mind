// Configuration des paramètres de layout dagre
export const layoutConfig = {
  // Dimensions des nodes
  node: {
    width: 220,
    height: 110,
    padding: 80,
  },

  // Espacement entre les éléments
  spacing: {
    nodeSeparation: 20,    // Espacement horizontal entre nodes
    rankSeparation: 20,   // Espacement vertical entre rangs
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

// Fonction utilitaire pour calculer les dimensions des nodes
export const getNodeDimensions = () => ({
  width: layoutConfig.node.width + layoutConfig.node.padding,
  height: layoutConfig.node.height + layoutConfig.node.padding,
});

// Fonction utilitaire pour ajuster la position finale
export const adjustNodePosition = (node: any, dagreNode: any) => ({
  x: dagreNode.x - layoutConfig.node.width / 2,
  y: dagreNode.y - layoutConfig.node.height / 2,
}); 