import React from 'react';
import App from '../../../lib/app.js';
import {TextBox} from 'devextreme-react/text-box';
import SelectBox from 'devextreme-react/select-box';
import { Button } from 'devextreme-react/button';
import Form, { Label,Item,EmptyItem,SimpleItem,GroupItem } from 'devextreme-react/form';

export default class barcodeCard extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            isHomeAddressVisible: true,
          };


          this.checkBoxOptions = {
            text: 'Show Address',
            value: true,
            onValueChanged: (e) => {
              this.setState({
                isHomeAddressVisible: e.component.option('value'),
              });
            },
          };
    }
    render()
    {
        return(
            <React.Fragment>
                <div className="long-title"><h3>Personal details</h3></div>
                <div className="form-container">
                    <Form colCount={1} id="frmPromo">
                            <SimpleItem editorType="dxCheckBox" editorOptions={this.checkBoxOptions} />
                            <GroupItem>
                                <Item visible={this.state.isHomeAddressVisible}>
                                    <Label text={"AAAA"}/>
                                </Item>
                            </GroupItem>
                    </Form>
                </div>
                
            </React.Fragment>
        )
    }
}