import { pickFields } from 'toolbox-x';
import {
	isArrayOfType,
	isEmptyObject,
	isError,
	isNonEmptyString,
	isObjectWithKeys,
	isString,
	isValidArray,
} from 'toolbox-x/guards';
import { BulkSmsError } from './BulkSmsError';
import type {
	BulkSmsBdConfig,
	BulkSmsResponse,
	Message,
	SmsBody,
	SuccessResponse,
} from './types';
import { BULK_SMS_BAS_API } from './constants';

export class BulkSmsClient {
	readonly #bulkSmsBaseApi: string;
	readonly #bulkSmsApiKey: string;
	readonly #bulkSmsSenderId: string;

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
			this.#bulkSmsBaseApi = isNonEmptyString(configs.bulkSmsBaseApi)
				? configs.bulkSmsBaseApi
				: BULK_SMS_BAS_API;

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
	 * * Send multiple SMS to different numbers
	 * @param messages - Array of messages
	 */
	async sendSMS(messages: Message[]): Promise<SuccessResponse>;

	/**
	 * * Send same SMS to multiple numbers
	 * @param to - Array of numbers
	 * @param message - Message to send
	 */
	async sendSMS(to: string[], message: string): Promise<SuccessResponse>;

	/**
	 * * Send single SMS to a number
	 * @param to - Number to send SMS to
	 * @param message - Message to send
	 */
	async sendSMS(to: string, message: string): Promise<SuccessResponse>;

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
				if (isArrayOfType(toOrMessages, isString)) {
					smsApiUrl = `${smsApiUrl}/smsapi`;
					smsBody.number = toOrMessages.join(',');
					smsBody.message = String(msg);
				} else {
					smsApiUrl = `${smsApiUrl}/smsapimany`;
					smsBody.messages = toOrMessages;
				}
			} else if (isNonEmptyString(msg)) {
				smsApiUrl = `${smsApiUrl}/smsapi`;
				smsBody.number = toOrMessages;
				smsBody.message = msg;
			}

			const res = await fetch(smsApiUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(smsBody),
			});

			const data: BulkSmsResponse = await res.json();

			if (data?.response_code !== 202) {
				throw new BulkSmsError(data?.error_message, data?.response_code);
			}

			return pickFields(data, ['response_code', 'success_message']);
		} catch (error) {
			throw new BulkSmsError(
				isError(error) ? error.message : 'Failed to send SMS',
				error instanceof BulkSmsError ? error.code : 1005
			);
		}
	}
}
