import OpenAI from "openai";

import type { AnalysisResponse } from "../interfaces/ai.js";

export const aiAnalysis = async (domain: string): Promise<AnalysisResponse> => {
    if (process.env.OPENAI_ENABLE !== "true") {
        return {
            risk_level: "0",
            category: "",
            owner: "",
            notes: ""
        };
    }

    const client = new OpenAI({
        apiKey: process.env.OPENAI_KEY
    });

    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `
You are a cybersecurity analyst.
Analyze the following domain from a DNS query log.

Rules:
- Respond ONLY with valid JSON.
- No markdown.
- No commentary.
- Be conservative when flagging risk.
`
            },
            {
                role: "user",
                content: `
Return structured analysis with:
- risk level (low, medium, high)
- category (what it's likely used for)
- ownership
- summary notes

DNS QUERY:
${domain}
`
            }
        ],
        response_format: {
            type: "json_schema",
            json_schema: {
                name: "dns_analysis",
                strict: true,
                schema: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        risk_level: { type: "string" },
                        category: { type: "string" },
                        owner: { type: "string" },
                        notes: { type: "string" }
                    },
                    required: ["risk_level", "category", "owner", "notes"]
                }
            }
        }
    });

    return JSON.parse(response.choices[0]?.message?.content || "{}");
};
