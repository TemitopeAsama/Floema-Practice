import dotenv from 'dotenv';
dotenv.config();
import * as prismicH from "@prismicio/helpers";
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; 
import { client, prismicMiddleware } from './config/prismicConfig.js';
import logger from 'morgan';
import errorHandler from 'errorhandler';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
// import find from 'lodash/find';

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); 

const app = express();
const port = 3004;


app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride())
app.use(errorHandler())
app.use(express.static(path.join(__dirname, 'public')))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(prismicMiddleware);

app.get('/', async (req, res) => {
  const meta = await client.getSingle('metadata');
  const preloader = await client.getSingle('preloader');
  const home = await client.getSingle('homepage');
  const navigation = await client.getSingle('navigation');
  const collections = await client.getAllByType('collection');

  res.render('pages/home', {meta, preloader, home, collections, navigation});
});

app.get('/about', async (req, res) => {
  try {
    const meta = await client.getSingle('metadata');
    const response = await client.getSingle('about');
    const preloader = await client.getSingle('preloader');
    const navigation = await client.getSingle('navigation');

     console.log(response.data.body);

    res.render('pages/about', { about: response, meta: meta, prismicH: prismicH, preloader, navigation });
  } catch (error) {
    console.error('Error fetching about page:', error);
    res.status(500).send('Error fetching about page');
  }
});

app.get('/collections', async (req, res) => {
  try {
    const meta = await client.getSingle('metadata');
    const home = await client.getSingle('homepage');
    const preloader = await client.getSingle('preloader');
    const result = await client.getAllByType('collection');
    const navigation = await client.getSingle('navigation');

    res.render('pages/collections', { collections: result, meta: meta, prismicH: prismicH, home, preloader, navigation });
  } catch (error) {
    console.error('Error fetching about page:', error);
    res.status(500).send('Error fetching about page');
  }
});

app.get('/detail/:uid', async (req, res) => {
  try {
    const meta = await client.getSingle('metadata');
    const preloader = await client.getSingle('preloader');
    const navigation = await client.getSingle('navigation');
    const response = await client.getByUID('product', req.params.uid, {
      fetchLinks: 'collection.title'
    });
    res.render('pages/detail', {product: response, meta: meta, prismicH: prismicH, preloader, navigation  });
  } catch (error) {
    console.error('Error fetching about page:', error);
    res.status(500).send('Error fetching about page');
  }
});

app.listen(port, () => {
  console.log(`My app is running on http://localhost:${port}`);
});