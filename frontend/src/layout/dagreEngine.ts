import dagre from "dagre";
import type { Node as RFNode, Edge as RFEdge } from "reactflow";

export interface LayoutEngine {
  layout(nodes: RFNode[], edges: RFEdge[]): RFNode[];
}

// Paramètres de layout – peuvent être rendus configurables au besoin
const nodeWidth = 220;
const nodeHeight = 110;
const nodePadding = 80;
const nodeSeparation = 50;
const rankSeparation = 160;
const layoutDirection: "TB" | "LR" = "LR";

function layout(nodes: RFNode[], edges: RFEdge[]): RFNode[] {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: layoutDirection,
    nodesep: nodeSeparation,
    ranksep: rankSeparation,
    ranker: "tight-tree",
  });

  nodes.forEach((node) => {
    g.setNode(node.id, {
      width: nodeWidth + nodePadding,
      height: nodeHeight + nodePadding,
    });
  });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));

  dagre.layout(g);

  return nodes.map((node) => {
    const p = g.node(node.id);
    return {
      ...node,
      position: {
        x: p.x - nodeWidth / 2,
        y: p.y - nodeHeight / 2,
      },
    };
  });
}

export const dagreEngine: LayoutEngine = { layout }; 