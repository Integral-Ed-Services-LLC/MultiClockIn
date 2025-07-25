import React, { useMemo } from 'react';
import classes from './Timesheet.module.css';
import FilterableDropdown from '../../utils/components/Filterable-Dropdown';
import TextArea from '../../utils/components/Text-Area';
import Input from '../../utils/components/Input';

function TimesheetEntry({
  index,
  task,
  jobCode,
  notes,
  minutes,
  onFormValueChange,
  tasksList,
  billingCodesList,
  billingCodesSprints
}) {
  function onTaskChange(val) {
    onFormValueChange(index, 'task', val);
  }

  function onJobCodeChange(val) {
    onFormValueChange(index, 'jobCode', val);
  }

  function onSprintCodeChange(val) {
    onFormValueChange(index, 'sprintCode', val);
  }

  function onNotesChange(val) {
    onFormValueChange(index, 'notes', val);
  }

  function onMinutesChange(val) {
    onFormValueChange(index, 'minutes', val);
    onFormValueChange(index, 'done', false);
  }

  const selectableTasks = useMemo(() => {
    return tasksList.map((val) => ({
      id: val.taskId,
      label: val.original
    }));
  }, [tasksList.length]);

  const selectableBillingCodes = useMemo(() => {
    return billingCodesList.map((val) => ({
      id: val,
      label: val
    }));
  }, [billingCodesList.length]);

  const selectableSprintCodes = useMemo(() => {
    if (!jobCode) return [];
    return billingCodesSprints[jobCode].map((val) => ({
      id: val.sprintId,
      label: val.sprintCode
    }));
  }, [jobCode]);

  return (
    <div className={classes['timesheet-form']}>
      <div className={classes['dropdown-input-item']}>
        <FilterableDropdown
          placeholder="Task"
          options={selectableTasks}
          onSelect={onTaskChange}
        />
      </div>
      <div className={classes['dropdown-input-item']}>
        <FilterableDropdown
          placeholder="Billing Code"
          options={selectableBillingCodes}
          onSelect={onJobCodeChange}
          disabled={!!task}
        />
      </div>
      <div className={classes['dropdown-input-item']}>
        <FilterableDropdown
          placeholder="Sprint Code"
          options={selectableSprintCodes}
          onChange={onSprintCodeChange}
          disabled={!!task}
        />
      </div>
      <div className={classes['notes-input-item']}>
        <TextArea
          placeholder="Notes"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={3}
          style={{ resize: 'none' }}
        />
      </div>
      <div className={classes['minutes-input-item']}>
        <Input
          placeholder="Minutes"
          type="number"
          min={1}
          value={minutes}
          onChange={(e) => onMinutesChange(e.target.value)}
        />
      </div>
    </div>
  );
}

export default React.memo(TimesheetEntry, (prevProps, newProps) => {
  return (
    prevProps.done === newProps.done &&
    prevProps.task === newProps.task &&
    prevProps.project === newProps.project &&
    prevProps.jobCode === newProps.jobCode &&
    prevProps.notes === newProps.notes &&
    prevProps.minutes === newProps.minutes
  );
});
