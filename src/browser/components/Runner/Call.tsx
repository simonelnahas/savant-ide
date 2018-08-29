import * as React from 'react';
import { ABI } from '../../store/contract/types';
import TransitionForm from './TransitionForm';

interface Props {
  abi: ABI;
}

export default class CallTab extends React.Component<Props> {
  render() {
    const { abi } = this.props;

    return (
      <div>
        {abi && abi.transitions.map((transition) => {
          return <TransitionForm key={transition.name} {...transition} />;
        })}
      </div>
    );
  }
}
