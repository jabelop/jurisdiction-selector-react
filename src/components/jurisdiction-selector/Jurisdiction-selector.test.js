import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import JurisdictionSelector from './JurisdictionSelector';
import { fetchJurisdictions, fetchSubJurisdictions } from '../../api/fakeJurisdictionsApi';

test('renders learn react link', () => {
  render(<JurisdictionSelector
    fetchJurisdictionsTop={fetchJurisdictions}
    fetchJurisdictionsLow={fetchSubJurisdictions}
    dataSelected={() => null}
  />);
  const selector = screen.getByText(/Choose jurisdiction/i);
  expect(selector).toBeInTheDocument();
});

test('renders learn react link', async () => {
    const { container } = render(<JurisdictionSelector
      fetchJurisdictionsTop={fetchJurisdictions}
      fetchJurisdictionsLow={fetchSubJurisdictions}
      dataSelected={() => null}
    />);
    const selector = screen.getByText(/Choose jurisdiction/i);
    expect(selector).toBeInTheDocument();
    fireEvent.click(selector);
    const loading = container.querySelector('#loading');
    expect(loading).toBeInTheDocument();
    await waitFor(() => {
        const item = screen.getByText(/Spain/i);
        expect(item).toBeInTheDocument();
    })
  });