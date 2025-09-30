/**
 * Shared type definitions for the Burrow frontend when authoring plain JavaScript files.
 * The project no longer relies on TypeScript, but these typedefs keep editor IntelliSense
 * and allow optional `@ts-check` usage without switching file extensions back to TSX.
 */

/**
 * @typedef {'consumer' | 'operator'} UserRole
 */

/**
 * @typedef {Object} UserAddress
 * @property {string} id
 * @property {string} line1
 * @property {string} [line2]
 * @property {string} city
 * @property {string} state
 * @property {string} pincode
 * @property {string} [landmark]
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {UserRole} role
 * @property {UserAddress[]} addresses
 * @property {string} createdAt
 */

/**
 * @typedef {[number, number]} Coordinates
 */

/**
 * @typedef {Object} Warehouse
 * @property {string} id
 * @property {string} name
 * @property {string} address
 * @property {Coordinates} coordinates
 * @property {number} capacity
 * @property {string} operatingHours
 * @property {boolean} isActive
 */

/**
 * @typedef {'submitted' | 'payment_pending' | 'approval_pending' | 'approved' | 'parcel_expected' |
 * 'parcel_arrived' | 'in_storage' | 'preparing_dispatch' | 'out_for_delivery' | 'delivered' | 'issue_reported'}
 * DeliveryStatus
 */

/**
 * @typedef {'pending' | 'completed' | 'failed'} PaymentStatus
 */

/**
 * @typedef {Object} PaymentDetails
 * @property {number} baseHandlingFee
 * @property {number} storageFee
 * @property {number} deliveryCharge
 * @property {number} gst
 * @property {number} totalAmount
 * @property {PaymentStatus} paymentStatus
 */

/**
 * @typedef {Object} StatusHistoryEntry
 * @property {DeliveryStatus} status
 * @property {string} timestamp
 * @property {string} [notes]
 */

/**
 * @typedef {Object} DeliveryRequest
 * @property {string} id
 * @property {string} userId
 * @property {string} orderNumber
 * @property {string} platform
 * @property {string} productDescription
 * @property {string} warehouseId
 * @property {string} originalETA
 * @property {string} scheduledDeliveryDate
 * @property {string} deliveryTimeSlot
 * @property {UserAddress} destinationAddress
 * @property {DeliveryStatus} status
 * @property {StatusHistoryEntry[]} statusHistory
 * @property {PaymentDetails} paymentDetails
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} AuthState
 * @property {User | null} user
 * @property {boolean} isLoading
 * @property {string | null} error
 */

/**
 * @typedef {{ type: 'LOGIN_START' }} AuthActionLoginStart
 * @typedef {{ type: 'LOGIN_SUCCESS', payload: User }} AuthActionLoginSuccess
 * @typedef {{ type: 'LOGIN_FAILURE', payload: string }} AuthActionLoginFailure
 * @typedef {{ type: 'LOGOUT' }} AuthActionLogout
 * @typedef {{ type: 'CLEAR_ERROR' }} AuthActionClearError
 * @typedef {AuthActionLoginStart | AuthActionLoginSuccess | AuthActionLoginFailure | AuthActionLogout | AuthActionClearError}
 * AuthAction
 */

/**
 * @typedef {Object} RequestFormAddress
 * @property {string} line1
 * @property {string} [line2]
 * @property {string} city
 * @property {string} state
 * @property {string} pincode
 * @property {string} landmark
 * @property {string} contactNumber
 */

/**
 * @typedef {Object} RequestFormData
 * @property {string} orderNumber
 * @property {string} platform
 * @property {string} productDescription
 * @property {string} originalETA
 * @property {Warehouse | null} warehouse
 * @property {string} scheduledDeliveryDate
 * @property {string} deliveryTimeSlot
 * @property {RequestFormAddress} destinationAddress
 */

/**
 * @typedef {Object.<string, string>} FormErrorMap
 */

export {}; // Marks this file as an ES module so the typedefs are discoverable.
