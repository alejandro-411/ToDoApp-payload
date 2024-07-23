import express from 'express'
import payload from 'payload'
import cors from 'cors'
import path from 'path'

require('dotenv').config()
const app = express()

const corsOptions = {
  origin: 'http://localhost:4200',
}

app.use(cors(corsOptions))

// Redirect root to Admin panel
app.get('/', (_, res) => {
  res.redirect('/admin')
})

app.use('/media', express.static(path.join(__dirname, 'media')));


const start = async () => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
    },
  })

  // Add your own express routes here

  app.listen(3000, async () => {
    payload.logger.info(`Server running at http://localhost:3000`)
  },)
}

start()

/*
import express from 'express';
import payload from 'payload';
import multer from 'multer';
import path from 'path';
import { config as dotenvConfig } from 'dotenv';
import { postgresAdapter } from '@payloadcms/db-postgres';

dotenvConfig();

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

app.use(express.json());

app.post('/api/tasks', upload.single('image'), async (req, res) => {
  const { title, description, completed } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const task = await payload.create({
      collection: 'tasks',
      data: {
        title,
        description,
        completed,
        image
      }
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/tasks/:id', upload.single('image'), async (req, res) => {
  const { title, description, completed } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const updatedTask = await payload.update({
      collection: 'tasks',
      id: req.params.id,
      data: {
        title,
        description,
        completed,
        image
      }
    });
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const start = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    database: {
      adapter: postgresAdapter({
        pool: {
          connectionString: process.env.DATABASE_URI,
        },
      }),
    },
  });

  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
};

start();*/
