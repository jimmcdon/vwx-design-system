/// <reference types="vite/client" />

interface ImportMetaEnv {
  // OpenRouter
  readonly VITE_OPENROUTER_API_KEY?: string;
  readonly VITE_OPENROUTER_BASE_URL?: string;
  readonly VITE_OPENROUTER_APP_NAME?: string;

  // FAL.ai
  readonly VITE_FAL_API_KEY?: string;

  // OpenAI
  readonly VITE_OPENAI_API_KEY?: string;
  readonly VITE_OPENAI_ORGANIZATION?: string;

  // Anthropic
  readonly VITE_ANTHROPIC_API_KEY?: string;

  // Google AI
  readonly VITE_GOOGLE_AI_API_KEY?: string;

  // VWX Hosted Service
  readonly VITE_VWX_HOSTED_API_KEY?: string;
  readonly VITE_VWX_HOSTED_TIER?: 'starter' | 'pro' | 'business';

  // Feature flags
  readonly VITE_USE_VWX_HOSTED?: string;
  readonly VITE_ENABLE_COST_TRACKING?: string;

  // Routing configuration
  readonly VITE_ROUTING_STRATEGY?: 'cost-optimized' | 'quality-first' | 'speed-first';
  readonly VITE_PREFERRED_PROVIDERS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
