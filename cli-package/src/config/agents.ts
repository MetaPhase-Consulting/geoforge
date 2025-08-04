export type AgentType = "training-crawler" | "live-search-indexer" | "on-demand-fetch" | "policy-token";

export interface Agent {
  id: string;                 // stable key
  label: string;              // UI name
  description: string;        // one-line caption
  robots: string[];           // user-agent strings or tokens
  defaultEnabled: boolean;    // default checkbox state
  type: AgentType;
}

/** Master list (order matters for display) */
export const AGENTS: Agent[] = [
  { id:"gptbot", label:"GPTBot", description:"OpenAI model-training crawler", robots:["GPTBot"], defaultEnabled:true,  type:"training-crawler" },
  { id:"chatgpt-user", label:"ChatGPT-User", description:"OpenAI on-demand fetch (Browse w/ Bing)", robots:["ChatGPT-User"], defaultEnabled:true, type:"on-demand-fetch" },
  { id:"oai-search", label:"OAI-SearchBot", description:"OpenAI live-search indexer", robots:["OAI-SearchBot"], defaultEnabled:true, type:"live-search-indexer" },

  { id:"claudebot", label:"ClaudeBot", description:"Anthropic model-training crawler", robots:["ClaudeBot","anthropic-ai"], defaultEnabled:true, type:"training-crawler" },
  { id:"claude-search", label:"Claude-SearchBot", description:"Anthropic live-search indexer", robots:["Claude-SearchBot"], defaultEnabled:true, type:"live-search-indexer" },
  { id:"claude-user", label:"Claude-User", description:"Anthropic on-demand fetch", robots:["Claude-User"], defaultEnabled:true, type:"on-demand-fetch" },

  { id:"perplexitybot", label:"PerplexityBot", description:"Perplexity search index crawler", robots:["PerplexityBot"], defaultEnabled:true, type:"live-search-indexer" },
  { id:"perplexity-user", label:"Perplexity-User", description:"Perplexity on-demand fetch (can ignore robots)", robots:["Perplexity-User"], defaultEnabled:true, type:"on-demand-fetch" },

  { id:"bingbot", label:"BingBot", description:"Microsoft search crawler (feeds Copilot)", robots:["Bingbot"], defaultEnabled:true, type:"training-crawler" },

  /* === Policy tokens (not crawlers) === */
  { id:"google-extended", label:"Google-Extended", description:"robots token for Gemini/Bard training", robots:["Google-Extended"], defaultEnabled:true, type:"policy-token" },
  { id:"applebot-ext", label:"Applebot-Extended", description:"robots token for Apple AI training", robots:["Applebot-Extended"], defaultEnabled:true, type:"policy-token" }
];

/** Helper functions for UI grouping */
export function getAgentsByType(type: AgentType): Agent[] {
  return AGENTS.filter(agent => agent.type === type);
}

export function getAgentById(id: string): Agent | undefined {
  return AGENTS.find(agent => agent.id === id);
}

/** Get type-specific badge info */
export function getTypeBadge(type: AgentType): { label: string; color: string } {
  switch (type) {
    case "training-crawler":
      return { label: "TRAIN", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" };
    case "live-search-indexer":
      return { label: "INDEX", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" };
    case "on-demand-fetch":
      return { label: "FETCH", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" };
    case "policy-token":
      return { label: "TOKEN", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" };
    default:
      return { label: "UNKNOWN", color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300" };
  }
}