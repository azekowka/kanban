#my open-source minimalistic kanban task organizer as other kanbans are suck

## TODO

- [x] Add auth using Clerk
- [x] Set up Neon DB serverless Postgres
- [] Landing page (not necessary for now)

## Use locally, prod-ready app will be made soon (with your help too - PRs are welcome!)

Rename .env.sample to .env, and paste necessary API keys:
   ```bash
    #------------------------------------------------------------------------------
    # Storage Provider - NeonDB
    DATABASE_URL='postgresql://neondb_owner:smth@smth.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
    #------------------------------------------------------------------------------
    # Auth Provider - Clerk
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY='pk_test_smth'
    CLERK_SECRET_KEY='sk_test_Csmth'
   ```
Install, set up db, and run the app:   
```bash
pnpm i
pnpm run db:setup
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.
