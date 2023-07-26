const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})
  
blogRouter.post('/', async (request, response, next) => {
    const body = request.body

    if(!body.likes){
        body.likes = 0
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    })

    try{
        const result = await blog.save()
        response.json(result)
    }catch(exception){
        next(exception)
    }
    
})

module.exports = blogRouter