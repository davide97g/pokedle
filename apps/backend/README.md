# pokédle-backend

This is the backend server in Nodejs for Pokédle project.

Deployed version: [https://server.pokedle.online](https://server.pokedle.online)

## Local development

- Install dependencies with `pnpm i` in the root of the whole project (not this folder, it is enough to do it at monorepo root).
- Build a compiled version with `pnpm build`
- Start a local development server with `pnpm dev`. Go to [http://localhost:3000](http://localhost:3000) to access it

## Environment Setup

> To correctly run locally you need to create a folder `backend/secrets` with a `service-account.json` file containing the service account secret of you firebase project.

Don't know how to create a firebase project and setup the service account? I asked ChatGPT to explain it [here](https://chatgpt.com/share/68132c44-6488-8011-a559-0fbff1d341e1)

It should look something like this:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n<your-actual-private-key>\n-----END PRIVATE KEY-----\n",
  "client_email": "...",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "...",
  "client_x509_cert_url": "...",
  "universe_domain": "googleapis.com"
}
```

Now the application will run using your firebase project as Cloud Provider and Database 🎉
