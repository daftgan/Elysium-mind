export interface TaskDTO {
  id: string;
  label: string;
  status: string;
  priority?: string; // optionnel dorénavant
}

export interface EdgeDTO {
  id: string;
  source: string;
  target: string;
}

export interface ITaskService {
  fetchAll(): Promise<{ tasks: TaskDTO[]; edges: EdgeDTO[] }>;
  createTask(task: TaskDTO): Promise<void>;
  updateTask(id: string, changes: Partial<TaskDTO>): Promise<void>;
  deleteTask(id: string): Promise<void>;
  createEdge(edge: EdgeDTO): Promise<void>;
  deleteEdge(id: string): Promise<void>;
}

export class HttpTaskService implements ITaskService {
  baseUrl: string;
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  }

  async fetchAll() {
    return this.request<{ tasks: TaskDTO[]; edges: EdgeDTO[] }>(`${this.baseUrl}/tasks`);
  }

  async createTask(task: TaskDTO) {
    await fetch(`${this.baseUrl}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
  }

  async updateTask(id: string, changes: Partial<TaskDTO>) {
    await fetch(`${this.baseUrl}/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changes),
    });
  }

  async deleteTask(id: string) {
    await fetch(`${this.baseUrl}/tasks/${id}`, { method: "DELETE" });
  }

  async createEdge(edge: EdgeDTO) {
    await fetch(`${this.baseUrl}/edges`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(edge),
    });
  }

  async deleteEdge(id: string) {
    await fetch(`${this.baseUrl}/edges/${id}`, { method: "DELETE" });
  }
} 