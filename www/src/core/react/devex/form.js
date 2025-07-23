import React from 'react';

export class NdForm extends React.PureComponent
{
    constructor(props)
    {
        super(props);
        this.formRef = React.createRef();
        this.lastLabelCount = 0;
        this.lastLabelTexts = [];
        this.isCalculating = false;
        this.state = 
        {
            disabled: props.disabled || false
        };
    }
    
    calculateOptimalLabelWidth()
    {
        if (!this.formRef.current || this.isCalculating) 
            return;
        
        // Formdaki tüm NdLabel'ları bul
        const labels = this.formRef.current.querySelectorAll('.nd-label');
        
        // Label sayısı veya içerikleri değişmediyse hesaplama yapma
        const currentLabelTexts = Array.from(labels).map(label => label.textContent);
        if (labels.length === this.lastLabelCount && JSON.stringify(currentLabelTexts) === JSON.stringify(this.lastLabelTexts)) 
        {
            return;
        }
        
        this.isCalculating = true;
        this.lastLabelCount = labels.length;
        this.lastLabelTexts = currentLabelTexts;
        
        let maxWidth = 0;
        
        // Geçici bir span oluştur text genişliğini ölçmek için
        const measureSpan = document.createElement('span');
        measureSpan.style.visibility = 'hidden';
        measureSpan.style.position = 'absolute';
        measureSpan.style.fontSize = '14px';
        measureSpan.style.fontFamily = getComputedStyle(document.body).fontFamily;
        measureSpan.style.whiteSpace = 'nowrap';
        document.body.appendChild(measureSpan);
        
        labels.forEach(label => 
        {
            measureSpan.textContent = label.textContent;
            const textWidth = measureSpan.offsetWidth + 10; // Sadece 10px padding
            if (textWidth > maxWidth) 
            {
                maxWidth = textWidth;
            }
        });
        
        document.body.removeChild(measureSpan);
        
        // Eğer hiç label yoksa varsayılan genişlik kullan
        if (maxWidth === 0) 
        {
            maxWidth = 100;
        }
        
        // CSS değişkenini güncelle
        this.formRef.current.style.setProperty('--label-width', `${maxWidth}px`);
        this.isCalculating = false;
    }
    
    componentDidUpdate(prevProps)
    {
        // Props'tan gelen disabled değeri değiştiyse state'i güncelle
        if (prevProps.disabled !== this.props.disabled) 
        {
            this.setState({ disabled: this.props.disabled || false });
        }
    }
    
    componentDidMount()
    {
        // Label genişliklerini hesapla
        setTimeout(() => {this.calculateOptimalLabelWidth()}, 100); // Biraz daha gecikme ekledim DOM'un tam yüklenmesi için
        
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
                        if (name === 'disabled') 
                        {
                            return this.state.disabled;
                        }
                        return this.formRef.current?.style[name];
                    } 
                    else 
                    {
                        // Setter
                        if (name === 'disabled') 
                        {
                            this.setState({ disabled: value });
                        } else if (this.formRef.current) 
                        {
                            this.formRef.current.style[name] = value;
                        }
                    }
                },
                repaint: () => 
                {
                    // Form'u yeniden çiz
                    this.forceUpdate();
                    // Manuel repaint durumunda label genişliklerini yeniden hesapla
                    setTimeout(() => 
                    {
                        this.lastLabelCount = 0; // Cache'i temizle
                        this.lastLabelTexts = [];
                        this.calculateOptimalLabelWidth();
                    }, 50);
                }
            };
            
            this.props.onInitialized({ component: componentObj });
        }
    }
    render()
    {
        const { colCount = 1, children, id, className, style, labelWidth = "150px" } = this.props;
        const { disabled } = this.state;
        
        const formStyle = 
        {
            display: 'grid',
            gridTemplateColumns: `repeat(${colCount}, 1fr)`,
            gap: '10px',
            '--label-width': labelWidth,
            width: '100%',
            maxWidth: '100%',
            minWidth: 0,
            overflow: 'visible', // Form'un kendisi visible, child'lar kendi scroll'unu yönetsin
            position: 'relative',
            padding: '1px 0px',
            pointerEvents: disabled ? 'none' : 'auto',
            opacity: disabled ? 0.6 : 1,
            ...style
        };
        
        // Disabled durumunda child component'leri disable et
        const processChildren = (children, disabled) => 
        {
            return React.Children.map(children, child => 
            {
                if (React.isValidElement(child)) 
                {
                    const newProps = disabled ? { disabled: true } : {};
                    
                    // Eğer child'ın kendi children'ı varsa onları da işle
                    if (child.props.children) 
                    {
                        const processedGrandChildren = processChildren(child.props.children, disabled);
                        return React.cloneElement(child, 
                        {
                            ...newProps,
                            children: processedGrandChildren
                        });
                    }
                    
                    return React.cloneElement(child, newProps);
                }
                return child;
            });
        };
        
        const processedChildren = disabled ? processChildren(children, disabled) : children;
        
        return (
            <div ref={this.formRef} id={id} className={`nd-form ${disabled ? 'nd-form-disabled' : ''} ${className || ''}`} style={formStyle}>
                {processedChildren}
            </div>
        );
    }
}
export class NdItem extends React.PureComponent 
{
    render() 
    {
        const { children, className, style, colSpan = 1, location, disabled } = this.props;
        
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
                pointerEvents: disabled ? 'none' : 'auto',
                opacity: disabled ? 0.6 : 1,
                ...style
            };
            
            const styledChildren = React.Children.map(children, (child, index) => 
            {
                if (child && child.type && (child.type.displayName === 'Button' || child.props.icon || child.props.text)) 
                {
                    const childProps = disabled ? { disabled: true } : {};
                    return (
                        <div key={index} style={
                        { 
                            display: 'inline-block', 
                            minWidth: 'auto', 
                            flexShrink: 0 
                        }}>
                            {React.isValidElement(child) ? React.cloneElement(child, childProps) : child}
                        </div>
                    );
                }
                return child;
            });
            
            return (
                <div className={`nd-item ${disabled ? 'nd-item-disabled' : ''} ${className || ''}`} style={itemStyle}>
                    {styledChildren}
                </div>
            );
        }
        // Normal item için - eğer sadece bir child varsa (grid gibi) full width yap
        const hasOnlyOneChild = React.Children.count(children) === 1;
        const firstChild = React.Children.toArray(children)[0];
        // Grid detection - direkt grid veya React.Fragment içindeki grid
        let isGridChild = false;
        if (firstChild) 
        {
            // Direkt grid check
            if (firstChild.type && (firstChild.type.displayName === 'NdGrid' || firstChild.props.id?.includes('grd') || firstChild.type.name === 'NdGrid')) 
            {
                isGridChild = true;
            }
            // React.Fragment içindeki grid check
            else if (firstChild.type === React.Fragment && firstChild.props.children) 
            {
                const fragmentChildren = React.Children.toArray(firstChild.props.children);
                isGridChild = fragmentChildren.some(child => 
                    child && child.type && (
                        child.type.displayName === 'NdGrid' || 
                        child.props.id?.includes('grd') || 
                        child.type.name === 'NdGrid'
                    )
                );
            }
        }
        
        if (hasOnlyOneChild && isGridChild) 
        {
            // Grid için responsive width ve scroll
            const itemStyle = 
            {
                gridColumn: `span ${colSpan}`,
                width: '100%',
                maxWidth: '100%',
                minWidth: 0,
                overflow: 'hidden', // Container'da hidden, grid kendi scroll'unu yönetsin
                position: 'relative',
                pointerEvents: disabled ? 'none' : 'auto',
                opacity: disabled ? 0.6 : 1,
                ...style
            };
            
            // Grid'i wrap edecek div için stil
            const gridWrapperStyle = 
            {
                width: '100%',
                overflowX: 'auto',
                overflowY: 'hidden',
                position: 'relative'
            };
            
            return (
                <div className={`nd-item nd-item-grid ${disabled ? 'nd-item-disabled' : ''} ${className || ''}`} style={itemStyle}>
                    <div className="nd-grid-wrapper" style={gridWrapperStyle}>
                        {children}
                    </div>
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
            pointerEvents: disabled ? 'none' : 'auto',
            opacity: disabled ? 0.6 : 1,
            ...style
        };
        
        return (
            <div className={`nd-item ${disabled ? 'nd-item-disabled' : ''} ${className || ''}`} style={itemStyle}>
                {children}
            </div>
        );
    }
}
export class NdLabel extends React.PureComponent 
{
    static name = 'NdLabel';

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
export class NdGroupItem extends React.PureComponent 
{
    render() 
    {
        const { children, className, style, colSpan = 1, caption, colCount = 1, captionStyle, groupStyle, visible = true } = this.props;
        
        // Eğer visible false ise hiçbir şey render etme
        if (!visible) 
        {
            return null;
        }
        
        // Gruplar arası mesafeyi artırmak için marginBottom ekliyoruz
        const groupWrapperStyle = 
        {
            gridColumn: `span ${colSpan}`,
            ...style
        };
        
        const captionWrapperStyle = 
        {
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '10px',
            ...captionStyle
        };
        
        const contentStyle = 
        {
            display: 'grid',
            gridTemplateColumns: `repeat(${colCount}, 1fr)`,
            gap: '10px',
            '--label-width': 'var(--label-width, 150px)',
            ...groupStyle
        };
        
        return (
            <div className={`nd-group-item ${className || ''}`} style={groupWrapperStyle}>
                {caption && (
                    <div style={captionWrapperStyle}>
                        {caption}
                    </div>
                )}
                <div className="nd-group-item-content" style={contentStyle}>
                    {children}
                </div>
            </div>
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