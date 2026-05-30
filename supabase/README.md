# Supabase Setup

1. Create a Supabase project.
2. Open SQL Editor and run `supabase/schema.sql`.
3. Open `js/supabase-config.js`.
4. Paste your project URL and anon/publishable key:

```js
window.VLEARNS_SUPABASE_CONFIG = {
  url: "https://your-project.supabase.co",
  anonKey: "your-anon-or-publishable-key"
};
```

The site keeps using localStorage if these values are blank or if Supabase is unavailable.

Important: the included SQL policies are demo-friendly so the static admin can manage events without login. Before production, add Supabase Auth and replace the demo admin policies with authenticated admin-only policies.
