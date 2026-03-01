// Set to 'true' to test the UI without a real backend server
const USE_MOCK_BACKEND = false;

export const mediaConvertAdapter = {
    supportedFormats: {
        image: ["jpg", "png", "webp", "gif", "tiff"],
        audio: ["mp3", "wav", "aac", "ogg"],
        video: ["mp4", "mov", "avi", "webm"],
        document: ["pdf", "docx", "txt", "md"]
    },

    /**
     * Uploads and converts media using the backend API
     * @param {File} file 
     * @param {string} targetFormat 
     * @returns {Promise<Object>}
     */
    convert: async (file, targetFormat) => {
        if (!file) throw new Error("No file provided for conversion");

        // 1. Mock Mode (Enable this constant above if you don't have a backend yet)
        if (USE_MOCK_BACKEND) {
            console.log(`[MediaAdapter] Simulating conversion: ${file.name || 'file'} -> ${targetFormat}`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            return {
                originalName: file.name || 'unknown',
                targetFormat: targetFormat,
                status: "success",
                url: `https://cdn.horizons.dev/converted/${Date.now()}_converted.${targetFormat}`,
                size: "1.2 MB",
                timestamp: new Date().toISOString()
            };
        }
        
        // 2. Production Mode (Real API Call)
        if (!(file instanceof File) && !(file instanceof Blob)) {
            throw new Error("Invalid file object. Real conversion requires a valid File or Blob.");
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('targetFormat', targetFormat);

        // Replace with your actual backend endpoint
        const API_ENDPOINT = import.meta.env.VITE_MEDIA_API_ENDPOINT || 'https://api.horizons.dev/v1/media/convert';

        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error(`Conversion failed: ${response.statusText}`);
        return await response.json();
    }
};