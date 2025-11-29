# Vercel Environment Variables Setup

## Adding API Keys to Vercel

1. **Go to your Vercel project dashboard**
   - https://vercel.com/dashboard
   - Select your `HomeworkGOAT` project

2. **Navigate to Settings → Environment Variables**

3. **Add these variables:**

   ```
   VITE_OPENAI_API_KEY = your_openai_key_here
   VITE_ANTHROPIC_API_KEY = your_anthropic_key_here
   ```

4. **Select environments:**
   - ✅ Production
   - ✅ Preview
   - ✅ Development (optional)

5. **Redeploy** your app for changes to take effect

## Security Notes

- ✅ These keys are **server-side only** in Vercel builds
- ✅ They're injected at build time, not exposed to the browser
- ⚠️ For production, consider moving LLM calls to a backend API route instead of calling from the client

## Alternative: Backend API Route (More Secure)

For production, create a Vercel serverless function:

```
/api/generate-world.ts
```

This keeps your API keys completely server-side and never exposed to the client.


