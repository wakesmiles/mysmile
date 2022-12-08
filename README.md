## Visit Site
You can visit the deployed site at [mysmile.vercel.app](https://mysmile.vercel.app/)!

## Run in Development Mode

To run this application locally, first add an `.env.local` file into the root of this repository folder in your local IDE. Database client credentials will go into this file as environment variables for security reasons. If you're a developer on this project, see the developer docs provided for you by admin (created by the Fall 2022 team). If not found, contact Fall 2022's Technical Lead, Alison "Lia" Zhang, for the information.

Run the development server with

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages. The folder is currently saved as boilerplate, as the application uses client-side data pre-fetching and rendering through React hooks. Next.js is used primarily for routing between components/pages.

## Deploy to Vercel

Theis repository is connected to automated [Vercel](https://vercel.com) deployments. Any updates to the `main` branch will deploy to both dev and production. Any updates to sub-branches will deploy only in dev.

You can log into Vercel using GitHub 3rd party sign-in.

## Resources
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
