import { gm } from '../core/gm-api.js';

const STYLES = `
#minimalSettingsPanel {
  font-size: 12px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  padding: 10px;
  background: linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%);
  border: 1px solid #d1d5db;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  z-index: 2147403647 !important;
  display: none;
}
#minimalSettingsPanel.lang-en {
  width: 600px;
}
#minimalSettingsPanel.show {
  display: block;
}
#minimalSettingsPanel .panel-header {
  text-align: center;
  border-bottom: 2px solid #e5e7eb;
}
#minimalSettingsPanel .panel-header h2 {
  margin: 0;
  font-size: 21px;
  color: #1f2937;
  font-weight: 600;
}
#minimalSettingsPanel .panel-header .subtitle {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}
#minimalSettingsPanel .section-title {
  font-size: 14px;
  font-weight: 600;
  color: #4b5563;
  margin: 5px 0 5px 0;
  padding-left: 8px;
  border-left: 3px solid #3b82f6;
}
#minimalSettingsPanel .setting-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
#minimalSettingsPanel .setting-list.two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}
#minimalSettingsPanel .setting-item {
  display: flex;
  align-items: center;
  padding: 2px 12px;
  background-color: rgba(240, 240, 240, 0.8);
  border-radius: 6px;
  transition: background-color 0.2s;
  white-space: nowrap;
}
#minimalSettingsPanel .setting-item:hover {
  background-color: rgba(59, 130, 246, 0.1);
}
#minimalSettingsPanel .setting-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  margin-right: 12px;
  cursor: pointer;
  accent-color: #3b82f6;
  flex-shrink: 0;
}
#minimalSettingsPanel .setting-item label {
  flex: 1;
  cursor: pointer;
  font-size: 15px;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}
#minimalSettingsPanel .setting-item label .star {
  color: #f59e0b;
  margin-right: 4px;
}
#minimalSettingsPanel .setting-item select {
  width: 80px;
  margin-left: 12px;
  padding: 4px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
  cursor: pointer;
}
#minimalSettingsPanel .buttons {
  margin-top: 10px;
  text-align: center;
  display: flex;
  gap: 12px;
  justify-content: center;
}
#minimalSettingsPanel .buttons button {
  padding: 8px 24px;
  cursor: pointer;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s;
}
#minimalSettingsPanel .buttons #saveBtn {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}
#minimalSettingsPanel .buttons #saveBtn:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
}
#minimalSettingsPanel .buttons #closeBtn {
  background-color: #e5e7eb;
  color: #374151;
}
#minimalSettingsPanel .buttons #closeBtn:hover {
  background-color: #d1d5db;
}
#minimalSettingsPanel .panel-footer {
  margin-top: 10px;
  padding-top: 5px;
  border-top: 1px solid #e5e7eb;
  text-align: center;
  font-size: 13px;
  color: #9ca3af;
}
#minimalSettingsPanel .panel-footer .author-info {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}
#minimalSettingsPanel .panel-footer .author-info .author-label {
  color: #6b7280;
}
#minimalSettingsPanel .panel-footer .author-info .author-name {
  color: #374151;
  font-weight: 500;
}
#minimalSettingsPanel .panel-footer .email-info {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}
#minimalSettingsPanel .panel-footer .email-info a {
  color: #3b82f6;
  text-decoration: none;
}
#minimalSettingsPanel .panel-footer .email-info a:hover {
  text-decoration: underline;
}
#minimalSettingsPanel .speed-list-section {
  margin-top: 5px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
}
#minimalSettingsPanel .speed-list-section .input-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}
#minimalSettingsPanel .speed-list-section .section-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  flex-shrink: 0;
}
#minimalSettingsPanel .speed-list-section .section-label .star {
  color: #f59e0b;
  margin-right: 4px;
}
#minimalSettingsPanel .speed-list-section input[type="text"] {
  flex: 0 0 auto;
  min-width: 200px;
  max-width: 300px;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color 0.2s;
  ime-mode: disabled;
}
#minimalSettingsPanel .speed-list-section input[type="text"]:focus {
  outline: none;
  border-color: #3b82f6;
  ime-mode: disabled;
}
#minimalSettingsPanel .speed-list-section input[type="text"].error {
  border-color: #ef4444;
  background-color: #fef2f2;
}
#minimalSettingsPanel .speed-list-section .separator-hint {
  font-size: 12px;
  color: #9ca3af;
  display: block;
}
#minimalSettingsPanel .speed-list-section .separator-hint.hidden {
  display: none;
}
#minimalSettingsPanel .speed-list-section .error-message {
  font-size: 13px;
  color: #ef4444;
  display: none;
}
#minimalSettingsPanel .speed-list-section .error-message.show {
  display: block;
}
#minimalSettingsPanel .turbo-playback-section {
  margin-top: 10px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  padding: 12px;
}
#minimalSettingsPanel .turbo-playback-section .setting-item {
  padding: 2px 12px;
  background-color: rgba(240, 240, 240, 0.8);
  border-radius: 6px;
}
#minimalSettingsPanel .turbo-playback-section .setting-item .turbo-key-input {
  flex: 0 0 auto;
  min-width: 100px;
  max-width: 140px;
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  box-sizing: border-box;
  transition: border-color 0.2s;
  text-align: center;
  margin-left: 12px;
}
#minimalSettingsPanel .turbo-playback-section .setting-item .turbo-key-input:focus {
  outline: none;
  border-color: #3b82f6;
}
#minimalSettingsPanel .turbo-playback-section .setting-item .turbo-speed-select {
  flex: 0 0 auto;
  width: 80px;
  padding: 4px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
  cursor: pointer;
  margin-left: 12px;
}
#minimalSettingsPanel .turbo-playback-section .setting-item .turbo-key-input.capturing {
  background-color: #eff6ff;
  border-color: #3b82f6;
  color: #3b82f6;
}
.speed-control-button.active {
  border: 2px solid #007bff !important;
}
#minimalSettingsPanel .shortcut-container {
  margin-top: 15px;
  font-size: 14px;
  color: #6b7280;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background-color: rgba(59, 130, 246, 0.1);
  border-radius: 6px;
}
#minimalSettingsPanel .shortcut-container .shortcut-title {
  font-weight: 600;
  margin-bottom: 4px;
}
#speedButtons {
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
}
#speedButtons.youtube {
  height: 32px;
  margin-top: 12px;
}
#speedButtons.bilibili {
  height: 32px;
}
.speed-control-button {
  background-color: rgba(255, 255, 255, 0.2) !important;
  backdrop-filter: blur(8px) !important;
  -webkit-backdrop-filter: blur(8px) !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
  color: #ffffff !important;
  margin-right: 1px;
  border-radius: 4px;
  cursor: pointer;
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
}
.speed-control-button.youtube {
  background-color: rgba(15, 15, 15, 0.8) !important;
  height: 28px;
  font-size: 15px;
}
.speed-control-button.bilibili {
  height: 30px;
  font-size: 14px;
}
`;

export function injectStyles() {
  gm.addStyle(STYLES);
}
