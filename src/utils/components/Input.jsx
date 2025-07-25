import React from 'react';
import classes from './util-components.module.css'; // same CSS module as your dropdown

function Input({ value, onChange, type = 'text', ...rest }) {
  return (
    <input
      type={type}
      className={classes.input}
      value={value}
      onChange={onChange}
      {...rest}
    />
  );
}

export default Input;
