import * as React from 'react';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

import { Transition } from '../../store/contract/types';

interface Props extends Transition {}
interface State {
  [key: string]: any;
}

export default class TransitionForm extends React.Component<Props, State> {
  handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { params } = this.props;
    return (
      <form>
        {params.map(({ name, type }) => {
          return (
            <FormControl key={name}>
              <InputLabel htmlFor={name}>{name}</InputLabel>
              <Input id={name} value={this.state && this.state[name] || ''} />
              <FormHelperText>Error</FormHelperText>
            </FormControl>
          );
        })}
      </form>
    );
  }
}
