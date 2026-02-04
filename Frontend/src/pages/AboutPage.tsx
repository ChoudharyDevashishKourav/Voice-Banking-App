
// src/pages/AboutPage.tsx
import React from 'react';
import { Info, Server, Database, Clock, ExternalLink } from 'lucide-react';
import { useSystemInfo } from '../hooks/api/useSystemInfo';

export const AboutPage: React.FC = () => {
  const { data, isLoading, error } = useSystemInfo();

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatLastSync = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">System Information</h1>
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <p className="text-red-800">Failed to load system information</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            System Information
          </h1>
          <p className="text-gray-600">
            Service status, versions, and terminology synchronization details
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Service Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Server className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Service Status</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600 font-medium">Online</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Service Name</span>
                <span className="text-sm font-medium text-gray-900">{data?.service}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Version</span>
                <span className="text-sm font-medium text-gray-900">{data?.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Last Check</span>
                <span className="text-sm font-medium text-gray-900">
                  {data?.timestamp ? formatTimestamp(data.timestamp) : 'Unknown'}
                </span>
              </div>
            </div>
          </div>

          {/* NAMASTE Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-namaste-100 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-namaste-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">NAMASTE CodeSystem</h2>
                <span className="text-sm text-namaste-600 font-medium">Local Terminology</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Version</span>
                <span className="text-sm font-medium text-gray-900">{data?.namaste.version}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600 block mb-1">System URI</span>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-800 break-all">
                  {data?.namaste.systemUri}
                </code>
              </div>
            </div>
          </div>

          {/* ICD-11 Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-icd-100 rounded-lg flex items-center justify-center">
                <ExternalLink className="w-5 h-5 text-icd-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">WHO ICD-11 API</h2>
                <span className="text-sm text-icd-600 font-medium">External Integration</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">API Version</span>
                <span className="text-sm font-medium text-gray-900">{data?.icd.apiVersion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Base URL</span>
                <span className="text-sm font-medium text-gray-900 truncate">
                  {data?.icd.icdBaseUrl}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Last Sync</span>
                <span className="text-sm font-medium text-gray-900">
                  {data?.icd.lastSync ? formatLastSync(data.icd.lastSync) : 'Never'}
                </span>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">System Health</h2>
                <span className="text-sm text-green-600 font-medium">All Systems Operational</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Database</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">Connected</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">WHO ICD API</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">Available</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cache</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-yellow-600">In-Memory</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <Info className="w-5 h-5 text-gray-400" />
            <h2 className="font-semibold text-gray-900">About This System</h2>
          </div>
          
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              This FHIR Terminology Service provides dual coding capabilities for Indian healthcare, 
              bridging NAMASTE (local terminology) with ICD-11 (international standards) for ABDM compliance.
            </p>
            <p>
              The system supports medical terminology search, code translation, and dual-coded condition 
              management for enhanced interoperability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};