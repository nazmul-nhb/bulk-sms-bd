export interface Message {
	to: string;
	message: string;
}

export interface BulkSmsResponse {
	response_code: number;
	success_message: string;
	error_message: string;
}

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
	 * @example '8809648908142'
	 */
	bulkSmsSenderId: string;
}

export type ErrorCode =
	| 400
	| 401
	| 402
	| 403
	| 404
	| 405
	| 406
	| 407
	| 408
	| 409
	| 410
	| 411
	| 412
	| 413
	| 414
	| 415
	| 416
	| 417
	| 418
	| 421
	| 422
	| 423
	| 424
	| 425
	| 426
	| 428
	| 429
	| 431
	| 451
	| 500
	| 501
	| 502
	| 503
	| 504
	| 505
	| 506
	| 507
	| 508
	| 510
	| 511;
