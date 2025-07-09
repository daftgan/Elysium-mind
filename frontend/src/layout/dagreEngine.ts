import dagre from "dagre";
import type { Node as RFNode, Edge as RFEdge } from "reactflow";
import { createDagreConfig, getNodeDimensions, adjustNodePosition } from "../config/layout";

export interface LayoutEngine {
  layout(nodes: RFNode[], edges: RFEdge[]): RFNode[];
}

function layout(nodes: RFNode[], edges: RFEdge[]): RFNode[] {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph(createDagreConfig());

  nodes.forEach((node) => {
    g.setNode(node.id, getNodeDimensions());
  });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));

  dagre.layout(g);

  return nodes.map((node) => {
    const p = g.node(node.id);
    return {
      ...node,
      position: adjustNodePosition(node, p),
    };
  });
}

export const dagreEngine: LayoutEngine = { layout }; 