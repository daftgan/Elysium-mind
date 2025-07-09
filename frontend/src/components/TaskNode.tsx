import React from "react";
import {
  Box,
  useColorModeValue,
  IconButton,
  HStack,
  Input,
  Checkbox,
} from "@chakra-ui/react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { Handle, Position } from "reactflow";

export interface TaskNodeData {
  label: string;
  status: string;
  // priority supprimé
  hasIncoming: boolean;
  hasOutgoing: boolean;
  onCheck: () => void;
  onStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  // onPriorityChange supprimé
  onLabelChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
  onAddLinkedNode: () => void;
}

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
      <HStack spacing={1} alignItems="center">
        <Checkbox
          isChecked={data.status === "Terminée"}
          colorScheme="whiteAlpha"
          sx={{
            ".chakra-checkbox__control": {
              borderColor: "white",
              borderWidth: "1px", // épaisseur fine
              borderRadius: "lg", // arrondi plus prononcé
              _hover: {
                bg: "transparent",
                borderColor: "white",
              },
            },
            _checked: {
              "& .chakra-checkbox__control": {
                bg: "transparent", // pas de fond quand checked
                borderColor: "white",
                borderWidth: "1px",
                borderRadius: "lg",
                "--checkbox-color": "white", // variable Chakra pour la couleur de l’icône
              },
              "& svg": {
                fill: "white",
                stroke: "white",
                color: "white",
              },
              "& .chakra-checkbox__icon": {
                color: "white",
              },
            },
            // neutraliser le hover même quand checked
            ".chakra-checkbox__control[data-hover]": {
              bg: "transparent",
              borderColor: "white",
            },
          }}
          size="lg" // plus grande – correspond mieux à la taille de la police
          borderRadius="md" // coins plus arrondis
          onChange={data.onCheck}
        />
        <Input
          value={data.label}
          onChange={data.onLabelChange}
          fontWeight="normal"
          variant="unstyled" // supprime toute bordure par défaut
          color="gray.100"
          px={1}
          py={1}
          fontSize="15.5px"
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

      {/* La priorité a été retirée */}
    </Box>
  );
});

export default TaskNode; 