import { getPrompts, addPrompt } from "../../server/prompts";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const prompts = await getPrompts();
        return res.status(200).json(prompts);
    } else if (req.method === "POST") {
        const { prompt } = req.body;
        const result = await addPrompt(prompt);
        return res.status(201).json(result);
    } else {
        return res.status(405).json({ message: "Method not allowed" });
    }
}