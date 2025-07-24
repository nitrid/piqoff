import React from 'react';
import Base from './base.js';
import {dialog} from './dialog.js';
export class NdLoadPanel extends Base
{
    constructor(props)
    {
        super(props)

        this.state.visible = false;
        this.isTimeOut = null;

        this.timeout = this.timeout.bind(this)
    }
    get showed()
    {
        return this.state.visible
    }
    async timeout()
    {
        this.hide()
        let tmpConfObj =
        {
            id:'msgisExecuteClose',showTitle:true,title:this.props.timeoutPopup.title,showCloseButton:true,width:'500px',height:'auto',
            button:[{id:"btn01",caption:this.props.timeoutPopup.button,location:'after'}],
            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.props.timeoutPopup.msg}</div>)
        }
        await dialog(tmpConfObj);
    }
    show()
    {
        this.setState({visible:true})
        if(this.props.timeout)
        {
            this.isTimeOut = setTimeout(this.timeout, this.props.timeout);
        }
    }
    hide()
    {
        this.setState({visible:false})
        if(this.props.timeout)
        {
            clearTimeout(this.isTimeOut)
        }
    }
    render()
    {
        // CSS animasyonunu component mount edildiğinde ekle
        if (!document.getElementById('nd-loadpanel-style')) 
        {
            const style = document.createElement('style');
            style.id = 'nd-loadpanel-style';
            style.textContent = `
                @keyframes nd-spinner-rotate {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .nd-spinner {
                    animation: nd-spinner-rotate 1s linear infinite;
                }
            `;
            document.head.appendChild(style);
        }

        return (
            <div style={this.state.visible ? 
                {
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: this.props.shadingColor || "rgba(0,0,0,0.4)",
                    zIndex: 1000,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column"
                } : { display: "none" }}>
                {/* Sadece Spinner */}
                {this.props.showIndicator !== false && this.props.showPane === false && (
                    <div className="nd-spinner" style={
                    {
                        width: this.props.indicatorSize || "40px",
                        height: this.props.indicatorSize || "40px",
                        border: `4px solid ${this.props.indicatorBgColor || "#f3f3f3"}`,
                        borderTop: `4px solid ${this.props.indicatorColor || "#337ab7"}`,
                        borderRadius: "50%"
                    }}></div>
                )}
                {/* Sadece Mesaj (Pane olmadan) */}
                {this.props.showMessage !== false && this.props.showPane === false && this.props.message && (
                    <div style={
                    { 
                        color: this.props.messageColor || "white", 
                        fontSize: this.props.messageSize || "16px",
                        textAlign: "center",
                        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
                        marginTop: this.props.showIndicator !== false ? "15px" : "0"
                    }}>
                        {this.props.message}
                    </div>
                )}
                {/* Beyaz Kutu ile Birlikte */}
                {this.props.showPane !== false &&
                    <div style={
                    {
                        backgroundColor: "white",
                        borderRadius: "8px",
                        padding: "20px 20px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "250px"
                    }}>
                        {this.props.showIndicator !== false && (
                            <div className="nd-spinner" style={
                            {
                                width: "40px",
                                height: "40px",
                                border: "4px solid #f3f3f3",
                                borderTop: "4px solid #337ab7",
                                borderRadius: "50%",
                                marginBottom: "15px"
                            }}></div>
                        )}
                        {this.props.showMessage !== false &&
                            <div style={
                            { 
                                color: "#333", 
                                fontSize: "14px",
                                textAlign: "center",
                                fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif"
                            }}>
                                {this.props.message || "Lütfen Bekleyin..."}
                            </div>
                        }
                    </div>
                }
            </div>
        )
    }
}