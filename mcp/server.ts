// This file lets an AI agent use your product. Start it with: npm run mcp
// Tools: product_statement and search_items (finds coding tasks).
import { readFileSync } from 'node:fs';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { searchTasks } from '../src/prototype/data.ts';

const server = new McpServer({ name: 'our-product', version: '0.1.0' });

server.registerTool(
  'product_statement',
  {
    description: 'Returns the one-sentence product statement and the baseline metric from docs/PRODUCT.md',
    inputSchema: {},
  },
  async () => ({ content: [{ type: 'text', text: readFileSync('docs/PRODUCT.md', 'utf8') }] }),
);

// Searches the coding tasks a job-seeker can take (the same sample tasks the app shows).
// Tasks that task authors add in the app stay in their browser, so they are not found here.
server.registerTool(
  'search_items',
  {
    description:
      'Search JobBridge coding tasks by category, title or description (e.g. "SQL", "python", "counter"). Returns each task with its category, time in minutes, description and the checks it runs. An empty query lists every task.',
    inputSchema: { query: z.string() },
  },
  async ({ query }) => {
    const tasks = searchTasks(query);
    const text = tasks.length ? JSON.stringify(tasks, null, 2) : `No tasks match "${query}".`;
    return { content: [{ type: 'text', text }] };
  },
);

await server.connect(new StdioServerTransport());
