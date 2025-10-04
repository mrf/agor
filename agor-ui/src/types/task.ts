// src/types/task.ts
export type TaskStatus = 'created' | 'running' | 'completed' | 'failed';

export interface Task {
  task_id: string;
  session_id: string;
  description: string; // Short summary or auto-generated title
  full_prompt?: string; // Original user prompt (can be multi-line)
  auto_generated_title?: boolean; // True if description was LLM-generated
  status: TaskStatus;

  // Message range
  message_range: {
    start_index: number;
    end_index: number;
    start_timestamp: string;
    end_timestamp?: string;
  };

  // Git state
  git_state: {
    sha_at_start: string;
    sha_at_end?: string;
    commit_message?: string;
  };

  // Model
  model: string;

  // Report
  report?: {
    template: string;
    path: string;
    generated_at: string;
  };

  created_at: string;
  completed_at?: string;
}
