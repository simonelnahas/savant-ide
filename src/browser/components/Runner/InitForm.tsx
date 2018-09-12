import * as React from 'react';

import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import Typography from '@material-ui/core/Typography';

import styled from 'styled-components';

import Loader from '../Loader';
import { DeploymentResult, Param } from '../../store/contract/types';
import { isField, Field, MsgField, FieldDict, MsgFieldDict } from '../../util/form';
import { validate as valid } from '../../util/validation';

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

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;

  .form {
    flex: 1 0 auto;
    margin: 2em 0;
  }
`;

interface Props {
  abiParams: Param[];
  result: DeploymentResult | null;
  handleSubmit: (init: FieldDict, msg: MsgFieldDict) => void;
  handleReset: () => void;
  isDeploying: boolean;
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
      _amount: { value: '0', touched: false, error: false },
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

    const validatedMsg = Object.keys(msg).reduce((acc, name) => {
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
    const baseField = { ...currentField, value, touched: true };
    const isValid = this.validate(baseField);
    const newField = {
      ...baseField,
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
    const baseField = { ...currentField, value, touched: true };
    const isValid = this.validate(baseField);
    const newField = { ...baseField, error: !isValid };
    const newMsg = { ...msg, [name]: newField };

    this.setState({ msg: newMsg });
  };

  validate = (field: Field | MsgField, ignoreTouched: boolean = false): boolean => {
    if (!field) {
      return false;
    }

    if (!field.touched && !ignoreTouched) {
      return true;
    }

    if (isField(field)) {
      return valid(field.type, field.value);
    }

    return valid('Uint128', field.value);
  };

  componentDidUpdate(nextProps: Props) {
    // we hit the reset button; clear out form state.
    if (!nextProps.result && nextProps.result !== this.props.result) {
      this.setState({
        init: {},
        msg: {},
      });
    }
  }

  render() {
    const { abiParams, result, handleReset } = this.props;
    const { init, msg } = this.state;

    if (this.props.isDeploying) {
      return <Loader delay={1001} message="Deploying contract..." />;
    }

    if (result && result.status === 0) {
      return (
        <StatusWrapper>
          <Typography variant="body2">
            {`Your contract was successfully deployed to 0x${result.address.toUpperCase()}`}
          </Typography>
          <Button
            color="primary"
            variant="extendedFab"
            aria-label="reset"
            onClick={handleReset}
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
            onClick={handleReset}
            style={{ margin: '3.5em 0' }}
          >
            Try Again
          </Button>
        </StatusWrapper>
      );
    }

    return (
      <Wrapper>
        <Typography align="left" gutterBottom variant="title">
          Transaction Parameters:
        </Typography>
        <FormGroup classes={{ root: 'form' }}>
          <FormControl error={msg._amount.error}>
            <InputLabel htmlFor="_amount">Amount (Uint128)</InputLabel>
            <Input
              onChange={this.handleMsgChange}
              id="_amount"
              name="_amount"
              value={msg._amount.value}
            />
            {msg._amount.error && <FormHelperText>Please fill in a valid value</FormHelperText>}
          </FormControl>
        </FormGroup>
        <FormGroup classes={{ root: 'form' }}>
          <Typography align="left" gutterBottom variant="title">
            Initialisation Parameters:
          </Typography>
          {abiParams.map(({ name, type }) => {
            const field = init[name];

            return (
              field && (
                <FormControl key={name} error={field.error}>
                  <InputLabel htmlFor={name}>{`${name} (${type})`}</InputLabel>
                  <Input
                    onChange={this.handleInitChange}
                    id={name}
                    name={name}
                    value={field.value}
                  />
                  {field.error && <FormHelperText>Please fill in a value</FormHelperText>}
                </FormControl>
              )
            );
          })}
        </FormGroup>
        <Button
          color="primary"
          variant="extendedFab"
          aria-label="Add Contract"
          onClick={this.handleSubmit}
          style={{ margin: '3.5em 0' }}
        >
          Deploy
        </Button>
      </Wrapper>
    );
  }
}
