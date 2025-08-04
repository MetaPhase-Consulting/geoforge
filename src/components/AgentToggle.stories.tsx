import type { Meta, StoryObj } from '@storybook/react';
import { AGENTS, getTypeBadge } from '../config/agents';

// Mock component for Storybook demonstration
const AgentToggle = ({ agent, checked, onChange }: { 
  agent: typeof AGENTS[0], 
  checked: boolean, 
  onChange: (checked: boolean) => void 
}) => {
  const badge = getTypeBadge(agent.type);
  
  return (
    <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg bg-white max-w-md">
      <input
        type="checkbox"
        id={agent.id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 w-5 h-5 rounded focus:ring-2"
        style={{ accentColor: '#FFD700' }}
      />
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <label htmlFor={agent.id} className="block font-medium text-gray-900 cursor-pointer">
            {agent.label}
          </label>
          <span className={`px-2 py-1 text-xs font-mono font-bold rounded ${badge.color}`}>
            {badge.label}
          </span>
        </div>
        <p className="text-sm text-gray-600">{agent.description}</p>
        <p className="text-xs text-gray-400 mt-1 font-mono">
          {agent.robots.join(', ')}
        </p>
      </div>
    </div>
  );
};

const meta: Meta<typeof AgentToggle> = {
  title: 'Components/AgentToggle',
  component: AgentToggle,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    checked: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Generate stories for each agent type
export const TrainingCrawlers: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Training Crawlers</h3>
      {AGENTS.filter(agent => agent.type === 'training-crawler').map(agent => (
        <AgentToggle 
          key={agent.id} 
          agent={agent} 
          checked={agent.defaultEnabled} 
          onChange={() => {}} 
        />
      ))}
    </div>
  ),
};

export const LiveSearchIndexers: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Live Search Indexers</h3>
      {AGENTS.filter(agent => agent.type === 'live-search-indexer').map(agent => (
        <AgentToggle 
          key={agent.id} 
          agent={agent} 
          checked={agent.defaultEnabled} 
          onChange={() => {}} 
        />
      ))}
    </div>
  ),
};

export const OnDemandFetchers: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">On-Demand Fetchers</h3>
      {AGENTS.filter(agent => agent.type === 'on-demand-fetch').map(agent => (
        <AgentToggle 
          key={agent.id} 
          agent={agent} 
          checked={agent.defaultEnabled} 
          onChange={() => {}} 
        />
      ))}
    </div>
  ),
};

export const PolicyTokens: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Policy Tokens</h3>
      {AGENTS.filter(agent => agent.type === 'policy-token').map(agent => (
        <AgentToggle 
          key={agent.id} 
          agent={agent} 
          checked={agent.defaultEnabled} 
          onChange={() => {}} 
        />
      ))}
    </div>
  ),
};

export const AllAgents: Story = {
  render: () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-6">All Supported Agents</h2>
      {['training-crawler', 'live-search-indexer', 'on-demand-fetch', 'policy-token'].map(type => (
        <div key={type} className="space-y-4">
          <h3 className="text-lg font-semibold capitalize">{type.replace('-', ' ')}</h3>
          {AGENTS.filter(agent => agent.type === type).map(agent => (
            <AgentToggle 
              key={agent.id} 
              agent={agent} 
              checked={agent.defaultEnabled} 
              onChange={() => {}} 
            />
          ))}
        </div>
      ))}
    </div>
  ),
};