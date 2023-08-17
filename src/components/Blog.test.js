import React from 'react'
import '@testing-library/jest-dom/'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content on initial display', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 5
  }

  render(<Blog blog={blog} />)

  const checkVisibility = (regex, shouldBeVisible) => {
    const elements = screen.getAllByText(regex);
    const visibleElements = elements.filter(element => getComputedStyle(element).display !== 'none');
    if (shouldBeVisible) {
      expect(visibleElements.length).toBe(1);
    } else {
      expect(visibleElements.length).toBe(0);
    }
  };

  checkVisibility(/Component testing is done with react-testing-library/i, true);
  checkVisibility(/Test Author/i, true); 
  checkVisibility(/http:\/\/testurl\.com/i, false); 
  checkVisibility(/5/i, false); 
});

test('renders content when view is clicked', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 5
  }

  const mockHandler = jest.fn()

  render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('View')
  await user.click(button)

  const checkVisibility = (regex, shouldBeVisible) => {
    const elements = screen.getAllByText(regex);
    const visibleElements = elements.filter(element => getComputedStyle(element).display !== 'none');
    if (shouldBeVisible) {
      expect(visibleElements.length).toBe(1);
    } else {
      expect(visibleElements.length).toBe(0);
    }
  };

  checkVisibility(/Component testing is done with react-testing-library/i, true);
  checkVisibility(/Test Author/i, true); 
  checkVisibility(/http:\/\/testurl\.com/i, true); 
  checkVisibility(/5/i, true); 
});


test('clicking the button calls event handler once', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 5
  }

  const mockHandler = jest.fn()

  render(
    <Blog blog={blog} handleUpdate={mockHandler} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})

test('clicking the button twice calls event handler twice', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 5
  }

  const mockHandler = jest.fn()

  render(
    <Blog blog={blog} handleUpdate={mockHandler} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
