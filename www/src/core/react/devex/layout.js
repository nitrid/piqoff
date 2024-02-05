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

        // this.onEditMode = async(pStatus)=>
        // {
        //     if(!pStatus)
        //     {
        //         console.log(this.props.parent)
        //         React.Children.map(this.props.children,child => 
        //         {
        //             if(typeof this.props.parent[child.props.id] != 'undefined')
        //             {
        //                 this.props.parent[child.props.id].setState({visible:this.props.parent[child.props.id].state.accessValue.visible})
        //             }
        //             //console.log(this.props.parent[child.props.id].state.accessValue.visible + " - " + child.props.id)
        //         })
        //     }
        // }
    }
    componentWillUnmount() 
    {
        this.isUnmounted = true;
    }
    componentDidMount()
    {
        const myDiv = document.getElementById(this.props.id);

        const resizeObserver = new ResizeObserver(entries =>
        {
            for (const entry of entries)
            {
                const newWidth = entry.contentRect.width;
                if (!this.isUnmounted) 
                {
                    this.setState({width : newWidth})
                }
            }
        });

        resizeObserver.observe(myDiv);
    }
    handleLayoutChange (newLayout) 
    {
        newLayout.forEach(itemL => 
        {
            React.Children.map(this.props.children,child => 
            {
                if(itemL.i.replace(/\.\$/g, "") == child.props.id)
                {
                    if(typeof child.props.access.getValue() != 'undefined' && typeof child.props.access.getValue().position != 'undefined')
                    {
                        let tmpObj = child.props.access.getValue()
    
                        if(typeof tmpObj.position.x != 'undefined')
                        {
                            tmpObj.position.x = itemL.x
                        }
                        if(typeof tmpObj.position.y != 'undefined')
                        {
                            tmpObj.position.y = itemL.y
                        }
    
                        child.props.access.setValue(tmpObj)
    
                        if(typeof this.props.parent != 'undefined' && typeof this.props.parent[child.props.id] != 'undefined')
                        {
                            this.props.parent[child.props.id].setState({accessValue:child.props.access.getValue()})
                        }
                    }
                }
            })
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
                isDraggable={this.editMode}
                draggableHandle=".react-grid-dragHandleExample"
                style={{position:'relative'}}
                >
                    {React.Children.map(this.props.children, child => 
                    {
                        let tmpX = 0;
                        let tmpY = 0;
                        let tmpH = 1;
                        let tmpW = 1;
                        let tmpMinH = 1;
                        let tmpMaxH = 1;
                        let tmpMinW = 1;
                        let tmpMaxW = 1;
                        let tmpStatic = false;
                        let tmpDragable = true;
                        let tmpResizable = true;
                        let tmpBounded = false;

                        if(typeof child.props.access.getValue() != 'undefined' && typeof child.props.access.getValue().position != 'undefined')
                        {
                            if(typeof child.props.access.getValue().position.x != 'undefined')
                            {
                                tmpX = child.props.access.getValue().position.x
                            }
                            if(typeof child.props.access.getValue().position.y != 'undefined')
                            {
                                tmpY = child.props.access.getValue().position.y
                            }
                            if(typeof child.props.access.getValue().position.h != 'undefined')
                            {
                                tmpH = child.props.access.getValue().position.h
                                tmpMinH = child.props.access.getValue().position.h
                                tmpMaxH = child.props.access.getValue().position.h
                            }
                            if(typeof child.props.access.getValue().position.w != 'undefined')
                            {
                                tmpW = child.props.access.getValue().position.w
                                tmpMinW = child.props.access.getValue().position.w
                                tmpMaxW = child.props.access.getValue().position.w
                            }
                            if(typeof child.props.access.getValue().position.minH != 'undefined')
                            {
                                tmpMinH = child.props.access.getValue().position.minH
                            }
                            if(typeof child.props.access.getValue().position.maxH != 'undefined')
                            {
                                tmpMaxH = child.props.access.getValue().position.maxH
                            }
                            if(typeof child.props.access.getValue().position.minW != 'undefined')
                            {
                                tmpMinW = child.props.access.getValue().position.minW
                            }
                            if(typeof child.props.access.getValue().position.maxW != 'undefined')
                            {
                                tmpMaxW = child.props.access.getValue().position.maxW
                            }
                            if(typeof child.props.access.getValue().position.static != 'undefined')
                            {
                                tmpStatic = child.props.access.getValue().position.static
                            }
                            if(typeof child.props.access.getValue().position.isDragable != 'undefined')
                            {
                                tmpDragable = child.props.access.getValue().position.isDragable
                            }
                            if(typeof child.props.access.getValue().position.isResizable != 'undefined')
                            {
                                tmpResizable = child.props.access.getValue().position.isResizable
                            }
                            if(typeof child.props.access.getValue().position.isBounded != 'undefined')
                            {
                                tmpBounded = child.props.access.getValue().position.isBounded
                            }
                        }
                        
                        return React.cloneElement(child, 
                        {
                            ['data-grid']: { x : tmpX, y : tmpY, w : tmpW, h : tmpH, minW : tmpMinW, maxW : tmpMaxW, minH : tmpMinH, maxH : tmpMaxH, static : tmpStatic, isDraggable : tmpDragable, isResizable : tmpResizable, isBounded : tmpBounded },
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
                if(this.state.accessValue.visible)
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
                <div ref={this.props.forwardedref} {...this.props}>
                    {(()=>
                    {
                        if(this.editMode)
                        {
                            return (
                                <div>
                                    <div style={{border:'1px solid #0d6efd',padding:'2px',display:'flex',alignItems: 'center'}}>
                                        <div className="react-grid-dragHandleExample" style={{zIndex:1000}}>
                                            <i className={"fa-solid fa-up-down-left-right"}/>
                                        </div>
                                        <div style={{flex:12}}>
                                            {this.props.children}
                                        </div>
                                        <div style={{flex:0,paddingLeft:'15px',zIndex:1000}}>
                                            <button className={"form-group btn btn-primary"} style={{alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', padding: '0px'}}
                                            onClick={()=>
                                            {
                                                if(typeof this.state.accessValue != 'undefined' && typeof this.state.accessValue.visible != 'undefined')
                                                {
                                                    this.state.accessValue.visible = this.state.accessValue.visible ? false : true
                                                    let tmpElm = document.getElementById(this.props.id + 'ico');
                                                    if (tmpElm) 
                                                    {
                                                        if(tmpElm.classList.contains('fa-eye'))
                                                        {
                                                            tmpElm.classList.add('fa-eye-slash')
                                                            tmpElm.classList.remove('fa-eye')
                                                        }
                                                        else if(tmpElm.classList.contains('fa-eye-slash'))
                                                        {
                                                            tmpElm.classList.add('fa-eye')
                                                            tmpElm.classList.remove('fa-eye-slash')
                                                        }
                                                    }
                                                }
                                            }}>
                                                <i id={this.props.id + "ico"} className={typeof this.state.accessValue != 'undefined' && typeof this.state.accessValue.visible != 'undefined' && this.state.accessValue.visible ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"} style={{fontSize:'12px'}}></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        else
                        {
                            return this.props.children
                        }
                    })()}
                    
                    
                </div>
            </div>
        );
    }
}
export const NdLayoutItem = React.forwardRef((props, ref) => <NdLayoutItemBase {...props} forwardedref={ref} />);
