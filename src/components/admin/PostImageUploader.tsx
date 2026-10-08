import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  HardDrive,
  Image as ImageIcon,
  Check,
  Loader2,
  Trash2,
  FileText,
  ExternalLink,
  Plus,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { uploadPostImageToFirestore, getMediaLibrary, deleteMediaItem } from '../../services/media';
import { MediaItem } from '../../types';
import { formatBytes } from '../../utils/imageOptimizer';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../Toast';

interface PostImageUploaderProps {
  currentCoverImage: string;
  onSelectCoverImage: (url: string) => void;
  onInsertIntoContent?: (markdownImg: string) => void;
  presetImages?: string[];
  postId?: string;
}

export const PostImageUploader: React.FC<PostImageUploaderProps> = ({
  currentCoverImage,
  onSelectCoverImage,
  onInsertIntoContent,
  presetImages = [],
  postId
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'device' | 'library' | 'presets' | 'url'>('device');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  // Recent device upload result
  const [lastUploadedItem, setLastUploadedItem] = useState<MediaItem | null>(null);
  const [customCaption, setCustomCaption] = useState('');

  // Firestore media library
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);

  // Custom URL input
  const [urlInput, setUrlInput] = useState(currentCoverImage.startsWith('data:') ? '' : currentCoverImage);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load library when library tab is opened
  useEffect(() => {
    if (activeTab === 'library') {
      fetchLibrary();
    }
  }, [activeTab]);

  const fetchLibrary = async () => {
    setLoadingLibrary(true);
    try {
      const items = await getMediaLibrary();
      setMediaLibrary(items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLibrary(false);
    }
  };

  const handleDeviceFile = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    setUploadStep('Optimizing image for Firestore...');

    try {
      setUploadStep('Saving compressed image to Firestore database...');
      const savedMedia = await uploadPostImageToFirestore(file, {
        postId,
        caption: customCaption || file.name.replace(/\.[^/.]+$/, ''),
        userId: user?.uid,
        userEmail: user?.email || undefined
      });

      setLastUploadedItem(savedMedia);
      onSelectCoverImage(savedMedia.dataUrl);
      showToast(`Image "${file.name}" saved directly to Firestore database!`, 'success');

      // Refresh library in background
      fetchLibrary();
    } catch (err: any) {
      console.error('Device image upload error:', err);
      showToast(err.message || 'Failed to save image to Firestore.', 'error');
    } finally {
      setIsUploading(false);
      setUploadStep('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleDeviceFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleDeviceFile(file);
    } else {
      showToast('Please drop an image file (JPG, PNG, WebP).', 'info');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleInsertBody = (imageUrl: string, captionText?: string) => {
    if (!onInsertIntoContent) return;
    const cleanCaption = (captionText || customCaption || 'Reflection image').trim();
    const markdown = `\n\n![${cleanCaption}](${imageUrl})\n\n`;
    onInsertIntoContent(markdown);
    showToast('Image inserted into essay body.', 'success');
  };

  const handleDeleteMedia = async (item: MediaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Delete "${item.name}" from Firestore?`)) return;

    try {
      await deleteMediaItem(item.id);
      setMediaLibrary(prev => prev.filter(m => m.id !== item.id));
      if (lastUploadedItem?.id === item.id) {
        setLastUploadedItem(null);
      }
      showToast('Image deleted from Firestore.', 'info');
    } catch (err) {
      showToast('Failed to delete image.', 'error');
    }
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    onSelectCoverImage(urlInput.trim());
    showToast('Cover image URL updated.', 'info');
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#EBE6DC] shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#122B22]/5 flex items-center justify-center text-[#122B22]">
            <HardDrive className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-lg text-[#122B22] leading-tight">Post Artwork & Media</h3>
            <p className="text-[11px] text-[#8EA595]">Save images directly in Cloud Firestore</p>
          </div>
        </div>

        {currentCoverImage && (
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#B8E0D2]/40 text-[#122B22]">
            Cover Active
          </span>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex p-1 bg-[#FAF7F2] rounded-2xl border border-[#EBE6DC] text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab('device')}
          className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'device'
              ? 'bg-[#122B22] text-[#FAF7F2] shadow-2xs font-semibold'
              : 'text-[#6F8A77] hover:text-[#122B22]'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Device Storage</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('library')}
          className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'library'
              ? 'bg-[#122B22] text-[#FAF7F2] shadow-2xs font-semibold'
              : 'text-[#6F8A77] hover:text-[#122B22]'
          }`}
        >
          <FolderOpen className="w-3.5 h-3.5" />
          <span>Firestore Media</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('presets')}
          className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'presets'
              ? 'bg-[#122B22] text-[#FAF7F2] shadow-2xs font-semibold'
              : 'text-[#6F8A77] hover:text-[#122B22]'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Presets</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('url')}
          className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'url'
              ? 'bg-[#122B22] text-[#FAF7F2] shadow-2xs font-semibold'
              : 'text-[#6F8A77] hover:text-[#122B22]'
          }`}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>URL</span>
        </button>
      </div>

      {/* TAB 1: DEVICE STORAGE UPLOAD */}
      {activeTab === 'device' && (
        <div className="space-y-4">
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            className="hidden"
          />

          {/* Drag & Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-[#122B22] bg-[#FAF7F2] scale-[0.99]'
                : 'border-[#EBE6DC] hover:border-[#8EA595] hover:bg-[#FAF7F2]/50 bg-white'
            } ${isUploading ? 'opacity-70 pointer-events-none' : ''}`}
          >
            {isUploading ? (
              <div className="space-y-3 py-4">
                <Loader2 className="w-8 h-8 text-[#122B22] animate-spin mx-auto" />
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-[#122B22]">{uploadStep}</p>
                  <p className="text-[11px] text-[#8EA595]">Compressing & saving directly in Firestore...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 py-2">
                <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#EBE6DC] flex items-center justify-center text-[#122B22] mx-auto shadow-2xs group-hover:scale-105 transition-transform">
                  <Upload className="w-5 h-5 text-[#6F8A77]" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-[#122B22]">
                    Click to browse device storage or drag & drop
                  </p>
                  <p className="text-[11px] text-[#8EA595]">
                    Supports JPG, PNG, WebP • Auto-optimized for Firestore
                  </p>
                </div>
                <button
                  type="button"
                  className="px-4 py-1.5 rounded-full bg-[#FAF7F2] border border-[#EBE6DC] text-[11px] font-semibold text-[#122B22] hover:bg-[#EBE6DC] transition-colors"
                >
                  Select from device
                </button>
              </div>
            )}
          </div>

          {/* Optional Caption Field for Next Upload or Insertion */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-[#8EA595] uppercase tracking-wider">
              Optional Image Caption / Alt Text
            </label>
            <input
              type="text"
              value={customCaption}
              onChange={(e) => setCustomCaption(e.target.value)}
              placeholder="e.g. Morning mist over pine needles"
              className="w-full bg-[#FAF7F2] border border-[#EBE6DC] rounded-xl px-3 py-2 text-xs text-[#122B22] focus:outline-none focus:border-[#8EA595]"
            />
          </div>

          {/* Upload Status / Quick Actions for last uploaded item */}
          {lastUploadedItem && (
            <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EBE6DC] space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={lastUploadedItem.dataUrl}
                  alt={lastUploadedItem.name}
                  className="w-14 h-14 rounded-xl object-cover border border-[#EBE6DC] shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <p className="text-xs font-semibold text-[#122B22] truncate">
                      {lastUploadedItem.name}
                    </p>
                  </div>
                  <p className="text-[11px] text-[#8EA595]">
                    {formatBytes(lastUploadedItem.sizeBytes)} • Saved in Firestore
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-[#EBE6DC]/80">
                <button
                  type="button"
                  onClick={() => {
                    onSelectCoverImage(lastUploadedItem.dataUrl);
                    showToast('Set as cover artwork.', 'success');
                  }}
                  className="flex-1 py-1.5 px-2.5 rounded-xl bg-white border border-[#EBE6DC] text-[11px] font-semibold text-[#122B22] hover:bg-[#122B22] hover:text-white transition-all text-center"
                >
                  Use as Cover
                </button>

                {onInsertIntoContent && (
                  <button
                    type="button"
                    onClick={() => handleInsertBody(lastUploadedItem.dataUrl, customCaption || lastUploadedItem.name)}
                    className="flex-1 py-1.5 px-2.5 rounded-xl bg-[#122B22] text-white text-[11px] font-semibold hover:bg-[#1A3B2F] transition-all text-center flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Insert into Body</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FIRESTORE MEDIA LIBRARY */}
      {activeTab === 'library' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#8EA595] uppercase tracking-wider">
              Images Saved in Firestore ({mediaLibrary.length})
            </span>
            <button
              type="button"
              onClick={fetchLibrary}
              disabled={loadingLibrary}
              className="text-xs text-[#6F8A77] hover:text-[#122B22] flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${loadingLibrary ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {loadingLibrary ? (
            <div className="py-8 text-center text-xs text-[#8EA595] flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#122B22]" />
              <span>Loading Firestore media...</span>
            </div>
          ) : mediaLibrary.length === 0 ? (
            <div className="py-8 text-center bg-[#FAF7F2] rounded-2xl border border-[#EBE6DC] p-4 space-y-2">
              <HardDrive className="w-6 h-6 text-[#8EA595] mx-auto" />
              <p className="text-xs text-[#122B22] font-medium">No device images saved yet</p>
              <p className="text-[11px] text-[#8EA595]">
                Switch to "Device Storage" above to upload photos directly from your phone or computer.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('device')}
                className="mt-2 px-3 py-1.5 rounded-full bg-[#122B22] text-white text-[11px] font-semibold"
              >
                Upload from device
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1">
              {mediaLibrary.map((item) => {
                const isSelectedCover = currentCoverImage === item.dataUrl;
                return (
                  <div
                    key={item.id}
                    className={`group relative rounded-xl overflow-hidden border-2 transition-all bg-[#FAF7F2] ${
                      isSelectedCover ? 'border-[#122B22] ring-2 ring-[#122B22]/20' : 'border-[#EBE6DC] hover:border-[#8EA595]'
                    }`}
                  >
                    <div className="aspect-square w-full overflow-hidden bg-black/5">
                      <img
                        src={item.dataUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="p-1.5 bg-white border-t border-[#EBE6DC] space-y-1">
                      <p className="text-[10px] font-medium text-[#122B22] truncate" title={item.name}>
                        {item.name}
                      </p>
                      <p className="text-[9px] text-[#8EA595]">
                        {formatBytes(item.sizeBytes)}
                      </p>
                    </div>

                    {/* Hover actions overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectCoverImage(item.dataUrl);
                          showToast('Cover updated.', 'success');
                        }}
                        className="w-full py-1 rounded-lg bg-white text-[#122B22] text-[10px] font-semibold hover:bg-[#FAF7F2] shadow-xs"
                      >
                        Set as Cover
                      </button>

                      {onInsertIntoContent && (
                        <button
                          type="button"
                          onClick={() => handleInsertBody(item.dataUrl, item.caption || item.name)}
                          className="w-full py-1 rounded-lg bg-[#B8E0D2] text-[#122B22] text-[10px] font-semibold hover:bg-[#a5d4c4] shadow-xs"
                        >
                          Insert in Body
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={(e) => handleDeleteMedia(item, e)}
                        className="p-1 rounded-md text-red-300 hover:text-red-100 hover:bg-red-500/30 transition-colors"
                        title="Delete from Firestore"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SANCTUARY PRESETS */}
      {activeTab === 'presets' && (
        <div className="space-y-3">
          <span className="text-[11px] font-semibold text-[#8EA595] uppercase tracking-wider">
            Curated Sanctuary Presets
          </span>
          <div className="grid grid-cols-3 gap-2">
            {presetImages.map((imgUrl, idx) => {
              const isSelected = currentCoverImage === imgUrl;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onSelectCoverImage(imgUrl);
                    showToast('Preset artwork applied.', 'info');
                  }}
                  className={`h-16 rounded-xl overflow-hidden border-2 transition-all relative ${
                    isSelected ? 'border-[#122B22] scale-95 shadow-sm' : 'border-transparent hover:opacity-85'
                  }`}
                >
                  <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  {isSelected && (
                    <div className="absolute inset-0 bg-[#122B22]/30 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: EXTERNAL URL */}
      {activeTab === 'url' && (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-[#8EA595] uppercase tracking-wider">
              Image Web URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full bg-[#FAF7F2] border border-[#EBE6DC] rounded-xl px-3 py-2 text-xs text-[#122B22] focus:outline-none focus:border-[#8EA595]"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-3 py-2 rounded-xl bg-[#122B22] text-white text-xs font-semibold shrink-0 hover:bg-[#1A3B2F]"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE COVER IMAGE PREVIEW */}
      {currentCoverImage && (
        <div className="space-y-1.5 pt-3 border-t border-[#F2ECE4]">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-[#8EA595] uppercase tracking-wider">
              Current Cover Preview
            </span>
            {currentCoverImage.startsWith('data:') && (
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Saved in Firestore
              </span>
            )}
          </div>

          <div className="relative w-full h-36 rounded-2xl overflow-hidden border border-[#EBE6DC] group">
            <img
              src={currentCoverImage}
              alt="Cover preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              {onInsertIntoContent && (
                <button
                  type="button"
                  onClick={() => handleInsertBody(currentCoverImage, 'Story Illustration')}
                  className="px-3 py-1.5 rounded-full bg-white text-[#122B22] text-xs font-semibold hover:bg-[#FAF7F2] shadow-sm flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Insert in Body</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
