import React, { useState, useEffect } from 'react';
import {
  X,
  Palette,
  Check,
  RotateCcw,
  Download,
  Upload,
  Save,
  Trash2,
  Edit2,
  Copy,
  Sparkles,
  Eye,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { CoreColorTokens, CustomThemeRecord, ThemePalette } from '../../theme/types';
import {
  SCHLAR_PALETTES,
  DEFAULT_PALETTE,
  getPaletteById,
  isValidHexColor,
  getContrastTextColor
} from '../../theme/palettes';
import {
  applyThemeToDom,
  getStoredActiveColors,
  getStoredActivePaletteId,
  saveStoredActiveColors,
  saveStoredActivePaletteId,
  getStoredCustomThemes,
  saveStoredCustomThemes,
  exportThemeToJSON,
  importThemeFromJSON
} from '../../theme/themeEngine';

interface CustomThemeEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onThemeApplied?: (paletteId: string, colors: CoreColorTokens) => void;
  showToast?: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export const CustomThemeEditorModal: React.FC<CustomThemeEditorModalProps> = ({
  isOpen,
  onClose,
  onThemeApplied,
  showToast
}) => {
  // Tabs: 'presets' | 'editor' | 'saved' | 'import_export'
  const [activeTab, setActiveTab] = useState<'presets' | 'editor' | 'saved' | 'import_export'>('presets');

  // Currently committed active colors
  const [appliedColors, setAppliedColors] = useState<CoreColorTokens>(getStoredActiveColors);
  const [appliedPaletteId, setAppliedPaletteId] = useState<string>(getStoredActivePaletteId);

  // Draft working state in the editor
  const [draftColors, setDraftColors] = useState<CoreColorTokens>(getStoredActiveColors);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(getStoredActivePaletteId);

  // Custom themes list
  const [savedThemes, setSavedThemes] = useState<CustomThemeRecord[]>(getStoredCustomThemes);
  const [newThemeName, setNewThemeName] = useState('');
  const [editingThemeId, setEditingThemeId] = useState<string | null>(null);
  const [editThemeName, setEditThemeName] = useState('');

  // Import / Export state
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      const activeColors = getStoredActiveColors();
      const activeId = getStoredActivePaletteId();
      setAppliedColors(activeColors);
      setAppliedPaletteId(activeId);
      setDraftColors(activeColors);
      setSelectedPresetId(activeId);
      setSavedThemes(getStoredCustomThemes());
      setImportError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle selecting a preset
  const handleSelectPreset = (palette: ThemePalette) => {
    setSelectedPresetId(palette.id);
    setDraftColors(palette.colors);
    // Apply immediate preview to DOM
    applyThemeToDom(palette.colors);
  };

  // Commit and apply theme
  const handleApplyTheme = () => {
    applyThemeToDom(draftColors);
    saveStoredActiveColors(draftColors);
    saveStoredActivePaletteId(selectedPresetId);
    setAppliedColors(draftColors);
    setAppliedPaletteId(selectedPresetId);

    if (onThemeApplied) {
      onThemeApplied(selectedPresetId, draftColors);
    }
    if (showToast) {
      const presetName = SCHLAR_PALETTES.find(p => p.id === selectedPresetId)?.name || 'Custom Theme';
      showToast(`Applied ${presetName} successfully!`, 'success');
    }
    onClose();
  };

  // Reset to default Petrol & Copper
  const handleResetToDefault = () => {
    setSelectedPresetId(DEFAULT_PALETTE.id);
    setDraftColors(DEFAULT_PALETTE.colors);
    applyThemeToDom(DEFAULT_PALETTE.colors);
    if (showToast) {
      showToast('Reset to default Petrol & Copper palette.', 'info');
    }
  };

  // Reset to the currently selected preset
  const handleResetToSelectedPreset = () => {
    const palette = getPaletteById(selectedPresetId);
    setDraftColors(palette.colors);
    applyThemeToDom(palette.colors);
    if (showToast) {
      showToast(`Reset draft to ${palette.name}.`, 'info');
    }
  };

  // Save current draft as custom theme
  const handleSaveCustomTheme = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newThemeName.trim();
    if (!name) return;

    const newRecord: CustomThemeRecord = {
      id: `custom_${Date.now()}`,
      name,
      colors: { ...draftColors },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = [newRecord, ...savedThemes];
    setSavedThemes(updated);
    saveStoredCustomThemes(updated);
    setNewThemeName('');
    setSelectedPresetId('custom');
    if (showToast) {
      showToast(`Saved custom theme "${name}" locally.`, 'success');
    }
  };

  // Delete saved theme
  const handleDeleteCustomTheme = (id: string, name: string) => {
    const updated = savedThemes.filter(t => t.id !== id);
    setSavedThemes(updated);
    saveStoredCustomThemes(updated);
    if (showToast) {
      showToast(`Deleted custom theme "${name}".`, 'info');
    }
  };

  // Rename custom theme
  const handleSaveRename = (id: string) => {
    const trimmed = editThemeName.trim();
    if (!trimmed) return;
    const updated = savedThemes.map(t => (t.id === id ? { ...t, name: trimmed, updatedAt: new Date().toISOString() } : t));
    setSavedThemes(updated);
    saveStoredCustomThemes(updated);
    setEditingThemeId(null);
    if (showToast) {
      showToast('Theme renamed successfully.', 'success');
    }
  };

  // Apply a saved custom theme
  const handleApplySavedTheme = (theme: CustomThemeRecord) => {
    setSelectedPresetId('custom');
    setDraftColors(theme.colors);
    applyThemeToDom(theme.colors);
    saveStoredActiveColors(theme.colors);
    saveStoredActivePaletteId('custom');
    setAppliedColors(theme.colors);
    setAppliedPaletteId('custom');
    if (onThemeApplied) {
      onThemeApplied('custom', theme.colors);
    }
    if (showToast) {
      showToast(`Applied saved theme "${theme.name}".`, 'success');
    }
    onClose();
  };

  // Export theme to JSON
  const handleExportCopy = () => {
    const currentName = SCHLAR_PALETTES.find(p => p.id === selectedPresetId)?.name || 'Custom SCHLAR Palette';
    const jsonStr = exportThemeToJSON(currentName, draftColors);
    navigator.clipboard.writeText(jsonStr);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 3000);
    if (showToast) {
      showToast('Theme JSON copied to clipboard.', 'success');
    }
  };

  const handleExportDownload = () => {
    const currentName = SCHLAR_PALETTES.find(p => p.id === selectedPresetId)?.name || 'custom_schlar_theme';
    const jsonStr = exportThemeToJSON(currentName, draftColors);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_theme.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    if (showToast) {
      showToast('Theme configuration downloaded.', 'success');
    }
  };

  // Import theme from JSON
  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setImportError(null);
    const result = importThemeFromJSON(importJsonText);
    if (!result.success || !result.colors) {
      setImportError(result.error || 'Failed to validate theme JSON.');
      return;
    }

    setDraftColors(result.colors);
    setSelectedPresetId('custom');
    applyThemeToDom(result.colors);

    // Save as custom theme automatically
    const importedRecord: CustomThemeRecord = {
      id: `custom_${Date.now()}`,
      name: result.name || 'Imported Theme',
      colors: result.colors,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [importedRecord, ...savedThemes];
    setSavedThemes(updated);
    saveStoredCustomThemes(updated);

    if (showToast) {
      showToast(`Imported "${result.name}" successfully!`, 'success');
    }
    setActiveTab('editor');
  };

  // Cancel and restore original applied colors
  const handleCancel = () => {
    applyThemeToDom(appliedColors);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-5 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs"
              style={{ backgroundColor: draftColors.primary }}
            >
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  SCHLAR Design System & Theme Engine
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold">
                  12 Palettes
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Authoritative tokens, instant full-app live preview, custom color editing & JSON persistence
              </p>
            </div>
          </div>

          <button
            onClick={handleCancel}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/60 transition-colors"
            aria-label="Close theme editor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 pt-3 pb-0 border-b border-slate-200 bg-white flex gap-2 shrink-0 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('presets')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'presets'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>12 Core Presets</span>
          </button>

          <button
            onClick={() => setActiveTab('editor')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'editor'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Custom Colors & Tokens</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'saved'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>Saved Themes ({savedThemes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('import_export')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'import_export'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import / Export JSON</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-5">
          {/* ============================================================== */}
          {/* TAB 1: 12 CORE PRESETS */}
          {/* ============================================================== */}
          {activeTab === 'presets' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
                <span>
                  Select any of the 12 authoritative SCHLAR palettes. Click to preview live across the app.
                </span>
                <span className="font-mono text-[11px] text-slate-600 font-bold">
                  Current Draft: {SCHLAR_PALETTES.find(p => p.id === selectedPresetId)?.name || 'Custom'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {SCHLAR_PALETTES.map(palette => {
                  const isSelected = selectedPresetId === palette.id;
                  const isCurrentlyActive = appliedPaletteId === palette.id;

                  return (
                    <div
                      key={palette.id}
                      onClick={() => handleSelectPreset(palette)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all hover:shadow-md relative flex flex-col justify-between ${
                        isSelected
                          ? 'border-slate-900 ring-2 ring-slate-900/10 bg-slate-50/70 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                            <span className="font-mono text-[11px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                              #{palette.paletteNumber}
                            </span>
                            <span>{palette.name}</span>
                          </span>
                          {palette.isDefault && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                              DEFAULT
                            </span>
                          )}
                          {isCurrentlyActive && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                              ACTIVE
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-500 line-clamp-1 mb-2.5">
                          {palette.description}
                        </p>

                        {/* 5 Core Token Swatches with exact Hex Codes */}
                        <div className="grid grid-cols-5 gap-1.5 mb-2">
                          {[
                            { label: 'Primary', color: palette.colors.primary },
                            { label: 'Secondary', color: palette.colors.secondary },
                            { label: 'Accent', color: palette.colors.accent },
                            { label: 'Backgrd', color: palette.colors.background },
                            { label: 'Surface', color: palette.colors.surface }
                          ].map((token, tIdx) => (
                            <div key={tIdx} className="text-center group/token">
                              <div
                                className="h-6 w-full rounded-md border border-slate-300 shadow-2xs transition-transform group-hover/token:scale-105"
                                style={{ backgroundColor: token.color }}
                                title={`${token.label}: ${token.color}`}
                              />
                              <span className="block text-[8px] font-mono text-slate-600 mt-0.5 truncate uppercase">
                                {token.color}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                        <span className="text-slate-400">
                          {isSelected ? '✓ Previewing in App' : 'Click to preview'}
                        </span>
                        {isSelected && (
                          <span className="font-bold text-slate-900 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 text-emerald-600" /> Selected
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: CUSTOM COLORS & TOKENS EDITOR */}
          {/* ============================================================== */}
          {activeTab === 'editor' && (
            <div className="space-y-5">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Adjust Core Design Tokens
                </h4>
                <p className="text-xs text-slate-500 mb-4">
                  Modify the five foundational tokens. Changes update the live interactive preview below immediately.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5">
                  {[
                    {
                      id: 'primary',
                      label: 'Primary Brand',
                      desc: 'Headers, active nav, primary CTAs',
                      value: draftColors.primary,
                      onChange: (val: string) => {
                        const updated = { ...draftColors, primary: val };
                        setDraftColors(updated);
                        if (isValidHexColor(val)) applyThemeToDom(updated);
                      }
                    },
                    {
                      id: 'secondary',
                      label: 'Secondary Brand',
                      desc: 'Sub-headers, secondary buttons',
                      value: draftColors.secondary,
                      onChange: (val: string) => {
                        const updated = { ...draftColors, secondary: val };
                        setDraftColors(updated);
                        if (isValidHexColor(val)) applyThemeToDom(updated);
                      }
                    },
                    {
                      id: 'accent',
                      label: 'Accent / Highlight',
                      desc: 'Badges, warnings, status focus',
                      value: draftColors.accent,
                      onChange: (val: string) => {
                        const updated = { ...draftColors, accent: val };
                        setDraftColors(updated);
                        if (isValidHexColor(val)) applyThemeToDom(updated);
                      }
                    },
                    {
                      id: 'background',
                      label: 'Page Background',
                      desc: 'Canvas background for workspace',
                      value: draftColors.background,
                      onChange: (val: string) => {
                        const updated = { ...draftColors, background: val };
                        setDraftColors(updated);
                        if (isValidHexColor(val)) applyThemeToDom(updated);
                      }
                    },
                    {
                      id: 'surface',
                      label: 'Card Surface',
                      desc: 'Containers, dialogs, sheets',
                      value: draftColors.surface,
                      onChange: (val: string) => {
                        const updated = { ...draftColors, surface: val };
                        setDraftColors(updated);
                        if (isValidHexColor(val)) applyThemeToDom(updated);
                      }
                    }
                  ].map(field => (
                    <div key={field.id} className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800">{field.label}</label>
                        <input
                          type="color"
                          value={isValidHexColor(field.value) ? field.value : '#000000'}
                          onChange={e => field.onChange(e.target.value)}
                          className="w-6 h-6 rounded-md border border-slate-300 cursor-pointer p-0 shrink-0"
                          title="Pick color visually"
                        />
                      </div>
                      <input
                        type="text"
                        value={field.value}
                        onChange={e => field.onChange(e.target.value)}
                        placeholder="#HEX"
                        className={`w-full p-2 text-xs font-mono font-bold rounded-lg border uppercase ${
                          isValidHexColor(field.value) ? 'border-slate-300' : 'border-rose-500 bg-rose-50'
                        }`}
                      />
                      <span className="text-[10px] text-slate-400 block truncate">{field.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save As Custom Preset Form */}
              <form onSubmit={handleSaveCustomTheme} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="w-full sm:w-auto flex-1">
                  <h4 className="text-xs font-bold text-slate-900">Save as Custom Preset</h4>
                  <p className="text-[11px] text-slate-500">Store these adjustments in local browser persistence for future sessions</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Greenfield Autumn Navy"
                    value={newThemeName}
                    onChange={e => setNewThemeName(e.target.value)}
                    className="p-2 text-xs rounded-xl border border-slate-300 bg-white flex-1 sm:w-60"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl flex items-center gap-1.5 shrink-0 shadow-2xs"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Preset
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: SAVED CUSTOM THEMES */}
          {/* ============================================================== */}
          {activeTab === 'saved' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Manage custom themes saved to browser localStorage.</span>
                <span className="font-mono text-slate-700 font-bold">{savedThemes.length} Saved</span>
              </div>

              {savedThemes.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-xs text-slate-500 space-y-2">
                  <Palette className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="font-semibold text-slate-700">No custom themes saved yet.</p>
                  <p className="text-[11px] text-slate-400">
                    Customize colors in the "Custom Colors & Tokens" tab and save them to this list.
                  </p>
                  <button
                    onClick={() => setActiveTab('editor')}
                    className="mt-2 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-xl"
                  >
                    Go to Color Editor &rarr;
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {savedThemes.map(theme => (
                    <div
                      key={theme.id}
                      className="p-3.5 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="space-y-1">
                        {editingThemeId === theme.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editThemeName}
                              onChange={e => setEditThemeName(e.target.value)}
                              className="px-2 py-1 text-xs rounded border border-slate-300 font-bold"
                            />
                            <button
                              onClick={() => handleSaveRename(theme.id)}
                              className="px-2.5 py-1 text-xs font-bold text-white bg-slate-900 rounded"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingThemeId(null)}
                              className="px-2 py-1 text-xs text-slate-500 hover:text-slate-700"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">{theme.name}</span>
                            <button
                              onClick={() => {
                                setEditingThemeId(theme.id);
                                setEditThemeName(theme.name);
                              }}
                              className="text-slate-400 hover:text-slate-600 p-0.5"
                              title="Rename theme"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        <span className="text-[10px] text-slate-400 font-mono block">
                          Created: {theme.createdAt.split('T')[0]}
                        </span>
                      </div>

                      {/* Swatches */}
                      <div className="flex items-center gap-1.5">
                        {[
                          theme.colors.primary,
                          theme.colors.secondary,
                          theme.colors.accent,
                          theme.colors.background,
                          theme.colors.surface
                        ].map((hex, hIdx) => (
                          <div
                            key={hIdx}
                            className="w-6 h-6 rounded-md border border-slate-300 shadow-2xs"
                            style={{ backgroundColor: hex }}
                            title={hex}
                          />
                        ))}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleApplySavedTheme(theme)}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Apply
                        </button>
                        <button
                          onClick={() => handleDeleteCustomTheme(theme.id, theme.name)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete theme"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 4: IMPORT / EXPORT JSON */}
          {/* ============================================================== */}
          {activeTab === 'import_export' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Export Panel */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-blue-700" />
                    <span>Export Theme JSON</span>
                  </h4>
                  <span className="text-[10px] font-mono text-slate-500">Schema v1.0</span>
                </div>
                <p className="text-xs text-slate-500">
                  Export the active draft palette to standard JSON for backups or cross-environment migration.
                </p>

                <pre className="bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-[11px] overflow-x-auto max-h-48 border border-slate-800">
                  {exportThemeToJSON(
                    SCHLAR_PALETTES.find(p => p.id === selectedPresetId)?.name || 'Custom Theme',
                    draftColors
                  )}
                </pre>

                <div className="flex gap-2">
                  <button
                    onClick={handleExportCopy}
                    className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedSuccess ? 'Copied!' : 'Copy to Clipboard'}</span>
                  </button>
                  <button
                    onClick={handleExportDownload}
                    className="flex-1 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .JSON</span>
                  </button>
                </div>
              </div>

              {/* Import Panel */}
              <form onSubmit={handleImportSubmit} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-emerald-700" />
                    <span>Import Theme JSON</span>
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold">Strict Validation</span>
                </div>
                <p className="text-xs text-slate-500">
                  Paste a valid SCHLAR theme configuration. Colors are verified against 6-character hex patterns.
                </p>

                <textarea
                  rows={6}
                  required
                  placeholder='Paste JSON here, e.g.:&#10;{&#10;  "name": "Custom Theme",&#10;  "colors": {&#10;    "primary": "#164E55",&#10;    "secondary": "#287B7A",&#10;    "accent": "#C47D54",&#10;    "background": "#F5F0E7",&#10;    "surface": "#FFFFFF"&#10;  }&#10;}'
                  value={importJsonText}
                  onChange={e => {
                    setImportJsonText(e.target.value);
                    setImportError(null);
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-[11px] bg-white"
                />

                {importError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <span>{importError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Validate & Apply Theme</span>
                </button>
              </form>
            </div>
          )}

          {/* ============================================================== */}
          {/* REAL-TIME INTERACTIVE LIVE PREVIEW PANE */}
          {/* ============================================================== */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-blue-700" />
                <span>Live Design-Token Preview</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Tokens: Primary {draftColors.primary} · Secondary {draftColors.secondary} · Accent {draftColors.accent}
              </span>
            </div>

            {/* Simulated Mini App Dashboard */}
            <div
              className="rounded-xl border border-slate-200 p-4 space-y-3 transition-colors shadow-xs"
              style={{ backgroundColor: draftColors.background }}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-300/60">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shadow-xs"
                    style={{
                      backgroundColor: draftColors.primary,
                      color: getContrastTextColor(draftColors.primary)
                    }}
                  >
                    GIS
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">Greenfield International School</span>
                    <span className="text-[10px] text-slate-500 block">SCHLAR Management Portal</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="px-3 py-1 rounded-lg text-xs font-bold shadow-2xs transition-colors"
                    style={{
                      backgroundColor: draftColors.primary,
                      color: getContrastTextColor(draftColors.primary)
                    }}
                  >
                    Primary Button
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                    style={{
                      backgroundColor: draftColors.secondary,
                      color: getContrastTextColor(draftColors.secondary)
                    }}
                  >
                    Secondary
                  </button>
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono shadow-2xs"
                    style={{
                      backgroundColor: draftColors.accent,
                      color: getContrastTextColor(draftColors.accent)
                    }}
                  >
                    Accent Pill
                  </span>
                </div>
              </div>

              {/* Surface Container Card */}
              <div
                className="p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-2"
                style={{ backgroundColor: draftColors.surface }}
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">Surface Card Component</span>
                  <span className="text-[10px] text-slate-400 font-mono">Surface: {draftColors.surface}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Notice how card containers, navigation links, and action buttons adapt in harmony while maintaining clear typographic contrast.
                </p>
                <div className="flex gap-2 pt-1 text-[11px]">
                  <span
                    className="px-2 py-0.5 rounded font-semibold text-[10px]"
                    style={{ backgroundColor: `${draftColors.primary}18`, color: draftColors.primary }}
                  >
                    Primary Tint Tag
                  </span>
                  <span
                    className="px-2 py-0.5 rounded font-semibold text-[10px]"
                    style={{ backgroundColor: `${draftColors.secondary}18`, color: draftColors.secondary }}
                  >
                    Secondary Tint Tag
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-5 py-3.5 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetToDefault}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1"
              title="Reset to default Petrol & Copper theme"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Default (Petrol & Copper)</span>
            </button>
            <button
              onClick={handleResetToSelectedPreset}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-colors"
              title="Reset draft to current preset"
            >
              Revert Draft
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyTheme}
              className="px-5 py-2 text-xs font-bold text-white rounded-xl shadow-sm transition-all flex items-center gap-1.5 hover:opacity-95"
              style={{
                backgroundColor: draftColors.primary,
                color: getContrastTextColor(draftColors.primary)
              }}
            >
              <Check className="w-4 h-4" />
              <span>Apply Theme Across System</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
