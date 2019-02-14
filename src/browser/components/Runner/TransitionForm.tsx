/**
 * This file is part of savant-ide.
 * Copyright (c) 2018 - present Zilliqa Research Pte. Ltd.
 *
 * savant-ide is free software: you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * savant-ide is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE.  See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * savant-ide.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as React from 'react';
import styled from 'styled-components';

import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import Typography from '@material-ui/core/Typography';

import Loader from '../Loader';
import Status from '../Status';
import TxParams from '../Form/TxParams';
import InputWrapper from '../Form/InputWrapper';
import { formatError } from '../../util/api';
import { RunnerResult, Transition } from '../../store/contract/types';
import { isField, Field, MsgField, FieldDict, MsgFieldDict } from '../../util/form';
import { validate as valid } from '../../util/validation';

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
  isCalling: boolean;
  result: RunnerResult | null;
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
      gaslimit: { value: 2000, touched: false, error: false },
      gasprice: { value: 1, touched: false, error: false },
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

  handleGasPriceChange = (_: any, value: any) => {
    this.setState({ msg: { ...this.state.msg, gasprice: { error: false, touched: true, value } } });
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

    if (this.props.isCalling) {
      return <Loader delay={1001} message="Calling transition..." />;
    }

    if (result && result.status === 0) {
      return (
        <Status>
          <Typography variant="body2" align="left">
            {`${this.props.name} at 0x${result.address.toUpperCase()} was successfully called.`}
          </Typography>
          <Typography variant="body2" align="left" style={{ whiteSpace: 'pre' }}>
            {`Gas used: ${result.gasUsed}\nGas price: ${
              result.gasPrice
            }\nTransaction cost: ${result.gasUsed * result.gasPrice} ZIL`}
          </Typography>
          <Button
            variant="extendedFab"
            color="primary"
            aria-label="reset"
            onClick={handleReset}
            style={{ margin: '3.5em 0' }}
          >
            Reset
          </Button>
        </Status>
      );
    }

    if (result && result.status === 1) {
      return (
        <Status>
          <Typography color="error" variant="body2" style={{ whiteSpace: 'pre-line' }}>
            {`The call to transition ${this.props.name} failed. The following error occured:

              ${result.error.response ? formatError(result.error.response.message) : result.error}

            Please double check your call parameters and try again.
            `}
          </Typography>
          <Button
            variant="extendedFab"
            color="primary"
            aria-label="reset"
            onClick={handleReset}
            style={{ margin: '3.5em 0' }}
          >
            Try Again
          </Button>
        </Status>
      );
    }

    return (
      <Wrapper>
        <Typography align="left" gutterBottom variant="headline">
          Transaction Parameters:
        </Typography>
        <TxParams
          values={msg}
          handleMsgChange={this.handleMsgChange}
          handleGasPriceChange={this.handleGasPriceChange}
        />
        {params && params.length ? (
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
                    <InputWrapper key={name} error={field.error}>
                      <InputLabel htmlFor={name}>{`${name} (${type})`}</InputLabel>
                      <Input
                        onChange={this.handleParamsChange}
                        id={name}
                        name={name}
                        value={field.value}
                      />
                      {field.error && <FormHelperText>Please fill in a value</FormHelperText>}
                    </InputWrapper>
                  )
                );
              })}
            </React.Fragment>
          </FormGroup>
        ) : null}
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
