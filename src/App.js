import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogSubmit from './components/BlogSubmit'
import './index.css'

const Notification = ({ message, style }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={style}>
      {message}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [errorStyle, setErrorStyle] = useState('success')
  const [user, setUser] = useState(null)

  const blogListRef = useRef()


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a,b)=> b.likes - a.likes))
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setErrorStyle('success')
      setErrorMessage('Successfully Logged In')
      setTimeout(() => {
      setErrorMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorStyle('error')
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }


  const handlePost = async (blogObject) => {
    blogListRef.current.toggleVisibility()

    try {
      const newBlog = await blogService.create(blogObject)
      const blogWithUser = {
        ...newBlog, 
        user: {
          ...user,
        }
      }
      setBlogs(blogs.concat(blogWithUser))
      setErrorStyle('success')
      setErrorMessage('New Blog Created')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
  } catch (exception) {
      setErrorStyle('error')
      setErrorMessage('Post failed')
      setTimeout(() => {
      setErrorMessage(null)
      }, 5000)
    }
  }
  
  const handleUpdate = async (blogId, blogObject) => {

    try {
      const updatedBlog = await blogService.update(blogId, blogObject)
      setBlogs(blogs.map(blog => 
            blog.id !== blogId ? blog : updatedBlog
        ));
      setErrorMessage(`Blog updated`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('Like failed')
      setTimeout(() => {
      setErrorMessage(null)
      }, 5000)
    }
  }

  const handleDelete = async (blogId) => {
    try {
      await blogService.deleteBlog(blogId);
      setBlogs(blogs.filter(blog => blog.id !== blogId));
      setErrorStyle('success')
      setErrorMessage(`Blog deleted`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } catch (exception) {
      console.error("Error deleting the blog:", exception);
      setErrorStyle('error')
      setErrorMessage('Delete failed')
      setTimeout(() => {
      setErrorMessage(null)
      }, 5000)
  }
}


  const loginForm = () => {
  

    return (
      <div>
        <Togglable buttonLabel='login'>
          <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
          />
          </Togglable>
      </div>
    )
  }

  const LogoutButton = () => {
    const handleLogOut = () => {
      setUser(null);
      window.localStorage.removeItem('loggedBlogappUser');
      setErrorStyle('success')
      setErrorMessage('Successfully Logged Out')
    }
  
    return (
      <button onClick={handleLogOut}>
        Log out
      </button>
    );
  }

 const blogList = () => {

  return ( 
    <div>
      <Togglable buttonLabel='Create'ref={blogListRef}>
      <BlogSubmit
        handlePost= {handlePost} 
        />
        </Togglable>
        <h2>blogs</h2>
        {blogs.map(blog =>
        <Blog 
        key={blog.id} 
        blog={blog} 
        handleUpdate = {handleUpdate} 
        handleDelete = {handleDelete} 
        user = {user}
        />
        )}
        </div>
    )
 }


  
  return (
    <div>
      <h1>Blog list</h1>
        <Notification message={errorMessage} style={errorStyle}/>
      
    
    {!user && loginForm()} 
    {user && <div>
      <span>{user.name} logged in</span>
      <span> <LogoutButton /> </span>
         {blogList()}
      </div>
    }


    </div>
  )
}

export default App