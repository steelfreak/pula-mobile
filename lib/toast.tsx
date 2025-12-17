import React from 'react';
import Toast, { BaseToast, ErrorToast, InfoToast, ToastConfig } from 'react-native-toast-message';

/**
 * @fileoverview Custom configuration and helper functions for displaying toasts
 * using the 'react-native-toast-message' library. Provides custom styling
 * for success, error, info, and warning toast types.
 */

/**
 * @description The configuration object for the `react-native-toast-message` library.
 * It maps toast 'types' (success, error, info, warning) to custom-styled React components.
 */
export const toastConfig: ToastConfig = {
  /**
   * @description Custom component for the 'success' toast type.
   * Uses BaseToast with green-themed styling.
   * @param {object} props The props passed by the Toast library.
   * @returns {JSX.Element} The styled BaseToast component.
   */
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#10B981',
        backgroundColor: '#F0FDF4',
        borderLeftWidth: 4,
        borderRadius: 8,
        marginHorizontal: 16,
        marginTop: 40,
      }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: '#065F46',
      }}
      text2Style={{
        fontSize: 14,
        color: '#047857',
      }}
    />
  ),
  /**
   * @description Custom component for the 'error' toast type.
   * Uses ErrorToast with red-themed styling.
   * @param {object} props The props passed by the Toast library.
   * @returns {JSX.Element} The styled ErrorToast component.
   */
  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: '#EF4444',
        backgroundColor: '#FEF2F2',
        borderLeftWidth: 4,
        borderRadius: 8,
        marginHorizontal: 16,
        marginTop: 40,
      }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: '#991B1B',
      }}
      text2Style={{
        fontSize: 14,
        color: '#B91C1C',
      }}
    />
  ),
  /**
   * @description Custom component for the 'info' toast type.
   * Uses InfoToast with blue-themed styling.
   * @param {object} props The props passed by the Toast library.
   * @returns {JSX.Element} The styled InfoToast component.
   */
  info: (props) => (
    <InfoToast
      {...props}
      style={{
        borderLeftColor: '#3B82F6',
        backgroundColor: '#EFF6FF',
        borderLeftWidth: 4,
        borderRadius: 8,
        marginHorizontal: 16,
        marginTop: 40,
      }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: '#1E40AF',
      }}
      text2Style={{
        fontSize: 14,
        color: '#2563EB',
      }}
    />
  ),
  /**
   * @description Custom component for the 'warning' toast type.
   * Uses BaseToast with yellow/orange-themed styling.
   * @param {object} props The props passed by the Toast library.
   * @returns {JSX.Element} The styled BaseToast component.
   */
  warning: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#F59E0B',
        backgroundColor: '#FFFBEB',
        borderLeftWidth: 4,
        borderRadius: 8,
        marginHorizontal: 16,
        marginTop: 40,
      }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: '#92400E',
      }}
      text2Style={{
        fontSize: 14,
        color: '#B45309',
      }}
    />
  ),
};

/**
 * @description An object containing helper functions to simplify displaying toasts.
 * These functions abstract away the internal structure of `Toast.show`.
 */
export const showToast = {
  /**
   * @description Shows a success toast notification.
   * @param {string} title The primary, bold title text (text1).
   * @param {string} [message] The secondary, smaller message text (text2).
   * @param {number} [duration] The time in milliseconds the toast should be visible. Defaults to 3000ms.
   * @sideeffect Displays a transient UI overlay notification.
   */
  success: (title: string, message?: string, duration?: number): void => {
    Toast.show({
      type: 'success',
      text1: title,
      text2: message,
      visibilityTime: duration || 3000,
      autoHide: true,
      topOffset: 40,
    });
  },
  /**
   * @description Shows an error toast notification.
   * @param {string} title The primary, bold title text (text1).
   * @param {string} [message] The secondary, smaller message text (text2).
   * @param {number} [duration] The time in milliseconds the toast should be visible. Defaults to 4000ms.
   * @sideeffect Displays a transient UI overlay notification.
   */
  error: (title: string, message?: string, duration?: number): void => {
    Toast.show({
      type: 'error',
      text1: title,
      text2: message,
      visibilityTime: duration || 4000,
      autoHide: true,
      topOffset: 40,
    });
  },
  /**
   * @description Shows an informational toast notification.
   * @param {string} title The primary, bold title text (text1).
   * @param {string} [message] The secondary, smaller message text (text2).
   * @param {number} [duration] The time in milliseconds the toast should be visible. Defaults to 3000ms.
   * @sideeffect Displays a transient UI overlay notification.
   */
  info: (title: string, message?: string, duration?: number): void => {
    Toast.show({
      type: 'info',
      text1: title,
      text2: message,
      visibilityTime: duration || 3000,
      autoHide: true,
      topOffset: 40,
    });
  },
  /**
   * @description Shows a warning toast notification.
   * @param {string} title The primary, bold title text (text1).
   * @param {string} [message] The secondary, smaller message text (text2).
   * @param {number} [duration] The time in milliseconds the toast should be visible. Defaults to 3500ms.
   * @sideeffect Displays a transient UI overlay notification.
   */
  warning: (title: string, message?: string, duration?: number): void => {
    Toast.show({
      type: 'warning',
      text1: title,
      text2: message,
      visibilityTime: duration || 3500,
      autoHide: true,
      topOffset: 40,
    });
  },
};
