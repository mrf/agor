import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import SessionCard from './SessionCard';
import SessionDrawer from '../SessionDrawer';
import { mockSessionA, mockSessionB, mockSessionC } from '../../mocks/sessions';
import { mockTasksBySession } from '../../mocks/tasks';
import { SessionViewMode } from '../../types';

const meta = {
  title: 'Components/SessionCard',
  component: SessionCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SessionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RunningSession: Story = {
  args: {
    session: mockSessionA,
    tasks: mockTasksBySession['abc123'],
  },
};

export const ForkedSession: Story = {
  args: {
    session: mockSessionB,
    tasks: mockTasksBySession['def456'],
  },
};

export const SpawnedSession: Story = {
  args: {
    session: mockSessionC,
    tasks: mockTasksBySession['ghi789'],
  },
};

export const CompactView: Story = {
  args: {
    session: mockSessionA,
    tasks: mockTasksBySession['abc123'],
    compact: true,
  },
};

export const Interactive: Story = {
  args: {
    session: mockSessionA,
    tasks: mockTasksBySession['abc123'],
    onTaskClick: (taskId: string) => alert(`Task clicked: ${taskId}`),
    onSessionClick: () => alert('Session clicked!'),
  },
};

export const CompletedSession: Story = {
  args: {
    session: { ...mockSessionC, status: 'completed' },
    tasks: mockTasksBySession['ghi789'],
  },
};

export const IdleSession: Story = {
  args: {
    session: mockSessionB,
    tasks: mockTasksBySession['def456'],
  },
};

// View mode stories
export const CollapsedView: Story = {
  args: {
    session: mockSessionA,
    tasks: mockTasksBySession['abc123'],
    viewMode: 'collapsed',
    onViewModeChange: (mode: SessionViewMode) => alert(`View mode changed to: ${mode}`),
  },
};

export const ExpandedView: Story = {
  args: {
    session: mockSessionA,
    tasks: mockTasksBySession['abc123'],
    viewMode: 'expanded',
    onViewModeChange: (mode: SessionViewMode) => alert(`View mode changed to: ${mode}`),
  },
};

// Interactive view mode switching
export const InteractiveViewMode = () => {
  const [viewMode, setViewMode] = useState<SessionViewMode>('expanded');

  return (
    <div>
      <div style={{ marginBottom: 16, padding: 8, background: 'rgba(0,0,0,0.1)', borderRadius: 4 }}>
        Current view mode: <strong>{viewMode}</strong>
      </div>
      <SessionCard
        session={mockSessionA}
        tasks={mockTasksBySession['abc123']}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onTaskClick={(taskId) => alert(`Task clicked: ${taskId}`)}
      />
    </div>
  );
};

export const ManyTasksSession: Story = {
  args: {
    session: mockSessionA,
    tasks: mockTasksBySession['abc123'], // Now has 16 tasks
    viewMode: 'expanded',
    onViewModeChange: (mode: SessionViewMode) => alert(`View mode changed to: ${mode}`),
  },
};

// Fully integrated example with SessionDrawer
export const WithDrawer = () => {
  const [viewMode, setViewMode] = useState<SessionViewMode>('expanded');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleViewModeChange = (mode: SessionViewMode) => {
    setViewMode(mode);
    if (mode === 'drawer') {
      setDrawerOpen(true);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16, padding: 8, background: 'rgba(0,0,0,0.1)', borderRadius: 4 }}>
        <strong>Try the view controls:</strong>
        <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
          <li>Click collapse icon (⬇️) to collapse the card</li>
          <li>Click expand icon (⬆️) to open the full session drawer</li>
          <li>Click "X more tasks" to open the drawer</li>
        </ul>
        Current view: <strong>{viewMode}</strong>
        {drawerOpen && ' | Drawer is open'}
      </div>

      <SessionCard
        session={mockSessionA}
        tasks={mockTasksBySession['abc123']}
        viewMode={viewMode === 'drawer' ? 'expanded' : viewMode}
        onViewModeChange={handleViewModeChange}
        onTaskClick={(taskId) => {
          alert(`Task clicked: ${taskId}`);
          setDrawerOpen(true);
        }}
      />

      <SessionDrawer
        session={mockSessionA}
        tasks={mockTasksBySession['abc123']}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setViewMode('expanded');
        }}
      />
    </div>
  );
};
