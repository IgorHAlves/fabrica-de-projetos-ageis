import axios from 'axios'

// Uploads an image file to Cloudinary using unsigned preset
// Required envs: VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_UPLOAD_PRESET
export async function uploadImageToCloudinary(file, onProgress) {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

    if (!cloudName || !uploadPreset) {
        throw new Error('Cloudinary não configurado. Defina VITE_CLOUDINARY_CLOUD_NAME e VITE_CLOUDINARY_UPLOAD_PRESET.')
    }

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
    const data = new FormData()
    data.append('file', file)
    data.append('upload_preset', uploadPreset)

    const response = await axios.post(url, data, {
        onUploadProgress: (evt) => {
            if (onProgress && evt.total) {
                const percent = Math.round((evt.loaded * 100) / evt.total)
                onProgress(percent)
            }
        }
    })

    return response.data // contains secure_url, public_id, etc
}



