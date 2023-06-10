import React from 'react';
import NbButton from '../../core/react/bootstrap/button';
import NbBase from '../../core/react/bootstrap/base';
import ScrollView from 'devextreme-react/scroll-view';

export class PageView extends NbBase
{
    constructor(props)
    {
        super(props)
    }
    componentDidMount()
    {
        console.log(this)
    }
    activePage(pPage)
    {
        Object.keys(this).map((item) => 
        {
            if(this[item] instanceof PageContent)
            {
                this[item].close()
            }
        })
        
        this[pPage].open()
    }
    render()
    {
        return(
            <div>
                {React.Children.map(this.props.children, (child) => {
                    const updatedProps = 
                    {
                        ...child.props,
                        parent: this
                    };
                    return React.cloneElement(child, updatedProps);
                })}
            </div>
        )
    }
}
export class PageContent extends NbBase
{
    constructor(props)
    {
        super(props)
        this.state = {opened : false}
    }
    componentDidMount()
    {
        console.log(window.innerHeight)
    }
    open()
    {
        this.setState({opened:true})
    }
    close()
    {
        this.setState({opened:false})
    }
    render()
    {
        return(
            <div style={{visibility:this.state.opened ? 'visible' : 'hidden',position:this.state.opened ? '' : 'fixed'}}>
                <ScrollView height={(window.innerHeight - 146).toString() + 'px'}>
                    {this.props.children}
                </ScrollView>
            </div>
        )
    }
}