import * as React from 'react';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

import { Transition } from '../../store/contract/types';

interface Props extends Transition {
  handleChange(transition: string, value: State): void;
}

interface State {
  [key: string]: Field;
}

interface Field {
  value: any;
  touched: boolean;
  error: boolean;
}

export default class TransitionForm extends React.Component<Props, State> {
  state: State = this.props.params.reduce((acc, { name }) => {
    return { ...acc, [name]: { value: '', touched: false, error: false } };
  }, {});

  handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    e.persist();
    const { name, value } = e.target;
    const error = this.validate(name);
    const field = { ...this.state[name], value, touched: true, error };

    this.setState({ [name]: field }, () => {
      this.props.handleChange(name, this.state);
    });
  };

  validate = (param: string, ignoreTouched: boolean = false): boolean => {
    const field = this.state[param];

    if (field.touched || ignoreTouched) {
      return !!field.value && field.value.length;
    }

    return !!field.value && field.value.length;
  };

  render() {
    const { params } = this.props;

    return (
      <React.Fragment>
        {params.map(({ name, type }) => {
          const field = this.state[name];

          return (
            <FormControl key={name} error={field.error}>
              <InputLabel htmlFor={name}>{`${name} (${type})`}</InputLabel>
              <Input onChange={this.handleChange} id={name} name={name} value={field.value} />
              {field.error && <FormHelperText>Please fill in a value</FormHelperText>}
            </FormControl>
          );
        })}
      </React.Fragment>
    );
  }
}
