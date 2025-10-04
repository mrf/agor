import { Task } from '../../types';
import { CheckCircleFilled, ThunderboltFilled, ClockCircleOutlined, CloseCircleFilled } from '@ant-design/icons';
import { Space, Tag, Typography, Tooltip } from 'antd';
import './TaskListItem.css';

const { Text } = Typography;

interface TaskListItemProps {
  task: Task;
  onClick?: () => void;
  compact?: boolean;
}

const TaskListItem = ({ task, onClick, compact = false }: TaskListItemProps) => {
  const getStatusIcon = () => {
    switch (task.status) {
      case 'completed':
        return <CheckCircleFilled style={{ color: '#52c41a', fontSize: 16 }} />;
      case 'running':
        return <ThunderboltFilled style={{ color: '#faad14', fontSize: 16 }} />;
      case 'failed':
        return <CloseCircleFilled style={{ color: '#ff4d4f', fontSize: 16 }} />;
      case 'created':
      default:
        return <ClockCircleOutlined style={{ color: '#d9d9d9', fontSize: 16 }} />;
    }
  };

  const messageCount = task.message_range.end_index - task.message_range.start_index + 1;
  const hasReport = !!task.report;

  // Truncate description if too long
  const MAX_LENGTH = 60;
  const description = task.description || task.full_prompt || 'Untitled task';
  const isTruncated = description.length > MAX_LENGTH;
  const displayDescription = isTruncated
    ? description.substring(0, MAX_LENGTH) + '...'
    : description;

  // Use full_prompt for tooltip if available, otherwise use description
  const tooltipText = task.full_prompt || (isTruncated ? description : null);

  return (
    <div className={`task-list-item ${compact ? 'compact' : ''}`} onClick={onClick}>
      <div className="task-header">
        <Space size={8}>
          {getStatusIcon()}
          {tooltipText ? (
            <Tooltip title={<div style={{ whiteSpace: 'pre-wrap' }}>{tooltipText}</div>}>
              <Text className="task-description">{displayDescription}</Text>
            </Tooltip>
          ) : (
            <Text className="task-description">{displayDescription}</Text>
          )}
        </Space>
      </div>

      <div className="task-metadata">
        <Space size={4} wrap>
          <Tag icon={<span>💬</span>} color="default">
            {messageCount} {messageCount === 1 ? 'msg' : 'msgs'}
          </Tag>
          {hasReport && (
            <Tag icon={<span>📄</span>} color="blue">
              report
            </Tag>
          )}
          {!compact && task.git_state.sha_at_end && task.git_state.sha_at_start !== task.git_state.sha_at_end && (
            <Tag color="purple">
              <Text style={{ fontSize: 11, fontFamily: 'monospace' }}>
                {task.git_state.sha_at_start.substring(0, 7)} → {task.git_state.sha_at_end.substring(0, 7)}
              </Text>
            </Tag>
          )}
        </Space>
      </div>
    </div>
  );
};

export default TaskListItem;
