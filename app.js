const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

// 1. Middlewares

app.use(morgan('dev'));

app.use(express.json());

// app.use((req, res, next) => {
//   console.log('Hello from the middleware');
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//2. Route handlers

const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: { tours },
  });
};

const getTour = (req, res) => {
  // console.log(req.params);
  const id = Number(req.params.id);
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
};

const createTour = (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({ status: 'success', data: { tour: newTour } });
    }
  );
};

const updateTour = (req, res) => {
  const id = Number(req.params.id);
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: { tour: '<Updated tour is here...>' },
  });
};

const deleteTour = (req, res) => {
  const id = Number(req.params.id);
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    statue: 'error',
    message: 'This route is not defined yet!',
  });
};
const createUser = (req, res) => {
  res.status(500).json({
    statue: 'error',
    message: 'This route is not defined yet!',
  });
};
const getUserUser = (req, res) => {
  res.status(500).json({
    statue: 'error',
    message: 'This route is not defined yet!',
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    statue: 'error',
    message: 'This route is not defined yet!',
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    statue: 'error',
    message: 'This route is not defined yet!',
  });
};

// app.get('/', (req, res) => {
//   // res.status(200).send('Hello!');
//   res.status(200).json({ message: 'Hello!', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint...');
// });

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

//3. Routes

app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app.route('/api/v1/users').get(getAllUsers).post(createUser);

app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

// 4. Start server

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
