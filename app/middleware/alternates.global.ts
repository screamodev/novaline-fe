/** Pages that know their translated paths set them in setup; clear stale values on every navigation. */
export default defineNuxtRouteMiddleware(() => {
  useAlternatePaths().value = null
})
