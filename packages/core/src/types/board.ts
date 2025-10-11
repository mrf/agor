import type { BoardID, SessionID } from './id';

export interface Board {
  /** Unique board identifier (UUIDv7) */
  board_id: BoardID;

  name: string;

  /**
   * Optional URL-friendly slug for board
   *
   * Examples: "main", "experiments", "bug-fixes"
   *
   * Allows CLI commands like:
   *   agor session list --board experiments
   * instead of:
   *   agor session list --board 01933e4a
   */
  slug?: string;

  description?: string;

  /** Session IDs in this board */
  sessions: SessionID[];

  /**
   * Session positions on the board canvas
   *
   * Maps session_id -> {x, y} coordinates for React Flow
   * Updated on drag events, isolated from other board operations
   */
  layout?: {
    [sessionId: string]: {
      x: number;
      y: number;
    };
  };

  created_at: string;
  last_updated: string;

  /** User ID of the user who created this board */
  created_by: string;

  /** Hex color for visual distinction */
  color?: string;

  /** Optional emoji/icon */
  icon?: string;
}
