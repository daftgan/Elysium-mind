import React, { useCallback, useEffect, useRef, useMemo } from "react";
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
import type { Node, Edge, ReactFlowInstance } from "reactflow";
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
import { BrainIcon } from "./components/BrainIcon";
import { useTaskGraph } from "./store/useTaskGraph";

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
      _hover={{
        "& .add-button": {
          opacity: 1,
          visibility: "visible",
        }
      }}
    >
      {data.hasIncoming && <Handle type="target" position={Position.Left} />}
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
        className="add-button"
        opacity={0}
        visibility="hidden"
        transition="all 0.2s ease-in-out"
        _hover={{
          transform: "translateY(-50%) scale(1.1)",
        }}
      />
      <HStack spacing={2} alignItems="center">
        <Checkbox
          isChecked={data.status === "Terminée"}
          onChange={data.onCheck}
          colorScheme="teal"
          size="sm"
        />
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
          textDecoration={data.status === "Terminée" ? "line-through" : "none"}
          opacity={data.status === "Terminée" ? 0.7 : 1}
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

  // Injection des handlers dans les nodes
  const nodesWithHandlers = nodes.map((node: Node<any>) => {
    const hasIncoming = edges.some((e) => e.target === node.id);
    const hasOutgoing = edges.some((e) => e.source === node.id);
    return {
      ...node,
      data: {
        ...node.data,
        onCheck: () => updateNodeData(node.id, { status: node.data.status === "Terminée" ? "À faire" : "Terminée" }),
        onStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => updateNodeData(node.id, { status: e.target.value }),
        onPriorityChange: (e: React.ChangeEvent<HTMLSelectElement>) => updateNodeData(node.id, { priority: e.target.value }),
        onLabelChange: (e: React.ChangeEvent<HTMLInputElement>) => updateNodeData(node.id, { label: e.target.value }),
        onDelete: () => deleteTask(node.id),
        onAddLinkedNode: () => addLinkedNode(node.id),
        hasIncoming,
        hasOutgoing,
      },
    };
  });

  useEffect(() => {
    if (!hasInitialFit.current && nodes.length > 0) {
      reactFlowInstance.current?.fitView({ padding: 0.2 });
      hasInitialFit.current = true;
    }
  }, [nodes]);

  return (
    <Box w="100vw" h="100vh" bg="gray.900" m={0} p={0} position="fixed" top={0} left={0} zIndex={0}>
      <Flex as="header" align="center" bg="gray.800" px={4} py={1} boxShadow="md" position="absolute" top={0} left={0} w="100vw" zIndex={2} h="44px">
        <Box as="span" mr={2} display="flex" alignItems="center">
          <BrainIcon width={28} height={28} />
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
        <Button size="xs" colorScheme="purple" mr={2} onClick={autoLayout}>Auto-layout</Button>
        <IconButton
          aria-label="Add task"
          icon={<AddIcon boxSize={3} />}
          colorScheme="teal"
          size="xs"
          onClick={addTask}
        />
      </Flex>
      <Box w="100vw" h="calc(100vh - 44px)" m={0} p={0} pt="0" position="absolute" top="44px" left={0}>
        <ReactFlow
          onInit={(instance) => (reactFlowInstance.current = instance)}
          nodes={nodesWithHandlers}
          edges={edges}
          onNodesChange={() => {}}
          onEdgesChange={onEdgesChangeWithDelete}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          maxZoom={1}
          minZoom={0.05}   /* autorise un zoom-out jusqu'à 5 % */
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