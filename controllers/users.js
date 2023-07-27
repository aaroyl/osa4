const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const { response } = require('../app')

usersRouter.post('/', async (request, response, next) => {
    const {username, name, password} = request.body

    if(password.length <= 3){
        return response.status(400).json({error: 'Too short password'})
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    try{
        const user = new User({
            username, 
            name, 
            passwordHash
        })
    
        const savedUser = await user.save()
    
        response.status(201).json(savedUser)
    }catch(exception){
        next(exception)
    }
    
})

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', {title: 1, author: 1, url: 1, likes: 1})
    response.json(users.map(user => user.toJSON()))
})

module.exports = usersRouter