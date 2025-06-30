import React, { useEffect, useState } from 'react';
import TimesheetEntryTable from './pages/Timesheet/Timesheet-Entry-Table';
import {
  findTeamMemberByFirstName,
  getTaskAndSprints,
  getBillingCodes
} from './airtable/apis';

const USER_FIRST_NAME = 'David';

function App() {
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [taskRecordsMap, setTaskRecordsMap] = useState({});
  const [taskSprintMap, setTaskSprintMap] = useState({});
  const [tasksList, setTasksList] = useState([]);
  const [billingCodesList, setBillingCodesList] = useState([]);
  const [billingCodesMap, setBillingCodesMap] = useState({});
  const [billingCodesSprints, setBillingCodesSprints] = useState({});

  async function loadInitialData() {
    setInitialized(false);
    const teamMember = await findTeamMemberByFirstName(USER_FIRST_NAME);
    setUser(teamMember);
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
    setInitialized(true);
  }

  useEffect(() => {
    loadInitialData();
  }, []);

  return !initialized ? (
    'Initializing the App...'
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
