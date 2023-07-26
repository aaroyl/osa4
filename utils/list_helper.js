const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.length === 0
    ? 0
    : blogs.reduce((a, blog) => a + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if(blogs.length === 0){
        return {}
    }else{
        let mostLikes = blogs.reduce((max, blog) => blog.likes > max ? blog.likes : max, blogs[0].likes)
        for(let i = 0; i < blogs.length; i++){
            if(blogs[i].likes === mostLikes){
                return blogs[i]
            }
        }
        return {}
    }
}

const mostBlogs = (blogs) => {
    const blogsByAuthor = lodash.countBy(blogs, 'author')
    const mostBlogs = lodash.maxBy(Object.keys(blogsByAuthor), (author) => blogsByAuthor[author])
    return {
        author: mostBlogs,
        blogs: blogsByAuthor[mostBlogs]
    }
}

const mostLikes = (blogs) => {
    const likesByAuthor = {}

    blogs.forEach((blog) => {
        if(likesByAuthor[blog.author]){
            likesByAuthor[blog.author] += blog.likes
        }else{
            likesByAuthor[blog.author] = blog.likes
        }
    })

    let bestAuthor = ''
    let mostLikes = 0
    for(const author in likesByAuthor){
        if(likesByAuthor[author] > mostLikes){
            bestAuthor = author
            mostLikes = likesByAuthor[author]
        }
    }

    return {
        author: bestAuthor,
        likes: mostLikes
    }
}
  
module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}