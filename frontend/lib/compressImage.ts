export async function compressImage(file: File, max_width: number = 1080, quality: number = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        const reader = new FileReader()

        reader.onload = (e) => {
            img.src = e.target?.result as string
        }

        img.onload = () => {
            const scale = Math.min(max_width / img.width, 1)
            const canvas = document.createElement('canvas')
            canvas.width = img.width * scale
            canvas.height = img.height * scale

            const ctx = canvas.getContext('2d')
            if (!ctx) {
                reject(new Error('Failed to get canvas context'))
                return
            }
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

            const fileName = file.name.replace(/\.[^/.]+$/, '.jpg')

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        const compressedFile = new File([blob], fileName, { type: 'image/jpeg' })
                        resolve(compressedFile)
                    } else {
                        reject(new Error('Failed to compress image'))
                    }
                },
                'image/jpeg',
                quality
            )
        }

        img.onerror = () => reject(new Error('Failed to load image'))
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}