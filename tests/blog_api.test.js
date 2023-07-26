const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: "joku kirja",
        author: "jokuvaan",
        url: "nettisivu",
        likes: 10
    },
    {
        title: "toinen kirja",
        author: "jaahama",
        url: "jokwidjk",
        likes: 103
    }
]

const blogToBeAdded = 
    {
        title: "kolmas kirja",
        author: "jokunen",
        url: "asdfghjklö",
        likes: 1035
    }

const blogWithoutLikes = 
    {
        title: "No likes",
        author: "yeuiqyeuwqyei",
        url: "yyyyyyyyyyy"
    }


beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
})

test('correct amount of blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(2)
})

test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
})

test('identifier is id', async () => {
    const blogs = await Blog.find({})
    expect(blogs[0].id).toBeDefined()
})

test('Can post', async () => {
    await api
        .post('/api/blogs')
        .send(blogToBeAdded)
        .expect(200)
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(3)
})

test('Likes default to 0', async () => {
    await api
        .post('/api/blogs')
        .send(blogWithoutLikes)
        .expect(200)
    const response = await api.get('/api/blogs')
    expect(response.body[2].likes).toBe(0)
})

test('Title missing', async () => {
    const blogTitleMissing = 
        {
            author: "jaska",
            url: "jiwojsiowa",
            likes: 105
        }
    
    await api
        .post('/api/blogs')
        .send(blogTitleMissing)
        .expect(400)
    
    const response = await api.get('/api/blogs')
    expect(response.body.length).toBe(2)
})

test('Url missing', async () => {
    const blogTitleMissing = 
        {
            title: "jooo",
            author: "jaskassq",
            likes: 10598
        }
    
    await api
        .post('/api/blogs')
        .send(blogTitleMissing)
        .expect(400)
    
    const response = await api.get('/api/blogs')
    expect(response.body.length).toBe(2)
})

afterAll(async () => {
    await mongoose.connection.close()
})