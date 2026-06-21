import type { ERROR_CODES, SUCCESS_CODES } from './constants';

/** Type for Message (number and message) object */
export interface Message {
	/** Number to send SMS to */
	to: string;
	/** Message to send */
	message: string;
}

/** Type for Success Response from Bulk SMS BD */
export interface SuccessResponse {
	/** Success response code from Bulk SMS BD */
	response_code: SuccessCode;
	/** Success message from Bulk SMS BD */
	success_message: string;
}

/** Type for Error Response from Bulk SMS BD */
export interface ErrorResponse {
	/** Error response code from Bulk SMS BD */
	response_code: ErrorCode;
	/** Error message from Bulk SMS BD */
	error_message: string;
}

/** Type for Bulk SMS BD API Response */
export type BulkSmsResponse = SuccessResponse | ErrorResponse;

/** Type for SMS Body */
export interface SmsBody {
	/** API Key for bulk SMS */
	api_key: string;
	/** Sender ID for bulk SMS */
	senderid: string;
	/** Number to send SMS to */
	number?: string;
	/** Message to send */
	message?: string;
	/** Array of messages to send */
	messages?: Message[];
}

export interface BulkSmsBdConfig {
	/**
	 * * Base API URL for bulk SMS BD.
	 * @default 'https://bulksmsbd.net/api'
	 */
	bulkSmsBaseApi?: string;

	/**
	 * * API key for bulk SMS.
	 * @example 'Bq8LOU3Bu0bOo9pe0rFq'
	 */
	bulkSmsApiKey: string;

	/**
	 * * Sender ID for bulk SMS.
	 * @example '8809648808144'
	 */
	bulkSmsSenderId: string;
}

/**
 * * Type for success response codes
 */
export type SuccessCode = keyof typeof SUCCESS_CODES;

/**
 * * Type for error response codes
 */
export type ErrorCode = keyof typeof ERROR_CODES;
