import fetch from 'node-fetch';
import * as prismic from '@prismicio/client';
import * as prismicH from '@prismicio/helpers';

const repoName = 'floema-lere'
const accessToken = process.env.PRISMIC_ACCESS_TOKEN 

const handleLinkResolver = doc => {
  if (doc.type === 'product') {
    return `/detail/${doc.uid}`
  }

  if (doc.type === 'collections') {
    return '/collections'
  }

  if (doc.type === 'about') {
    return '/about'
  }

  return '/'
};

export const client = prismic.createClient(repoName, { 
  fetch, 
  accessToken,
});

// Middleware function
export const prismicMiddleware = (req, res, next) => {
  res.locals.ctx = {
    endpoint: client.endpoint,
    linkResolver: handleLinkResolver
  }

  res.locals.Link = handleLinkResolver

  res.locals.Numbers = index => {
    return index == 0 ? 'One' : index == 1 ? 'Two' : index == 2 ? 'Three' : index == 3 ? 'Four' : '';
  }
  
  res.locals.prismicH = prismicH

  next()
}

// Helper function to handle Prismic previews
export const handlePreview = async (req, res) => {
  const { token: ref } = req.query;
  if (ref) {
    // Check the token is valid
    try {
      await client.getPreviewResolver(ref).resolve(handleLinkResolver, '/');
      res.cookie(prismic.cookie.preview, ref, { maxAge: 30 * 60 * 1000 });
    } catch (err) {
      console.error(err);
    }
  }

  res.redirect(302, '/');
}