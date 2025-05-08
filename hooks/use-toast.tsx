"use client"

import { useState, useCallback, useEffect, useRef } from "react"

type ToastVariant = "default" | "destructive" | "success"

interface ToastProps {
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

interface Toast extends ToastProps {
  id: string
}

interface ToastState {
  toasts: Toast[]
}

const defaultState: ToastState = {
  toasts: [],
}

function useToast() {
  const [state, setState] = useState<ToastState>(defaultState)

  const toast = useCallback(({ title, description, variant = "default", duration = 3000 }: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: Toast = { id, title, description, variant, duration }

    setState((prevState) => ({ ...prevState, toasts: [...prevState.toasts, newToast] }))

    // Auto-dismiss after duration
    setTimeout(() => {
      dismiss(id)
    }, duration)

    return id
  }, [])

  const dismiss = useCallback((id: string) => {
    setState((prevState) => ({ ...prevState, toasts: prevState.toasts.filter((t) => t.id !== id) }))
  }, [])

  // Toast component for rendering
  const ToastContainer = useCallback(() => {
    if (state.toasts.length === 0) return null

    return (
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {state.toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-md shadow-lg max-w-md transform transition-all duration-300 ease-in-out ${
              toast.variant === "destructive"
                ? "bg-red-900 text-white"
                : toast.variant === "success"
                  ? "bg-green-900 text-white"
                  : "bg-gray-800 text-white"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{toast.title}</h3>
                {toast.description && <p className="text-sm opacity-90 mt-1">{toast.description}</p>}
              </div>
              <button onClick={() => dismiss(toast.id)} className="text-sm opacity-70 hover:opacity-100">
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    )
  }, [state.toasts, dismiss])

  return { toast, dismiss, ToastContainer }
}

// Create a singleton instance for client-side usage
const useSingletonToast = () => {
  const [singletonToast, setSingletonToast] = useState<ReturnType<typeof useToast> | null>(null)
  const toastRef = useRef<ReturnType<typeof useToast> | null>(null)

  useEffect(() => {
    toastRef.current = useToast()
    setSingletonToast(toastRef.current)
  }, [])

  return singletonToast
}

// Export the instance with proper type safety
export const toast = (props: ToastProps) => {
  const singletonToast = useSingletonToast()
  return singletonToast?.toast ? singletonToast.toast(props) : null
}

export const dismiss = (id: string) => {
  const singletonToast = useSingletonToast()
  return singletonToast?.dismiss ? singletonToast.dismiss(id) : null
}

export const ToastContainer = () => {
  const singletonToast = useSingletonToast()
  return singletonToast?.ToastContainer ? singletonToast.ToastContainer() : null
}
