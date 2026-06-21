import type { ERROR_CODES, SUCCESS_CODES } from './constants';

export interface Message {
	to: string;
	message: string;
}

export interface SuccessResponse {
	response_code: SuccessCode;
	success_message: string;
}

export interface ErrorResponse {
	response_code: ErrorCode;
	error_message: string;
}

export type BulkSmsResponse = SuccessResponse | ErrorResponse;

export interface SmsBody {
	api_key: string;
	senderid: string;
	number?: string;
	message?: string;
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

export type SuccessCode = keyof typeof SUCCESS_CODES;

export type ErrorCode = keyof typeof ERROR_CODES;
