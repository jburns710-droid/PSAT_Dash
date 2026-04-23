export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { student } = req.body;

  const prompt = `You are helping a teacher quickly understand a student's PSAT performance.

Write a short, clear summary using this data:
- Name: ${student.name}
- Grade: ${student.grade}
- Total Score: ${student.total} (range 320–1520)
- Reading & Writing: ${student.rw} (benchmark: ${student.grade === 10 ? 430 : 460}, ${student.rwMet ? 'met' : 'not met'})
- Math: ${student.math} (benchmark: ${student.grade === 10 ? 480 : 510}, ${student.mathMet ? 'met' : 'not met'})
- Strongest domains: ${student.strengths.join(', ')}
- Focus areas: ${student.focus.join(', ')}
- Days absent: ${student.absences}

Rules:
- Use plain, teacher-friendly language
- 3–4 sentences maximum
- Lead with a strength
- End with one specific, actionable next step
- Do not restate numbers unless they add meaning`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  const data = await response.json();
  res.status(200).json({ summary: data.content[0].text });
}
