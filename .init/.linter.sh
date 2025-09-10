#!/bin/bash
cd /home/kavia/workspace/code-generation/product-support-assistant-33464-33473/qa_agent_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

