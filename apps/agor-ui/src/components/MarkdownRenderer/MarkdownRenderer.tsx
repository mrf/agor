/**
 * MarkdownRenderer - Renders markdown content with token-based styling
 *
 * Uses react-markdown + remark-gfm for GitHub Flavored Markdown support.
 * All styling uses Ant Design tokens for consistent theming.
 */

import { Typography, theme } from 'antd';
import type React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const { Paragraph } = Typography;

interface MarkdownRendererProps {
  /**
   * Markdown content to render
   */
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const { token } = theme.useToken();

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1
            style={{
              marginTop: token.sizeUnit * 2,
              marginBottom: token.sizeUnit,
              fontWeight: 600,
              fontSize: '1.5em',
            }}
          >
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2
            style={{
              marginTop: token.sizeUnit * 2,
              marginBottom: token.sizeUnit,
              fontWeight: 600,
              fontSize: '1.3em',
            }}
          >
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3
            style={{
              marginTop: token.sizeUnit * 2,
              marginBottom: token.sizeUnit,
              fontWeight: 600,
              fontSize: '1.1em',
            }}
          >
            {children}
          </h3>
        ),
        p: ({ children }) => <p style={{ margin: `${token.sizeUnit}px 0` }}>{children}</p>,
        ul: ({ children }) => (
          <ul
            style={{
              margin: `${token.sizeUnit}px 0`,
              paddingLeft: token.sizeUnit * 3,
            }}
          >
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol
            style={{
              margin: `${token.sizeUnit}px 0`,
              paddingLeft: token.sizeUnit * 3,
            }}
          >
            {children}
          </ol>
        ),
        li: ({ children }) => <li style={{ margin: `${token.sizeUnit / 2}px 0` }}>{children}</li>,
        code: ({ node, inline, className, children, ...props }) => {
          return inline ? (
            <code
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.06)',
                padding: `${token.sizeUnit / 4}px ${token.sizeUnit * 0.75}px`,
                borderRadius: token.borderRadiusSM,
                fontFamily: "'Courier New', monospace",
                fontSize: '0.9em',
              }}
              {...props}
            >
              {children}
            </code>
          ) : (
            <pre
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.06)',
                padding: token.sizeUnit * 1.5,
                borderRadius: token.borderRadius,
                overflowX: 'auto',
                margin: `${token.sizeUnit * 1.5}px 0`,
              }}
            >
              <code style={{ background: 'none', padding: 0 }} {...props}>
                {children}
              </code>
            </pre>
          );
        },
        blockquote: ({ children }) => (
          <blockquote
            style={{
              borderLeft: `3px solid ${token.colorBorder}`,
              paddingLeft: token.sizeUnit * 1.5,
              margin: `${token.sizeUnit * 1.5}px 0`,
              color: token.colorTextSecondary,
            }}
          >
            {children}
          </blockquote>
        ),
        table: ({ children }) => (
          <table
            style={{
              borderCollapse: 'collapse',
              margin: `${token.sizeUnit * 1.5}px 0`,
              width: '100%',
            }}
          >
            {children}
          </table>
        ),
        th: ({ children }) => (
          <th
            style={{
              border: `1px solid ${token.colorBorder}`,
              padding: token.sizeUnit,
              textAlign: 'left',
              backgroundColor: token.colorBgTextHover,
              fontWeight: 600,
            }}
          >
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td
            style={{
              border: `1px solid ${token.colorBorder}`,
              padding: token.sizeUnit,
              textAlign: 'left',
            }}
          >
            {children}
          </td>
        ),
        a: ({ children, href }) => (
          <a href={href} style={{ color: token.colorLink, textDecoration: 'none' }}>
            {children}
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};
