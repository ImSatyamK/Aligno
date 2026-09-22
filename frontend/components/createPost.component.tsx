'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ImagePlus, X } from 'lucide-react'
import { compressImage } from '@/lib/compressImage'
import { createPost } from '@/api/post'
import { toast } from './ui/toast'
import { Switch } from './ui/switch'
import { Trash2 } from 'lucide-react'

export function CreatePostForm({
    currentUsername,
    currentUserImg,
}: {
    currentUsername?: string
    currentUserImg?: string
}) {
    const [text, setText] = useState('')
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [visibility, setVisibility] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC')
    const [tags, setTags] = useState<string[]>([])
    const [currentTag, setCurrentTag] = useState<string>('')
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        if (previewUrl) URL.revokeObjectURL(previewUrl)

        setImageFile(file)
        setPreviewUrl(URL.createObjectURL(file))
    }

    function removeImage() {
        setImageFile(null)
        if (previewUrl) URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!text.trim() && !imageFile) {
            toast.add({ title: 'Empty post', description: 'Add some text or an image first.', type: 'error' })
            return
        }

        setIsSubmitting(true)

        try {
            const formData = new FormData()
            formData.append('text', text)
            formData.append('visibility', visibility)
            formData.append('tags', JSON.stringify(tags))

            if (imageFile) {
                const compressed = await compressImage(imageFile)
                formData.append('img', compressed)
            }

            const result = await createPost(formData)

            if (result.success) {
                toast.add({ title: 'Post created', type: 'success' })
                if (previewUrl) URL.revokeObjectURL(previewUrl)
                router.push('/')
            } else {
                toast.add({
                    title: 'Error',
                    description: typeof result.error === 'string' ? result.error : 'Failed to create post',
                    type: 'error',
                })
            }
        } catch (err) {
            console.error(err)
            toast.add({ title: 'Error', description: 'Something went wrong while creating your post', type: 'error' })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="border-b border-foreground/10 px-4 py-4">
            <div className="flex gap-3">
                <Image
                    src={currentUserImg || '/default_profile.webp'}
                    alt={currentUsername || 'You'}
                    width={40}
                    height={40}
                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                />

                <div className="flex-1 min-w-0">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="What's on your mind?"
                        rows={3}
                        className="w-full resize-none bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />

                    {previewUrl && (
                        <div className="relative mt-2 w-full overflow-hidden rounded-xl border border-foreground/10">
                            <Image
                                src={previewUrl}
                                alt="Selected image preview"
                                width={600}
                                height={400}
                                className="w-full h-auto max-h-96 object-cover"
                                unoptimized
                            />
                            <button
                                type="button"
                                onClick={removeImage}
                                aria-label="Remove image"
                                className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                    <div className="mt-3 flex items-center justify-between border-t border-foreground/10 pt-3">
                        <label className="flex items-center gap-1.5 text-sm font-medium text-[#C08A2E] cursor-pointer hover:opacity-80 transition-opacity">
                            <ImagePlus className="h-4 w-4" />
                            Add image
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    </div>
                    <div className="mt-3">
                        <div className="flex items-center justify-between gap-3">
                            <input
                                type="text"
                                placeholder="Enter tags..."
                                value={currentTag}
                                onChange={(e) => setCurrentTag(e.target.value)}
                                className="rounded-md border border-foreground/10 bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C08A2E]"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setTags([...tags, currentTag])
                                    setCurrentTag('')
                                }}
                                className="rounded-md bg-[#C08A2E] px-4 py-1.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                Add
                            </button>
                        </div>

                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="rounded bg-[gray] px-3 py-1 text-sm font-medium text-white"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setTags(tags.filter((_, i) => i !== index));
                                            }}
                                            className="ml-2 text-xs text-white hover:text-gray-300"
                                        >
                                            <Trash2 className='w-3 h-3'/>
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}

                    </div>
                    <div className="mt-3 flex items-center justify-between gap-2">
                        <span className="text-sm">PRIVATE</span>
                        <Switch
                            checked={visibility === 'PRIVATE'}
                            onCheckedChange={(checked) => setVisibility(checked ? 'PRIVATE' : 'PUBLIC')}
                        />
                    </div>
                    <div className="mt-10 flex items-center justify-center gap-2">
                        <button
                            type="submit"
                            disabled={isSubmitting || (!text.trim() && !imageFile)}
                            className="w-full rounded-md bg-[#C08A2E] px-4 py-1.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            {isSubmitting ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}