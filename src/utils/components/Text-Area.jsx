import classes from './util-components.module.css';

function TextArea(props) {
  return <textarea className={classes.input} rows={2} {...props} />;
}

export default TextArea;
