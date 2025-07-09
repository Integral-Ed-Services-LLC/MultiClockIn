1. **Enhance Job Code (billing-codes-timesheet-ddl) Dropdown UX:**
   - Sort all billing codes alphabetically in the dropdown.
   - Replace the dropdown with a combo box that allows users to type and filter the list in real time.
   - Add a button at the bottom of the filtered list labeled "See all billing codes"; clicking this button resets the filter and displays the full list.
   - The "See all billing codes" button should open a modal containing a combo box of all active job codes.
     - **a.** Sort billing codes alphabetically in the data preparation step (e.g., in App.jsx after fetching from Airtable).
     - **b.** Implement the combo box in the UI (input for typing/filtering, filtered list, and the "See all billing codes" button).
     - **c.** When the button is clicked, display a modal with a combo box showing all active job codes, allowing type-to-filter within the modal as well.
     - **d.** Ensure the modal can be closed and the selected job code is applied to the main form.
