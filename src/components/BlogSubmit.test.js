import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/'
import BlogSubmit from './BlogSubmit'
import userEvent from '@testing-library/user-event'

test('<BlogSubmit /> updates parent state and calls onSubmit', async () => {
  const handlePost = jest.fn()
  const user = userEvent.setup()


  const { container } = render(<BlogSubmit handlePost={handlePost} />)

  const input = container.querySelector('#title-input')
  const sendButton = screen.getByText('Create')

  await user.type(input, 'testing a form...')
  await user.click(sendButton)

  expect(handlePost.mock.calls).toHaveLength(1)
  expect(handlePost.mock.calls[0][0].title).toBe('testing a form...')
})