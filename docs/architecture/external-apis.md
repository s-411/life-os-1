# External APIs

Life OS is primarily a self-contained application with minimal external dependencies. The only external integrations are for authentication via OAuth providers.

## Google OAuth API

- **Purpose:** Enable "Sign in with Google" authentication
- **Documentation:** https://developers.google.com/identity/protocols/oauth2
- **Base URL(s):** `https://accounts.google.com/o/oauth2/v2/auth`
- **Authentication:** OAuth 2.0 with client ID and secret (managed by Supabase)
- **Rate Limits:** Google's standard OAuth rate limits (not publicly documented, but very generous)

**Key Endpoints Used:**
- `GET /auth` - Initiate OAuth flow
- `POST /token` - Exchange authorization code for tokens

**Integration Notes:** Supabase Auth handles all OAuth flow complexity. We only configure Google OAuth app in Supabase dashboard and use `supabase.auth.signInWithOAuth({ provider: 'google' })`.

---

## GitHub OAuth API

- **Purpose:** Enable "Sign in with GitHub" authentication
- **Documentation:** https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps
- **Base URL(s):** `https://github.com/login/oauth/authorize`
- **Authentication:** OAuth 2.0 with client ID and secret (managed by Supabase)
- **Rate Limits:** GitHub's OAuth rate limits (5000 requests/hour for authenticated users)

**Key Endpoints Used:**
- `GET /authorize` - Initiate OAuth flow
- `POST /access_token` - Exchange authorization code for tokens

**Integration Notes:** Similar to Google OAuth, Supabase Auth manages the integration. Configure GitHub OAuth app in Supabase dashboard.

---
