import React from 'react';
import TabPanel from 'devextreme-react/tab-panel';
import Page from './page.js'
import moment from 'moment';

const page_list = [];
export default class Panel extends React.PureComponent
{
  static instance = null;
  constructor()
  {
    super()
    
    this.state =
    {
      dataSource : page_list,
      selectedIndex: 0
    }
    this.onSelectionChanged = this.onSelectionChanged.bind(this);
    this.renderTitle = this.renderTitle.bind(this);
    this.tabCount = 0;

    if(!Panel.instance)
    {
      Panel.instance = this;
    }
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
    return (
      <React.Fragment>
        <div>
          <span>
            {e.text}
          </span>
          {<i className="dx-icon dx-icon-close" onClick={()=>{this.onClose()}} />}
        </div>
      </React.Fragment>
    );
  }
  onSelectionChanged(e)
  {
    if(e.name == 'selectedIndex') 
    {
      this.setState(
      {
        selectedIndex: e.value
      });
    }
  }
  render()
  {
    const { dataSource, selectedIndex } = this.state;
    return (
      <React.Fragment>
        <TabPanel id="page"
          dataSource={dataSource}
          height = {'100%'}
          itemTitleRender={this.renderTitle}
          deferRendering={true}
          showNavButtons={true}
          selectedIndex={selectedIndex}
          repaintChangesOnly={true}
          onOptionChanged={this.onSelectionChanged}
          itemComponent={Page}
        />
      </React.Fragment>
    );
  }
}