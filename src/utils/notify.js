import { Notify } from 'quasar'

/**
 * Displays a success notification.
 * @param {string} message - The message to display.
 * @param {Object} [options={}] - Additional Quasar Notify options.
 */
export const notifySuccess = (message, options = {}) => {
  Notify.create({
    type: 'positive',
    icon: 'sym_o_check_circle', // Success icon
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
    icon: 'sym_o_error', // Error icon
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
    icon: 'sym_o_warning', // Warning icon
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
    icon: 'sym_o_info', // Info icon
    message,
    position: 'top-right',
    timeout: 3000,
    ...options,
  })
}
