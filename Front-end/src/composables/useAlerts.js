export function useAlerts() {
    // SweetAlert2 está disponível globalmente via CDN
    const Swal = window.Swal

    // Verificação de segurança
    if (!Swal) {
        console.error('SweetAlert2 não foi carregado. Verifique se o CDN está funcionando.')
        // Fallback para alert nativo
        return {
            showSuccess: (title, text = '') => alert(`${title}: ${text}`),
            showError: (title, text = '') => alert(`ERRO - ${title}: ${text}`),
            showWarning: (title, text = '') => alert(`AVISO - ${title}: ${text}`),
            showInfo: (title, text = '') => alert(`INFO - ${title}: ${text}`),
            showConfirm: (title, text = '') => confirm(`${title}: ${text}`),
            showSuccessToast: (message) => console.log(`Toast: ${message}`),
            showErrorToast: (message) => console.error(`Toast Error: ${message}`),
            showLoading: (title = 'Carregando...') => console.log(`Loading: ${title}`),
            closeLoading: () => console.log('Loading closed')
        }
    }

    // Alert de sucesso
    const showSuccess = (title, text = '') => {
        return Swal.fire({
            title,
            text,
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#10B981',
            timer: 3000,
            timerProgressBar: true
        })
    }

    // Alert de erro
    const showError = (title, text = '') => {
        return Swal.fire({
            title,
            text,
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#EF4444'
        })
    }

    // Alert de aviso
    const showWarning = (title, text = '') => {
        return Swal.fire({
            title,
            text,
            icon: 'warning',
            confirmButtonText: 'OK',
            confirmButtonColor: '#F59E0B'
        })
    }

    // Alert de informação
    const showInfo = (title, text = '') => {
        return Swal.fire({
            title,
            text,
            icon: 'info',
            confirmButtonText: 'OK',
            confirmButtonColor: '#3B82F6'
        })
    }

    // Confirmação
    const showConfirm = (title, text = '', confirmText = 'Sim', cancelText = 'Não') => {
        return Swal.fire({
            title,
            text,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: confirmText,
            cancelButtonText: cancelText,
            confirmButtonColor: '#10B981',
            cancelButtonColor: '#EF4444',
            reverseButtons: true
        })
    }

    // Toast de sucesso
    const showSuccessToast = (message) => {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })

        return Toast.fire({
            icon: 'success',
            title: message
        })
    }

    // Toast de erro
    const showErrorToast = (message) => {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 4000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })

        return Toast.fire({
            icon: 'error',
            title: message
        })
    }

    // Loading
    const showLoading = (title = 'Carregando...') => {
        return Swal.fire({
            title,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading()
            }
        })
    }

    // Fechar loading
    const closeLoading = () => {
        Swal.close()
    }

    return {
        showSuccess,
        showError,
        showWarning,
        showInfo,
        showConfirm,
        showSuccessToast,
        showErrorToast,
        showLoading,
        closeLoading
    }
}
