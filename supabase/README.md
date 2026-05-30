# Supabase Setup

1. Create a Supabase project.
2. Open SQL Editor.
3. Run the SQL files one by one:
   - `supabase/01_tables.sql`
   - `supabase/02_policies.sql`
   - `supabase/03_seed_events.sql`
4. Open `js/supabase-config.js`.
5. Paste your project URL and anon/publishable key:

```js
window.VLEARNS_SUPABASE_CONFIG = {
  url: "https://your-project.supabase.co",
  anonKey: "your-anon-or-publishable-key"
};
```

The site keeps using localStorage if these values are blank or if Supabase is unavailable.

Important: the included SQL policies are demo-friendly so the static admin can manage events without login. Before production, add Supabase Auth and replace the demo admin policies with authenticated admin-only policies.
