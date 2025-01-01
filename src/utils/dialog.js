import { Dialog } from 'quasar'

/**
 * Displays a confirmation dialog with the provided message and options.
 * @param {String} title - Title of the dialog.
 * @param {String} message - Message to display in the dialog.
 * @returns {Promise} Resolves if the user clicks "OK", rejects if "Cancel".
 */
export const showConfirmDialog = ({ title, message }) => {
  return new Promise((resolve, reject) => {
    Dialog.create({
      title,
      message,
      persistent: true,
      ok: {
        label: 'OK',
        flat: true,
        color: 'primary',
      },
      cancel: {
        label: 'Cancel',
        flat: true,
        color: 'secondary',
      },
    })
      .onOk(() => resolve())
      .onCancel(() => reject())
  })
}
