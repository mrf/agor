import { Session, Task } from '../../types';
import { Drawer, Typography, Space, Badge, Tag, Divider, Timeline } from 'antd';
import { BranchesOutlined, ForkOutlined, ClockCircleOutlined, CodeOutlined, FileTextOutlined } from '@ant-design/icons';
import './SessionDrawer.css';

const { Title, Text, Paragraph } = Typography;

interface SessionDrawerProps {
  session: Session | null;
  tasks: Task[];
  open: boolean;
  onClose: () => void;
}

const SessionDrawer = ({ session, tasks, open, onClose }: SessionDrawerProps) => {
  if (!session) return null;

  const getStatusColor = () => {
    switch (session.status) {
      case 'running':
        return 'processing';
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
      case 'idle':
      default:
        return 'default';
    }
  };

  const getAgentIcon = () => {
    const agentIcons: Record<string, string> = {
      'claude-code': '🤖',
      'cursor': '✏️',
      'codex': '💻',
      'gemini': '💎',
    };
    return agentIcons[session.agent] || '🤖';
  };

  const getTaskStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'running':
        return '⚡';
      case 'failed':
        return '✗';
      case 'created':
      default:
        return '○';
    }
  };

  const getTaskStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'running':
        return 'blue';
      case 'failed':
        return 'red';
      case 'created':
      default:
        return 'gray';
    }
  };

  const isForked = !!session.genealogy.forked_from_session_id;
  const isSpawned = !!session.genealogy.parent_session_id;

  return (
    <Drawer
      title={
        <Space size={12} align="center">
          <span style={{ fontSize: 24 }}>{getAgentIcon()}</span>
          <div>
            <div>
              <Text strong style={{ fontSize: 16 }}>
                {session.agent}
              </Text>
              <Badge status={getStatusColor()} text={session.status.toUpperCase()} style={{ marginLeft: 12 }} />
            </div>
            {session.description && (
              <Text type="secondary" style={{ fontSize: 14 }}>
                {session.description}
              </Text>
            )}
          </div>
        </Space>
      }
      placement="right"
      width={720}
      open={open}
      onClose={onClose}
      className="session-drawer"
    >
      {/* Genealogy Tags */}
      {(isForked || isSpawned) && (
        <div className="drawer-section">
          <Space size={8}>
            {isForked && (
              <Tag icon={<ForkOutlined />} color="cyan">
                FORKED from {session.genealogy.forked_from_session_id?.substring(0, 7)}
                {session.genealogy.fork_point_task_id && ` at task ${session.genealogy.fork_point_task_id.substring(0, 7)}`}
              </Tag>
            )}
            {isSpawned && (
              <Tag icon={<BranchesOutlined />} color="purple">
                SPAWNED from {session.genealogy.parent_session_id?.substring(0, 7)}
                {session.genealogy.spawn_point_task_id && ` at task ${session.genealogy.spawn_point_task_id.substring(0, 7)}`}
              </Tag>
            )}
          </Space>
        </div>
      )}

      {/* Git State */}
      <div className="drawer-section">
        <Title level={5}>Git State</Title>
        <Space direction="vertical" size={4}>
          <Text>
            <CodeOutlined /> Branch: <Text code>{session.git_state.ref}</Text>
          </Text>
          <Text>
            Base SHA: <Text code>{session.git_state.base_sha}</Text>
          </Text>
          <Text>
            Current SHA: <Text code>{session.git_state.current_sha}</Text>
          </Text>
        </Space>
      </div>

      {/* Worktree Info */}
      {session.worktree && (
        <div className="drawer-section">
          <Title level={5}>Worktree</Title>
          <Text>
            Path: <Text code>{session.worktree.path}</Text>
          </Text>
          {session.worktree.managed_by_agor && (
            <Tag color="blue" style={{ marginLeft: 8 }}>Managed by Agor</Tag>
          )}
        </div>
      )}

      {/* Concepts */}
      {session.concepts.length > 0 && (
        <div className="drawer-section">
          <Title level={5}>Loaded Concepts</Title>
          <Space size={8} wrap>
            {session.concepts.map((concept) => (
              <Tag key={concept} color="geekblue">
                📦 {concept}
              </Tag>
            ))}
          </Space>
        </div>
      )}

      <Divider />

      {/* Task Timeline */}
      <div className="drawer-section">
        <Title level={5}>
          Task History ({tasks.length} {tasks.length === 1 ? 'task' : 'tasks'})
        </Title>

        <Timeline
          mode="left"
          items={tasks.map((task) => ({
            color: getTaskStatusColor(task.status),
            dot: task.status === 'running' ? <ClockCircleOutlined /> : undefined,
            children: (
              <div className="task-timeline-item">
                <div className="task-timeline-header">
                  <Space size={8}>
                    <span className="task-status-icon">{getTaskStatusIcon(task.status)}</span>
                    <Text strong>{task.description}</Text>
                    {task.auto_generated_title && (
                      <Tag color="purple" style={{ fontSize: 10 }}>AUTO</Tag>
                    )}
                  </Space>
                </div>

                {task.full_prompt && (
                  <div className="task-full-prompt">
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Full prompt:
                    </Text>
                    <Paragraph
                      ellipsis={{ rows: 3, expandable: true, symbol: 'show more' }}
                      style={{
                        marginTop: 4,
                        padding: 8,
                        background: 'rgba(0, 0, 0, 0.02)',
                        borderRadius: 4,
                        fontSize: 13,
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      {task.full_prompt}
                    </Paragraph>
                  </div>
                )}

                <Space size={16} style={{ marginTop: 8 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    💬 {task.message_range.end_index - task.message_range.start_index + 1} messages
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    🤖 {task.model}
                  </Text>
                  {task.git_state.sha_at_end && (
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      📝 {task.git_state.sha_at_start.substring(0, 7)} → {task.git_state.sha_at_end.substring(0, 7)}
                    </Text>
                  )}
                  {task.report && (
                    <Tag icon={<FileTextOutlined />} color="green" style={{ fontSize: 11 }}>
                      Report
                    </Tag>
                  )}
                </Space>

                {task.git_state.commit_message && (
                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Commit: <Text code style={{ fontSize: 11 }}>{task.git_state.commit_message}</Text>
                    </Text>
                  </div>
                )}

                <div style={{ marginTop: 4 }}>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    {new Date(task.created_at).toLocaleString()}
                    {task.completed_at && ` → ${new Date(task.completed_at).toLocaleString()}`}
                  </Text>
                </div>
              </div>
            ),
          }))}
        />
      </div>

      {/* Session Metadata */}
      <Divider />
      <div className="drawer-section">
        <Title level={5}>Session Metadata</Title>
        <Space direction="vertical" size={4} style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text type="secondary">Session ID:</Text>
            <Text code>{session.session_id}</Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text type="secondary">Total Messages:</Text>
            <Text>{session.message_count}</Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text type="secondary">Created:</Text>
            <Text>{new Date(session.created_at).toLocaleString()}</Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text type="secondary">Last Updated:</Text>
            <Text>{new Date(session.last_updated).toLocaleString()}</Text>
          </div>
          {session.agent_version && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text type="secondary">Agent Version:</Text>
              <Text code>{session.agent_version}</Text>
            </div>
          )}
        </Space>
      </div>
    </Drawer>
  );
};

export default SessionDrawer;
