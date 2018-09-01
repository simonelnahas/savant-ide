import * as React from 'react';

import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

import { DeploymentResult, Param } from '../../store/contract/types';
import { Field, MsgField, FieldDict, MsgFieldDict } from '../../util/form';

const StatusWrapper = styled.div`
  width: 100%;
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;

  > * {
    width: 100%;
    text-align: center;
  }
`;

interface Props {
  abiParams: Param[];
  result: DeploymentResult | null;
  handleSubmit: (init: FieldDict, msg: MsgFieldDict) => void;
}

interface State {
  init: FieldDict;
  msg: MsgFieldDict;
}

export default class InitForm extends React.Component<Props, State> {
  state: State = {
    init: this.props.abiParams.reduce(
      (acc, { name, type }) => ({
        ...acc,
        [name]: { value: '', type, touched: false, error: false },
      }),
      {},
    ),
    msg: {
      _amount: { value: '', touched: false, error: false },
    },
  };

  handleSubmit: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    const { init, msg } = this.state;

    let canSubmit = true;

    const validatedInit = Object.keys(init).reduce((acc, name) => {
      const field = init[name];
      const isValid = this.validate(field, true);

      if (!isValid) {
        canSubmit = false;
      }

      return { ...acc, [name]: { ...field, error: !isValid } };
    }, init);

    const validatedMsg = Object.keys(init).reduce((acc, name) => {
      const field = msg[name];
      const isValid = this.validate(field, true);

      if (!isValid) {
        canSubmit = false;
      }

      return { ...acc, [name]: { ...field, error: !isValid } };
    }, msg);

    if (!canSubmit) {
      this.setState({ init: validatedInit, msg: validatedMsg });
      return;
    }

    this.props.handleSubmit(init, msg);
  };

  handleInitChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    const { init } = this.state;

    const currentField = init[name];
    const isValid = this.validate(currentField);
    const newField = {
      ...currentField,
      value,
      touched: true,
      error: !isValid,
    };
    const newInit = { ...init, [name]: newField };

    this.setState({ init: newInit });
  };

  handleMsgChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    const { msg } = this.state;

    const currentField = msg[name];
    const isValid = this.validate(currentField);
    const newField = { ...currentField, value, touched: true, error: !isValid };
    const newMsg = { ...msg, [name]: newField };

    this.setState({ msg: newMsg });
  };

  reset = () => {
    this.setState({
      init: {},
      msg: {},
    });
  };

  validate = (field: Field | MsgField, ignoreTouched: boolean = false): boolean => {
    if (!field.touched && !ignoreTouched) {
      return true;
    }

    if (!field) {
      return false;
    }

    return field.value.length > 0;
  };

  render() {
    const { abiParams, result } = this.props;
    const { init, msg } = this.state;

    if (result && result.status === 0) {
      return (
        <StatusWrapper>
          <Typography variant="body2">
            {`Your contract was successfully deployed to ${result.address}`}
          </Typography>
          <Button
            variant="extendedFab"
            aria-label="reset"
            onClick={this.reset}
            style={{ margin: '3.5em 0' }}
          >
            Reset
          </Button>
        </StatusWrapper>
      );
    }

    if (result && result.status === 1) {
      return (
        <StatusWrapper>
          <Typography color="error" variant="body2">
            Your contract could not be deployed.
          </Typography>
          <Button
            variant="extendedFab"
            aria-label="reset"
            onClick={this.reset}
            style={{ margin: '3.5em 0' }}
          >
            Try Again
          </Button>
        </StatusWrapper>
      );
    }

    return (
      <React.Fragment>
        <Typography align="left" variant="headline">
          Transaction Parameters:
        </Typography>
        <FormControl error={msg._amount.error}>
          <InputLabel htmlFor="_amount">Amount (Uint128)</InputLabel>
          <Input
            onChange={this.handleMsgChange}
            id="_amount"
            name="_amount"
            value={msg._amount.value}
          />
          {msg._amount.error && <FormHelperText>Please fill in a value</FormHelperText>}
        </FormControl>
        <Typography align="left" variant="headline">
          Initialisation Parameters:
        </Typography>
        {abiParams.map(({ name, type }) => {
          const field = init[name];

          return (
            field && (
              <FormControl key={name} error={field.error}>
                <InputLabel htmlFor={name}>{`${name} (${type})`}</InputLabel>
                <Input onChange={this.handleInitChange} id={name} name={name} value={field.value} />
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
