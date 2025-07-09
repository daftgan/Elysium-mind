import React from "react";
import { Flex, Box, Heading, Spacer, Button, IconButton } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { BrainIcon } from "./BrainIcon";

interface Props {
  onAddTask: () => void;
  onAutoLayout: () => void;
}

/**
 * Barre d'en-tête contenant le logo, le titre et les actions principales.
 */
const TaskHeader: React.FC<Props> = ({ onAddTask, onAutoLayout }) => {
  return (
    <Flex
      as="header"
      align="center"
      bg="gray.800"
      px={4}
      py={1}
      boxShadow="md"
      position="absolute"
      top={0}
      left={0}
      w="100vw"
      zIndex={2}
      h="44px"
    >
      {/* Logo */}
      <Box as="span" mr={2} display="flex" alignItems="center">
        <BrainIcon width={28} height={28} />
      </Box>

      {/* Titre */}
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

      {/* Actions */}
      <Button size="xs" colorScheme="purple" mr={2} onClick={onAutoLayout}>
        Auto-layout
      </Button>
      <IconButton
        aria-label="Add task"
        icon={<AddIcon boxSize={3} />}
        colorScheme="teal"
        size="xs"
        onClick={onAddTask}
      />
    </Flex>
  );
};

export default TaskHeader; 