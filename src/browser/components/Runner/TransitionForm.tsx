import * as React from 'react';
import styled from 'styled-components';

import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';

import { CallResult, Transition } from '../../store/contract/types';
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

interface Props extends Transition {
  handleReset: () => void;
  handleSubmit: (transition: string, params: FieldDict, msg: MsgFieldDict) => void;
  result: CallResult | null;
}

interface State {
  params: FieldDict;
  msg: MsgFieldDict;
}

export default class TransitionForm extends React.Component<Props, State> {
  state: State = {
    params: this.props.params.reduce(
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
    const { params, msg } = this.state;

    let canSubmit = true;

    const validatedParams = Object.keys(params).reduce((acc, name) => {
      const field = params[name];
      const isValid = this.validate(field, true);

      if (!isValid) {
        canSubmit = false;
      }

      return { ...acc, [name]: { ...field, error: !isValid } };
    }, params);

    const validatedMsg = Object.keys(msg).reduce((acc, name) => {
      const field = msg[name];
      const isValid = this.validate(field, true);

      if (!isValid) {
        canSubmit = false;
      }

      return { ...acc, [name]: { ...field, error: !isValid } };
    }, msg);

    if (!canSubmit) {
      this.setState({ params: validatedParams, msg: validatedMsg });
      return;
    }

    this.props.handleSubmit(this.props.name, params, msg);
  };

  handleParamsChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    const { params } = this.state;

    const currentField = params[name];
    const baseField = { ...currentField, value, touched: true };
    const isValid = this.validate(baseField);
    const newField = {
      ...baseField,
      error: !isValid,
    };
    const newParams = { ...params, [name]: newField };

    this.setState({ params: newParams });
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
        params: {},
        msg: {},
      });
    }
  }

  render() {
    const { handleReset, params, result } = this.props;
    const { msg } = this.state;

    if (result && result.status === 0) {
      return (
        <StatusWrapper>
          <Typography variant="body2">
            {`${this.props.name} at ${result.address} was successfully called.`}
          </Typography>
          <Button
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
            The call to transition `$
            {this.props.name}` failed. The following error occured:
            {result.error}
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
        <Typography align="left" gutterBottom variant="headline">
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
        {!!params.length && (
          <FormGroup classes={{ root: 'form' }}>
            <React.Fragment>
              <Typography align="left" gutterBottom variant="headline">
                Transition Parameters:
              </Typography>
              {params.map(({ name, type }) => {
                const field = this.state.params[name];

                if (!field) {
                  return null;
                }

                return (
                  field && (
                    <FormControl key={name} error={field.error}>
                      <InputLabel htmlFor={name}>{`${name} (${type})`}</InputLabel>
                      <Input
                        onChange={this.handleParamsChange}
                        id={name}
                        name={name}
                        value={field.value}
                      />
                      {field.error && <FormHelperText>Please fill in a value</FormHelperText>}
                    </FormControl>
                  )
                );
              })}
            </React.Fragment>
          </FormGroup>
        )}
        <Button
          color="primary"
          variant="extendedFab"
          aria-label="Add Contract"
          onClick={this.handleSubmit}
          style={{ margin: '3.5em 0' }}
        >
          Call Transition
        </Button>
      </Wrapper>
    );
  }
}
