import { ApplicationInsights } from '@microsoft/applicationinsights-web';

class appInsightCls
{
    constructor() 
    {
        this.appInsights = null;
        this.isInitialized = false;
    }
    initialize(appId,macId,version) 
    {
        if (this.isInitialized) 
        {
            return this.appInsights;
        }

        this.appInsights = new ApplicationInsights(
        {
            config: 
            {
                connectionString: "InstrumentationKey=5959656b-e42a-46ae-9db9-f44e43c1c74f;IngestionEndpoint=https://francecentral-1.in.applicationinsights.azure.com/;LiveEndpoint=https://francecentral.livediagnostics.monitor.azure.com/;ApplicationId=62d3a68a-628f-450b-ac7b-794ac27656a9",
                enableAutoRouteTracking: true, // SPA için otomatik sayfa tracking
                enableCorsCorrelation: true,
                enableRequestHeaderTracking: true,
                enableResponseHeaderTracking: true,
                enableAjaxErrorStatusText: true,
                enableAjaxPerfTracking: true,
                autoTrackPageVisitTime: true,
                disableAjaxTracking: false,
                disableFetchTracking: false,
                // Debug için
                loggingLevelConsole: 0, // Production'da 0 yapın
            }
        });

        this.appInsights.loadAppInsights();

        this.appInsights.addTelemetryInitializer((envelope) => 
        {
            envelope.tags['ai.cloud.role'] = appId;
            envelope.tags['ai.cloud.roleInstance'] = macId;
            envelope.tags['ai.application.ver'] = version;
        });

        this.isInitialized = true;

        return this;
    }
    setUser(userId, accountId = null, storeInCookie = true) 
    {
        if (!this.isInitialized) return;
        
        this.appInsights.setAuthenticatedUserContext(userId, accountId, storeInCookie);
    }
    trackEvent(name, properties = {}, measurements = {}) 
    {
        if (!this.isInitialized) return;
        
        this.appInsights.trackEvent(
        {
            name: name,
            properties: 
            {
                ...properties
            },
            measurements: measurements
        });
    }
    trackPageView(name = null, url = null, properties = {}, measurements = {}) 
    {
        if (!this.isInitialized) return;
        
        this.appInsights.trackPageView(
        {
            name: name || document.title,
            uri: url, // null olabilir - sorun yok
            properties: 
            {
                ...properties
            },
            measurements: measurements
        });
    }
    trackException(error, properties = {}) 
    {
        if (!this.isInitialized) return;
        
        this.appInsights.trackException(
        {
            exception: error,
            properties: 
            {
                ...properties
            }
        });
    }
    trackMetric(name, average, properties = {}) 
    {
        if (!this.isInitialized) return;
        
        this.appInsights.trackMetric(
        {
            name: name,
            average: average,
            properties: 
            {
                ...properties
            }
        });
    }
    trackTrace(message, properties = {}, severityLevel = 1) 
    {
        if (!this.isInitialized) return;
        
        this.appInsights.trackTrace(
        {
            message: message,
            severityLevel: severityLevel, // 0=Verbose, 1=Information, 2=Warning, 3=Error, 4=Critical
            properties: 
            {
                ...properties
            }
        });
    }
    // Dependency tracking (API çağrıları vs.)
    trackDependency(id, method, absoluteUrl, pathName, totalTime, success, resultCode = 200) 
    {
        if (!this.isInitialized) return;
        
        this.appInsights.trackDependencyData(
        {
            id: id,
            target: absoluteUrl,
            type: 'Http',
            name: method + ' ' + pathName,
            data: absoluteUrl,
            duration: totalTime,
            success: success,
            resultCode: resultCode
        });
    }
    // Flush - önemli eventler için hemen gönder
    flush() 
    {
        if (!this.isInitialized) return;
        this.appInsights.flush();
    }
    // Context bilgileri set etme
    addTelemetryInitializer(telemetryInitializer) 
    {
        if (!this.isInitialized) return;
        this.appInsights.addTelemetryInitializer(telemetryInitializer);
    }
}
// Singleton instance
const appInsight = new appInsightCls();
export default appInsight;