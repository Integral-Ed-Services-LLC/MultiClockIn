import { useEffect, useState } from 'react';
import TimesheetEntryTable from './pages/Timesheet/Timesheet-Entry-Table';
import {
  getTaskAndSprints,
  getBillingCodes,
  findTeamMemberByEmail
} from './airtable/apis';

function App() {
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [taskRecordsMap, setTaskRecordsMap] = useState({});
  const [taskSprintMap, setTaskSprintMap] = useState({});
  const [tasksList, setTasksList] = useState([]);
  const [billingCodesList, setBillingCodesList] = useState([]);
  const [billingCodesMap, setBillingCodesMap] = useState({});
  const [billingCodesSprints, setBillingCodesSprints] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);

  const params = new URLSearchParams(window.location.search);
  const userEmail = params.get('email');

  async function loadInitialData() {
    setInitialized(false);
    const teamMember = await findTeamMemberByEmail(userEmail);
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
    if (userEmail) {
      loadInitialData();
    } else {
      setErrorMessage('No email provided in the search url.');
      setInitialized(true);
    }
  }, [userEmail]);

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
