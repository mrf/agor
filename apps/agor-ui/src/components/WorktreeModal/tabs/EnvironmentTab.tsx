import type { Repo, Worktree } from '@agor/core/types';
import { CodeOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Alert, Descriptions, Empty, Space, Tag, Typography } from 'antd';

const { Text, Paragraph } = Typography;

interface EnvironmentTabProps {
  worktree: Worktree;
  repo: Repo;
  onUpdate?: (worktreeId: string, updates: Partial<Worktree>) => void;
}

export const EnvironmentTab: React.FC<EnvironmentTabProps> = ({ worktree, repo, onUpdate }) => {
  const hasEnvironmentConfig = !!repo.environment_config;
  const environmentInstance = worktree.environment_instance;

  if (!hasEnvironmentConfig) {
    return (
      <div style={{ padding: '0 24px' }}>
        <Empty
          description={
            <Space direction="vertical" size="small">
              <Text>No environment configuration for this repository</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Configure environment commands in Settings → Repositories to enable start/stop
                functionality.
              </Text>
            </Space>
          }
        />
      </div>
    );
  }

  const config = repo.environment_config;

  return (
    <Space direction="vertical" size="large" style={{ width: '100%', padding: '0 24px' }}>
      <Alert
        message="Environment Management (Phase 2)"
        description="Start/stop/restart functionality will be implemented in Phase 2. Currently showing configuration only."
        type="info"
        icon={<InfoCircleOutlined />}
        showIcon
      />

      {/* Configuration from repo */}
      <div>
        <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 8 }}>
          Configuration (from repository "{repo.name}")
        </Text>
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item
            label={
              <Space>
                <CodeOutlined /> Up Command
              </Space>
            }
          >
            <Text code style={{ fontSize: 11, wordBreak: 'break-all' }}>
              {config.up_command}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Space>
                <CodeOutlined /> Down Command
              </Space>
            }
          >
            <Text code style={{ fontSize: 11, wordBreak: 'break-all' }}>
              {config.down_command}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Template Variables">
            <Space wrap>
              {config.template_vars.map(varName => (
                <Tag key={varName} color="blue">
                  {varName}
                </Tag>
              ))}
            </Space>
          </Descriptions.Item>
          {config.health_check && (
            <Descriptions.Item label="Health Check">
              <Space direction="vertical" size={0}>
                <Text style={{ fontSize: 12 }}>Type: {config.health_check.type}</Text>
                {config.health_check.url_template && (
                  <Text code style={{ fontSize: 11 }}>
                    {config.health_check.url_template}
                  </Text>
                )}
                {config.health_check.port_var && (
                  <Text style={{ fontSize: 12 }}>
                    Port variable: {config.health_check.port_var}
                  </Text>
                )}
              </Space>
            </Descriptions.Item>
          )}
        </Descriptions>
      </div>

      {/* Instance Variables */}
      <div>
        <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 8 }}>
          Instance Variables
        </Text>
        {environmentInstance?.variables ? (
          <Descriptions column={1} bordered size="small">
            {Object.entries(environmentInstance.variables).map(([key, value]) => (
              <Descriptions.Item key={key} label={key}>
                <Text code>{String(value)}</Text>
              </Descriptions.Item>
            ))}
          </Descriptions>
        ) : (
          <Paragraph type="secondary" italic>
            No instance variables configured yet. Variables will be assigned when the environment is
            first started.
          </Paragraph>
        )}
      </div>

      {/* Status (Phase 2) */}
      <div>
        <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 8 }}>
          Status
        </Text>
        {environmentInstance?.status ? (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Status">
              <Tag
                color={
                  environmentInstance.status === 'running'
                    ? 'green'
                    : environmentInstance.status === 'error'
                      ? 'red'
                      : 'default'
                }
              >
                {environmentInstance.status.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            {environmentInstance.process?.pid && (
              <Descriptions.Item label="PID">{environmentInstance.process.pid}</Descriptions.Item>
            )}
            {environmentInstance.process?.uptime && (
              <Descriptions.Item label="Uptime">
                {environmentInstance.process.uptime}
              </Descriptions.Item>
            )}
            {environmentInstance.last_health_check && (
              <Descriptions.Item label="Last Health Check">
                <Space direction="vertical" size={0}>
                  <Text style={{ fontSize: 12 }}>
                    Status: {environmentInstance.last_health_check.status}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    {new Date(environmentInstance.last_health_check.timestamp).toLocaleString()}
                  </Text>
                  {environmentInstance.last_health_check.message && (
                    <Text style={{ fontSize: 12 }}>
                      {environmentInstance.last_health_check.message}
                    </Text>
                  )}
                </Space>
              </Descriptions.Item>
            )}
          </Descriptions>
        ) : (
          <Paragraph type="secondary" italic>
            Environment has not been started yet
          </Paragraph>
        )}
      </div>

      {/* Access URLs (Phase 2) */}
      {environmentInstance?.access_urls && environmentInstance.access_urls.length > 0 && (
        <div>
          <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 8 }}>
            Access URLs
          </Text>
          <Space direction="vertical" size="small">
            {environmentInstance.access_urls.map(urlConfig => (
              <div key={urlConfig.url}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {urlConfig.name}:
                </Text>{' '}
                <a href={urlConfig.url} target="_blank" rel="noopener noreferrer">
                  <Text code style={{ fontSize: 11 }}>
                    {urlConfig.url}
                  </Text>
                </a>
              </div>
            ))}
          </Space>
        </div>
      )}

      {/* TODO: Phase 2 - Add buttons for Start/Stop/Restart/View Logs/Open Terminal */}
    </Space>
  );
};
