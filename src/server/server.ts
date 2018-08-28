import errorHandler from 'errorhandler';

import app from './app';

app.use(errorHandler());

// Launch scilla server
app.listen(app.get('port'), () => {
  console.log('Scilla is running at http://localhost:%d', app.get('port'));
});

export default app;
