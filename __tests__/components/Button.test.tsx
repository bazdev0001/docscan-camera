import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../../components/ui/Button';

describe('Button', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <Button title="Test Button" onPress={() => undefined} />
    );
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <Button title="Press Me" onPress={mockOnPress} />
    );
    fireEvent.press(getByTestId('button'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <Button title="Disabled" onPress={mockOnPress} disabled />
    );
    const button = getByTestId('button');
    expect(button.props.accessibilityState?.disabled).toBe(true);
  });

  it('shows loading indicator when loading', () => {
    const { queryByText, getByTestId } = render(
      <Button title="Loading" onPress={() => undefined} loading />
    );
    expect(queryByText('Loading')).toBeNull();
    expect(getByTestId('button')).toBeTruthy();
  });
});
