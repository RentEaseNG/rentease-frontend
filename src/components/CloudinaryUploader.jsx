import { useRef, useState } from 'react';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * CloudinaryUploader
 *
 * Props:
 *   value    {string[]}               - Current list of uploaded image URLs
 *   onChange {(urls: string[]) => void} - Called whenever the URL list changes
 *   maxFiles {number}                 - Max number of images allowed (default: 10)
 */
const CloudinaryUploader = ({ value = [], onChange, maxFiles = 10 }) => {
    // Each entry: { id, file, preview, status: 'uploading'|'done'|'error', url, progress }
    const [uploads, setUploads] = useState(() =>
        value.map((url, i) => ({
            id: `existing-${i}`,
            preview: url,
            status: 'done',
            url,
            progress: 100,
        }))
    );
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef(null);

    const notifyParent = (newUploads) => {
        const urls = newUploads.filter((u) => u.status === 'done').map((u) => u.url);
        onChange(urls);
    };

    const uploadFile = async (file, id) => {
        if (!CLOUD_NAME || !UPLOAD_PRESET) {
            console.error('Cloudinary env vars missing: VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET');
            setUploads((prev) => {
                const next = prev.map((u) =>
                    u.id === id ? { ...u, status: 'error', errorMsg: 'Cloudinary not configured.' } : u
                );
                notifyParent(next);
                return next;
            });
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);

        return new Promise((resolve) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);

            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    const progress = Math.round((e.loaded / e.total) * 100);
                    setUploads((prev) =>
                        prev.map((u) => (u.id === id ? { ...u, progress } : u))
                    );
                }
            };

            xhr.onload = () => {
                if (xhr.status === 200) {
                    const data = JSON.parse(xhr.responseText);
                    setUploads((prev) => {
                        const next = prev.map((u) =>
                            u.id === id
                                ? { ...u, status: 'done', url: data.secure_url, progress: 100 }
                                : u
                        );
                        notifyParent(next);
                        return next;
                    });
                } else {
                    setUploads((prev) => {
                        const next = prev.map((u) =>
                            u.id === id ? { ...u, status: 'error', errorMsg: 'Upload failed.' } : u
                        );
                        notifyParent(next);
                        return next;
                    });
                }
                resolve();
            };

            xhr.onerror = () => {
                setUploads((prev) => {
                    const next = prev.map((u) =>
                        u.id === id ? { ...u, status: 'error', errorMsg: 'Network error.' } : u
                    );
                    notifyParent(next);
                    return next;
                });
                resolve();
            };

            xhr.send(formData);
        });
    };

    const processFiles = (files) => {
        const remaining = maxFiles - uploads.length;
        const toProcess = Array.from(files).slice(0, remaining);
        if (!toProcess.length) return;

        const newEntries = toProcess.map((file) => ({
            id: `${Date.now()}-${Math.random()}`,
            file,
            preview: URL.createObjectURL(file),
            status: 'uploading',
            url: null,
            progress: 0,
        }));

        setUploads((prev) => [...prev, ...newEntries]);
        newEntries.forEach((entry) => uploadFile(entry.file, entry.id));
    };

    const removeImage = (id) => {
        setUploads((prev) => {
            const next = prev.filter((u) => u.id !== id);
            notifyParent(next);
            return next;
        });
    };

    const retryUpload = (id) => {
        const entry = uploads.find((u) => u.id === id);
        if (!entry?.file) return;
        setUploads((prev) =>
            prev.map((u) => (u.id === id ? { ...u, status: 'uploading', progress: 0 } : u))
        );
        uploadFile(entry.file, id);
    };

    // ── Drag handlers ──────────────────────────────────────────────────────────
    const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
    const onDragLeave = () => setDragging(false);
    const onDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        processFiles(e.dataTransfer.files);
    };

    const atLimit = uploads.length >= maxFiles;

    return (
        <div className="space-y-3">
            {/* Drop zone */}
            {!atLimit && (
                <div
                    onClick={() => inputRef.current?.click()}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl py-8 px-4 cursor-pointer transition-colors select-none
            ${dragging
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-300 bg-gray-50 hover:border-green-400 hover:bg-green-50/50'
                        }`}
                >
                    <Upload size={24} className="text-gray-400" />
                    <p className="text-sm text-gray-600 font-medium">
                        Drag &amp; drop images here, or{' '}
                        <span className="text-green-700 underline underline-offset-2">browse</span>
                    </p>
                    <p className="text-xs text-gray-400">
                        PNG, JPG, WEBP · up to {maxFiles} images
                    </p>
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => processFiles(e.target.files)}
                    />
                </div>
            )}

            {/* Thumbnails grid */}
            {uploads.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {uploads.map((u) => (
                        <div
                            key={u.id}
                            className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-100 aspect-square"
                        >
                            {/* Preview image */}
                            <img
                                src={u.preview}
                                alt="upload preview"
                                className="w-full h-full object-cover"
                            />

                            {/* Uploading overlay */}
                            {u.status === 'uploading' && (
                                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1 p-2">
                                    <Loader2 size={20} className="text-white animate-spin" />
                                    <div className="w-full bg-white/30 rounded-full h-1.5">
                                        <div
                                            className="h-1.5 rounded-full bg-green-400 transition-all duration-300"
                                            style={{ width: `${u.progress}%` }}
                                        />
                                    </div>
                                    <span className="text-white text-xs font-medium">{u.progress}%</span>
                                </div>
                            )}

                            {/* Error overlay */}
                            {u.status === 'error' && (
                                <div className="absolute inset-0 bg-red-500/80 flex flex-col items-center justify-center gap-1 p-2">
                                    <ImageIcon size={18} className="text-white" />
                                    <p className="text-white text-xs text-center leading-tight">
                                        {u.errorMsg ?? 'Upload failed'}
                                    </p>
                                    {u.file && (
                                        <button
                                            type="button"
                                            onClick={() => retryUpload(u.id)}
                                            className="mt-1 px-2 py-0.5 bg-white text-red-600 text-xs rounded font-medium hover:bg-gray-100"
                                        >
                                            Retry
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Remove button (only when done or error) */}
                            {u.status !== 'uploading' && (
                                <button
                                    type="button"
                                    onClick={() => removeImage(u.id)}
                                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors"
                                    aria-label="Remove image"
                                >
                                    <X size={11} strokeWidth={2.5} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {atLimit && (
                <p className="text-xs text-amber-600 font-medium">
                    Maximum of {maxFiles} images reached. Remove one to add another.
                </p>
            )}
        </div>
    );
};

export default CloudinaryUploader;
