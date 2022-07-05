import React from 'react';
import { Item } from 'devextreme-react/toolbar';
import TabPanel from 'devextreme-react/tab-panel';
import Button from 'devextreme-react/button';
import Page from '../lib/page';

const page_list = [];

export default class Test extends React.PureComponent
{
    constructor()
    {
        super()

        this.state =
        {
            dataSource : page_list,
            selectedIndex: 0
        }

        this.renderTitle = this.renderTitle.bind(this);
        this.myRef = React.createRef();
    }
    addPage(e)
    {
        //AYNI EKRANI BİRDEN ÇOK AÇMAK İÇİN YAPILDI. MENÜDEN GELEN DATA TAB ÜZERİNDE BENZERSİZ HALE GETİRİLİYOR.
        let Tmp = {...e}
        
        this.tabCount += 1
        Tmp.tabkey = this.tabCount;//this.state.dataSource.length;
        //*************************************************************************************************** */
        this.setState(
        {
            dataSource: [...this.state.dataSource, Tmp],
            selectedIndex: this.state.dataSource.length
        });    
    }
    closePage()
    {
        const newPages = [...this.state.dataSource];
        const index = this.state.selectedIndex;
        
        newPages.splice(index, 1);

        this.setState(
        {
        dataSource: newPages,
        selectedIndex : 0
        });
    }
    renderTitle(e) 
    {
        console.log(e)
        return (
        <React.Fragment>
            <div>
            <span>
                {e.title}
            </span>
            {<i className="dx-icon dx-icon-close" onClick={()=>{this.onClose()}} />}
            </div>
        </React.Fragment>
        );
    }
    componentDidMount()
    {

    }
    render()
    {
        const { dataSource, selectedIndex } = this.state;
        return(
            <React.Fragment>
                <div className='row'>
                    <div className='col-12'>
                        <Button onClick={()=>
                        {
                            this.addPage({
                                id: 'pos_02_005',
                                text: 'menu.pos_02_005',
                                path: 'test'
                            })
                            console.log(this.myRef)
                        }}>Bumbum</Button>
                    </div>
                </div>
                <TabPanel id="page" ref={this.myRef}
                dataSource={dataSource}
                height = {'100%'}
                itemTitleRender={this.renderTitle}
                deferRendering={false}
                showNavButtons={true}
                repaintChangesOnly={true}
                itemComponent={Page}
                selectedIndex={selectedIndex}
                // items={
                // [
                //     {title:"Deneme"}
                // ]}
                >
                    {/* <Item title="Deneme">
                        <div>ALI KEMAL KARACA</div>
                    </Item> */}
                </TabPanel>
            </React.Fragment>
        )
    }
}