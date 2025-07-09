import React, { useCallback, useEffect, useRef, useMemo } from "react";
import ReactFlow, {
  Controls,
} from "reactflow";
import type { Node, ReactFlowInstance } from "reactflow";
import "reactflow/dist/style.css";
import { Box } from "@chakra-ui/react";
import TaskHeader from "./components/TaskHeader";
import TaskNode from "./components/TaskNode";
import { useTaskGraph } from "./store/useTaskGraph";
import { themeConfig, generateBackgroundCSS } from "./config/theme";

const nodeTypes = { task: TaskNode };

export default function TaskManager() {
  const {
    nodes,
    edges,
    load,
    addTask,
    deleteTask,
    updateNodeData,
    addLinkedNode,
    onConnect,
    onEdgesChangeWithDelete,
    autoLayout,
  } = useTaskGraph();
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);
  const hasInitialFit = useRef(false);

  useEffect(() => { load(); }, [load]);

  // Injection des handlers dans les nodes – mémoïsé pour ne se recalculer que quand nécessaire
  const nodesWithHandlers = useMemo(
    () =>
      nodes.map((node: Node) => {
        const hasIncoming = edges.some((e) => e.target === node.id);
        const hasOutgoing = edges.some((e) => e.source === node.id);
        return {
          ...node,
          data: {
            ...node.data,
            onCheck: () =>
              updateNodeData(node.id, {
                status: node.data.status === "Terminée" ? "À faire" : "Terminée",
              }),
            onStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
              updateNodeData(node.id, { status: e.target.value }),
            onLabelChange: (e: React.ChangeEvent<HTMLInputElement>) =>
              updateNodeData(node.id, { label: e.target.value }),
            onDelete: () => deleteTask(node.id),
            onAddLinkedNode: () => addLinkedNode(node.id),
            hasIncoming,
            hasOutgoing,
          },
        };
      }),
    [nodes, edges, updateNodeData, deleteTask, addLinkedNode]
  );

  useEffect(() => {
    if (!hasInitialFit.current && nodes.length > 0) {
      reactFlowInstance.current?.fitView({ padding: 0.2 });
      hasInitialFit.current = true;
    }
  }, [nodes]);

  // Fonction neutre mémoïsée pour éviter de recréer la référence à chaque render
  const handleNodesChange = useCallback(() => {}, []);

  // Style par défaut des arêtes depuis la config
  const defaultEdgeOptions = useMemo(
    () => ({
      type: themeConfig.edges.type,
      style: {
        stroke: themeConfig.edges.color,
        strokeWidth: themeConfig.edges.strokeWidth,
      },
    }),
    []
  );

  return (
    <Box w="100vw" h="100vh" m={0} p={0} position="fixed" top={0} left={0} zIndex={0}>
      {/* Fond multi-layers avec palette Midnight Blues */}
      <Box
        position="absolute"
        top={0}
        left={0}
        w="100vw"
        h="100vh"
        zIndex={0}
        style={{
          background: generateBackgroundCSS(),
          backgroundBlendMode: themeConfig.background.blendMode,
        }}
      ></Box>
      {/* Barre d'en-tête */}
      <TaskHeader onAddTask={addTask} onAutoLayout={autoLayout} />

      {/* Canvas React Flow */}
      <Box w="100vw" h="calc(100vh - 44px)" m={0} p={0} pt="0" position="absolute" top="44px" left={0}>
        <ReactFlow
          onInit={(instance) => (reactFlowInstance.current = instance)}
          nodes={nodesWithHandlers}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChangeWithDelete}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          maxZoom={1}
          minZoom={0.05}   /* autorise un zoom-out jusqu'à 5 % */
          fitView
        >
          {/* <MiniMap /> */}
          <Controls />
          {/* <Background gap={16} /> */}
        </ReactFlow>
      </Box>
    </Box>
  );
} 