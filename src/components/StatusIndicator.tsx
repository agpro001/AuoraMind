
import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Server, AlertCircle, CheckCircle } from 'lucide-react';

export const StatusIndicator: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'offline' | 'local' | 'online'>('offline');
  const [serverInfo, setServerInfo] = useState<string>('');

  useEffect(() => {
    // Simulate connection checking
    const checkConnection = () => {
      const random = Math.random();
      if (random > 0.7) {
        setConnectionStatus('online');
        setServerInfo('Connected to cloud');
      } else if (random > 0.3) {
        setConnectionStatus('local');
        setServerInfo('Local AI running at 192.168.1.100:8080');
      } else {
        setConnectionStatus('offline');
        setServerInfo('No connection - using cached content');
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 10000);
    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'online':
        return {
          icon: CheckCircle,
          label: 'Connected',
          className: 'status-online',
          description: 'Full access to all features',
          bgColor: 'bg-success/10',
          iconColor: 'text-success'
        };
      case 'local':
        return {
          icon: Server,
          label: 'Local Server',
          className: 'status-local',
          description: 'AI tutor available locally',
          bgColor: 'bg-primary/10',
          iconColor: 'text-primary'
        };
      default:
        return {
          icon: WifiOff,
          label: 'Offline',
          className: 'status-offline',
          description: 'Using cached content',
          bgColor: 'bg-warning/10',
          iconColor: 'text-warning'
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  return (
    <div className="w-full">
      <div className="glass-card p-6 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${config.bgColor}`}>
              <StatusIcon className={`w-5 h-5 ${config.iconColor}`} />
            </div>
            <div>
              <div className="font-semibold">{config.label}</div>
              <div className="text-sm text-muted-foreground">{config.description}</div>
            </div>
          </div>
          <div className={config.className}>
            {config.label}
          </div>
        </div>
        
        {serverInfo && (
          <div className="text-xs text-muted-foreground bg-muted/20 rounded p-2 font-mono">
            {serverInfo}
          </div>
        )}
        
        <div className="mt-4 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Last sync:</span>
            <span>2 minutes ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};
