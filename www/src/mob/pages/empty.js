import React from 'react';
import App from '../lib/app.js';

export default class Dashboard extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.lang = App.instance.lang;
        
        this.state = {
            currentTime: new Date(),
            animationClass: 'fadeIn'
        }
    }
    
    componentDidMount()
    {
        // Saati her saniye güncelle
        this.timer = setInterval(() => {
            this.setState({ currentTime: new Date() });
        }, 1000);
        
        // Animasyon efekti
        setTimeout(() => {
            this.setState({ animationClass: 'fadeIn pulse' });
        }, 500);
    }
    
    componentWillUnmount()
    {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
    
    formatTime(date)
    {
        const locale = this.lang.language === 'tr' ? 'tr-TR' : 
                      this.lang.language === 'fr' ? 'fr-FR' : 'en-US';
        return date.toLocaleTimeString(locale, { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
    }
    
    formatDate(date)
    {
        const locale = this.lang.language === 'tr' ? 'tr-TR' : 
                      this.lang.language === 'fr' ? 'fr-FR' : 'en-US';
        return date.toLocaleDateString(locale, { 
            weekday: 'long',
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        });
    }
    
    render()
    {
        const { currentTime, animationClass } = this.state;
        
        return(
            <div>
                <div style={{
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                    minHeight: '100vh',
                    position: 'relative'
                }}>
                    {/* Arka plan profesyonel şekiller */}
                    <div style={{
                        position: 'absolute',
                        top: '-20px',
                        right: '-50px',
                        width: '200px',
                        height: '200px',
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, rgba(0,123,255,0.08), rgba(0,123,255,0.03))',
                        animation: 'float 8s ease-in-out infinite'
                    }}></div>
                    
                    <div style={{
                        position: 'absolute',
                        top: '25%',
                        left: '-100px',
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, rgba(108,117,125,0.05), rgba(108,117,125,0.02))',
                        animation: 'float 12s ease-in-out infinite'
                    }}></div>
                    
                    {/* Ana içerik */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '80vh',
                        textAlign: 'center',
                        position: 'relative',
                        zIndex: 1,
                        paddingTop: '-10px'
                    }}>
                        {/* Logo */}
                        <div className={animationClass} style={{
                            marginBottom: '20px',
                            animation: 'bounceIn 1s ease-out'
                        }}>
                            <div style={{
                                width: '180px',
                                height: '180px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto',
                                boxShadow: '0 12px 35px rgba(0,0,0,0.15)',
                                border: '4px solid rgba(0,123,255,0.15)'
                            }}>
                                <img src="./css/img/logo-blue.png" 
                                     alt="PIQSOFT Logo"
                                     style={{
                                         width: '150px',
                                         height: '150px',
                                         objectFit: 'contain',
                                         animation: 'pulse 3s infinite'
                                     }}
                                />
                            </div>
                        </div>                    
                        {/* Alt Başlık */}
                        <h3 style={{
                            color: '#6c757d',
                            fontSize: '18px',
                            fontWeight: '400',
                            margin: '5px 0 20px 0',
                            animation: 'slideInUp 1s ease-out 0.5s both'
                        }}>
                            {this.lang.t('mobilTerminal')}
                        </h3>
                        
                        {/* Saat ve Tarih */}
                        <div style={{
                            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '15px',
                            padding: '15px 15px',
                            marginBottom: '20px',
                            border: '1px solid rgba(0,123,255,0.15)',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                            animation: 'slideInUp 1s ease-out 0.7s both'
                        }}>
                            <div style={{
                                color: '#2c3e50',
                                fontSize: '24px',
                                fontWeight: 'bold',
                                marginBottom: '5px'
                            }}>
                                {this.formatTime(currentTime)}
                            </div>
                            <div style={{
                                color: '#6c757d',
                                fontSize: '14px'
                            }}>
                                {this.formatDate(currentTime)}
                            </div>
                        </div>
                        
                        {/* Özellik Kartları */}
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: '20px',
                            maxWidth: '400px',
                            animation: 'slideInUp 1s ease-out 0.9s both',
                            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                            borderRadius: '12px',
                            padding: '20px',
                            border: '1px solid rgba(40,167,69,0.15)',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                            color: '#28a745',
                            fontSize: '16px',
                            fontWeight: '500'
                        }}>
                         {this.lang.t('comingSoon')}
                        </div>
                    </div>
                    
                    {/* CSS Animasyonları */}
                    <style>{`
                        html, body {
                            margin: 0;
                            padding: 0;
                            overflow: hidden;
                            height: 100%;
                            width: 100%;
                        }
                        
                        #root {
                            height: 100vh;
                            overflow: hidden;
                        }
                        
                        @keyframes float {
                            0%, 100% { transform: translateY(0px); }
                            50% { transform: translateY(-20px); }
                        }
                        
                        @keyframes pulse {
                            0%, 100% { transform: scale(1); }
                            50% { transform: scale(1.05); }
                        }
                        
                        @keyframes bounceIn {
                            0% { transform: scale(0.3); opacity: 0; }
                            50% { transform: scale(1.05); }
                            70% { transform: scale(0.9); }
                            100% { transform: scale(1); opacity: 1; }
                        }
                        
                        @keyframes slideInUp {
                            0% { transform: translateY(30px); opacity: 0; }
                            100% { transform: translateY(0); opacity: 1; }
                        }
                        
                        @keyframes fadeIn {
                            0% { opacity: 0; }
                            100% { opacity: 1; }
                        }
                        
                        .feature-card:hover {
                            transform: translateY(-5px) !important;
                            box-shadow: 0 10px 25px rgba(0,0,0,0.3) !important;
                        }
                    `}</style>
                </div>
            </div>
        )
    }
}