import React, { useEffect, useState } from 'react';
import TimesheetEntryTable from './pages/Timesheet/Timesheet-Entry-Table';
import {
  getTaskAndSprints,
  getBillingCodes,
  findTeamMemberByEmail
} from './airtable/apis';

const USER_EMAIL = 'david@integral-ed.com';

function App({ userData }) {
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [taskRecordsMap, setTaskRecordsMap] = useState({});
  const [taskSprintMap, setTaskSprintMap] = useState({});
  const [tasksList, setTasksList] = useState([]);
  const [billingCodesList, setBillingCodesList] = useState([]);
  const [billingCodesMap, setBillingCodesMap] = useState({});
  const [billingCodesSprints, setBillingCodesSprints] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);

  async function loadInitialData() {
    setInitialized(false);
    const teamMember = await findTeamMemberByEmail(USER_EMAIL);
    setUser(teamMember);
    if (!teamMember) {
      setErrorMessage('Cannot load the user data!');
      setInitialized(true);
      return;
    }
    const { taskIdToRecordId, parsedTasks, sprintsMap } =
      await getTaskAndSprints(teamMember.id);
    setTaskRecordsMap(taskIdToRecordId);
    setTaskSprintMap(sprintsMap);
    setTasksList(parsedTasks);
    const { billingCodes, billingCodeToRecordsMap, sprintMap } =
      await getBillingCodes(teamMember.id);
    setBillingCodesList(billingCodes);
    setBillingCodesMap(billingCodeToRecordsMap);
    setBillingCodesSprints(sprintMap);
    setErrorMessage(null);
    setInitialized(true);
  }

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    function handleUserMessage(event) {
      if (event.data && (event.data.email || event.data.firstName)) {
        // Use event.data.email or event.data.firstName to fetch user from Airtable
        // Example: findTeamMemberByEmail(event.data.email)
        // or: findTeamMemberByFirstName(event.data.firstName)
        // Then setUser(...) and load the rest of the app
      }
    }
    window.addEventListener('message', handleUserMessage);
    return () => window.removeEventListener('message', handleUserMessage);
  }, []);

  return !initialized ? (
    'Initializing the App...'
  ) : errorMessage ? (
    errorMessage
  ) : (
    <TimesheetEntryTable
      taskRecordsMap={taskRecordsMap}
      taskSprintMap={taskSprintMap}
      tasksList={tasksList}
      billingCodesList={billingCodesList}
      billingCodesMap={billingCodesMap}
      billingCodesSprints={billingCodesSprints}
      user={user}
    />
  );
}

export default App;
