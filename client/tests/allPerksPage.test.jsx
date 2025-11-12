import { fireEvent, screen } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';

import AllPerks from '../src/pages/AllPerks.jsx';
import { renderWithRouter } from './utils/renderWithRouter.js';


  

describe('AllPerks page (Directory)', () => {
  test('lists public perks and responds to name filtering', async () => {
    // The seeded record gives us a deterministic expectation regardless of the
    // rest of the shared database contents.
    const seededPerk = global.__TEST_CONTEXT__.seededPerk;

    // Render the exploration page so it performs its real HTTP fetch.
    renderWithRouter(
      <Routes>
        <Route path="/explore" element={<AllPerks />} />
      </Routes>,
      { initialEntries: ['/explore'] }
    );

  // Wait for the baseline card to appear which guarantees the asynchronous
  // fetch finished. Increase timeout because the real HTTP fetch can take
  // longer than the testing-library default in CI/local environments.
  await screen.findByText(seededPerk.title, {}, { timeout: 10000 });

    // Interact with the name filter input using the real value that
    // corresponds to the seeded record.
    const nameFilter = screen.getByPlaceholderText('Enter perk name...');
    fireEvent.change(nameFilter, { target: { value: seededPerk.title } });

  await screen.findByText(seededPerk.title, {}, { timeout: 10000 });

    // The summary text should continue to reflect the number of matching perks.
    expect(screen.getByText(/showing/i)).toHaveTextContent('Showing');
  });

  /*
  TODO: Test merchant filtering
  - use the seeded record
  - perform a real HTTP fetch.
  - wait for the fetch to finish
  - choose the record's merchant from the dropdown
  - verify the record is displayed
  - verify the summary text reflects the number of matching perks
  */

  test('lists public perks and responds to merchant filtering', async () => {
    const seededPerk = global.__TEST_CONTEXT__.seededPerk;

    // Render the exploration page so it performs its real HTTP fetch.
    renderWithRouter(
      <Routes>
        <Route path="/explore" element={<AllPerks />} />
      </Routes>,
      { initialEntries: ['/explore'] }
    );

  // Wait for the seeded perk card to appear so we know the initial fetch finished.
  await screen.findByText(seededPerk.title, {}, { timeout: 10000 });

    // The label is not programmatically associated with the <select>, so
    // query the "All Merchants" option and get its parent <select>.
  const allOption = await screen.findByText(/all merchants/i, {}, { timeout: 5000 });
    const merchantSelect = allOption.closest('select');
    if (!merchantSelect) throw new Error('Could not find merchant <select>');

    // Choose the seeded perk's merchant and trigger the change event.
    fireEvent.change(merchantSelect, { target: { value: seededPerk.merchant } });

  // Wait for the seeded perk to be visible after filtering.
  await screen.findByText(seededPerk.title, {}, { timeout: 10000 });

    // The summary text should reflect the number of matching perks.
    expect(screen.getByText(/showing/i)).toHaveTextContent('Showing');
  });
});
