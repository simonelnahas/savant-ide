import * as React from 'react';
// tslint:disable-next-line
// @ts-ignore
import * as brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/ocaml';
import 'brace/theme/github';

export default class ScillaEditor extends React.Component<any> {
  onChange = (value: any): void => {
    console.log(value);
  };

  render() {
    return (
      <AceEditor
        mode="ocaml"
        theme="github"
        onChange={this.onChange}
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
      />
    );
  }
}
