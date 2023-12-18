import React from "react";
import GridLayout from "react-grid-layout";
import Base from '../devex/base.js';

export class NdLayout extends Base
{
    constructor(props)
    {
        super(props)
        this.state.width = 1200
        this.state.layout = []
        this.state.accessValue = {}

        this.handleLayoutChange = this.handleLayoutChange.bind(this)
    }
    componentDidMount()
    {
        const myDiv = document.getElementById(this.props.id);

        const resizeObserver = new ResizeObserver(entries =>
        {
            for (const entry of entries)
            {
                const newWidth = entry.contentRect.width;
                this.setState({width : newWidth})
            }
        });

        resizeObserver.observe(myDiv);
    }
    handleLayoutChange (newLayout) 
    {
        newLayout.forEach(itemL => 
        {
            if(itemL.i.replace(/\.\$/g, "") == this.props.children.props.id)
            {
                if(typeof this.props.children.props.access.getValue() != 'undefined' && typeof this.props.children.props.access.getValue().position != 'undefined')
                {
                    let tmpObj = this.props.children.props.access.getValue()

                    if(typeof tmpObj.position.x != 'undefined')
                    {
                        tmpObj.position.x = itemL.x
                    }
                    if(typeof tmpObj.position.y != 'undefined')
                    {
                        tmpObj.position.y = itemL.y
                    }

                    this.props.children.props.access.setValue(tmpObj)

                    if(typeof this.props.parent != 'undefined' && typeof this.props.parent[this.props.children.props.id] != 'undefined')
                    {
                        this.props.parent[this.props.children.props.id].setState({accessValue:this.props.children.props.access.getValue()})
                    }
                }
            }
        });
    };
    render()
    {
        return(
            <div id={this.props.id}>
                <GridLayout className="layout"
                cols={typeof this.props.cols == 'undefined' ? 12 : this.props.cols} 
                rowHeight={typeof this.props.rowHeight == 'undefined' ? 36 : this.props.rowHeight} 
                width={this.state.width}
                layout={this.state.layout}
                onLayoutChange={this.handleLayoutChange}
                >
                    {React.Children.map(this.props.children, child => 
                    {
                        let tmpX = 0;
                        let tmpY = 0;

                        if(typeof child.props.access.getValue() != 'undefined' && typeof child.props.access.getValue().position != 'undefined' && typeof child.props.access.getValue().position.x != 'undefined')
                        {
                            tmpX = child.props.access.getValue().position.x
                        }
                        if(typeof child.props.access.getValue() != 'undefined' && typeof child.props.access.getValue().position != 'undefined' && typeof child.props.access.getValue().position.y != 'undefined')
                        {
                            tmpY = child.props.access.getValue().position.y
                        }
                        
                        return React.cloneElement(child, 
                        {
                            ['data-grid']: { x : tmpX, y : tmpY, w : 1, h : 1 },
                        });
                    })}
                </GridLayout>
            </div>
        )
    }
}
class NdLayoutItemBase extends Base
{
    constructor(props)
    {
        super(props)
        this.state.accessValue = {}
    }
    render() 
    {
        let tmpVisible = false
        if(this.state.editMode)
        {
            tmpVisible = true
        }
        else
        {
            if(typeof this.props.access != 'undefined' && typeof this.props.access.getValue().visible != 'undefined')
            {
                if(this.props.access.getValue().visible)
                {
                    tmpVisible = true
                }
                else
                {
                    tmpVisible = false
                }
            }
            else
            {
                tmpVisible = true
            }
        }
        
        return (
            <div style={{visibility : tmpVisible ? 'visible' : 'hidden'}}>
                <div ref={this.props.forwardedref} {...this.props} className={`custom-panel wrapper ${this.props.classname}`}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}
export const NdLayoutItem = React.forwardRef((props, ref) => <NdLayoutItemBase {...props} forwardedref={ref} />);
