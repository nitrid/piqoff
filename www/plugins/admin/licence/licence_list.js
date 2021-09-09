import React from 'react';
import App from '../../../admin/lib/app.js';
import DataGrid, {Column,Grouping,GroupPanel,Pager,Paging,SearchPanel} from 'devextreme-react/data-grid';
import DropDownButton from 'devextreme-react/drop-down-button';
import { Popup, Position, ToolbarItem } from 'devextreme-react/popup';

export default class LicenceList extends React.Component
{
    constructor()
    {
        super()
        this.state = 
        {
            macid : '',
            data : [],
            setup_popup : false,
            setup_msg : ''
        }
        this.selectedRow = null;
        this.onItemClick = this.onItemClick.bind(this)
        this.onSelectionChanged = this.onSelectionChanged.bind(this)

        App.instance.core.socket.emit('lic',{cmd:'get_macid'},(pData) =>
        {
            this.setState({macid:pData})
        })
        App.instance.core.socket.emit('lic',{cmd:'get_lic'},(pData) =>
        {
            this.setState({data:pData})
        })
    }
    onItemClick(e)
    {
        if(e.itemData == "Setup")
        {
            if(this.selectedRow != null)
            {
                this.setState({setup_popup:true,setup_msg:'Uygulama yükleniyor. Lütfen bekleyin...'})
            
                App.instance.core.socket.emit('lic',{cmd:'git_download',prm:this.selectedRow.APP_URL},(pData) =>
                {
                    if(pData == 'success')
                    {
                        this.setState({setup_msg:'Uygulama kurulumu tamamlandı.Lütfen sunucuyu yeniden başlatın.'})
                    }
                    else
                    {
                        this.setState({setup_msg:'Hata : ' + pData})
                    }
                })
            }
        }
    }
    onSelectionChanged({ selectedRowsData }) 
    {
        this.selectedRow = selectedRowsData[0];
    }
    render()
    {
        return(
            <div id="container" style={{padding:'10px',height:'100%'}}>
                <Popup
                    visible={this.state.setup_popup}
                    dragEnabled={false}
                    closeOnOutsideClick={true}
                    showCloseButton={false}
                    showTitle={true}
                    title="Setup"
                    container="#container"
                    width={500}
                    height={120} >
                    <Position at="center" my="center" of="#container"/>
                    <div>{this.state.setup_msg}</div>
                </Popup>
                <div className='row pb-2' style={{height:'5%'}}>
                    <div className='col-6'>
                        Macid : {this.state.macid}
                    </div>
                    <div className='col-6'>
                        <DropDownButton className='float-end'
                            text="İşlemler"
                            dropDownOptions={{width: '150'}}
                            items={['Setup']}
                            onItemClick={this.onItemClick} />
                    </div>
                </div>
                <div className='row' style={{height:'95%'}}>
                    <div className='col-12'>
                        <DataGrid
                            dataSource={this.state.data}
                            selection={{ mode: 'single' }}
                            columnAutoWidth={true}
                            width={'100%'}
                            showRowLines={true}
                            showBorders={true}
                            allowColumnReordering={true}
                            height={'100%'}
                            onSelectionChanged={this.onSelectionChanged} >
          
                            <Column caption="UYGULAMA" dataField="APP" dataType="string" width={100} />
                            <Column caption="KULLANICI SAYISI" dataField="USER_COUNT" dataType="string" width={150} />
                            <Column caption="BAŞLANGIC TARİHİ" dataField="START_DATE" dataType="date" width={200} />
                            <Column caption="BİTİŞ TARİH" dataField="FINISH_DATE" dataType="date" width={200} />
                            <Column caption="KİRALIK" dataField="HIRE" dataType="bit" width={100} />
                            <Column caption="PAKET" dataField="PACKAGE" dataType="string" width={100} />
                            <Column caption="URL" dataField="APP_URL" dataType="string" width={300} />
                        </DataGrid>    
                    </div>
                </div>
            </div>
            
        )
    }
}