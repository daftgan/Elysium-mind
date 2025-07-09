import React from "react";
import {
  Box,
  useColorModeValue,
  IconButton,
  HStack,
  Input,
  Checkbox,
  Select,
  Text,
} from "@chakra-ui/react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { Handle, Position } from "reactflow";

export interface TaskNodeData {
  label: string;
  status: string;
  priority: string;
  hasIncoming: boolean;
  hasOutgoing: boolean;
  onCheck: () => void;
  onStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onPriorityChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onLabelChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
  onAddLinkedNode: () => void;
}

const priorityOptions = ["Basse", "Moyenne", "Haute"];

/**
 * Nœud de tâche individuel affiché dans React Flow.
 * Composant mémoïsé pour éviter les re-rendus inutiles.
 */
const TaskNode: React.FC<{ data: TaskNodeData }> = React.memo(({ data }) => {
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
        },
      }}
    >
      {data.hasIncoming && <Handle type="target" position={Position.Left} />}
      <Handle type="source" position={Position.Right} />

      {/* Bouton d'ajout de nœud lié */}
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

      {/* En-tête du nœud */}
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

      {/* Sélection de la priorité */}
      <HStack spacing={2} mt={2}>
        <Text fontSize="xs" whiteSpace="nowrap">
          Priorité :
        </Text>
        <Select
          size="xs"
          value={data.priority}
          onChange={data.onPriorityChange}
          bg="gray.900"
          color="gray.100"
        >
          {priorityOptions.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </Select>
      </HStack>
    </Box>
  );
});

export default TaskNode; 