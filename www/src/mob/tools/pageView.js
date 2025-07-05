import React from 'react';
import NbButton from '../../core/react/bootstrap/button';
import NbBase from '../../core/react/bootstrap/base';

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
            <div style={{
                background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
                height: '100vh',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `
                        radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.03) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.03) 0%, transparent 50%),
                        radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.03) 0%, transparent 50%)
                    `,
                    pointerEvents: 'none'
                }}></div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    {React.Children.map(this.props.children, (child) => {
                        const updatedProps = 
                        {
                            ...child.props,
                            parent: this
                        };
                        return React.cloneElement(child, updatedProps);
                    })}
                </div>
                
                <style>{`
                    /* Modern page transitions */
                    @keyframes pageSlideIn {
                        from {
                            opacity: 0;
                            transform: translateX(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }
                    
                    @keyframes pageSlideOut {
                        from {
                            opacity: 1;
                            transform: translateX(0);
                        }
                        to {
                            opacity: 0;
                            transform: translateX(-20px);
                        }
                    }
                    /* Page content animations */
                    .page-content-visible {
                        animation: pageSlideIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                    }
                    
                    .page-content-hidden {
                        animation: pageSlideOut 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                    }
                `}</style>
            </div>
        )
    }
}

export class PageContent extends NbBase
{
    constructor(props)
    {
        super(props)
        this.state = {opened : false, animating: false}
    }
    componentDidUpdate(prevProps,prevState)
    {
        if(prevState.opened == false && this.state.opened == true && typeof this.props.onActive != 'undefined')
        {
            // Add a small delay to ensure DOM is ready
            setTimeout(() => {
                this.props.onActive();
            }, 100);
        }
    }
    open()
    {
        this.setState({opened:true, animating: true})
        // Reset animation state after animation completes
        setTimeout(() => {
            this.setState({animating: false})
        }, 400);
    }
    close()
    {
        this.setState({opened:false, animating: false})
    }
    render()
    {
        const containerStyle = {
            visibility: this.state.opened ? 'visible' : 'hidden',
            position: this.state.opened ? 'relative' : 'fixed',
            width: '100%',
            background: this.state.opened ? 'transparent' : 'rgba(255, 255, 255, 0.95)',
            borderRadius: this.state.opened ? '0' : '12px',
            boxShadow: this.state.opened ? 'none' : '0 4px 20px rgba(0, 0, 0, 0.1)',
            border: this.state.opened ? 'none' : '1px solid rgba(233, 236, 239, 0.5)',
            backdropFilter: this.state.opened ? 'none' : 'blur(10px)',
            transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            transform: this.state.opened ? 'translateY(0)' : 'translateY(-10px)',
            opacity: this.state.opened ? 1 : 0.95
        };

        const contentWrapperStyle = {
            padding: this.state.opened ? '4px' : '8px',
            background: this.state.opened ? 'transparent' : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 249, 250, 0.9) 100%)',
            borderRadius: '8px',
            position: 'relative',
            overflow: 'hidden'
        };

        return(
            <div style={containerStyle} className={this.state.opened ? 'page-content-visible' : 'page-content-hidden'}>
                {this.state.opened && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `
                            linear-gradient(45deg, rgba(0, 123, 255, 0.02) 0%, transparent 50%),
                            linear-gradient(-45deg, rgba(40, 167, 69, 0.02) 0%, transparent 50%)
                        `,
                        pointerEvents: 'none',
                        borderRadius: '8px'
                    }}></div>
                )}
                <div style={{ position: 'relative', zIndex: 1, height: '100vh', overflow: 'hidden' }}>
                    <div style={{
                        ...contentWrapperStyle,
                        height: '100%',
                        overflow: 'hidden'
                    }}>
                        {this.state.opened && (
                            <div style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                width: '4px',
                                height: '30px',
                                background: 'linear-gradient(135deg, #007bff 0%, #28a745 100%)',
                                borderRadius: '2px',
                                opacity: 0.3,
                                animation: 'pulse 2s infinite'
                            }}></div>
                        )}
                        {this.props.children}
                    </div>
                </div>
                
                <style>{`
                    @keyframes pulse {
                        0%, 100% { opacity: 0.3; }
                        50% { opacity: 0.7; }
                    }
                    /* Page content glow effect on active */
                    .page-content-visible::before {
                        content: '';
                        position: absolute;
                        top: -2px;
                        left: -2px;
                        right: -2px;
                        bottom: -2px;
                        background: linear-gradient(45deg, 
                            rgba(0, 123, 255, 0.1), 
                            rgba(40, 167, 69, 0.1), 
                            rgba(255, 193, 7, 0.1),
                            rgba(220, 53, 69, 0.1)
                        );
                        border-radius: 10px;
                        z-index: -1;
                        opacity: 0;
                        animation: glowPulse 3s ease-in-out infinite;
                    }      
                    
                    @keyframes glowPulse {
                        0%, 100% { opacity: 0; }
                        50% { opacity: 0.3; }
                    }
                `}</style>
            </div>
        )
    }
}