import { app } from './dist/media-news-company/server/server.mjs';

const port = process.env.PORT || 4000;

app.listen(port, (error) => {
  if (error) {
    throw error;
  }

  console.log(`Node Express server listening on http://localhost:${port}`);
});
