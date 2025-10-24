<template>
    <div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
        <label for="imageFile" class="block text-sm font-semibold text-gray-700 mb-3">Upload da Imagem</label>

        <!-- File Input -->
        <div class="mb-4">
            <div class="relative">
                <input id="imageFile" type="file" accept="image/*" @change="onFileChange"
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div
                    class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 cursor-pointer group">
                    <div class="flex flex-col items-center space-y-4">
                        <div
                            class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-200">
                            <svg class="w-8 h-8 text-gray-400 group-hover:text-gray-500" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-lg font-medium text-gray-900">Clique para selecionar uma imagem</p>
                            <p class="text-sm text-gray-500 mt-1">ou arraste e solte aqui</p>
                        </div>
                        <div class="flex items-center space-x-2 text-xs text-gray-400">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>JPG, PNG, GIF até 10MB</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Progress Bar -->
        <div v-if="uploadProgress > 0 && uploadProgress < 100" class="mb-4">
            <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-blue-700">Enviando imagem...</span>
                    <span class="text-sm font-bold text-blue-600">{{ uploadProgress }}%</span>
                </div>
                <div class="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
                    <div class="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300 ease-out shadow-sm"
                        :style="{ width: uploadProgress + '%' }"></div>
                </div>
                <div class="flex items-center mt-2 text-xs text-blue-600">
                    <svg class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Processando upload...</span>
                </div>
            </div>
        </div>

        <!-- Image Preview -->
        <div v-if="modelValue" class="mt-4">
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center space-x-2">
                        <svg class="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span class="text-sm font-medium text-green-700">Imagem carregada com sucesso</span>
                    </div>
                    <button @click="removeImage"
                        class="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1"
                        title="Remover imagem">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="flex items-center space-x-4">
                    <div class="relative group">
                        <img :src="modelValue" alt="Prévia da imagem"
                            class="w-20 h-20 object-cover rounded-lg border-2 border-green-200 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                            @click="previewImage" @error="console.error('Erro ao carregar imagem:', modelValue)"
                            title="Clique para visualizar em tamanho real" />
                        <div
                            class="absolute inset-0 bg-black/0 hover:bg-black/20 rounded-lg transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                            <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                        </div>
                    </div>
                    <div class="flex-1">
                        <p class="text-xs text-gray-600">Clique na imagem para visualizar em tamanho real</p>
                        <button @click="previewImage" class="text-xs text-blue-600 hover:text-blue-800 underline mt-1">
                            Ou clique aqui para abrir
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Error Messages -->
        <p v-if="error" class="mt-2 text-sm text-red-600 font-medium">{{ error }}</p>
        <p class="mt-2 text-sm text-gray-500">Formatos aceitos: JPG, PNG, GIF. Máximo 10MB.</p>

    </div>
</template>

<script setup>
import { ref } from 'vue'
import { uploadImageToCloudinary } from '@/Services/cloudinary'
import { useAlerts } from '../composables/useAlerts'

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    error: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['update:modelValue', 'upload-progress'])

const { showSuccessToast, showErrorToast } = useAlerts()
const uploadProgress = ref(0)

async function onFileChange(e) {
    const file = e.target.files && e.target.files[0]
    if (!file) return

    uploadProgress.value = 0
    try {
        // Verificar se Cloudinary está configurado
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

        if (!cloudName || !uploadPreset) {
            console.warn('Cloudinary não configurado. Imagem será ignorada.')
            emit('update:modelValue', '')
            return
        }

        const res = await uploadImageToCloudinary(file, p => {
            uploadProgress.value = p
            emit('upload-progress', p)
        })
        emit('update:modelValue', res.secure_url)
        console.log('Imagem enviada com sucesso:', res.secure_url)
        showSuccessToast('Imagem carregada com sucesso!')
    } catch (error) {
        console.error('Erro ao enviar imagem:', error)
        emit('update:modelValue', '')
        showErrorToast('Erro ao carregar imagem')
    }
}

function removeImage() {
    emit('update:modelValue', '')
    uploadProgress.value = 0
    showSuccessToast('Imagem removida!')
}

function previewImage() {
    console.log('previewImage chamada, modelValue:', props.modelValue)

    if (!props.modelValue) {
        console.warn('Nenhuma imagem para visualizar')
        return
    }

    // Usar modal simples primeiro (mais confiável)
    showModalPreview()
}

// Função usando modal (mais confiável que popup)
function showModalPreview() {
    console.log('Criando modal para imagem:', props.modelValue)

    // Remover modal existente se houver
    const existingModal = document.getElementById('image-preview-modal')
    if (existingModal) {
        existingModal.remove()
    }

    // Prevenir scroll do body
    document.body.style.overflow = 'hidden'

    // Criar modal
    const modal = document.createElement('div')
    modal.id = 'image-preview-modal'
    modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.95);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    cursor: pointer;
    overflow: hidden;
  `

    // Container principal
    const mainContainer = document.createElement('div')
    mainContainer.style.cssText = `
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    box-sizing: border-box;
  `

    // Container da imagem
    const imageContainer = document.createElement('div')
    imageContainer.style.cssText = `
    position: relative;
    max-width: 100%;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `

    // Botão de fechar (melhor posicionado)
    const closeBtn = document.createElement('button')
    closeBtn.innerHTML = '✕'
    closeBtn.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(0,0,0,0.7);
    color: white;
    border: 2px solid rgba(255,255,255,0.3);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    font-size: 24px;
    cursor: pointer;
    z-index: 10001;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
  `

    // Hover effect para o botão
    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.background = 'rgba(239,68,68,0.8)'
        closeBtn.style.borderColor = 'rgba(255,255,255,0.8)'
        closeBtn.style.transform = 'scale(1.1)'
    })

    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.background = 'rgba(0,0,0,0.7)'
        closeBtn.style.borderColor = 'rgba(255,255,255,0.3)'
        closeBtn.style.transform = 'scale(1)'
    })

    // Imagem
    const img = document.createElement('img')
    img.src = props.modelValue
    img.style.cssText = `
    max-width: 100%;
    max-height: calc(100vh - 100px);
    object-fit: contain;
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    transition: transform 0.3s ease;
  `

    // Hover effect para a imagem
    img.addEventListener('mouseenter', () => {
        img.style.transform = 'scale(1.02)'
    })

    img.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1)'
    })

    // Título
    const title = document.createElement('h3')
    title.textContent = 'Visualização da Imagem'
    title.style.cssText = `
    color: white;
    margin-bottom: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 18px;
    font-weight: 500;
    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    text-align: center;
  `

    // Instruções
    const instructions = document.createElement('p')
    instructions.textContent = 'Pressione ESC ou clique fora da imagem para fechar'
    instructions.style.cssText = `
    color: rgba(255,255,255,0.7);
    font-size: 14px;
    margin-top: 15px;
    text-align: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `

    imageContainer.appendChild(title)
    imageContainer.appendChild(img)
    imageContainer.appendChild(instructions)
    mainContainer.appendChild(imageContainer)
    modal.appendChild(mainContainer)
    modal.appendChild(closeBtn)
    document.body.appendChild(modal)

    // Eventos de fechamento
    const closeModal = () => {
        if (document.body.contains(modal)) {
            document.body.removeChild(modal)
            document.body.style.overflow = '' // Restaurar scroll
        }
    }

    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        closeModal()
    })

    modal.addEventListener('click', closeModal)

    // Fechar com ESC
    const handleKeyPress = (e) => {
        if (e.key === 'Escape') {
            closeModal()
            document.removeEventListener('keydown', handleKeyPress)
        }
    }
    document.addEventListener('keydown', handleKeyPress)

    // Prevenir fechamento ao clicar na imagem
    img.addEventListener('click', (e) => {
        e.stopPropagation()
    })

    // Prevenir fechamento ao clicar no container da imagem
    imageContainer.addEventListener('click', (e) => {
        e.stopPropagation()
    })

    console.log('Modal criado com sucesso')
}
</script>
