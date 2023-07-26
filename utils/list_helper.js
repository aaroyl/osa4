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
  
module.exports = {
    dummy, totalLikes, favoriteBlog
}