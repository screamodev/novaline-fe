/** Adds `.is-in` to `.reveal` elements when they enter the viewport (rise animation, see main.css). */
export function useReveal() {
  if (import.meta.server) return { rebind: () => {} }
  let io: IntersectionObserver | null = null

  const observe = () => {
    io?.disconnect()
    io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io?.unobserve(e.target)
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    )
    document.querySelectorAll<HTMLElement>('.reveal:not(.is-in)').forEach((el) => io?.observe(el))
  }

  onMounted(observe)
  onBeforeUnmount(() => {
    io?.disconnect()
    io = null
  })
  return { rebind: observe }
}
