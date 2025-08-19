
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./models');

const app = express();

app.use(express.json());
const port = 3001; // Using 3001 to avoid potential conflict with frontend dev server

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username }, 'supersecretkey', { expiresIn: '1h' });
};

// JWT Authentication Middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Token ') ? authHeader.slice(6) : null;

  if (!token) {
    return res.status(401).json({ errors: { body: ['Unauthorized'] } });
  }

  try {
    const decoded = jwt.verify(token, 'supersecretkey');
    const user = await db.User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({ errors: { body: ['User not found'] } });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ errors: { body: ['Invalid token'] } });
  }
};

// Optional Authentication Middleware (for endpoints that work with or without auth)
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Token ') ? authHeader.slice(6) : null;

  if (token) {
    try {
      const decoded = jwt.verify(token, 'supersecretkey');
      const user = await db.User.findByPk(decoded.id);
      if (user) {
        req.user = user;
      }
    } catch (error) {
      // Ignore token errors for optional auth
    }
  }
  
  next();
};

// Utility function to generate slug from title
const generateSlug = async (title) => {
  let baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  let slug = baseSlug;
  let counter = 1;
  
  // Check for uniqueness and add suffix if needed
  while (await db.Article.findOne({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
};

// User Registration
app.post('/api/users', async (req, res) => {
  try {
    const { username, email, password } = req.body.user;

    if (!username || !email || !password) {
      return res.status(422).json({ errors: { body: ['username, email, and password are required'] } });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.User.create({
      username,
      email,
      password_hash: hashedPassword,
    });

    const token = generateToken(user);

    res.status(201).json({
      user: {
        email: user.email,
        token,
        username: user.username,
        bio: user.bio,
        image: user.image_url,
      },
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(422).json({ errors: { email: ['has already been taken'] } });
    }
    console.error(error);
    res.status(500).json({ errors: { body: ['Something went wrong'] } });
  }
});

// User Login
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body.user;

    if (!email || !password) {
      return res.status(422).json({ errors: { body: ['email and password are required'] } });
    }

    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      return res.status(403).json({ errors: { email: ['is invalid'] } });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(403).json({ errors: { password: ['is invalid'] } });
    }

    const token = generateToken(user);

    res.status(200).json({
      user: {
        email: user.email,
        token,
        username: user.username,
        bio: user.bio,
        image: user.image_url,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: { body: ['Something went wrong'] } });
  }
});

// === ARTICLES API ENDPOINTS ===

// GET /api/articles - List articles with pagination and filtering
app.get('/api/articles', optionalAuth, async (req, res) => {
  try {
    const { limit = 20, offset = 0, tag, author, favorited } = req.query;
    
    const whereClause = {};
    const include = [
      {
        model: db.User,
        as: 'author',
        attributes: ['username', 'bio', 'image_url']
      },
      {
        model: db.Tag,
        as: 'tags',
        attributes: ['name']
      }
    ];

    // Add filtering conditions
    if (author) {
      include[0].where = { username: author };
    }
    
    if (tag) {
      include[1].where = { name: tag };
    }

    const articles = await db.Article.findAndCountAll({
      where: whereClause,
      include,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      distinct: true
    });

    const articlesFormatted = articles.rows.map(article => ({
      slug: article.slug,
      title: article.title,
      description: article.description,
      body: article.body,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      tagList: article.tags.map(tag => tag.name),
      author: {
        username: article.author.username,
        bio: article.author.bio,
        image: article.author.image_url
      }
    }));

    res.json({
      articles: articlesFormatted,
      articlesCount: articles.count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: { body: ['Something went wrong'] } });
  }
});

// GET /api/articles/:slug - Get single article
app.get('/api/articles/:slug', optionalAuth, async (req, res) => {
  try {
    const { slug } = req.params;
    
    const article = await db.Article.findOne({
      where: { slug },
      include: [
        {
          model: db.User,
          as: 'author',
          attributes: ['username', 'bio', 'image_url']
        },
        {
          model: db.Tag,
          as: 'tags',
          attributes: ['name']
        },
        {
          model: db.Comment,
          as: 'comments',
          attributes: ['id']
        }
      ]
    });

    if (!article) {
      return res.status(404).json({ errors: { body: ['Article not found'] } });
    }

    const articleFormatted = {
      slug: article.slug,
      title: article.title,
      description: article.description,
      body: article.body,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      tagList: article.tags.map(tag => tag.name),
      author: {
        username: article.author.username,
        bio: article.author.bio,
        image: article.author.image_url
      }
    };

    res.json({ article: articleFormatted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: { body: ['Something went wrong'] } });
  }
});

// POST /api/articles - Create article (authenticated)
app.post('/api/articles', authenticateToken, async (req, res) => {
  try {
    const { title, description, body, tagList = [] } = req.body.article;

    if (!title || !description || !body) {
      return res.status(422).json({ 
        errors: { body: ['title, description, and body are required'] } 
      });
    }

    const slug = await generateSlug(title);

    const article = await db.Article.create({
      slug,
      title,
      description,
      body,
      author_id: req.user.id
    });

    // Handle tags
    if (tagList.length > 0) {
      const tags = await Promise.all(
        tagList.map(async (tagName) => {
          const [tag] = await db.Tag.findOrCreate({
            where: { name: tagName },
            defaults: { name: tagName }
          });
          return tag;
        })
      );
      await article.setTags(tags);
    }

    // Fetch the complete article with associations
    const createdArticle = await db.Article.findOne({
      where: { id: article.id },
      include: [
        {
          model: db.User,
          as: 'author',
          attributes: ['username', 'bio', 'image_url']
        },
        {
          model: db.Tag,
          as: 'tags',
          attributes: ['name']
        }
      ]
    });

    const articleFormatted = {
      slug: createdArticle.slug,
      title: createdArticle.title,
      description: createdArticle.description,
      body: createdArticle.body,
      createdAt: createdArticle.createdAt,
      updatedAt: createdArticle.updatedAt,
      tagList: createdArticle.tags.map(tag => tag.name),
      author: {
        username: createdArticle.author.username,
        bio: createdArticle.author.bio,
        image: createdArticle.author.image_url
      }
    };

    res.status(201).json({ article: articleFormatted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: { body: ['Something went wrong'] } });
  }
});

// PUT /api/articles/:slug - Update article (author only)
app.put('/api/articles/:slug', authenticateToken, async (req, res) => {
  try {
    const { slug } = req.params;
    const { title, description, body } = req.body.article;

    const article = await db.Article.findOne({ where: { slug } });

    if (!article) {
      return res.status(404).json({ errors: { body: ['Article not found'] } });
    }

    // Check if user is the author
    if (article.author_id !== req.user.id) {
      return res.status(403).json({ errors: { body: ['Not authorized to update this article'] } });
    }

    // Update fields
    const updateData = {};
    if (title) {
      updateData.title = title;
      updateData.slug = await generateSlug(title);
    }
    if (description) updateData.description = description;
    if (body) updateData.body = body;

    await article.update(updateData);

    // Fetch updated article with associations
    const updatedArticle = await db.Article.findOne({
      where: { id: article.id },
      include: [
        {
          model: db.User,
          as: 'author',
          attributes: ['username', 'bio', 'image_url']
        },
        {
          model: db.Tag,
          as: 'tags',
          attributes: ['name']
        }
      ]
    });

    const articleFormatted = {
      slug: updatedArticle.slug,
      title: updatedArticle.title,
      description: updatedArticle.description,
      body: updatedArticle.body,
      createdAt: updatedArticle.createdAt,
      updatedAt: updatedArticle.updatedAt,
      tagList: updatedArticle.tags.map(tag => tag.name),
      author: {
        username: updatedArticle.author.username,
        bio: updatedArticle.author.bio,
        image: updatedArticle.author.image_url
      }
    };

    res.json({ article: articleFormatted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: { body: ['Something went wrong'] } });
  }
});

// DELETE /api/articles/:slug - Delete article (author only)
app.delete('/api/articles/:slug', authenticateToken, async (req, res) => {
  try {
    const { slug } = req.params;

    const article = await db.Article.findOne({ where: { slug } });

    if (!article) {
      return res.status(404).json({ errors: { body: ['Article not found'] } });
    }

    // Check if user is the author
    if (article.author_id !== req.user.id) {
      return res.status(403).json({ errors: { body: ['Not authorized to delete this article'] } });
    }

    await article.destroy();

    res.status(200).json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: { body: ['Something went wrong'] } });
  }
});

// === COMMENTS API ENDPOINTS ===

// GET /api/articles/:slug/comments - Get comments for article
app.get('/api/articles/:slug/comments', optionalAuth, async (req, res) => {
  try {
    const { slug } = req.params;

    // First check if article exists
    const article = await db.Article.findOne({ where: { slug } });
    if (!article) {
      return res.status(404).json({ errors: { body: ['Article not found'] } });
    }

    const comments = await db.Comment.findAll({
      where: { article_id: article.id },
      include: [
        {
          model: db.User,
          as: 'author',
          attributes: ['username', 'bio', 'image_url']
        }
      ],
      order: [['createdAt', 'ASC']]
    });

    const commentsFormatted = comments.map(comment => ({
      id: comment.id,
      body: comment.body,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      author: {
        username: comment.author.username,
        bio: comment.author.bio,
        image: comment.author.image_url
      }
    }));

    res.json({ comments: commentsFormatted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: { body: ['Something went wrong'] } });
  }
});

// POST /api/articles/:slug/comments - Add comment to article (authenticated)
app.post('/api/articles/:slug/comments', authenticateToken, async (req, res) => {
  try {
    const { slug } = req.params;
    const { body } = req.body.comment;

    if (!body) {
      return res.status(422).json({ 
        errors: { body: ['Comment body is required'] } 
      });
    }

    // First check if article exists
    const article = await db.Article.findOne({ where: { slug } });
    if (!article) {
      return res.status(404).json({ errors: { body: ['Article not found'] } });
    }

    const comment = await db.Comment.create({
      body,
      article_id: article.id,
      author_id: req.user.id
    });

    // Fetch the comment with author information
    const createdComment = await db.Comment.findOne({
      where: { id: comment.id },
      include: [
        {
          model: db.User,
          as: 'author',
          attributes: ['username', 'bio', 'image_url']
        }
      ]
    });

    const commentFormatted = {
      id: createdComment.id,
      body: createdComment.body,
      createdAt: createdComment.createdAt,
      updatedAt: createdComment.updatedAt,
      author: {
        username: createdComment.author.username,
        bio: createdComment.author.bio,
        image: createdComment.author.image_url
      }
    };

    res.status(201).json({ comment: commentFormatted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: { body: ['Something went wrong'] } });
  }
});

// DELETE /api/articles/:slug/comments/:id - Delete comment (author only)
app.delete('/api/articles/:slug/comments/:id', authenticateToken, async (req, res) => {
  try {
    const { slug, id } = req.params;

    // First check if article exists
    const article = await db.Article.findOne({ where: { slug } });
    if (!article) {
      return res.status(404).json({ errors: { body: ['Article not found'] } });
    }

    const comment = await db.Comment.findOne({ 
      where: { 
        id: parseInt(id),
        article_id: article.id 
      } 
    });

    if (!comment) {
      return res.status(404).json({ errors: { body: ['Comment not found'] } });
    }

    // Check if user is the comment author
    if (comment.author_id !== req.user.id) {
      return res.status(403).json({ errors: { body: ['Not authorized to delete this comment'] } });
    }

    await comment.destroy();

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: { body: ['Something went wrong'] } });
  }
});

// --- Start Server and Test DB Connection ---
async function startServer() {
  try {
    await db.sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
    
    // Sync database tables (creates tables if they don't exist)
    await db.sequelize.sync();
    console.log('Database tables synchronized successfully.');
    
    app.listen(port, () => {
      console.log(`Backend server listening at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

startServer();
