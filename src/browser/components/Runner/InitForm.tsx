import * as React from 'react';

import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';

import { find } from 'ramda';

import { Param } from '../../store/contract/types';

interface Props {
  params: Param[];
  handleSubmit(args: { [param: string]: Field }): void;
  handleChange(value: State): void;
}

interface State {
  [key: string]: Field;
}

export interface Field {
  value: any;
  type: string;
  touched: boolean;
  error: boolean;
}

export default class InitForm extends React.Component<Props, State> {
  state: State = this.props.params.reduce((acc, { name }) => {
    return { ...acc, [name]: { value: '', touched: false, error: false } };
  }, {});

  handleSubmit: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    // if it's a `view` transition, do not validate at all.
    if (!Object.keys(this.state).length) {
      this.props.handleSubmit(this.state);
    }

    let canSubmit = true;

    const validated = Object.keys(this.state).reduce((acc, param) => {
      const field = this.state[param];
      const isValid = this.validate(field, true);

      if (!isValid) {
        canSubmit = false;
      }

      return { ...acc, [param]: { ...field, error: !isValid } };
    }, this.state);

    if (!canSubmit) {
      this.setState(validated);
      return;
    }

    this.props.handleSubmit(this.state);
  };

  handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    e.persist();
    const { name, value } = e.target;
    const param = find((p) => p.name === name, this.props.params) as Param;
    const field = { ...this.state[name], value, touched: true, type: param.type };
    const isValid = this.validate(field);

    this.setState({ [name]: { ...field, error: !isValid } }, () => {
      this.props.handleChange(this.state);
    });
  };

  validate = (field: Field, ignoreTouched: boolean = false): boolean => {
    if (!field.touched && !ignoreTouched) {
      return true;
    }

    if (!field) {
      return false;
    }

    return field.value.length > 0;
  };

  render() {
    const { params } = this.props;

    return (
      <React.Fragment>
        <Typography align="left" variant="headline">
          Initialisation Parameters:
        </Typography>
        {params.map(({ name, type }) => {
          const field = this.state[name];

          if (!field) {
            return null;
          }

          return (
            field && (
              <FormControl key={name} error={field.error}>
                <InputLabel htmlFor={name}>{`${name} (${type})`}</InputLabel>
                <Input onChange={this.handleChange} id={name} name={name} value={field.value} />
                {field.error && <FormHelperText>Please fill in a value</FormHelperText>}
              </FormControl>
            )
          );
        })}
        <Button
          variant="extendedFab"
          aria-label="Add Contract"
          onClick={this.handleSubmit}
          style={{ margin: '3.5em 0' }}
        >
          Deploy
        </Button>
      </React.Fragment>
    );
  }
}
