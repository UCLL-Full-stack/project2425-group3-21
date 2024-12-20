import React from 'react';
import { render, screen } from '@testing-library/react';
import HomeComponent from '../components/homeComponent';
import '@testing-library/jest-dom';

// Mock the useTranslation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

test('renders component', () => {
  render(<HomeComponent />);
  const titleElement = screen.getByText('home.title');
  expect(titleElement).toBeInTheDocument();
});