import('./server/server.mjs')
  .then(({ app }) => {
    const port = process.env.PORT || 4000;

    app.listen(port, (error) => {
      if (error) throw error;
      console.log(`Node Express server listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Unable to start the Angular SSR server.', error);
    process.exitCode = 1;
  });
