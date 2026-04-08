// Environment configuration
// TODO: Replace with actual API keys
export const config = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  },
  naver: {
    clientId: process.env.NAVER_CLIENT_ID || "",
    clientSecret: process.env.NAVER_CLIENT_SECRET || "",
    searchApiUrl: "https://openapi.naver.com/v1/search",
    datalabApiUrl: "https://openapi.naver.com/v1/datalab/search",
  },
  ai: {
    apiKey: process.env.ANTHROPIC_API_KEY || "",
    model: "claude-sonnet-4-20250514",
  },
  toss: {
    clientKey: process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "",
    secretKey: process.env.TOSS_SECRET_KEY || "",
  },
};
