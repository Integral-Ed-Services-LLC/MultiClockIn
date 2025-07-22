import React, { useMemo, useState } from 'react';
import classes from './Timesheet.module.css';
import FilterableDropdown from '../../utils/components/Filterable-Dropdown';

function TimesheetEntry({
  index,
  task,
  jobCode,
  sprintCode,
  notes,
  minutes,
  done,
  onFormValueChange,
  onRemoveEntry,
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

  function onDoneChange(val) {
    onFormValueChange(index, 'done', val);
  }

  const hoursAndMinutes = useMemo(() => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;

    const hrsPart = hrs > 0 ? `${hrs}hr${hrs > 1 ? 's' : ''}` : '';
    const minsPart = mins > 0 ? `${mins}min${mins > 1 ? 's' : ''}` : '';

    return [hrsPart, minsPart].filter(Boolean).join(' ');
  }, [minutes]);

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
      <div className={classes['task-inputs']}>
        <div className={classes['task-input-item']}>
          <label className={classes['task-input-label']} htmlFor="task">
            Task:
          </label>
          <FilterableDropdown
            options={selectableTasks}
            onSelect={onTaskChange}
          />
        </div>
        <div className={classes['task-input-item']}>
          <label className={classes['task-input-label']} htmlFor="jobCode">
            Job Code:
          </label>
          <FilterableDropdown
            options={selectableBillingCodes}
            onSelect={onJobCodeChange}
          />
        </div>
        <div className={classes['task-input-item']}>
          <label className={classes['task-input-label']} htmlFor="sprintCode">
            Sprint Code:
          </label>
          <select
            className={classes['task-input']}
            name="sprintCode"
            id="sprintCode"
            value={sprintCode}
            onChange={(e) => onSprintCodeChange(e.target.value)}
            disabled={task}
          >
            <option value="">
              {selectableSprintCodes.length > 0
                ? '-- Select Job Code --'
                : 'No Available Sprint Code'}
            </option>
            {selectableSprintCodes.map((sprintCode, index) => (
              <option key={index} value={sprintCode.id}>
                {sprintCode.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className={classes['notes-input-item']}>
        Notes:
        <textarea
          className={classes['notes-input']}
          type="text"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
        />
      </div>
      <div className={classes['minutes-input-section']}>
        <div className={classes['minutes-input-item']}>
          <div>Minutes</div>
          <input
            className={classes['minutes-input']}
            type="number"
            min={1}
            value={minutes}
            onChange={(e) => onMinutesChange(e.target.value)}
          />
          <div>{hoursAndMinutes}</div>
        </div>
        <div className={classes['check-input-item']}>
          <input
            type="checkbox"
            checked={done}
            onChange={(e) => onDoneChange(e.target.checked)}
          />
          Done
        </div>
        <button className="btn-danger" onClick={() => onRemoveEntry(index)}>
          X Cancel
        </button>
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
