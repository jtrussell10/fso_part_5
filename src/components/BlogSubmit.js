import { useState } from 'react'


const BlogSubmit = ({handlePost}) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    handlePost({
        title: title,
        author: author,
        url: url,
      })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
  <div>
    <form onSubmit={addBlog}>
    <div>
      title
        <input
        id='title-input'
        type="text"
        value={title}
        name="Title"
        onChange={({ target }) => setTitle(target.value)}
      />
    </div>
    <div>
      author
        <input
        id='author-input'
        type="text"
        value={author}
        name="Author"
        onChange={({ target }) => setAuthor(target.value)}
      />
    </div>
    <div>
      url
        <input
        id='url-input'
        type="text"
        value={url}
        name="Url"
        onChange={({ target }) => setUrl(target.value)}
      />
    </div>
    <button type="submit" id='create-submit'>Create</button>
  </form>     
  </div>
)}

export default BlogSubmit