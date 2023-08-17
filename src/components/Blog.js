



import { useState } from 'react'

const Blog = ({blog, handleUpdate, handleDelete, user}) => {

  const [visible, setVisible] = useState(false) 

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = (event) => {
    setVisible(prevIsShown => !prevIsShown)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const addUpdate = (blog) => {
    handleUpdate(blog.id, {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes + 1, 
        ...(blog.user ? { user: blog.user.id } : {})
      })
  }

const deleteBlog = (blog) => {
  handleDelete(blog.id)
}


  return (
    <div style = {blogStyle} className='blog'>
      <div style={hideWhenVisible}>
      {blog.title} {blog.author} <button onClick={toggleVisibility}>View</button>
      </div>
      <div style={showWhenVisible}>
        {blog.title} <button onClick={toggleVisibility}>Hide</button>
        <br/>
        {blog.author}
        <br/>
        {blog.url}
        <br/>
        {blog.likes} <button onClick={() => addUpdate(blog)} >like</button>
        <br/>
        {blog.user?.name && "Created By: " + blog.user.name} 
        {user && blog.user && user.username === blog.user.username && <button onClick={() => deleteBlog(blog)}>Delete</button>}
      </div>
    </div>
  )

}

export default Blog
