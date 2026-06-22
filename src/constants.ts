/**
 * Base API URL for bulk SMS BD
 * @see https://bulksmsbd.net/developers
 */
export const BULK_SMS_BASE_API = 'https://bulksmsbd.net/api';

/**
 * * Type for success response codes
 * @see https://bulksmsbd.net/developers
 */
export const SUCCESS_CODES = /* @__PURE__ */ Object.freeze({
	202: 'SMS Submitted Successfully',
} as const);

/**
 * * Type for error response codes
 * @see https://bulksmsbd.net/developers
 */
export const ERROR_CODES = /* @__PURE__ */ Object.freeze({
	1001: 'Invalid Phone Number',
	1002: 'Sender ID Not Correct/Sender ID is Disabled',
	1003: 'All Fields are Required',
	1005: 'Internal Error',
	1006: 'Balance Validity Not Available',
	1007: 'Balance Insufficient',
	1011: 'User ID Not Found',
	1012: 'Masking SMS Must be Sent in Bengali',
	1013: 'Sender ID Has Not Found Gateway by API Key',
	1014: 'Sender Type Name Not Found Using this Sender by API Key',
	1015: 'Sender ID Has Not Found Any Valid Gateway by API Key',
	1016: 'Active Price Info Not Found by this Sender ID',
	1017: 'Price Info Not Found by this Sender ID',
	1018: 'The Owner of this Account is Disabled',
	1019: 'The Price of this Account is Disabled',
	1020: 'The Parent of this Account is Not Found',
	1021: 'The Parent Active Price of this Account is Not Found',
	1031: 'Your Account Not Verified, Please Contact Administrator',
	1032: 'IP Not Whitelisted',
} as const);
