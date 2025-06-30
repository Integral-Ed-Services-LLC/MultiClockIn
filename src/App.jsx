import React, { useEffect, useState } from 'react';
import TimesheetEntryTable from './pages/Timesheet/Timesheet-Entry-Table';
import { findTeamMemberByFirstName, getTaskAndSprints } from './airtable/apis';

const USER = {
  'First Name': 'David',
  'Last Name': 'Malbin'
};

function App() {
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [taskRecordsMap, setTaskRecordsMap] = useState({});
  const [taskSprintMap, setTaskSprintMap] = useState({});
  const [tasksList, setTasksList] = useState([]);

  async function loadInitialData() {
    setInitialized(false);
    const teamMember = await findTeamMemberByFirstName(USER['First Name']);
    setUser(teamMember);
    const { taskIdToRecordId, parsedTasks, sprintsMap } =
      await getTaskAndSprints(teamMember.id);
    setTaskRecordsMap(taskIdToRecordId);
    setTaskSprintMap(sprintsMap);
    setTasksList(parsedTasks);
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
      user={user}
    />
  );
}

export default App;
