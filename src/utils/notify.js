import { Notify } from 'quasar'

/**
 * Displays a success notification.
 * @param {string} message - The message to display.
 * @param {Object} [options={}] - Additional Quasar Notify options.
 */
export const notifySuccess = (message, options = {}) => {
  Notify.create({
    type: 'positive',
    message,
    position: 'top-right',
    timeout: 3000,
    ...options,
  })
}

/**
 * Displays an error notification.
 * @param {string} message - The message to display.
 * @param {Object} [options={}] - Additional Quasar Notify options.
 */
export const notifyError = (message, options = {}) => {
  Notify.create({
    type: 'negative',
    message,
    position: 'top-right',
    timeout: 5000,
    ...options,
  })
}

/**
 * Displays a warning notification.
 * @param {string} message - The message to display.
 * @param {Object} [options={}] - Additional Quasar Notify options.
 */
export const notifyWarning = (message, options = {}) => {
  Notify.create({
    type: 'warning',
    message,
    position: 'top-right',
    timeout: 4000,
    ...options,
  })
}

/**
 * Displays an informational notification.
 * @param {string} message - The message to display.
 * @param {Object} [options={}] - Additional Quasar Notify options.
 */
export const notifyInfo = (message, options = {}) => {
  Notify.create({
    type: 'info',
    message,
    position: 'top-right',
    timeout: 3000,
    ...options,
  })
}
