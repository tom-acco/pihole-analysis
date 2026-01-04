const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.OPENAI_KEY
});

const aiAnalysis = async (domain) => {
    const response = await client.responses.create({
        model: "gpt-4.1-mini",
        input: [
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
        text: {
            format: {
                name: "dns_analysis",
                type: "json_schema",
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

    return JSON.parse(response.output_text);
};

module.exports = aiAnalysis;
