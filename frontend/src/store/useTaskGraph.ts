import { create } from 'zustand';
import { dagreEngine } from '../layout/dagreEngine';
import { HttpTaskService } from '../api/TaskService';
import { v4 as uuidv4 } from 'uuid';
import type { Node, Edge, Connection } from 'reactflow';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const taskService = new HttpTaskService(API_URL);

interface TaskGraphState {
  nodes: Node[];
  edges: Edge[];
  load: () => Promise<void>;
  addTask: () => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateNodeData: (id: string, changes: any) => Promise<void>;
  addLinkedNode: (sourceId: string) => Promise<void>;
  onConnect: (connection: Connection) => Promise<void>;
  onEdgesChangeWithDelete: (changes: any) => void;
  autoLayout: () => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
}

export const useTaskGraph = create<TaskGraphState>((set, get) => ({
  nodes: [],
  edges: [],

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  load: async () => {
    const { tasks, edges } = await taskService.fetchAll();
    const initialNodes = tasks.map((t) => ({
      id: t.id,
      type: 'task',
      position: { x: 0, y: 0 },
      data: { label: t.label, status: t.status, priority: t.priority },
    }));
    const initialEdges = edges.map((e) => ({ id: e.id, source: e.source, target: e.target }));
    set({ edges: initialEdges });
    set({ nodes: dagreEngine.layout(initialNodes, initialEdges) });
  },

  addTask: async () => {
    const nodes = get().nodes;
    const edges = get().edges;
    const newId = uuidv4();
    const newTask = {
      id: newId,
      label: `Tâche ${nodes.length + 1}`,
      status: 'À faire',
      // priority supprimée
    };
    const newNodes = [
      ...nodes,
      {
        id: newId,
        type: 'task',
        position: { x: 200 + Math.random() * 200, y: 200 + Math.random() * 100 },
        data: { ...newTask },
      },
    ];
    set({ nodes: dagreEngine.layout(newNodes, edges) });
    await taskService.createTask(newTask);
  },

  deleteTask: async (id) => {
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== id),
      edges: state.edges.filter((edge) => edge.source !== id && edge.target !== id),
    }));
    await taskService.deleteTask(id);
  },

  updateNodeData: async (id, changes) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...changes } } : node
      ),
    }));
    await taskService.updateTask(id, { ...changes });
  },

  addLinkedNode: async (sourceId) => {
    const nodes = get().nodes;
    const edges = get().edges;
    const newId = uuidv4();
    const newTask = {
      id: newId,
      label: `Tâche ${nodes.length + 1}`,
      status: 'À faire',
      // priority supprimée
    };
    const sourceNode = nodes.find((n) => n.id === sourceId);
    const pos = sourceNode ? { x: sourceNode.position.x + 180, y: sourceNode.position.y + 40 } : { x: 200, y: 200 };
    const edgeId = `edge_${Math.random().toString(36).slice(2, 9)}`;
    const newNodes = [
      ...nodes,
      {
        id: newId,
        type: 'task',
        position: pos,
        data: { ...newTask },
      },
    ];
    const newEdge = { id: edgeId, source: sourceId, target: newId };
    set({
      nodes: dagreEngine.layout(newNodes, [...edges, newEdge]),
      edges: [...edges, newEdge],
    });
    await taskService.createTask(newTask);
    await taskService.createEdge({ id: edgeId, source: sourceId, target: newId });
  },

  onConnect: async (connection) => {
    const edges = get().edges;
    const edgeId = `edge_${Math.random().toString(36).slice(2, 9)}`;
    // Correction : source et target ne doivent pas être null
    if (!connection.source || !connection.target) return;
    const newEdge = { ...connection, id: edgeId, source: connection.source, target: connection.target };
    set({ edges: [...edges, newEdge] });
    await taskService.createEdge({ id: edgeId, source: connection.source, target: connection.target });
  },

  onEdgesChangeWithDelete: (changes) => {
    changes.forEach(async (change: any) => {
      if (change.type === 'remove') {
        set((state) => ({ edges: state.edges.filter((e) => e.id !== change.id) }));
        await taskService.deleteEdge(change.id);
      }
    });
  },

  autoLayout: () => {
    const nodes = get().nodes;
    const edges = get().edges;
    set({ nodes: dagreEngine.layout(nodes, edges) });
  },
})); 