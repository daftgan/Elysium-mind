import React, { useState, useEffect } from "react";
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
import { themeConfig } from "../config/theme";

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
  const bg = themeConfig.nodes.colors.background;
  const border = themeConfig.nodes.colors.border;
  const color = themeConfig.nodes.colors.text;

  // État local pour l’édition du label
  const [localLabel, setLocalLabel] = useState(data.label);

  // Synchronise si le label change depuis l’extérieur (undo, reload, etc.)
  useEffect(() => {
    setLocalLabel(data.label);
  }, [data.label]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalLabel(e.target.value);
  };

  const handleBlur = () => {
    if (localLabel !== data.label) {
      data.onLabelChange({ target: { value: localLabel } } as any);
    }
  };

  return (
    <Box
      p={3}
      bg={bg}
      color={color}
      borderRadius={themeConfig.nodes.borderRadius}
      minW="180px"
      boxShadow={themeConfig.nodes.shadow}
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
          size={themeConfig.checkbox.size}
          borderRadius={themeConfig.checkbox.borderRadius}
          onChange={data.onCheck}
          sx={{
            ".chakra-checkbox__control": {
              borderColor: themeConfig.checkbox.color,
              borderWidth: themeConfig.checkbox.borderWidth,
              borderRadius: themeConfig.checkbox.borderRadius,
              _hover: {
                bg: "transparent",
                borderColor: themeConfig.checkbox.color,
              },
            },
            _checked: {
              "& .chakra-checkbox__control": {
                bg: "transparent", // pas de fond quand checked
                borderColor: themeConfig.checkbox.color,
                borderWidth: themeConfig.checkbox.borderWidth,
                borderRadius: themeConfig.checkbox.borderRadius,
                "--checkbox-color": themeConfig.checkbox.color,
              },
              "& svg": {
                fill: themeConfig.checkbox.color,
                stroke: themeConfig.checkbox.color,
                color: themeConfig.checkbox.color,
              },
              "& .chakra-checkbox__icon": {
                color: themeConfig.checkbox.color,
              },
            },
            // neutraliser le hover même quand checked
            ".chakra-checkbox__control[data-hover]": {
              bg: "transparent",
              borderColor: themeConfig.checkbox.color,
            },
          }}
        />
        <Input
          value={localLabel}
          onChange={handleChange}
          onBlur={handleBlur}
          fontWeight="normal"
          variant="unstyled" // supprime toute bordure par défaut
          color={data.status === "Terminée" ? themeConfig.nodes.colors.textCompleted : themeConfig.nodes.colors.text}
          px={1}
          py={1}
          fontSize={themeConfig.nodes.fontSize}
          textDecoration={data.status === "Terminée" ? "line-through" : "none"}
          sx={data.status === "Terminée" ? {
            textDecorationColor: "white",
            textDecorationThickness: "1px",
          } : {}}
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