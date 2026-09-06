import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { GoogleGenAI } from "@google/genai";
import * as path from "path";

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main() {
  const allowedDirectory = path.resolve(process.cwd());

  const transport = new StdioClientTransport({
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-filesystem", allowedDirectory],
  });

  const mcpClient = new Client(
    { name: "mcp-gemini-client", version: "1.0.0" },
    { capabilities: {} },
  );

  try {
    await mcpClient.connect(transport);
    console.log("Connected to Filesystem MCP Server!\n");

    // 1. Get tools from the MCP server
    const toolsResponse = await mcpClient.listTools();

    // 2. Format MCP tool declarations for Gemini Function Calling
    const geminiTools = [
      {
        functionDeclarations: toolsResponse.tools.map((tool) => ({
          name: tool.name,
          description: tool.description,
          parameters: tool.inputSchema as any,
        })),
      },
    ];

    // 3. Prompt Gemini
    const userPrompt =
      "Check what files are in this directory, find package.json, and summarize the project dependencies.";
    console.log(`User Prompt: "${userPrompt}"\n`);

    // First API call: Prompt Gemini with available MCP tools
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userPrompt,
      config: {
        tools: geminiTools,
      },
    });

    // 4. Check if Gemini selected an MCP tool to execute
    const functionCalls = response.functionCalls;

    if (functionCalls && functionCalls.length > 0) {
      for (const call of functionCalls) {
        console.log(`Gemini decided to call tool: '${call.name}'`);
        console.log(`Arguments:`, call.args);

        // Execute tool call through the MCP client connection
        const mcpResult = await mcpClient.callTool({
          name: call.name,
          arguments: call.args as Record<string, unknown>,
        });

        console.log("\nMCP Tool Execution Result:");
        console.log(JSON.stringify(mcpResult, null, 2));

        // 5. Send tool results back to Gemini for the final answer
        const finalResponse = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: [
            { role: "user", parts: [{ text: userPrompt }] },
            {
              role: "model",
              parts: response.candidates?.[0]?.content?.parts || [],
            },
            {
              role: "user",
              parts: [
                {
                  functionResponse: {
                    name: call.name,
                    response: { output: mcpResult },
                  },
                },
              ],
            },
          ],
        });

        console.log("\n--- Final Gemini Response ---");
        console.log(finalResponse.text);
      }
    } else {
      console.log("\n--- Gemini Response ---");
      console.log(response.text);
    }
  } catch (error) {
    console.error("Error running MCP client:", error);
  } finally {
    await transport.close();
    console.log("\nConnection closed.");
  }
}

main();
