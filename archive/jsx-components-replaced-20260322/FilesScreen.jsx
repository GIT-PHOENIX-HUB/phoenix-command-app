import React from 'react';
import { ChevronRight } from 'lucide-react';
import { glassCard, screenContainer, redGlowOverlay, screenTitle, sectionHeader } from '../theme';

/**
 * FilesScreen - Job files and SharePoint folder browser.
 *
 * Props:
 *   jobFiles          - Array of job file objects ({ name, type, items?, size? })
 *   sharepointFolders - Array of folder name strings
 */
const FilesScreen = ({ jobFiles, sharepointFolders }) => (
  <div style={screenContainer}>
    <div style={redGlowOverlay} />

    <h2 style={screenTitle}>FILES & DOCUMENTS</h2>

    {/* Today's Jobs */}
    <div style={glassCard}>
      <h3 style={sectionHeader}>
        <span style={{ fontSize: '18px' }}>📋</span>
        TODAY'S JOBS
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {jobFiles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: 'rgba(255,255,255,0.4)' }}>
            Connect to Service Fusion to view job files
          </div>
        ) : jobFiles.map((file, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.borderColor = 'rgba(255,100,100,0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '22px' }}>
                {file.type === 'Folder' ? '📁' : '📄'}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#FFFFFF' }}>
                  {file.name}
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                  {file.type === 'Folder' ? file.items : file.size}
                </div>
              </div>
            </div>
            <ChevronRight size={18} color="rgba(255,255,255,0.4)" />
          </div>
        ))}
      </div>
    </div>

    {/* SharePoint Folders */}
    <div style={glassCard}>
      <h3 style={sectionHeader}>
        <span style={{ fontSize: '18px' }}>📂</span>
        SHAREPOINT
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {sharepointFolders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: 'rgba(255,255,255,0.4)' }}>
            Connect to SharePoint to view folders
          </div>
        ) : sharepointFolders.map((folder, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.borderColor = 'rgba(255,100,100,0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '22px' }}>📁</div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#FFFFFF' }}>
                {folder}
              </div>
            </div>
            <ChevronRight size={18} color="rgba(255,255,255,0.4)" />
          </div>
        ))}
      </div>
    </div>

    {/* Search */}
    <div style={glassCard}>
      <h3 style={sectionHeader}>
        <span style={{ fontSize: '18px' }}>🔍</span>
        SEARCH FILES
      </h3>
      <input
        type="text"
        placeholder="Search all SharePoint..."
        style={{
          width: '100%',
          padding: '14px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(212,175,55,0.3)',
          borderRadius: '10px',
          fontSize: '13px',
          outline: 'none',
          color: '#FFFFFF'
        }}
      />
    </div>
  </div>
);

export default FilesScreen;

