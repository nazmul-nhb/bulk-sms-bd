import {
	isArrayOfType,
	isEmptyObject,
	isNonEmptyString,
	isObjectWithKeys,
	isURL,
	isValidArray,
} from 'toolbox-x/guards';
import { BulkSmsError } from './BulkSmsError';
import { BULK_SMS_BASE_API, SUCCESS_CODES } from './constants';
import type {
	$BalanceResponse,
	BalanceResponse,
	BulkSmsBdConfig,
	BulkSmsResponse,
	Message,
	SmsBody,
	SuccessResponse,
} from './types';
import {
	_assertSuccessData,
	_throwCaughtError,
	_throwValidationError,
	isMessage,
	isPhoneNumber,
} from './utils';

/**
 * @class `BulkSmsClient`
 *
 * A client for sending SMS messages using the Bulk SMS BD API.
 *
 * @example
 * ```ts
 * import { BulkSmsClient } from 'bulk-sms-bd';
 *
 * const smsClient = new BulkSmsClient({
 * 	bulkSmsApiKey: 'Bq8LOU3Bu0bOo9pe0rFq',
 * 	bulkSmsSenderId: '8809648808144',
 * });
 * ```
 */
export class BulkSmsClient {
	readonly #bulkSmsBaseApi: string;
	readonly #bulkSmsApiKey: string;
	readonly #bulkSmsSenderId: string;

	/**
	 * * Create a new instance of {@link BulkSmsClient}
	 *
	 * @param configs - Configuration for Bulk SMS BD
	 *
	 * @example
	 * ```ts
	 * import { BulkSmsClient } from 'bulk-sms-bd';
	 *
	 * const smsClient = new BulkSmsClient({
	 * 	bulkSmsApiKey: 'Bq8LOU3Bu0bOo9pe0rFq',
	 * 	bulkSmsSenderId: '8809648808144',
	 * });
	 * ```
	 */
	constructor(configs: BulkSmsBdConfig) {
		if (isEmptyObject(configs)) {
			throw new BulkSmsError(
				'Configuration is empty for Bulk SMS BD! Please provide a valid configuration!',
				1003
			);
		}

		if (
			isObjectWithKeys(configs, ['bulkSmsApiKey', 'bulkSmsSenderId']) &&
			isNonEmptyString(configs.bulkSmsApiKey) &&
			isNonEmptyString(configs.bulkSmsSenderId)
		) {
			this.#bulkSmsBaseApi = isURL(configs.bulkSmsBaseApi)
				? configs.bulkSmsBaseApi
				: BULK_SMS_BASE_API;

			this.#bulkSmsApiKey = configs.bulkSmsApiKey;
			this.#bulkSmsSenderId = configs.bulkSmsSenderId;
		} else {
			throw new BulkSmsError(
				'Configuration is incomplete for Bulk SMS BD! Please provide bulkSmsApiKey and bulkSmsSenderId!',
				1003
			);
		}
	}

	/**
	 * * Send single SMS to a number
	 *
	 * @param to - Number to send SMS to
	 * @param message - Message to send
	 * @returns `SuccessResponse` - Response from Bulk SMS BD
	 *
	 * @remarks Alternative method {@link oneToOne}
	 *
	 * @example
	 * ```ts
	 * const res = await smsClient.sendSMS('8801623732187', 'Hello World');
	 *
	 * console.log(res);
	 * ```
	 */
	async sendSMS(to: string, message: string): Promise<SuccessResponse>;

	/**
	 * * Send same SMS to multiple numbers
	 *
	 * @param to - Array of numbers
	 * @param message - Message to send
	 * @returns `SuccessResponse` - Response from Bulk SMS BD
	 *
	 * @remarks Alternative method {@link oneToMany}
	 *
	 * @example
	 * ```ts
	 * const res = await smsClient.sendSMS(['8801623732187', '8801623732188'], 'Hello World');
	 *
	 * console.log(res);
	 * ```
	 */
	async sendSMS(to: string[], message: string): Promise<SuccessResponse>;

	/**
	 * * Send different SMS to different numbers
	 *
	 * @param messages - Array of messages
	 * @returns `SuccessResponse` - Response from Bulk SMS BD
	 *
	 * @remarks Alternative method {@link manyToMany}
	 *
	 * @example
	 * ```ts
	 * const res = await smsClient.sendSMS([
	 * 	{ to: '8801623732187', message: 'Hello World' },
	 * 	{ to: '8801623732188', message: 'Hello Earth' },
	 * ]);
	 *
	 * console.log(res);
	 * ```
	 */
	async sendSMS(messages: Message[]): Promise<SuccessResponse>;

	async sendSMS(
		toOrMessages: string | string[] | Message[],
		msg?: string
	): Promise<SuccessResponse> {
		try {
			let smsApiUrl = this.#bulkSmsBaseApi;

			const smsBody = {
				api_key: this.#bulkSmsApiKey,
				senderid: this.#bulkSmsSenderId,
			} as SmsBody;

			if (isValidArray(toOrMessages)) {
				if (isArrayOfType(toOrMessages, isPhoneNumber) && isNonEmptyString(msg)) {
					smsApiUrl = `${smsApiUrl}/smsapi`;
					smsBody.number = toOrMessages.join(',');
					smsBody.message = msg;
				} else if (isArrayOfType(toOrMessages, isMessage)) {
					smsApiUrl = `${smsApiUrl}/smsapimany`;
					smsBody.messages = toOrMessages;
				} else {
					_throwValidationError();
				}
			} else if (isPhoneNumber(toOrMessages) && isNonEmptyString(msg)) {
				smsApiUrl = `${smsApiUrl}/smsapi`;
				smsBody.number = toOrMessages;
				smsBody.message = msg;
			} else {
				_throwValidationError();
			}

			const res = await fetch(smsApiUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(smsBody),
			});

			const data: BulkSmsResponse = await res.json();

			_assertSuccessData(data);

			return {
				response_code: data?.response_code || 202,
				success_message: SUCCESS_CODES[data?.response_code] || data?.success_message,
			};
		} catch (error) {
			_throwCaughtError(error, 'Failed to send SMS!', 1005);
		}
	}

	/**
	 * * Send single SMS to a number
	 *
	 * @param to - Number to send SMS to
	 * @param message - Message to send
	 * @returns `SuccessResponse` - Response from Bulk SMS BD
	 *
	 * @remarks This method is just a wrapper of {@link sendSMS}
	 *
	 * @example
	 * ```ts
	 * const res = await smsClient.oneToOne('8801623732187', 'Hello World');
	 *
	 * console.log(res);
	 * ```
	 */
	async oneToOne(to: string, message: string): Promise<SuccessResponse> {
		return this.sendSMS(to, message);
	}

	/**
	 * * Send same SMS to multiple numbers
	 *
	 * @param to - Array of numbers
	 * @param message - Message to send
	 * @returns `SuccessResponse` - Response from Bulk SMS BD
	 *
	 * @remarks This method is just a wrapper of {@link sendSMS}
	 *
	 * @example
	 * ```ts
	 * const res = await smsClient.oneToMany(['8801623732187', '8801623732188'], 'Hello World');
	 *
	 * console.log(res);
	 * ```
	 */
	async oneToMany(to: string[], message: string): Promise<SuccessResponse> {
		return this.sendSMS(to, message);
	}

	/**
	 * * Send different SMS to different numbers
	 *
	 * @param messages - Array of messages
	 * @returns `SuccessResponse` - Response from Bulk SMS BD
	 *
	 * @remarks This method is just a wrapper of {@link sendSMS}
	 *
	 * @example
	 * ```ts
	 * const res = await smsClient.manyToMany([
	 * 	{ to: '8801623732187', message: 'Hello World' },
	 * 	{ to: '8801623732188', message: 'Hello Earth' },
	 * ]);
	 *
	 * console.log(res);
	 * ```
	 */
	async manyToMany(messages: Message[]): Promise<SuccessResponse> {
		return this.sendSMS(messages);
	}

	/**
	 * * Check balance
	 *
	 * @returns `BalanceResponse` - Response from Bulk SMS BD
	 *
	 * @example
	 * ```ts
	 * const res = await smsClient.checkBalance();
	 *
	 * console.log(res);
	 * ```
	 */
	async checkBalance(): Promise<BalanceResponse> {
		try {
			const res = await fetch(
				`${this.#bulkSmsBaseApi}/getBalanceApi?api_key=${this.#bulkSmsApiKey}`
			);

			const data: $BalanceResponse = await res.json();

			_assertSuccessData(data);

			return {
				response_code: data?.response_code || 202,
				balance: data?.balance,
			};
		} catch (error) {
			_throwCaughtError(error, 'Failed to check balance!', 1006);
		}
	}
}
