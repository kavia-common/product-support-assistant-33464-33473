const latency = () => new Promise(res => setTimeout(res, 450));

// PUBLIC_INTERFACE
export async function askQuestionAPI(question) {
  /**
   * Simulated API call to backend Q&A service.
   * Params:
   *  - question: string user question
   * Returns:
   *  - { answer: string }
   * Note: Replace this stub with a real fetch to backend service using an env-provided base URL.
   */
  await latency();
  // Demo: generate concise answer text
  const concise = `Here's a concise answer for: "${question}". 
- Check features in Settings > Features. 
- Troubleshooting: restart app, clear cache, ensure latest version.
- Pricing & warranty: see Account > Billing and Help > Warranty.
`;
  // Randomly simulate occasional error
  if (question.toLowerCase().includes('error:')) {
    throw new Error('Backend reported an error while processing the request.');
  }
  return { answer: concise };
}

// PUBLIC_INTERFACE
export async function sendFeedbackAPI({ id, kind }) {
  /**
   * Simulated feedback API call.
   * Params:
   *  - id: string, last answer id
   *  - kind: 'up' | 'down'
   * Returns: { ok: true }
   */
  await latency();
  if (!id || !kind) throw new Error('Invalid feedback payload');
  return { ok: true };
}
