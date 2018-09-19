import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

const StatusWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 6px 8px;
`;

interface Props {
  line: number;
  col: number;
  blockHeight: number;
  selectedFile: string;
}

const Statusline: React.SFC<Props> = ({ line, col, blockHeight, selectedFile }) => (
  <StatusWrapper>
    <Typography variant="body2" color="primary">{`Block Height: ${blockHeight}`}</Typography>
    <Typography variant="body2">{`${selectedFile}.scilla`}</Typography>
    <Typography variant="body2">{`Ln ${line}, Col ${col}`}</Typography>
  </StatusWrapper>
);

export default Statusline;
