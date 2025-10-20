import type { Application } from '@agor/core/feathers';
import type { Worktree } from '@agor/core/types';
import { FileMarkdownOutlined, FolderOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Alert, Button, Empty, List, Space, Typography } from 'antd';
import { useState } from 'react';

const { Text } = Typography;

interface ConceptsTabProps {
  worktree: Worktree;
  client: Application | null;
}

interface ConceptFile {
  path: string;
  title?: string;
  updated_at: string;
  size: number;
}

export const ConceptsTab: React.FC<ConceptsTabProps> = ({ worktree, client }) => {
  // TODO: Fetch concept files from backend service
  // const [files, setFiles] = useState<ConceptFile[]>([]);
  // const [loading, setLoading] = useState(false);

  // Placeholder data structure
  const [files] = useState<ConceptFile[]>([]);

  const handleViewFile = (filePath: string) => {
    console.log('View file:', filePath);
    // TODO: Open MarkdownModal with file content
  };

  const handleEditFile = (filePath: string) => {
    console.log('Edit file:', filePath);
    // TODO: Phase 4 - Open markdown editor
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%', padding: '0 24px' }}>
      <Alert
        message="Concept Files (Phase 1 - In Progress)"
        description={
          <Space direction="vertical" size="small">
            <Text>
              This feature will list all markdown files (CLAUDE.md, context/*.md, docs/*.md) from
              the worktree path.
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Backend service (WorktreeConceptsService) needs to be implemented to scan the worktree
              directory:{' '}
              <Text code style={{ fontSize: 11 }}>
                {worktree.path}
              </Text>
            </Text>
          </Space>
        }
        type="info"
        icon={<InfoCircleOutlined />}
        showIcon
      />

      {files.length === 0 ? (
        <Empty
          image={<FileMarkdownOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
          description={
            <Space direction="vertical" size="small">
              <Text>No concept files found (or service not yet implemented)</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Concept files will be automatically discovered from:
              </Text>
              <Space direction="vertical" size={0} style={{ fontSize: 11 }}>
                <Text code>CLAUDE.md</Text>
                <Text code>{'context/**/*.md'}</Text>
                <Text code>{'docs/**/*.md'}</Text>
                <Text code>{'.github/**/*.md'}</Text>
              </Space>
            </Space>
          }
        />
      ) : (
        <div>
          <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 8 }}>
            Context files in this worktree:
          </Text>
          <List
            size="small"
            bordered
            dataSource={files}
            renderItem={file => (
              <List.Item
                actions={[
                  <Button
                    key="view"
                    type="link"
                    size="small"
                    onClick={() => handleViewFile(file.path)}
                  >
                    View
                  </Button>,
                  <Button
                    key="edit"
                    type="link"
                    size="small"
                    onClick={() => handleEditFile(file.path)}
                  >
                    Edit
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    file.path.includes('/') ? (
                      <FolderOutlined style={{ fontSize: 16 }} />
                    ) : (
                      <FileMarkdownOutlined style={{ fontSize: 16 }} />
                    )
                  }
                  title={
                    <Text code style={{ fontSize: 12 }}>
                      {file.path}
                    </Text>
                  }
                  description={
                    <Space size="small">
                      {file.title && <Text style={{ fontSize: 11 }}>{file.title}</Text>}
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        Updated {new Date(file.updated_at).toLocaleDateString()}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        {Math.round(file.size / 1024)} KB
                      </Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      )}

      {/* TODO: Phase 1 - Implement backend service to fetch files */}
      {/* TODO: Phase 4 - Add "Create New Concept File" button */}
      {/* TODO: Phase 4 - Implement markdown editor for editing files */}
    </Space>
  );
};
