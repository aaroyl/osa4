const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
    response.json(blogs)
})
  
blogRouter.post('/', async (request, response, next) => {
    const body = request.body

    const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if(!decodedToken.id){
        return response.status(401).json({error: 'token invalid'})
    }

    const user = await User.findById(decodedToken.id)

    if(!body.likes){
        body.likes = 0
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    })

    try{
        const result = await blog.save()
        response.json(result)
        user.blogs = user.blogs.concat(result._id)
        await user.save()
        console.log(user)
    }catch(exception){
        next(exception)
    }  
})

blogRouter.delete('/:id', async (request, response, next) => {
    try{
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    }catch(exception){
        next(exception)
    }
})

blogRouter.put('/:id', async (request, response, next) => {
    const body = request.body
    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    try{
        const result = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
        response.json(result)
    }catch(exception){
        next(exception)
    }  
})

module.exports = blogRouter