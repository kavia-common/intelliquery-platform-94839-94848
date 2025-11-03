 // PUBLIC_INTERFACE
 export const initialUIState = {
   /** Minimal UI state placeholder for future expansion. */
   loading: false,
   error: null,
 };

 // PUBLIC_INTERFACE
 export function setLoading(state, value) {
   /** Set loading boolean. */
   state.loading = !!value;
 }

 // PUBLIC_INTERFACE
 export function setError(state, message) {
   /** Set error message string or null. */
   state.error = message || null;
 }
