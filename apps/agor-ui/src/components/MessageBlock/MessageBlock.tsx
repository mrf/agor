/**
 * MessageBlock - Renders individual messages with support for structured content
 *
 * Handles:
 * - Text content (string or TextBlock)
 * - Tool use blocks
 * - Tool result blocks
 * - User vs Assistant styling
 */

import type { Message } from '@agor/core/types';
import { CodeOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import { Avatar, Button, Typography, theme } from 'antd';
import React from 'react';
import { MarkdownRenderer } from '../MarkdownRenderer';
import { ToolUseRenderer } from '../ToolUseRenderer';

const { Paragraph } = Typography;

interface ToolUseBlock {
  type: 'tool_use';
  id: string;
  name: string;
  input: Record<string, unknown>;
}

interface ToolResultBlock {
  type: 'tool_result';
  tool_use_id: string;
  content: string | ContentBlock[];
  is_error?: boolean;
}

interface TextBlock {
  type: 'text';
  text: string;
}

type ContentBlock = TextBlock | ToolUseBlock | ToolResultBlock;

interface MessageBlockProps {
  message: Message;
}

export const MessageBlock: React.FC<MessageBlockProps> = ({ message }) => {
  const { token } = theme.useToken();
  const isUser = message.role === 'user';
  const [showRaw, setShowRaw] = React.useState(false);

  // Skip rendering if message has no content
  if (!message.content || (typeof message.content === 'string' && message.content.trim() === '')) {
    return null;
  }

  // Parse content blocks from message
  const getContentBlocks = (): {
    textBlocks: string[];
    toolBlocks: { toolUse: ToolUseBlock; toolResult?: ToolResultBlock }[];
  } => {
    const textBlocks: string[] = [];
    const toolBlocks: { toolUse: ToolUseBlock; toolResult?: ToolResultBlock }[] = [];

    // Handle string content
    if (typeof message.content === 'string') {
      return {
        textBlocks: [message.content],
        toolBlocks: [],
      };
    }

    // Handle array of content blocks
    if (Array.isArray(message.content)) {
      const toolUseMap = new Map<string, ToolUseBlock>();
      const toolResultMap = new Map<string, ToolResultBlock>();

      // First pass: collect tool_use and tool_result blocks
      for (const block of message.content) {
        if (block.type === 'text') {
          textBlocks.push((block as TextBlock).text);
        } else if (block.type === 'tool_use') {
          const toolUse = block as ToolUseBlock;
          toolUseMap.set(toolUse.id, toolUse);
        } else if (block.type === 'tool_result') {
          const toolResult = block as ToolResultBlock;
          toolResultMap.set(toolResult.tool_use_id, toolResult);
        }
      }

      // Second pass: match tool_use with tool_result
      for (const [id, toolUse] of toolUseMap.entries()) {
        toolBlocks.push({
          toolUse,
          toolResult: toolResultMap.get(id),
        });
      }
    }

    return { textBlocks, toolBlocks };
  };

  const { textBlocks, toolBlocks } = getContentBlocks();

  // Skip rendering if message has no meaningful content
  const hasText = textBlocks.some(text => text.trim().length > 0);
  const hasTools = toolBlocks.length > 0;

  if (!hasText && !hasTools) {
    return null;
  }

  // If this message is only tool invocations (no text), render compact
  if (!hasText && hasTools) {
    return (
      <div style={{ margin: `${token.sizeUnit * 1.5}px 0` }}>
        {toolBlocks.map(({ toolUse, toolResult }) => (
          <ToolUseRenderer key={toolUse.id} toolUse={toolUse} toolResult={toolResult} />
        ))}
      </div>
    );
  }

  // Get raw content for debugging
  const getRawContent = (): string => {
    if (typeof message.content === 'string') {
      return message.content;
    }
    if (Array.isArray(message.content)) {
      return JSON.stringify(message.content, null, 2);
    }
    return '';
  };

  // Render standard message with Bubble
  return (
    <div style={{ margin: `${token.sizeUnit}px 0` }}>
      <Bubble
        placement={isUser ? 'end' : 'start'}
        avatar={
          isUser ? (
            <Avatar icon={<UserOutlined />} style={{ backgroundColor: token.colorPrimary }} />
          ) : (
            <Avatar icon={<RobotOutlined />} style={{ backgroundColor: token.colorSuccess }} />
          )
        }
        content={
          <>
            {hasText && (
              <div style={{ wordWrap: 'break-word' }}>
                {isUser ? (
                  // User messages: plain text (preserve newlines)
                  textBlocks.filter(t => t.trim()).join('\n\n')
                ) : (
                  // Assistant messages: render as markdown with GFM support
                  <MarkdownRenderer content={textBlocks.filter(t => t.trim()).join('\n\n')} />
                )}
              </div>
            )}
            {toolBlocks.length > 0 && (
              <div style={{ marginTop: token.sizeUnit * 1.5 }}>
                {toolBlocks.map(({ toolUse, toolResult }, index) => (
                  <div
                    key={toolUse.id}
                    style={{ marginBottom: index < toolBlocks.length - 1 ? token.sizeUnit : 0 }}
                  >
                    <ToolUseRenderer toolUse={toolUse} toolResult={toolResult} />
                  </div>
                ))}
              </div>
            )}

            {/* Debug toggle for raw content */}
            <div
              style={{
                marginTop: token.sizeUnit,
                paddingTop: token.sizeUnit,
                borderTop: `1px dashed ${token.colorBorderSecondary}`,
              }}
            >
              <Button
                size="small"
                type="text"
                icon={<CodeOutlined />}
                onClick={() => setShowRaw(!showRaw)}
                style={{ fontSize: 11 }}
              >
                {showRaw ? 'Hide' : 'Show'} raw
              </Button>
              {showRaw && (
                <Paragraph
                  copyable
                  style={{
                    marginTop: token.sizeUnit,
                    fontSize: 11,
                    fontFamily: 'monospace',
                    background: token.colorBgLayout,
                    padding: token.sizeUnit,
                    borderRadius: token.borderRadius,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                  }}
                >
                  {getRawContent()}
                </Paragraph>
              )}
            </div>
          </>
        }
        variant={isUser ? 'filled' : 'outlined'}
        styles={{
          content: {
            backgroundColor: isUser ? token.colorPrimary : undefined,
            color: isUser ? '#fff' : undefined,
          },
        }}
      />
    </div>
  );
};
