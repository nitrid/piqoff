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
        if(typeof this.props.onActivePage != 'undefined')
        {
            this.props.onActivePage(pPage)
        }
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
    componentDidUpdate(prevProps,prevState)
    {
        if(prevState.opened == false && typeof this.props.onActive != 'undefined')
        {
            this.props.onActive();
        }
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
                <ScrollView height={(window.innerHeight - 110).toString() + 'px'}>
                    {this.props.children}
                </ScrollView>
            </div>
        )
    }
}