import React from 'react';
import { render, screen } from '@testing-library/react';
import HomeComponent from '../components/homeComponent';
import '@testing-library/jest-dom';

window.React = React;

test('renders component', () => {
    render(<HomeComponent />);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
    });