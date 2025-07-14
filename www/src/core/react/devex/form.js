import React from 'react';

export class NdForm extends React.PureComponent
{
    constructor(props)
    {
        super(props);
        this.formRef = React.createRef();
    }
    
    calculateOptimalLabelWidth()
    {
        if (!this.formRef.current) return;
        
        // Formdaki tüm NdLabel'ları bul
        const labels = this.formRef.current.querySelectorAll('.nd-label');
        let maxWidth = 0; // Minimum genişlik yok, gerçek genişliği kullan
        
        // Geçici bir span oluştur text genişliğini ölçmek için
        const measureSpan = document.createElement('span');
        measureSpan.style.visibility = 'hidden';
        measureSpan.style.position = 'absolute';
        measureSpan.style.fontSize = '14px';
        measureSpan.style.fontFamily = getComputedStyle(document.body).fontFamily;
        measureSpan.style.whiteSpace = 'nowrap';
        document.body.appendChild(measureSpan);
        
        labels.forEach(label => {
            measureSpan.textContent = label.textContent;
            const textWidth = measureSpan.offsetWidth + 10; // Sadece 10px padding (daha az boşluk)
            if (textWidth > maxWidth) {
                maxWidth = textWidth;
            }
        });
        
        document.body.removeChild(measureSpan);
        
        // Eğer hiç label yoksa varsayılan genişlik kullan
        if (maxWidth === 0) {
            maxWidth = 100;
        }
        
        // CSS değişkenini güncelle
        this.formRef.current.style.setProperty('--label-width', `${maxWidth}px`);
    }
    
    componentDidMount()
    {
        // Label genişliklerini hesapla
        setTimeout(() => {
            this.calculateOptimalLabelWidth();
        }, 0);
        
        if (typeof this.props.onInitialized === 'function')
        {
            // DevExtreme Form benzeri component objesi oluştur
            const componentObj = 
            {
                element: () => this.formRef.current,
                option: (name, value) => 
                {
                    // DevExtreme API benzeri option metodu
                    if (arguments.length === 1) 
                    {
                        // Getter
                        return this.formRef.current?.style[name];
                    } 
                    else 
                    {
                        // Setter
                        if (this.formRef.current) 
                        {
                            this.formRef.current.style[name] = value;
                        }
                    }
                },
                repaint: () => 
                {
                    // Form'u yeniden çiz
                    this.forceUpdate();
                    // Label genişliklerini yeniden hesapla
                    setTimeout(() => {
                        this.calculateOptimalLabelWidth();
                    }, 0);
                }
            };
            
            this.props.onInitialized({ component: componentObj });
        }
    }
    
    componentDidUpdate()
    {
        // Component güncellendiğinde label genişliklerini yeniden hesapla
        setTimeout(() => {
            this.calculateOptimalLabelWidth();
        }, 0);
    }
    render()
    {
        const { colCount = 1, children, id, className, style, labelWidth = "150px" } = this.props;
        
        const formStyle = 
        {
            display: 'grid',
            gridTemplateColumns: `repeat(${colCount}, 1fr)`,
            gap: '10px',
            '--label-width': labelWidth,
            width: '100%',
            maxWidth: '100%',
            overflow: 'hidden',
            ...style
        };
        
        return (
            <div ref={this.formRef} id={id} className={`nd-form ${className || ''}`} style={formStyle}>
                {children}
            </div>
        );
    }
}
export class NdItem extends React.PureComponent 
{
    render() 
    {
        const { children, className, style, colSpan = 1, location } = this.props;
        
        if (location === "after") 
        {
            const itemStyle = 
            {
                gridColumn: `span ${colSpan}`,
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: '10px',
                padding: '5px 0',
                width: '100%',
                maxWidth: '100%',
                ...style
            };
            
            const styledChildren = React.Children.map(children, (child, index) => 
            {
                if (child && child.type && (child.type.displayName === 'Button' || child.props.icon || child.props.text)) 
                {
                    return (
                        <div key={index} style={{ display: 'inline-block', minWidth: 'auto', flexShrink: 0 }}>
                            {child}
                        </div>
                    );
                }
                return child;
            });
            
            return (
                <div className={`nd-item ${className || ''}`} style={itemStyle}>
                    {styledChildren}
                </div>
            );
        }
        
        // Normal item için - eğer sadece bir child varsa (grid gibi) full width yap
        const hasOnlyOneChild = React.Children.count(children) === 1;
        const firstChild = React.Children.toArray(children)[0];
        const isGridChild = firstChild && firstChild.type && (firstChild.type.displayName === 'NdGrid' || firstChild.props.id?.includes('grd') ||firstChild.type.name === 'NdGrid');
        
        if (hasOnlyOneChild && isGridChild) 
        {
            // Grid için responsive width
            const itemStyle = 
            {
                gridColumn: `span ${colSpan}`,
                width: '100%',
                maxWidth: '100%',
                minWidth: 0, // Grid'in küçülmesine izin ver
                overflow: 'auto', // İçerik taşarsa scroll göster
                ...style
            };
            
            return (
                <div className={`nd-item ${className || ''}`} style={itemStyle}>
                    {children}
                </div>
            );
        }
        
        // Çocuklarda NdLabel var mı kontrol et
        const childrenArray = React.Children.toArray(children);
        const hasLabel = childrenArray.some(child => child && child.type && child.type.name === 'NdLabel');

        // Label varsa iki kolon, yoksa tek kolon
        const itemStyle = 
        {
            gridColumn: `span ${colSpan}`,
            display: 'grid',
            gridTemplateColumns: hasLabel ? 'var(--label-width, 150px) 1fr' : '1fr',
            alignItems: 'center',
            gap: '10px',
            width: '100%',
            maxWidth: '100%',
            minWidth: 0,
            ...style
        };
        
        return (
            <div className={`nd-item ${className || ''}`} style={itemStyle}>
                {children}
            </div>
        );
    }
}
export class NdLabel extends React.PureComponent 
{
    render() 
    {
        const { text, alignment = "right", className, style, width } = this.props;
        
        const labelStyle = 
        {
            width: width || 'auto',
            minWidth: width || 'auto',
            maxWidth: width || 'auto',
            textAlign: alignment,
            whiteSpace: 'nowrap',
            fontSize: '14px',
            color: '#333',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            ...style
        };
        
        return (
            <label className={`nd-label ${className || ''}`} style={labelStyle}>
                {text}
            </label>
        );
    }
}
export class NdEmptyItem extends React.PureComponent 
{
    render() 
    {
        const { colSpan = 1, className, style } = this.props;
        
        const emptyStyle = 
        {
            gridColumn: `span ${colSpan}`,
            ...style
        };
        
        return (
            <div className={className || ''} style={emptyStyle}>
                {/* Boş alan */}
            </div>
        );
    }
}