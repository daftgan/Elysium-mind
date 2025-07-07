import React, { useCallback, useEffect } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
} from "reactflow";
import type { Node, Edge } from "reactflow";
import "reactflow/dist/style.css";
import {
  Box,
  Button,
  Input,
  Select,
  useColorModeValue,
  IconButton,
  HStack,
  VStack,
  Text,
  useToast,
  Checkbox,
  Flex,
  Spacer,
  Heading,
} from "@chakra-ui/react";
import { CloseIcon, AddIcon } from "@chakra-ui/icons";

const statusOptions = ["À faire", "En cours", "Terminée"];
const priorityOptions = ["Basse", "Moyenne", "Haute"];

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function TaskNode({ data }: { data: any }) {
  const bg = useColorModeValue("gray.800", "gray.700");
  const border = useColorModeValue("gray.600", "gray.500");
  const color = useColorModeValue("gray.100", "gray.100");
  return (
    <Box
      p={3}
      bg={bg}
      color={color}
      borderRadius="md"
      minW="180px"
      boxShadow="md"
      borderWidth="1px"
      borderColor={border}
      position="relative"
    >
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <IconButton
        aria-label="Add linked node"
        icon={<AddIcon boxSize={3} />}
        size="xs"
        colorScheme="teal"
        position="absolute"
        right={-4}
        top="50%"
        transform="translateY(-50%)"
        zIndex={1}
        onClick={data.onAddLinkedNode}
      />
      <HStack spacing={2} alignItems="center">
        <Input
          value={data.label}
          onChange={data.onLabelChange}
          fontWeight="bold"
          border="none"
          bg="gray.900"
          color="gray.100"
          borderRadius="md"
          px={2}
          py={1}
          size="sm"
          _focus={{ boxShadow: "outline" }}
        />
        <IconButton
          aria-label="Delete task"
          icon={<CloseIcon boxSize={3} />}
          size="xs"
          colorScheme="red"
          variant="ghost"
          onClick={data.onDelete}
        />
      </HStack>
      <HStack spacing={2} mt={2}>
        <Text fontSize="xs" whiteSpace="nowrap">Priorité :</Text>
        <Select size="xs" value={data.priority} onChange={data.onPriorityChange} bg="gray.900" color="gray.100">
          {priorityOptions.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </Select>
      </HStack>
    </Box>
  );
}

const nodeTypes = { task: TaskNode };

let id = 1;
const getId = () => `task_${id++}`;

export default function TaskManager() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<any>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge<any>>([]);
  const toast = useToast();

  // Chargement initial depuis le backend
  useEffect(() => {
    fetch(`${API_URL}/tasks`)
      .then((res) => res.json())
      .then(({ tasks, edges }) => {
        setNodes(tasks.map((t: any) => ({
          id: t.id,
          type: "task",
          position: { x: 100 + Math.random() * 300, y: 100 + Math.random() * 200 },
          data: { label: t.label, status: t.status, priority: t.priority },
        })));
        setEdges(edges.map((e: any) => ({ id: e.id, source: e.source, target: e.target })));
      });
  }, [setNodes, setEdges]);

  // Ajout d'une nouvelle tâche
  const addTask = async () => {
    const newId = getId();
    const newTask = {
      id: newId,
      label: `Tâche ${nodes.length + 1}`,
      status: "À faire",
      priority: "Basse",
    };
    setNodes((nds: Node<any>[]) => [
      ...nds,
      {
        id: newId,
        type: "task",
        position: { x: 200 + Math.random() * 200, y: 200 + Math.random() * 100 },
        data: { ...newTask },
      },
    ]);
    await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    });
    toast({ title: "Tâche ajoutée", status: "success", duration: 1500, isClosable: true });
  };

  // Suppression d'une tâche
  const deleteTask = async (id: string) => {
    setNodes((nds: Node<any>[]) => nds.filter((node: Node<any>) => node.id !== id));
    setEdges((eds: Edge<any>[]) => eds.filter((edge: Edge<any>) => edge.source !== id && edge.target !== id));
    await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
    toast({ title: "Tâche supprimée", status: "info", duration: 1500, isClosable: true });
  };

  // Mise à jour d'une tâche
  const updateNodeData = async (id: string, changes: any) => {
    setNodes((nds: Node<any>[]) =>
      nds.map((node: Node<any>) =>
        node.id === id ? { ...node, data: { ...node.data, ...changes } } : node
      )
    );
    const node = nodes.find((n) => n.id === id);
    if (node) {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...node.data, ...changes }),
      });
    }
  };

  // Ajout d'un node relié à un node existant
  const addLinkedNode = async (sourceId: string) => {
    const newId = getId();
    const newTask = {
      id: newId,
      label: `Tâche ${nodes.length + 1}`,
      status: "À faire",
      priority: "Basse",
    };
    // Position à côté du node source
    const sourceNode = nodes.find((n) => n.id === sourceId);
    const pos = sourceNode ? { x: sourceNode.position.x + 180, y: sourceNode.position.y + 40 } : { x: 200, y: 200 };
    // Ajout du node côté frontend
    setNodes((nds: Node<any>[]) => [
      ...nds,
      {
        id: newId,
        type: "task",
        position: pos,
        data: { ...newTask },
      },
    ]);
    // Créer l'edge en utilisant addEdge
    const edgeId = `edge_${Math.random().toString(36).slice(2, 9)}`;
    const newEdge = { id: edgeId, source: sourceId, target: newId };
    setEdges((eds) => addEdge(newEdge, eds));
    console.log('Edge added:', newEdge);
    // Ajout du node côté backend
    await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    });
    // Ajout du lien côté backend
    await fetch(`${API_URL}/edges`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: edgeId, source: sourceId, target: newId }),
    });
  };

  // Ajout d'une liaison entre deux tâches
  const onConnect = useCallback(async (params: Edge<any> | any) => {
    setEdges((eds: Edge<any>[]) => addEdge(params, eds));
    const edgeId = `edge_${Math.random().toString(36).slice(2, 9)}`;
    await fetch(`${API_URL}/edges`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: edgeId, source: params.source, target: params.target }),
    });
  }, [setEdges]);

  // Suppression d'une liaison
  const onEdgesChangeWithDelete = useCallback((changes: any) => {
    changes.forEach(async (change: any) => {
      if (change.type === "remove") {
        await fetch(`${API_URL}/edges/${change.id}`, { method: "DELETE" });
      }
    });
    onEdgesChange(changes);
  }, [onEdgesChange]);

  // Injection des handlers dans les nodes
  const nodesWithHandlers = nodes.map((node: Node<any>) => ({
    ...node,
    data: {
      ...node.data,
      onCheck: () => updateNodeData(node.id, { status: node.data.status === "Terminée" ? "À faire" : "Terminée" }),
      onStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => updateNodeData(node.id, { status: e.target.value }),
      onPriorityChange: (e: React.ChangeEvent<HTMLSelectElement>) => updateNodeData(node.id, { priority: e.target.value }),
      onLabelChange: (e: React.ChangeEvent<HTMLInputElement>) => updateNodeData(node.id, { label: e.target.value }),
      onDelete: () => deleteTask(node.id),
      onAddLinkedNode: () => addLinkedNode(node.id),
    },
  }));

  return (
    <Box w="100vw" h="100vh" bg="gray.900" m={0} p={0} position="fixed" top={0} left={0} zIndex={0}>
      <Flex as="header" align="center" bg="gray.800" px={4} py={1} boxShadow="md" position="absolute" top={0} left={0} w="100vw" zIndex={2} h="44px">
        <Box as="span" mr={2} display="flex" alignItems="center">
          {/* Brain flat design SVG icon */}
          <svg width="28" height="28" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="20" cy="32" rx="16" ry="20" fill="#90cdf4"/>
            <ellipse cx="44" cy="32" rx="16" ry="20" fill="#b794f4"/>
            <ellipse cx="32" cy="32" rx="18" ry="22" fill="#a0aec0" fillOpacity="0.5"/>
            <ellipse cx="32" cy="32" rx="14" ry="18" fill="#f7fafc" fillOpacity="0.7"/>
            <path d="M32 14C28 14 28 22 32 22C36 22 36 14 32 14Z" fill="#805ad5"/>
            <path d="M32 50C28 50 28 42 32 42C36 42 36 50 32 50Z" fill="#3182ce"/>
          </svg>
        </Box>
        <Heading
          as="h1"
          size="sm"
          fontWeight="bold"
          bgGradient="linear(to-r, blue.300, purple.400)"
          bgClip="text"
        >
          Elysium Mind
        </Heading>
        <Spacer />
        <IconButton
          aria-label="Add task"
          icon={<AddIcon boxSize={3} />}
          colorScheme="teal"
          size="xs"
          onClick={addTask}
        />
      </Flex>
      <Box w="100vw" h="100vh" m={0} p={0} pt="60px">
        <ReactFlow
          nodes={nodesWithHandlers}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChangeWithDelete}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          {/* <MiniMap /> */}
          <Controls />
          <Background gap={16} />
        </ReactFlow>
      </Box>
    </Box>
  );
} 